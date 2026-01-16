'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, Badge } from '@/components/ui';

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

// Badge System Configuration
interface BadgeTier {
  name: string;
  minStreak: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

const BADGE_TIERS: BadgeTier[] = [
  { name: 'Newbie', minStreak: 0, color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
  { name: 'Bronze', minStreak: 7, color: 'text-amber-600', bgColor: 'bg-amber-600/10', borderColor: 'border-amber-600/30' },
  { name: 'Silver', minStreak: 14, color: 'text-gray-300', bgColor: 'bg-gray-300/10', borderColor: 'border-gray-400/30' },
  { name: 'Gold', minStreak: 21, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/30' },
  { name: 'Platinum', minStreak: 30, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', borderColor: 'border-cyan-400/30' },
  { name: 'Diamond', minStreak: 60, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/30' },
  { name: 'Master', minStreak: 90, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  { name: 'Legend', minStreak: 180, color: 'text-purple-400', bgColor: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10', borderColor: 'border-purple-500/30' },
];

function getBadgeTier(streakCount: number): BadgeTier {
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (streakCount >= BADGE_TIERS[i].minStreak) {
      return BADGE_TIERS[i];
    }
  }
  return BADGE_TIERS[0];
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
        return 'text-[var(--color-text-secondary)]';
      case 2:
        return 'text-amber-600';
      default:
        return 'text-[var(--color-text-muted)]';
    }
  };

  const getMedalBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400/10 border-yellow-400/20';
      case 1:
        return 'bg-[var(--color-text-secondary)]/10 border-[var(--color-text-secondary)]/20';
      case 2:
        return 'bg-amber-600/10 border-amber-600/20';
      default:
        return 'bg-[var(--color-bg-tertiary)]/50 border-[var(--color-border)]';
    }
  };

  return (
    <div className="bg-[var(--color-bg-tertiary)]/30 rounded-2xl border border-[var(--color-border)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Leaderboard</h3>
          </div>

          {/* Sort Options */}
          <div className="flex gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-lg">
            <button
              onClick={() => setSortBy('problems')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sortBy === 'problems'
                  ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                sortBy === 'streak'
                  ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
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
          <div className="animate-pulse text-[var(--color-text-muted)]">Loading leaderboard...</div>
        </div>
      ) : (
        /* Leaderboard List */
        <div className="divide-y divide-[var(--color-border)]/50">
          {sortedPlayers.map((player, index) => {
            const isCurrentUser = player.id === currentUserId;
            const problems = playerStats[player.id] || player.problemsSolved;
            const isTopThree = index < 3;

            return (
              <div
                key={player.id}
                className={`p-4 transition-colors ${
                  isCurrentUser ? 'bg-indigo-500/5' : 'hover:bg-[var(--color-bg-tertiary)]/30'
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
                      <span className="text-sm font-bold text-[var(--color-text-muted)]">
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
                        <h4 className="font-medium text-[var(--color-text-primary)] truncate">
                          {player.name || player.username || 'Anonymous'}
                        </h4>
                        <BadgeDisplay tier={getBadgeTier(player.streakCount)} />
                        {isCurrentUser && (
                          <Badge variant="info" size="sm">
                            You
                          </Badge>
                        )}
                      </div>
                      {player.leetcodeProfile && (
                        <p className="text-xs text-[var(--color-text-muted)]">
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
                        <span className="text-lg font-bold text-[var(--color-text-primary)]">
                          {player.streakCount}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">days</div>
                    </div>

                    {/* Problems */}
                    <div className="text-right w-20">
                      <div className="flex items-center justify-end gap-1.5">
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-lg font-bold text-[var(--color-text-primary)]">
                          {problems}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">solved</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 ml-14">
                  {sortBy === 'streak' ? (
                    <div className="h-1.5 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(player.streakCount / maxStreak) * 100}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-1.5 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
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
      <div className="px-6 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/30">
        <p className="text-xs text-[var(--color-text-muted)] text-center">
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

// Badge Display Component
function BadgeDisplay({ tier }: { tier: BadgeTier }) {
  const getBadgeIcon = () => {
    switch (tier.name) {
      case 'Newbie':
        return <SeedlingIcon className={`w-3 h-3 ${tier.color}`} />;
      case 'Bronze':
      case 'Silver':
        return <ShieldIcon className={`w-3 h-3 ${tier.color}`} />;
      case 'Gold':
      case 'Platinum':
        return <CrownIcon className={`w-3 h-3 ${tier.color}`} />;
      case 'Diamond':
        return <DiamondIcon className={`w-3 h-3 ${tier.color}`} />;
      case 'Master':
        return <StarBadgeIcon className={`w-3 h-3 ${tier.color}`} />;
      case 'Legend':
        return <LegendIcon className={`w-3 h-3 ${tier.color}`} />;
      default:
        return <SeedlingIcon className={`w-3 h-3 ${tier.color}`} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.bgColor} ${tier.borderColor} border`}>
      {getBadgeIcon()}
      <span className={tier.color}>{tier.name}</span>
    </div>
  );
}

// Badge Icons
function SeedlingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 22c-4.97 0-9-4.03-9-9 0-3.87 2.4-7.17 5.8-8.48-.24.78-.38 1.6-.38 2.48 0 3.31 2.69 6 6 6 .88 0 1.7-.14 2.48-.38C15.17 16.6 11.87 19 8 19c-1.1 0-2-.9-2-2s.9-2 2-2c.35 0 .68.09.97.25.03-.08.03-.17.03-.25 0-2.21-1.79-4-4-4-.33 0-.65.04-.96.11C5.54 7.53 8.47 5 12 5c4.97 0 9 4.03 9 9s-4.03 9-9 9z"/>
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 18.06L5.62 11h2.76l2.62 3.5V18.06zM12 11.31L9.09 8h5.82L12 11.31zm1 3.19l2.62-3.5h2.76L12 18.06v-3.56z"/>
    </svg>
  );
}

function StarBadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function LegendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
