import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all rooms where user is a player (includes owned rooms)
    const rooms = await prisma.room.findMany({
      where: {
        players: {
          some: { id: userId },
        },
      },
      include: {
        owner: {
          select: { id: true, username: true, name: true },
        },
        players: {
          select: { id: true, username: true, avatarUrl: true },
        },
        _count: {
          select: { players: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Fetch rooms error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
