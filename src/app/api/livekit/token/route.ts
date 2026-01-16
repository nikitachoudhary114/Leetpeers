import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { roomId } = body;

    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    // Check if LiveKit is configured
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return NextResponse.json(
        {
          error: 'Video calls not configured',
          isDemo: true,
          message: 'LiveKit credentials not set. Video calls are in demo mode.'
        },
        { status: 503 }
      );
    }

    // Create LiveKit access token
    const participantName = session.user.name || session.user.email || 'Anonymous';
    const participantIdentity = session.user.id;

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantIdentity,
      name: participantName,
      ttl: '2h', // Token valid for 2 hours
    });

    // Grant permissions for this room
    at.addGrant({
      room: roomId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      identity: participantIdentity,
      name: participantName,
    });
  } catch (error) {
    console.error('LiveKit token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video call token' },
      { status: 500 }
    );
  }
}

// GET - Check if LiveKit is configured
export async function GET() {
  const isConfigured = !!LIVEKIT_API_KEY && !!LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  return NextResponse.json({
    configured: isConfigured,
    hasUrl: !!livekitUrl,
  });
}
