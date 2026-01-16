'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { RoomWithPlayers } from '@/types';

interface RoomsContainerProps {
  initialRooms: RoomWithPlayers[];
  userId: string;
}

export default function RoomsContainer({ initialRooms, userId }: RoomsContainerProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomWithPlayers[]>(initialRooms);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleCreateRoom = useCallback(
    async (name: string): Promise<boolean> => {
      clearMessages();
      try {
        const res = await fetch('/api/room/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to create room');
          return false;
        }

        setRooms((prev) => [data, ...prev]);
        setSuccess(`Room "${data.name}" created with code ${data.code}`);
        setTimeout(() => setSuccess(null), 5000);
        return true;
      } catch {
        setError('Network error. Please try again.');
        return false;
      }
    },
    [clearMessages]
  );

  const handleJoinRoom = useCallback(
    async (code: string): Promise<boolean> => {
      clearMessages();
      try {
        const res = await fetch('/api/room/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to join room');
          return false;
        }

        setRooms((prev) => [data, ...prev]);
        setSuccess(`Joined room "${data.name}" successfully`);
        setTimeout(() => setSuccess(null), 5000);
        return true;
      } catch {
        setError('Network error. Please try again.');
        return false;
      }
    },
    [clearMessages]
  );

  const handleLeaveRoom = useCallback(
    async (roomId: string): Promise<void> => {
      clearMessages();
      try {
        const res = await fetch('/api/room/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to leave room');
          return;
        }

        setRooms((prev) => prev.filter((room) => room.id !== roomId));
        setSuccess('Left room successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch {
        setError('Network error. Please try again.');
      }
    },
    [clearMessages]
  );

  const handleRoomClick = useCallback(
    (roomId: string) => {
      router.push(`/rooms/${roomId}`);
    },
    [router]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Your Rooms</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage your study groups and track progress together</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              clearMessages();
              setIsJoinModalOpen(true);
            }}
            className="px-5 py-2.5 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] rounded-xl font-medium transition-colors border border-[var(--color-border)]"
          >
            Join Room
          </button>
          <button
            onClick={() => {
              clearMessages();
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-[var(--color-text-primary)] rounded-xl font-medium transition-all"
          >
            Create Room
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Room List or Empty State */}
      {rooms.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-[var(--color-bg-tertiary)] rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">No rooms yet</h3>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
            Create a new room or join an existing one to start practicing with others.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-6 py-3 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] rounded-xl font-medium transition-colors border border-[var(--color-border)]"
            >
              Join Room
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 text-[var(--color-text-primary)] rounded-xl font-medium transition-all"
            >
              Create Room
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isOwner={room.ownerId === userId}
              onClick={() => handleRoomClick(room.id)}
              onLeave={() => handleLeaveRoom(room.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoom}
      />
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleJoinRoom}
      />
    </div>
  );
}

// Room Card Component
function RoomCard({
  room,
  isOwner,
  onClick,
  onLeave,
}: {
  room: RoomWithPlayers;
  isOwner: boolean;
  onClick: () => void;
  onLeave: () => void;
}) {
  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to leave this room?')) {
      onLeave();
    }
  };

  const memberCount = room._count?.players ?? room.players.length;

  return (
    <div
      onClick={onClick}
      className="group bg-[var(--color-bg-primary)]/50 rounded-2xl border border-[var(--color-border)] p-6 cursor-pointer hover:border-indigo-500/50 hover:bg-[var(--color-bg-primary)]/70 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-[var(--color-text-primary)] truncate group-hover:text-indigo-300 transition-colors">
            {room.name || 'Unnamed Room'}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] font-mono">Code: {room.code}</p>
        </div>
        {isOwner && (
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-lg flex-shrink-0 ml-2">
            Owner
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)] mb-5">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          {room.dailyTarget} problems/day
        </span>
        <span className="flex items-center gap-1.5 text-orange-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          {room.streakCount} day streak
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {room.players.slice(0, 5).map((player) => (
            <div
              key={player.id}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[var(--color-bg-primary)] flex items-center justify-center text-xs font-medium text-[var(--color-text-primary)]"
              title={player.username || 'User'}
            >
              {player.username?.charAt(0).toUpperCase() || '?'}
            </div>
          ))}
          {room.players.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-hover)] border-2 border-[var(--color-bg-primary)] flex items-center justify-center text-xs text-[var(--color-text-secondary)] font-medium">
              +{room.players.length - 5}
            </div>
          )}
        </div>

        {!isOwner && (
          <button
            onClick={handleLeaveClick}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
}

// Create Room Modal
function CreateRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Room name is required');
      return;
    }

    setIsLoading(true);
    const success = await onSubmit(name.trim());
    setIsLoading(false);

    if (success) {
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-2xl animate-scale-in">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Create a Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Daily LeetCode Grind"
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            You&apos;ll receive a unique 6-character code to share with others.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Join Room Modal
function JoinRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<boolean>;
}) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length !== 6) {
      setError('Room code must be exactly 6 characters');
      return;
    }

    setIsLoading(true);
    const success = await onSubmit(cleanCode);
    setIsLoading(false);

    if (success) {
      setCode('');
      onClose();
    }
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-2xl animate-scale-in">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Join a Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono tracking-widest text-center text-lg"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Ask the room owner for the code to join their study group.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
