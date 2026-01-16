import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch messages for a room
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { searchParams } = new URL(req.url);
    const after = searchParams.get('after'); // Get messages after this ID for polling
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify user is a member of the room
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        players: { some: { id: session.user.id } }
      }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found or access denied' }, { status: 404 });
    }

    // Build query for messages
    const whereClause: { roomId: string; createdAt?: { gt: Date } } = { roomId };

    // If polling for new messages after a certain time
    if (after) {
      const afterMessage = await prisma.roomMessage.findUnique({
        where: { id: after },
        select: { createdAt: true }
      });
      if (afterMessage) {
        whereClause.createdAt = { gt: afterMessage.createdAt };
      }
    }

    const messages = await prisma.roomMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send a message to a room
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id: roomId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 });
    }

    // Verify user is a member of the room
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        players: { some: { id: session.user.id } }
      }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found or access denied' }, { status: 404 });
    }

    // Create the message
    const message = await prisma.roomMessage.create({
      data: {
        roomId,
        senderId: session.user.id,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
