import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { runTestCase } from '@/lib/judge0';

interface TestCase {
  input: string;
  expected: string;
  isHidden?: boolean;
}

// POST - Submit code for full evaluation and save to database
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { code, language, problemSlug, problemId, roomId, testCases } = body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    if (!problemSlug || typeof problemSlug !== 'string') {
      return NextResponse.json({ error: 'Problem slug is required' }, { status: 400 });
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json({ error: 'Test cases are required' }, { status: 400 });
    }

    // Verify room membership if roomId provided
    if (roomId) {
      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
          players: { some: { id: session.user.id } }
        }
      });

      if (!room) {
        return NextResponse.json({ error: 'Room not found or access denied' }, { status: 404 });
      }
    }

    // Run code against all test cases using Piston API
    const results = [];
    let maxTime = 0;
    let maxMemory = 0;

    for (const testCase of testCases as TestCase[]) {
      const result = await runTestCase(code, language, testCase.input, testCase.expected);

      if (result.time && result.time > maxTime) maxTime = result.time;
      if (result.memory && result.memory > maxMemory) maxMemory = result.memory;

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: result.actualOutput,
        passed: result.passed,
        time: result.time,
        memory: result.memory,
        error: result.error,
        status: result.status,
        isHidden: testCase.isHidden || false,
      });
    }

    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const allPassed = passed === total;

    // Determine submission status
    let status = 'wrong_answer';
    if (allPassed) {
      status = 'accepted';
    } else if (results.some(r => r.error?.includes('compile') || r.status === 'Compilation Error')) {
      status = 'error';
    } else if (results.some(r => r.status === 'Time Limit Exceeded')) {
      status = 'timeout';
    }

    // Save submission to database
    const submission = await prisma.codeSubmission.create({
      data: {
        userId: session.user.id,
        roomId: roomId || null,
        problemId: problemId || 0,
        problemSlug,
        language,
        code,
        status,
        runtime: Math.round(maxTime),
        memory: Math.round(maxMemory),
        testsPassed: passed,
        totalTests: total,
        output: JSON.stringify(results.filter(r => !r.isHidden).map(r => ({
          input: r.input,
          expected: r.expected,
          actual: r.actual,
          passed: r.passed,
        }))),
        error: results.find(r => r.error)?.error || null,
      },
    });

    // Update user's problemsSolved count if accepted (and not already solved)
    if (status === 'accepted') {
      const existingAccepted = await prisma.codeSubmission.findFirst({
        where: {
          userId: session.user.id,
          problemSlug,
          status: 'accepted',
          id: { not: submission.id }, // Exclude current submission
        },
      });

      if (!existingAccepted) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { problemsSolved: { increment: 1 } },
        });
      }
    }

    // Return results (hide hidden test case details)
    const visibleResults = results.map(r => ({
      input: r.isHidden ? '[Hidden]' : r.input,
      expected: r.isHidden ? '[Hidden]' : r.expected,
      actual: r.isHidden ? (r.passed ? '[Passed]' : '[Failed]') : r.actual,
      passed: r.passed,
      time: r.time,
      memory: r.memory,
      status: r.status,
    }));

    return NextResponse.json({
      submission: {
        id: submission.id,
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        testsPassed: submission.testsPassed,
        totalTests: submission.totalTests,
      },
      results: visibleResults,
      summary: {
        passed,
        total,
        allPassed,
        status,
      },
      isDemo: false, // Piston is always available
    });
  } catch (error) {
    console.error('Code submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit code' },
      { status: 500 }
    );
  }
}
