'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from './ui/Avatar';

export function Navbar() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              LeetPeers
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Navigation Links */}
            {status === 'authenticated' && session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/rooms"
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Rooms
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    <Avatar
                      src={session.user.image}
                      name={session.user.name || session.user.email}
                      size="sm"
                    />
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] shadow-lg z-50 py-2 animate-scale-in">
                        <div className="px-4 py-2 border-b border-[var(--color-border)]">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {session.user.name || 'User'}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[var(--color-bg-hover)] transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : status === 'unauthenticated' ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
