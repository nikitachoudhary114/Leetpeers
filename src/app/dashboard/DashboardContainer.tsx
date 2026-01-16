'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  Sidebar,
  MobileSidebar,
  ProfileWidget,
  RoomsWidget,
  AnalyticsWidget,
  ChatbotWidget,
  ProblemsWidget,
  LearningWidget,
  PracticeAnalytics,
} from './components';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';

interface Room {
  id: string;
  name: string | null;
  code: string;
  createdAt: string;
  dailyTarget: number;
  streakCount: number;
  ownerId: string;
  owner: {
    id: string;
    username: string | null;
    name: string | null;
  };
  players: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
  }[];
  _count: {
    players: number;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  leetcodeProfile: string | null;
  streakCount: number;
  problemsSolved: number;
  bio: string | null;
  country: string | null;
  createdAt: string;
}

interface DashboardContainerProps {
  user: User;
  rooms: Room[];
}

export function DashboardContainer({ user, rooms }: DashboardContainerProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileWidget user={user} />;
      case 'learning':
        return <LearningWidget />;
      case 'problems':
        return <ProblemsWidget userStreak={user.streakCount} />;
      case 'progress':
        return <PracticeAnalytics userStreak={user.streakCount} />;
      case 'rooms':
        return <RoomsWidget rooms={rooms} userId={user.id} />;
      case 'analytics':
        return (
          <AnalyticsWidget
            leetcodeUsername={user.leetcodeProfile}
            userStreak={user.streakCount}
          />
        );
      case 'chatbot':
        return <ChatbotWidget userName={user.name} leetcodeUsername={user.leetcodeProfile} />;
      default:
        return <ProfileWidget user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
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
              <Link
                href="/rooms"
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors hidden sm:block"
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
                    src={user.avatarUrl}
                    name={user.name || user.email}
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
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {user.email}
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
                        href="/rooms"
                        className="block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Rooms
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
