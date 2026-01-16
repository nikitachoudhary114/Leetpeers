'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CircularProgress, ProgressBar, Badge, Button } from '@/components/ui';

interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
}

interface AnalyticsWidgetProps {
  leetcodeUsername: string | null;
  userStreak: number;
}

interface Recommendation {
  type: 'topic' | 'problem';
  title: string;
  reason: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  priority: 'high' | 'medium' | 'low';
}

const generateRecommendations = (stats: LeetCodeStats | null): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (!stats) {
    return [
      {
        type: 'topic',
        title: 'Start with Arrays & Strings',
        reason: 'Foundation for most coding problems',
        priority: 'high',
      },
      {
        type: 'problem',
        title: 'Two Sum',
        reason: 'Classic beginner problem to learn hash maps',
        difficulty: 'Easy',
        priority: 'high',
      },
    ];
  }

  // Check weak areas
  const easyPercent = (stats.easySolved / stats.totalEasy) * 100;
  const mediumPercent = (stats.mediumSolved / stats.totalMedium) * 100;
  const hardPercent = (stats.hardSolved / stats.totalHard) * 100;

  if (easyPercent < 20) {
    recommendations.push({
      type: 'topic',
      title: 'Master Easy Problems First',
      reason: `You've solved ${stats.easySolved} easy problems. Aim for 100+ to build strong foundations.`,
      priority: 'high',
    });
  }

  if (stats.easySolved > 50 && mediumPercent < 10) {
    recommendations.push({
      type: 'topic',
      title: 'Start Medium Problems',
      reason: 'Ready to level up! Medium problems will prepare you for interviews.',
      priority: 'high',
    });
  }

  if (stats.mediumSolved > 100 && hardPercent < 5) {
    recommendations.push({
      type: 'topic',
      title: 'Challenge Yourself with Hard',
      reason: 'Time to tackle hard problems for FAANG-level preparation.',
      priority: 'medium',
    });
  }

  // Topic recommendations based on common patterns
  const topicSuggestions = [
    { title: 'Two Pointers', reason: 'Essential for array and string problems', priority: 'high' as const },
    { title: 'Binary Search', reason: 'Key for O(log n) solutions', priority: 'high' as const },
    { title: 'Sliding Window', reason: 'Common pattern for substring/subarray problems', priority: 'medium' as const },
    { title: 'Dynamic Programming', reason: 'Required for optimization problems', priority: 'medium' as const },
    { title: 'Graph Traversal (BFS/DFS)', reason: 'Essential for tree and graph problems', priority: 'medium' as const },
  ];

  // Add 2-3 topic suggestions
  const shuffled = topicSuggestions.sort(() => Math.random() - 0.5);
  recommendations.push(
    ...shuffled.slice(0, 3).map((t) => ({ ...t, type: 'topic' as const }))
  );

  // Problem recommendations
  const problemSuggestions = [
    { title: 'Valid Parentheses', difficulty: 'Easy' as const, reason: 'Learn stack data structure' },
    { title: 'Merge Intervals', difficulty: 'Medium' as const, reason: 'Common interview question' },
    { title: 'LRU Cache', difficulty: 'Medium' as const, reason: 'System design fundamental' },
    { title: 'Longest Substring Without Repeating', difficulty: 'Medium' as const, reason: 'Sliding window mastery' },
    { title: 'Word Search', difficulty: 'Medium' as const, reason: 'Backtracking practice' },
  ];

  recommendations.push(
    ...problemSuggestions.slice(0, 2).map((p) => ({
      type: 'problem' as const,
      title: p.title,
      difficulty: p.difficulty,
      reason: p.reason,
      priority: 'medium' as const,
    }))
  );

  return recommendations.slice(0, 6);
};

export function AnalyticsWidget({ leetcodeUsername, userStreak }: AnalyticsWidgetProps) {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations'>('overview');

  const fetchStats = useCallback(async () => {
    if (!leetcodeUsername) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leetcode/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: leetcodeUsername }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch LeetCode stats');
      }

      const data = await res.json();

      if (data.profile?.submitStats?.acSubmissionNum) {
        const submissions = data.profile.submitStats.acSubmissionNum;
        const allSolved = submissions.find((s: { difficulty: string }) => s.difficulty === 'All');
        const easySolved = submissions.find((s: { difficulty: string }) => s.difficulty === 'Easy');
        const mediumSolved = submissions.find((s: { difficulty: string }) => s.difficulty === 'Medium');
        const hardSolved = submissions.find((s: { difficulty: string }) => s.difficulty === 'Hard');

        setStats({
          totalSolved: allSolved?.count || 0,
          totalQuestions: 3373,
          easySolved: easySolved?.count || 0,
          totalEasy: 837,
          mediumSolved: mediumSolved?.count || 0,
          totalMedium: 1756,
          hardSolved: hardSolved?.count || 0,
          totalHard: 780,
          acceptanceRate: data.profile?.profile?.acceptanceRate || 0,
          ranking: data.profile?.profile?.ranking || 0,
        });
      }
    } catch (err) {
      setError('Could not load LeetCode stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [leetcodeUsername]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const recommendations = generateRecommendations(stats);

  if (!leetcodeUsername) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Analytics & Recommendations</h2>
        <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-8 border border-[var(--color-border)] text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LeetCodeIcon className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Connect LeetCode</h3>
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            Link your LeetCode account to track your progress and get personalized recommendations.
          </p>
          <Link href="/profile">
            <Button variant="primary">Connect Account</Button>
          </Link>
        </div>

        {/* Show general recommendations */}
        <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-400" />
            Getting Started Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Analytics & Recommendations</h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
        >
          <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Recommendations
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          {loading && !stats ? (
            <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-8 border border-[var(--color-border)] flex items-center justify-center">
              <div className="animate-pulse text-[var(--color-text-muted)]">Loading stats...</div>
            </div>
          ) : stats ? (
            <>
              {/* Main Stats Card */}
              <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6 border border-[var(--color-border)]">
                <div className="flex items-center gap-6 mb-6">
                  {/* Circular Progress */}
                  <CircularProgress
                    value={stats.totalSolved}
                    max={stats.totalQuestions}
                    size={140}
                    strokeWidth={10}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--color-text-primary)]">{stats.totalSolved}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Solved</div>
                    </div>
                  </CircularProgress>

                  {/* Quick Stats */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-muted)]">Streak</span>
                      <div className="flex items-center gap-2">
                        <FireIcon className="w-4 h-4 text-orange-400" />
                        <span className="font-semibold text-[var(--color-text-primary)]">{userStreak} days</span>
                      </div>
                    </div>
                    {stats.ranking > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-text-muted)]">Ranking</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">#{stats.ranking.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-muted)]">LeetCode</span>
                      <Badge variant="success">@{leetcodeUsername}</Badge>
                    </div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-4">
                  <ProgressBar
                    label="Easy"
                    value={stats.easySolved}
                    max={stats.totalEasy}
                    variant="easy"
                    size="md"
                  />
                  <ProgressBar
                    label="Medium"
                    value={stats.mediumSolved}
                    max={stats.totalMedium}
                    variant="medium"
                    size="md"
                  />
                  <ProgressBar
                    label="Hard"
                    value={stats.hardSolved}
                    max={stats.totalHard}
                    variant="hard"
                    size="md"
                  />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{stats.easySolved}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">Easy</div>
                </div>
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 text-center">
                  <div className="text-2xl font-bold text-amber-400">{stats.mediumSolved}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">Medium</div>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.hardSolved}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-1">Hard</div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6 border border-[var(--color-border)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--color-bg-primary)]/50 rounded-xl p-4">
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">Total Progress</div>
                    <div className="text-lg font-bold text-[var(--color-text-primary)]">
                      {((stats.totalSolved / stats.totalQuestions) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-[var(--color-bg-primary)]/50 rounded-xl p-4">
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">To Top 10%</div>
                    <div className="text-lg font-bold text-[var(--color-text-primary)]">
                      {Math.max(0, 300 - stats.totalSolved)} more
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-2">
              <SparklesIcon className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-[var(--color-text-primary)]">AI-Powered Recommendations</h3>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Based on your progress, here&apos;s what you should focus on next to maximize your learning.
            </p>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>

          {/* Study Plan */}
          <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6 border border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              Suggested Weekly Plan
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-[var(--color-text-muted)]">Mon-Wed</div>
                <div className="flex-1 bg-[var(--color-bg-hover)]/50 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  Focus on Easy problems (2-3 per day)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-[var(--color-text-muted)]">Thu-Fri</div>
                <div className="flex-1 bg-[var(--color-bg-hover)]/50 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  Tackle Medium problems (1-2 per day)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-[var(--color-text-muted)]">Weekend</div>
                <div className="flex-1 bg-[var(--color-bg-hover)]/50 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  Review solutions & learn new patterns
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-amber-500/30 bg-amber-500/5',
    low: 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)]',
  };

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-400/10',
    Medium: 'text-amber-400 bg-amber-400/10',
    Hard: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className={`rounded-xl p-4 border ${priorityColors[recommendation.priority]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {recommendation.type === 'topic' ? (
              <BookIcon className="w-4 h-4 text-indigo-400" />
            ) : (
              <CodeIcon className="w-4 h-4 text-emerald-400" />
            )}
            <h4 className="font-medium text-[var(--color-text-primary)]">{recommendation.title}</h4>
            {recommendation.difficulty && (
              <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[recommendation.difficulty]}`}>
                {recommendation.difficulty}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">{recommendation.reason}</p>
        </div>
        {recommendation.priority === 'high' && (
          <Badge variant="danger" size="sm">Priority</Badge>
        )}
      </div>
    </div>
  );
}

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
