import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['leetcode', 'github'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    // Get the pending verification
    const verification = await prisma.profileVerification.findUnique({
      where: {
        userId_type: {
          userId: session.user.id,
          type,
        },
      },
    });

    if (!verification) {
      return NextResponse.json({
        hasPending: false,
      });
    }

    // Check if expired
    const isExpired = new Date() > verification.expiresAt;

    if (isExpired) {
      // Clean up expired verification
      await prisma.profileVerification.delete({
        where: { id: verification.id },
      });
      return NextResponse.json({
        hasPending: false,
      });
    }

    return NextResponse.json({
      hasPending: true,
      code: verification.code,
      username: verification.username,
      expiresAt: verification.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}

// Cancel pending verification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['leetcode', 'github'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    await prisma.profileVerification.deleteMany({
      where: {
        userId: session.user.id,
        type,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification cancelled',
    });
  } catch (error) {
    console.error('Verification cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel verification' },
      { status: 500 }
    );
  }
}
