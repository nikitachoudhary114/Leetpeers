'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Badge, Button, ProgressBar, Modal } from '@/components/ui';

interface Player {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  leetcodeProfile: string | null;
  streakCount: number;
  problemsSolved: number;
}

interface MembersListProps {
  roomId: string;
  players: Player[];
  ownerId: string;
  currentUserId: string;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export function MembersList({ roomId, players, ownerId, currentUserId }: MembersListProps) {
  const router = useRouter();
  const [playerStats, setPlayerStats] = useState<Record<string, LeetCodeStats>>({});
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});
  const [kickConfirm, setKickConfirm] = useState<Player | null>(null);
  const [kicking, setKicking] = useState(false);

  const isOwner = currentUserId === ownerId;

  const fetchPlayerStats = useCallback(async (player: Player) => {
    if (!player.leetcodeProfile || playerStats[player.id]) return;

    setLoadingStats((prev) => ({ ...prev, [player.id]: true }));

    try {
      const res = await fetch('/api/leetcode/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: player.leetcodeProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile?.submitStats?.acSubmissionNum) {
          const submissions = data.profile.submitStats.acSubmissionNum;
          const stats: LeetCodeStats = {
            totalSolved: submissions.find((s: { difficulty: string }) => s.difficulty === 'All')?.count || 0,
            easySolved: submissions.find((s: { difficulty: string }) => s.difficulty === 'Easy')?.count || 0,
            mediumSolved: submissions.find((s: { difficulty: string }) => s.difficulty === 'Medium')?.count || 0,
            hardSolved: submissions.find((s: { difficulty: string }) => s.difficulty === 'Hard')?.count || 0,
          };
          setPlayerStats((prev) => ({ ...prev, [player.id]: stats }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats for', player.username, error);
    } finally {
      setLoadingStats((prev) => ({ ...prev, [player.id]: false }));
    }
  }, [playerStats]);

  useEffect(() => {
    players.forEach((player) => {
      if (player.leetcodeProfile) {
        fetchPlayerStats(player);
      }
    });
  }, [players, fetchPlayerStats]);

  const handleKickMember = async () => {
    if (!kickConfirm) return;

    setKicking(true);
    try {
      const res = await fetch(`/api/room/${roomId}/kick-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: kickConfirm.id }),
      });

      if (res.ok) {
        setKickConfirm(null);
        router.refresh();
      }
    } finally {
      setKicking(false);
    }
  };

  // Sort players: owner first, then by problems solved
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === ownerId) return -1;
    if (b.id === ownerId) return 1;
    return b.problemsSolved - a.problemsSolved;
  });

  // Calculate team totals
  const teamStats = Object.values(playerStats).reduce(
    (acc, stats) => ({
      totalSolved: acc.totalSolved + stats.totalSolved,
      easySolved: acc.easySolved + stats.easySolved,
      mediumSolved: acc.mediumSolved + stats.mediumSolved,
      hardSolved: acc.hardSolved + stats.hardSolved,
    }),
    { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 }
  );

  const hasTeamStats = Object.keys(playerStats).length > 0;

  return (
    <>
      {/* Team Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <ChartIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Team Statistics</h3>
            <p className="text-sm text-slate-400">Combined progress of all members</p>
          </div>
        </div>

        {hasTeamStats ? (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{teamStats.totalSolved}</div>
              <div className="text-xs text-slate-400 mt-1">Total Solved</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{teamStats.easySolved}</div>
              <div className="text-xs text-slate-400 mt-1">Easy</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{teamStats.mediumSolved}</div>
              <div className="text-xs text-slate-400 mt-1">Medium</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{teamStats.hardSolved}</div>
              <div className="text-xs text-slate-400 mt-1">Hard</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-slate-400 text-sm">
            Loading team statistics...
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 rounded-2xl border border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Members</h3>
            </div>
            <span className="text-sm text-slate-400">{players.length} members</span>
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-slate-700/50">
          {sortedPlayers.map((player) => {
            const stats = playerStats[player.id];
            const isLoading = loadingStats[player.id];
            const isPlayerOwner = player.id === ownerId;
            const isCurrentUser = player.id === currentUserId;

            return (
              <div key={player.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar
                    src={player.avatarUrl}
                    name={player.name || player.username}
                    size="lg"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">
                        {player.name || player.username || 'Anonymous'}
                      </h4>
                      {isPlayerOwner && <Badge variant="premium" size="sm">Owner</Badge>}
                      {isCurrentUser && !isPlayerOwner && (
                        <Badge variant="info" size="sm">You</Badge>
                      )}
                    </div>

                    <p className="text-sm text-slate-400 mb-2">
                      @{player.username || 'username'}
                    </p>

                    {/* LeetCode Stats */}
                    {player.leetcodeProfile ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <LeetCodeIcon className="w-4 h-4 text-amber-500" />
                          <a
                            href={`https://leetcode.com/${player.leetcodeProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:text-indigo-300"
                          >
                            @{player.leetcodeProfile}
                          </a>
                        </div>

                        {isLoading ? (
                          <div className="text-xs text-slate-500">Loading stats...</div>
                        ) : stats ? (
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-400">Total:</span>
                              <span className="text-sm font-semibold text-white">{stats.totalSolved} solved</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">
                                <div className="text-lg font-bold text-emerald-400">
                                  {stats.easySolved}
                                </div>
                                <div className="text-xs text-slate-500">Easy</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-amber-400">
                                  {stats.mediumSolved}
                                </div>
                                <div className="text-xs text-slate-500">Medium</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-red-400">
                                  {stats.hardSolved}
                                </div>
                                <div className="text-xs text-slate-500">Hard</div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        LeetCode not connected
                      </div>
                    )}
                  </div>

                  {/* Actions & Stats */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <FireIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-white">
                        {player.streakCount} days
                      </span>
                    </div>

                    {isOwner && !isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setKickConfirm(player)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kick Confirmation Modal */}
      <Modal
        isOpen={!!kickConfirm}
        onClose={() => setKickConfirm(null)}
        title="Remove Member"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-white">
              {kickConfirm?.name || kickConfirm?.username}
            </span>{' '}
            from this room?
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setKickConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleKickMember}
              disabled={kicking}
            >
              {kicking ? 'Removing...' : 'Remove Member'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
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

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
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

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
