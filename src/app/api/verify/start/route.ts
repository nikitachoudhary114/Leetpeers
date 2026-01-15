import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, username } = await request.json();

    if (!type || !['leetcode', 'github'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Generate a unique verification code
    const code = `LEETPEERS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Set expiry to 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Upsert the verification record
    await prisma.profileVerification.upsert({
      where: {
        userId_type: {
          userId: session.user.id,
          type,
        },
      },
      update: {
        code,
        username: username.trim(),
        expiresAt,
      },
      create: {
        userId: session.user.id,
        type,
        code,
        username: username.trim(),
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      code,
      expiresAt: expiresAt.toISOString(),
      instructions: type === 'leetcode'
        ? `Add this code to your LeetCode profile bio: ${code}`
        : `Add this code to your GitHub profile bio: ${code}`,
    });
  } catch (error) {
    console.error('Verification start error:', error);
    return NextResponse.json(
      { error: 'Failed to start verification' },
      { status: 500 }
    );
  }
}
