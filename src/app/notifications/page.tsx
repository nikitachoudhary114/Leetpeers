import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/layout';
import NotificationsContainer from './NotificationsContainer';

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationsContainer
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
      </main>
    </div>
  );
}
