import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { DashboardContainer } from './DashboardContainer';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      avatarUrl: true,
      leetcodeProfile: true,
      streakCount: true,
      problemsSolved: true,
      bio: true,
      country: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const rooms = await prisma.room.findMany({
    where: {
      players: {
        some: { id: session.user.id },
      },
    },
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
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { players: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize dates for client component
  const serializedUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
  };

  const serializedRooms = rooms.map((room) => ({
    ...room,
    createdAt: room.createdAt.toISOString(),
  }));

  return <DashboardContainer user={serializedUser} rooms={serializedRooms} />;
}
