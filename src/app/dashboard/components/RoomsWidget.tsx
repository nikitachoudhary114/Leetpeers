'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, Badge, Button } from '@/components/ui';

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

interface RoomsWidgetProps {
  rooms: Room[];
  userId: string;
}

export function RoomsWidget({ rooms, userId }: RoomsWidgetProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedRooms = showAll ? rooms : rooms.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Rooms</h2>
        <Link
          href="/rooms"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/rooms" className="flex-1">
          <Button variant="primary" className="w-full">
            <PlusIcon className="w-4 h-4" />
            Create Room
          </Button>
        </Link>
        <Link href="/rooms" className="flex-1">
          <Button variant="secondary" className="w-full">
            <JoinIcon className="w-4 h-4" />
            Join Room
          </Button>
        </Link>
      </div>

      {/* Rooms List */}
      {rooms.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RoomsIcon className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No rooms yet</h3>
          <p className="text-slate-400 text-sm mb-4">
            Create a room to start collaborating with your peers!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedRooms.map((room) => (
            <RoomCard key={room.id} room={room} userId={userId} />
          ))}
        </div>
      )}

      {/* Show More */}
      {rooms.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {showAll ? 'Show Less' : `Show ${rooms.length - 3} More`}
        </button>
      )}
    </div>
  );
}

function RoomCard({ room, userId }: { room: Room; userId: string }) {
  const isOwner = room.ownerId === userId;
  const displayPlayers = room.players.slice(0, 4);
  const remainingCount = room._count.players - displayPlayers.length;

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="block bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
              {room.name || 'Unnamed Room'}
            </h3>
            {isOwner && <Badge variant="premium" size="sm">Owner</Badge>}
          </div>
          <p className="text-xs text-slate-500 mt-1">Code: {room.code}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-orange-400">
            <FireIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{room.streakCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {displayPlayers.map((player) => (
              <Avatar
                key={player.id}
                src={player.avatarUrl}
                name={player.username}
                size="sm"
                className="ring-2 ring-slate-800"
              />
            ))}
          </div>
          {remainingCount > 0 && (
            <span className="ml-2 text-xs text-slate-400">+{remainingCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <TargetIcon className="w-4 h-4" />
          <span className="text-xs">{room.dailyTarget}/day</span>
        </div>
      </div>
    </Link>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function JoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  );
}

function RoomsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
      />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
