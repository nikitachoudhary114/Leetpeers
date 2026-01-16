'use client';

import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/Avatar';

interface Member {
  userId: string;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  todaySolved: number;
  metTarget: boolean;
  userStreak: number;
}

interface DailyStatusResponse {
  success: boolean;
  roomId: string;
  roomStreak: number;
  dailyTarget: number;
  timeRemaining: string;
  userTimezone: string;
  members: Member[];
}

interface DailyProgressCardProps {
  roomId: string;
  currentUserId: string;
}

export function DailyProgressCard({ roomId, currentUserId }: DailyProgressCardProps) {
  const [status, setStatus] = useState<DailyStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyStatus();
  }, [roomId]);

  const fetchDailyStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/rooms/${roomId}/daily-status`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch daily status');
      }
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load daily status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[var(--color-bg-tertiary)] rounded w-1/3"></div>
          <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-12 bg-[var(--color-bg-tertiary)] rounded"></div>
            <div className="h-12 bg-[var(--color-bg-tertiary)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-red-500/20 p-6">
        <p className="text-red-400 text-center">{error || 'Failed to load daily progress'}</p>
        <button
          onClick={fetchDailyStatus}
          className="mt-4 mx-auto block px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentUser = status.members.find((m) => m.userId === currentUserId);
  const membersMetTarget = status.members.filter((m) => m.metTarget).length;
  const allMembersMetTarget = membersMetTarget === status.members.length;

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6 space-y-6">
      {/* Header with Room Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Daily Progress</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            {status.timeRemaining} remaining
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl">
          <span className="text-orange-400">
            {status.roomStreak > 0 ? '🔥' : ''}
          </span>
          <span className="text-xl font-bold text-orange-400">{status.roomStreak}</span>
          <span className="text-sm text-[var(--color-text-muted)]">Room Streak</span>
        </div>
      </div>

      {/* Your Progress */}
      {currentUser && (
        <div className={`p-4 rounded-xl border ${
          currentUser.metTarget
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentUser.metTarget ? 'bg-green-500/20' : 'bg-amber-500/20'
              }`}>
                {currentUser.metTarget ? (
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Your Progress</p>
                <p className={`text-sm ${currentUser.metTarget ? 'text-green-400' : 'text-amber-400'}`}>
                  {currentUser.metTarget ? 'Target met!' : `${status.dailyTarget - currentUser.todaySolved} more to go`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {currentUser.todaySolved}/{status.dailyTarget}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Your streak: {currentUser.userStreak} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Room Target Status */}
      <div className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-xl">
        <span className="text-sm text-[var(--color-text-muted)]">Daily Target</span>
        <span className="font-bold text-[var(--color-text-primary)]">{status.dailyTarget} problems</span>
      </div>

      {/* All Members Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">Team Progress</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${
            allMembersMetTarget
              ? 'bg-green-500/20 text-green-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {membersMetTarget}/{status.members.length} completed
          </span>
        </div>
        <div className="space-y-2">
          {status.members.map((member) => (
            <div
              key={member.userId}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                member.userId === currentUserId
                  ? 'bg-indigo-500/10 border border-indigo-500/30'
                  : 'bg-[var(--color-bg-tertiary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={member.avatarUrl}
                  name={member.name || member.username || 'User'}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {member.name || member.username || 'Anonymous'}
                    {member.userId === currentUserId && (
                      <span className="text-xs text-indigo-400 ml-1">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Streak: {member.userStreak} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  member.metTarget ? 'text-green-400' : 'text-[var(--color-text-muted)]'
                }`}>
                  {member.todaySolved}/{status.dailyTarget}
                </span>
                {member.metTarget ? (
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--color-border)]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchDailyStatus}
        className="w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        Refresh Status
      </button>
    </div>
  );
}
