'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  roomId: string | null;
  roomName: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationsContainerProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

export default function NotificationsContainer({
  initialNotifications,
  initialUnreadCount,
}: NotificationsContainerProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      const wasUnread = notifications.find((n) => n.id === notificationId && !n.isRead);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.link) return notification.link;
    if (notification.roomId) return `/rooms/${notification.roomId}`;
    return null;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      reminder_20h: '⏰',
      reminder_2h: '🚨',
      target_met: '🎯',
      streak_milestone: '🔥',
      streak_lost: '💔',
      streak_at_risk: '⚠️',
      room_streak: '🏆',
      member_joined: '👋',
      member_left: '👋',
      room_target_changed: '📊',
      kicked_from_room: '🚫',
      leaderboard_top3: '🥇',
      leaderboard_overtaken: '📈',
      most_problems_today: '⭐',
      sync_success: '✅',
      sync_failed: '❌',
      new_problems_detected: '🆕',
      inactive_reminder: '👀',
      weekly_summary: '📊',
      first_problem: '🎉',
      comeback: '🙌',
      welcome: '👋',
      profile_incomplete: '📝',
      timezone_reminder: '🌍',
    };
    return icons[type] || '🔔';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Notifications
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-indigo-500 text-white'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-indigo-500 text-white'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
              <BellIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)]">
              {filter === 'unread'
                ? 'No unread notifications'
                : 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const link = getNotificationLink(notification);

            return (
              <div
                key={notification.id}
                className={`relative bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] overflow-hidden transition-all hover:border-[var(--color-border-hover)] ${
                  !notification.isRead ? 'border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-xl">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {notification.title}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-2 opacity-60">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Link */}
                    {link && (
                      <Link
                        href={link}
                        className="inline-flex items-center gap-1 mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        View details
                        <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
