'use client';

import { Card, Button } from '@/components/ui';
import type { RoomWithPlayers } from '@/types';

interface RoomCardProps {
  room: RoomWithPlayers;
  isOwner: boolean;
  onClick: () => void;
  onLeave: () => void;
}

export function RoomCard({ room, isOwner, onClick, onLeave }: RoomCardProps) {
  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to leave this room?')) {
      onLeave();
    }
  };

  const memberCount = room._count?.players ?? room.players.length;

  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:border-[var(--color-border)] transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-[var(--color-text-primary)] truncate">
            {room.name || 'Unnamed Room'}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] font-mono">Code: {room.code}</p>
        </div>
        {isOwner && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0 ml-2">
            Owner
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)] mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          {room.dailyTarget} problems/day
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
          {room.streakCount} day streak
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {room.players.slice(0, 5).map((player) => (
            <div
              key={player.id}
              className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-bg-primary)] flex items-center justify-center text-xs font-medium overflow-hidden"
              title={player.username || 'User'}
            >
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[var(--color-text-muted)]">
                  {player.username?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
          ))}
          {room.players.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-bg-primary)] flex items-center justify-center text-xs text-[var(--color-text-muted)] font-medium">
              +{room.players.length - 5}
            </div>
          )}
        </div>

        {!isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveClick}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Leave
          </Button>
        )}
      </div>
    </Card>
  );
}
