import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
import { runTestCase } from '@/lib/judge0';

interface TestCase {
  input: string;
  expected: string;
}

// POST - Run code against test cases
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { code, language, testCases } = body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json({ error: 'Test cases are required' }, { status: 400 });
    }

    const supportedLanguages = ['python', 'javascript', 'java', 'cpp', 'c', 'typescript', 'go', 'rust'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    // Run code against each test case using Piston API
    const results = [];

    for (const testCase of testCases as TestCase[]) {
      const result = await runTestCase(code, language, testCase.input, testCase.expected);

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: result.actualOutput,
        passed: result.passed,
        time: result.time,
        memory: result.memory,
        error: result.error,
        status: result.status,
      });
    }

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    return NextResponse.json({
      results,
      summary: {
        passed,
        total,
        allPassed: passed === total,
      },
      isDemo: false, // Piston is always available
    });
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
