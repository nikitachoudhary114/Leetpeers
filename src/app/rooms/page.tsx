import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import RoomsContainer from './RoomsContainer';
import { Navbar } from '@/components/layout';
import type { RoomWithPlayers } from '@/types';

export default async function RoomsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const rooms = await prisma.room.findMany({
    where: {
      players: {
        some: { id: session.user.id },
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

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoomsContainer
          initialRooms={rooms as unknown as RoomWithPlayers[]}
          userId={session.user.id}
        />
      </main>
    </div>
  );
}
