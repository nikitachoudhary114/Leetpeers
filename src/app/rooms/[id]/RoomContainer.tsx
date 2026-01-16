'use client';

import { useState } from 'react';
import {
  RoomHeader,
  RoomChat,
  VideoSection,
  MembersList,
  Leaderboard,
  ProblemsSection,
  SolutionsSection,
} from './components';

interface Player {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  leetcodeProfile: string | null;
  streakCount: number;
  problemsSolved: number;
}

interface Room {
  id: string;
  name: string | null;
  code: string;
  dailyTarget: number;
  streakCount: number;
  ownerId: string;
  owner: {
    id: string;
    username: string | null;
    name: string | null;
  };
  players: Player[];
  _count: {
    players: number;
  };
}

interface RoomContainerProps {
  room: Room;
  currentUserId: string;
}

type ActiveTab = 'problems' | 'solutions' | 'chat' | 'video' | 'members' | 'leaderboard';

const tabs = [
  { id: 'problems' as const, label: 'Problems', icon: CodeIcon },
  { id: 'solutions' as const, label: 'Strategies', icon: LightbulbIcon },
  { id: 'chat' as const, label: 'Chat', icon: ChatIcon },
  { id: 'video' as const, label: 'Video', icon: VideoIcon },
  { id: 'members' as const, label: 'Members', icon: UsersIcon },
  { id: 'leaderboard' as const, label: 'Leaderboard', icon: TrophyIcon },
];

export function RoomContainer({ room, currentUserId }: RoomContainerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('problems');

  const currentUser = room.players.find((p) => p.id === currentUserId);

  const renderContent = () => {
    switch (activeTab) {
      case 'problems':
        return <ProblemsSection roomId={room.id} />;
      case 'solutions':
        return <SolutionsSection />;
      case 'chat':
        return (
          <RoomChat
            roomId={room.id}
            currentUser={currentUser || { id: currentUserId, name: null, username: null, avatarUrl: null }}
            players={room.players}
          />
        );
      case 'video':
        return (
          <VideoSection roomId={room.id} players={room.players} currentUserId={currentUserId} />
        );
      case 'members':
        return (
          <MembersList
            roomId={room.id}
            players={room.players}
            ownerId={room.ownerId}
            currentUserId={currentUserId}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard players={room.players} currentUserId={currentUserId} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <RoomHeader room={room} userId={currentUserId} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--color-bg-primary)]/50 rounded-xl mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] shadow-lg'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'members' && (
                  <span className="ml-1 px-2 py-0.5 bg-[var(--color-bg-hover)] rounded-full text-xs">
                    {room._count.players}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">{renderContent()}</div>
      </div>
    </div>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}
