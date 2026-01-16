'use client';

import { useState, useEffect, useCallback } from 'react';

type TimeRange = 'weekly' | 'monthly' | 'yearly';

interface DailyStats {
  date: string;
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

interface AnalyticsData {
  dailyStats: DailyStats[];
  totals: { easy: number; medium: number; hard: number; total: number };
  bestDay: { date: string; total: number };
  activeStreak: number;
  avgPerDay: string;
  streakCount: number;
  totalProblemsSolved: number;
}

interface PracticeAnalyticsProps {
  userStreak: number;
}

export function PracticeAnalytics({ userStreak }: PracticeAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Could not load analytics data');
      // Fall back to mock data
      setData(generateMockData(timeRange));
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Use API data or fallback to calculated values
  const dailyStats = data?.dailyStats || [];
  const totals = data?.totals || { easy: 0, medium: 0, hard: 0, total: 0 };
  const bestDay = data?.bestDay || { date: '', total: 0 };
  const avgPerDay = data?.avgPerDay || '0';
  const currentStreak = data?.streakCount ?? userStreak;

  // Get recent days for chart
  const recentDays = timeRange === 'weekly' ? dailyStats : dailyStats.slice(-14);
  const maxValue = Math.max(...recentDays.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Practice Analytics</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Track your problem-solving progress
          </p>
        </div>
        {/* Time Range Selector */}
        <div className="flex gap-1 p-1 bg-[var(--color-bg-tertiary)] rounded-lg">
          {(['weekly', 'monthly', 'yearly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                timeRange === range
                  ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[var(--color-text-muted)]">Loading analytics...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-400">
          {error} - Showing sample data
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Solved"
              value={totals.total}
              icon={<CheckIcon className="w-5 h-5" />}
              color="indigo"
            />
            <StatCard
              title="Current Streak"
              value={`${currentStreak} days`}
              icon={<FireIcon className="w-5 h-5" />}
              color="orange"
            />
            <StatCard
              title="Avg. Per Day"
              value={avgPerDay}
              icon={<ChartIcon className="w-5 h-5" />}
              color="emerald"
            />
            <StatCard
              title="Best Day"
              value={`${bestDay.total} problems`}
              subtitle={bestDay.date ? formatDate(bestDay.date) : '-'}
              icon={<TrophyIcon className="w-5 h-5" />}
              color="amber"
            />
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Difficulty Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              <DifficultyCard
                label="Easy"
                count={totals.easy}
                total={totals.total}
                color="emerald"
              />
              <DifficultyCard
                label="Medium"
                count={totals.medium}
                total={totals.total}
                color="amber"
              />
              <DifficultyCard
                label="Hard"
                count={totals.hard}
                total={totals.total}
                color="red"
              />
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Activity ({timeRange === 'weekly' ? 'Last 7 Days' : timeRange === 'monthly' ? 'Last 14 Days' : 'Last 14 Days'})
            </h3>
            <div className="flex items-end gap-1 h-32">
              {recentDays.map((day, index) => {
                const height = (day.total / maxValue) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-full rounded-t-sm transition-all hover:from-indigo-400 hover:to-purple-400 ${
                        day.total > 0
                          ? 'bg-gradient-to-t from-indigo-500 to-purple-500'
                          : 'bg-[var(--color-bg-hover)]'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${day.date}: ${day.total} problems`}
                    />
                    {(timeRange === 'weekly' || index % 2 === 0) && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Heatmap (for monthly/yearly) */}
          {timeRange !== 'weekly' && dailyStats.length > 0 && (
            <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {dailyStats.slice(-28).map((day, index) => {
                  const intensity = day.total === 0 ? 0 : day.total <= 1 ? 1 : day.total <= 3 ? 2 : 3;
                  const colors = [
                    'bg-[var(--color-bg-hover)]',
                    'bg-emerald-900',
                    'bg-emerald-700',
                    'bg-emerald-500',
                  ];
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm ${colors[intensity]} transition-colors hover:ring-2 hover:ring-white/20`}
                      title={`${day.date}: ${day.total} problems`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-xs text-[var(--color-text-muted)]">Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[var(--color-bg-hover)]" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-900" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">More</span>
              </div>
            </div>
          )}

          {/* Progress Insights */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <LightbulbIcon className="w-4 h-4 text-amber-400" />
              Insights
            </h3>
            <ul className="space-y-3">
              {totals.easy > totals.medium + totals.hard && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  Great progress on Easy problems! Consider challenging yourself with more Medium problems.
                </li>
              )}
              {currentStreak >= 3 && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  Amazing! You&apos;ve been consistent for {currentStreak} days. Keep the streak going!
                </li>
              )}
              {Number(avgPerDay) < 2 && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  Try solving at least 2 problems daily to improve your consistency.
                </li>
              )}
              {totals.hard === 0 && totals.total > 0 && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  No Hard problems this period. Tackling one Hard problem a week can significantly boost your skills!
                </li>
              )}
              {totals.total === 0 && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  Start solving problems to build your analytics! Every problem solved is tracked here.
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// Generate mock data as fallback
function generateMockData(range: TimeRange): AnalyticsData {
  const dailyStats: DailyStats[] = [];
  const now = new Date();
  const days = range === 'weekly' ? 7 : range === 'monthly' ? 30 : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const easy = Math.floor(Math.random() * 3);
    const medium = Math.floor(Math.random() * 2);
    const hard = Math.floor(Math.random() * 1);
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      easy,
      medium,
      hard,
      total: easy + medium + hard,
    });
  }

  const totals = dailyStats.reduce(
    (acc, day) => ({
      easy: acc.easy + day.easy,
      medium: acc.medium + day.medium,
      hard: acc.hard + day.hard,
      total: acc.total + day.total,
    }),
    { easy: 0, medium: 0, hard: 0, total: 0 }
  );

  const bestDay = dailyStats.reduce((max, day) => (day.total > max.total ? day : max), dailyStats[0]);
  const avgPerDay = (totals.total / dailyStats.length).toFixed(1);

  return {
    dailyStats,
    totals,
    bestDay,
    activeStreak: 3,
    avgPerDay,
    streakCount: 3,
    totalProblemsSolved: totals.total,
  };
}

// Helper Components
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'indigo' | 'orange' | 'emerald' | 'amber';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-[var(--color-text-muted)]">{title}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</div>
      {subtitle && <div className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</div>}
    </div>
  );
}

interface DifficultyCardProps {
  label: string;
  count: number;
  total: number;
  color: 'emerald' | 'amber' | 'red';
}

function DifficultyCard({ label, count, total, color }: DifficultyCardProps) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-400',
    amber: 'text-amber-400 bg-amber-400',
    red: 'text-red-400 bg-red-400',
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
        {count}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
      <div className="mt-2 h-1.5 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color].split(' ')[1]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-[var(--color-text-muted)] mt-1">{percentage}%</div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
