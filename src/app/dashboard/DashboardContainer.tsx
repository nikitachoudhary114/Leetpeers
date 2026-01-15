'use client';

import { useState } from 'react';
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
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
