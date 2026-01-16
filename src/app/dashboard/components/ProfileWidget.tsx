"use client";

import Link from "next/link";
import { Avatar, Badge } from "@/components/ui";

interface ProfileWidgetProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    avatarUrl: string | null;
    leetcodeProfile: string | null;
    streakCount: number;
    bio: string | null;
    country: string | null;
    createdAt: string;
  };
  leetcodeSolved: number;
  leetcodeStats?: {
    ranking: number | null;
    solved: {
      all: number;
      easy: number;
      medium: number;
      hard: number;
    };
  } | null;
}

export function ProfileWidget({
  user,
  leetcodeSolved,
  leetcodeStats,
}: ProfileWidgetProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

 return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
        Your Profile
      </h2>
      <Link
        href="/profile"
        className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
      >
        Edit Profile →
      </Link>
    </div>

    {/* Profile Card */}
    <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] p-6">

      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-5 mb-6">
        <Avatar src={user.avatarUrl} name={user.name} size="xl" />
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {user.name || "Anonymous"}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            @{user.username || "username"}
          </p>
          {user.country && (
            <p className="text-xs text-[var(--color-text-disabled)] mt-1">
              {user.country}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="relative text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
          {user.bio}
        </p>
      )}

      {/* Ranking Highlight */}
      {leetcodeStats?.ranking && (
        <div className="mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">
            🌍 LeetCode Global Ranking
          </span>
          <span className="text-2xl font-bold text-indigo-400">
            #{leetcodeStats.ranking.toLocaleString()}
          </span>
        </div>
      )}

      {/* Core Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Day Streak" value={user.streakCount} color="orange" />
        <StatCard label="Solved" value={leetcodeSolved} color="emerald" />
        <StatCard label="Member Since" value={memberSince} small />
      </div>

      {/* Difficulty Breakdown */}
      {leetcodeStats && (
        <div className="mb-6">
          <p className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
            Difficulty Breakdown
          </p>
          <div className="flex gap-3">
            <DifficultyPill label="Easy" value={leetcodeStats.solved.easy} color="green" />
            <DifficultyPill label="Medium" value={leetcodeStats.solved.medium} color="yellow" />
            <DifficultyPill label="Hard" value={leetcodeStats.solved.hard} color="red" />
          </div>
        </div>
      )}

      {/* LeetCode Connection */}
      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LeetCodeIcon className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-[var(--color-text-secondary)]">
            LeetCode
          </span>
        </div>

        {user.leetcodeProfile ? (
          <div className="flex items-center gap-2">
            <Badge variant="success">Connected</Badge>
            <a
              href={`https://leetcode.com/${user.leetcodeProfile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-500 hover:text-indigo-400"
            >
              @{user.leetcodeProfile}
            </a>
          </div>
        ) : (
          <Link href="/profile">
            <Badge variant="warning">Connect Now</Badge>
          </Link>
        )}
      </div>
    </div>

    {/* Actions */}
    <div className="grid grid-cols-2 gap-3">
      <ActionButton href="/profile" label="Edit Profile" icon={<EditIcon className="w-3.5 h-3.5" />} />
      <ActionButton href="/rooms" label="View Rooms" icon={<RoomsIcon className="w-3.5 h-3.5"/>} />
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

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function RoomsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function ActionButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center justify-center gap-1.5
        rounded-lg
        border border-[var(--color-border)]
        bg-[var(--color-bg-tertiary)]
        px-3 py-1.5
        text-xs font-medium
        text-[var(--color-text-secondary)]
        transition-all
        hover:bg-[var(--color-bg-hover)]
        hover:text-[var(--color-text-primary)]
        hover:-translate-y-0.5
        active:translate-y-0
      "
    >
      <span className="w-3.5 h-3.5">{icon}</span>
      {label}
    </Link>
  );
}


const STAT_COLORS = {
  orange: "text-orange-400",
  emerald: "text-emerald-400",
  indigo: "text-indigo-400",
};

function StatCard({
  label,
  value,
  color = "indigo",
  small,
}: {
  label: string;
  value: string | number;
  color?: keyof typeof STAT_COLORS;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-bg-hover)] p-4 text-center">
      <div
        className={`${small ? "text-sm" : "text-2xl"} font-bold ${
          STAT_COLORS[color]
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-[var(--color-text-muted)] mt-1">
        {label}
      </div>
    </div>
  );
}


const DIFFICULTY_COLORS = {
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
  },
};

function DifficultyPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: keyof typeof DIFFICULTY_COLORS;
}) {
  const c = DIFFICULTY_COLORS[color];

  return (
    <div
      className={`flex-1 rounded-xl ${c.bg} ${c.border} px-4 py-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm`}
    >
      <p className={`text-xl font-bold ${c.text}`}>{value}</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">
        {label}
      </p>
    </div>
  );
}
