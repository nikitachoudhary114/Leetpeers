'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { NotificationBell } from '@/components/NotificationBell';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/rooms', label: 'Rooms', icon: RoomsIcon },
    { href: '/profile', label: 'Profile', icon: ProfileIcon },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/rooms" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-text-primary)] hidden sm:block">
              Leet<span className="text-indigo-400">Peers</span>
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Notification Bell + User Menu */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[120px]">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[120px]">
                  {session?.user?.email}
                </p>
              </div>
              <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] shadow-xl z-20 overflow-hidden">
                  <div className="p-3 border-b border-[var(--color-border)]">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{session?.user?.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{session?.user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                    >
                      <DashboardIcon className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                    >
                      <ProfileIcon className="w-4 h-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/rooms"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                    >
                      <RoomsIcon className="w-4 h-4" />
                      Your Rooms
                    </Link>
                  </div>
                  <div className="p-2 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function RoomsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
