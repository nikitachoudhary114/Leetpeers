import { getServerSession } from 'next-auth/next';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { RoomContainer } from './RoomContainer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
      players: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          leetcodeProfile: true,
          streakCount: true,
          problemsSolved: true,
        },
      },
      _count: {
        select: { players: true },
      },
    },
  });

  if (!room) {
    notFound();
  }

  // Check if user is a member of this room
  const isMember = room.players.some((p) => p.id === session.user.id);
  if (!isMember) {
    redirect('/rooms');
  }

  return <RoomContainer room={room} currentUserId={session.user.id} />;
}
