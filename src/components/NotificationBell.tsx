'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications?limit=10');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.link) return notification.link;
    if (notification.roomId) return `/rooms/${notification.roomId}`;
    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="w-5 h-5 text-[var(--color-text-muted)]" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] shadow-xl z-50 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <BellIcon className="w-10 h-10 text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const link = getNotificationLink(notification);
                const content = (
                  <div
                    className={`flex gap-3 px-4 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer border-b border-[var(--color-border)] last:border-b-0 ${
                      !notification.isRead ? 'bg-indigo-500/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread Indicator */}
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.isRead
                            ? 'bg-transparent'
                            : 'bg-indigo-500'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-60">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );

                if (link) {
                  return (
                    <Link key={notification.id} href={link}>
                      {content}
                    </Link>
                  );
                }

                return <div key={notification.id}>{content}</div>;
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-[var(--color-border)]">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center py-3 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}
