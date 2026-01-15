import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import ProfileContainer from './ProfileContainer';
import { Navbar } from '@/components/layout';
import type { UserWithRooms } from '@/types';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      leetcodeProfile: true,
      leetcodeVerified: true,
      bio: true,
      avatarUrl: true,
      githubProfile: true,
      githubVerified: true,
      linkedinProfile: true,
      country: true,
      streakCount: true,
      problemsSolved: true,
      lastTotalSolved: true,
      createdAt: true,
      updatedAt: true,
      rooms: {
        select: {
          id: true,
          name: true,
          code: true,
          createdAt: true,
          ownerId: true,
        },
      },
      ownedRooms: {
        select: {
          id: true,
          name: true,
          code: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
            User not found. Please sign in again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileContainer initialUser={user as UserWithRooms} />
      </main>
    </div>
  );
}
