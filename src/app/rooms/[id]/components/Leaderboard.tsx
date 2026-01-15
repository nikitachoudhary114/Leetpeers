'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, Badge, ProgressBar } from '@/components/ui';

interface Player {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  leetcodeProfile: string | null;
  streakCount: number;
  problemsSolved: number;
}

interface LeaderboardProps {
  players: Player[];
  currentUserId: string;
}

type SortBy = 'streak' | 'problems';
type TimeFilter = 'all' | 'week' | 'today';

interface PlayerWithStats extends Player {
  totalSolved?: number;
}

export function Leaderboard({ players, currentUserId }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<SortBy>('problems');
  const [playerStats, setPlayerStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    const stats: Record<string, number> = {};

    await Promise.all(
      players.map(async (player) => {
        if (!player.leetcodeProfile) {
          stats[player.id] = player.problemsSolved;
          return;
        }

        try {
          const res = await fetch('/api/leetcode/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: player.leetcodeProfile }),
          });

          if (res.ok) {
            const data = await res.json();
            const allSolved = data.profile?.submitStats?.acSubmissionNum?.find(
              (s: { difficulty: string }) => s.difficulty === 'All'
            );
            stats[player.id] = allSolved?.count || player.problemsSolved;
          } else {
            stats[player.id] = player.problemsSolved;
          }
        } catch {
          stats[player.id] = player.problemsSolved;
        }
      })
    );

    setPlayerStats(stats);
    setLoading(false);
  }, [players]);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  // Calculate max value for progress bars
  const maxStreak = Math.max(...players.map((p) => p.streakCount), 1);
  const maxProblems = Math.max(...Object.values(playerStats), ...players.map((p) => p.problemsSolved), 1);

  // Sort players
  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === 'streak') {
      return b.streakCount - a.streakCount;
    }
    const aProblems = playerStats[a.id] || a.problemsSolved;
    const bProblems = playerStats[b.id] || b.problemsSolved;
    return bProblems - aProblems;
  });

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-400';
      case 1:
        return 'text-slate-300';
      case 2:
        return 'text-amber-600';
      default:
        return 'text-slate-500';
    }
  };

  const getMedalBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400/10 border-yellow-400/20';
      case 1:
        return 'bg-slate-300/10 border-slate-300/20';
      case 2:
        return 'bg-amber-600/10 border-amber-600/20';
      default:
        return 'bg-slate-800/50 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800/30 rounded-2xl border border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Leaderboard</h3>
          </div>

          {/* Sort Options */}
          <div className="flex gap-1 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setSortBy('problems')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sortBy === 'problems'
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sortBy === 'streak'
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Streak
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-pulse text-slate-400">Loading leaderboard...</div>
        </div>
      ) : (
        /* Leaderboard List */
        <div className="divide-y divide-slate-700/50">
          {sortedPlayers.map((player, index) => {
            const isCurrentUser = player.id === currentUserId;
            const problems = playerStats[player.id] || player.problemsSolved;
            const isTopThree = index < 3;

            return (
              <div
                key={player.id}
                className={`p-4 transition-colors ${
                  isCurrentUser ? 'bg-indigo-500/5' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getMedalBg(
                      index
                    )}`}
                  >
                    {isTopThree ? (
                      <MedalIcon className={`w-5 h-5 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                      src={player.avatarUrl}
                      name={player.name || player.username}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white truncate">
                          {player.name || player.username || 'Anonymous'}
                        </h4>
                        {isCurrentUser && (
                          <Badge variant="info" size="sm">
                            You
                          </Badge>
                        )}
                      </div>
                      {player.leetcodeProfile && (
                        <p className="text-xs text-slate-500">
                          @{player.leetcodeProfile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    {/* Streak */}
                    <div className="text-right w-20">
                      <div className="flex items-center justify-end gap-1.5">
                        <FireIcon className="w-4 h-4 text-orange-400" />
                        <span className="text-lg font-bold text-white">
                          {player.streakCount}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">days</div>
                    </div>

                    {/* Problems */}
                    <div className="text-right w-20">
                      <div className="flex items-center justify-end gap-1.5">
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-lg font-bold text-white">
                          {problems}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">solved</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 ml-14">
                  {sortBy === 'streak' ? (
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(player.streakCount / maxStreak) * 100}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(problems / maxProblems) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/30">
        <p className="text-xs text-slate-500 text-center">
          Rankings based on {sortBy === 'streak' ? 'consecutive days' : 'total problems solved'}
        </p>
      </div>
    </div>
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

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C9.243 2 7 4.243 7 7c0 1.462.634 2.776 1.639 3.691L5 20l7-3 7 3-3.639-9.309A4.972 4.972 0 0017 7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
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
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
