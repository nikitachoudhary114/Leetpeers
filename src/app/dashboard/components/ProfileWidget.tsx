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
}

export function ProfileWidget({
  user,
  leetcodeSolved,
}: ProfileWidgetProps) {

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Your Profile
        </h2>
        <Link
          href="/profile"
          className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-[var(--color-bg-tertiary)] rounded-2xl p-6 border border-[var(--color-border)] transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={user.avatarUrl} name={user.name} size="xl" />
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {user.name || "Anonymous"}
            </h3>
            <p className="text-[var(--color-text-muted)]">
              @{user.username || "username"}
            </p>
            {user.country && (
              <p className="text-sm text-[var(--color-text-disabled)] mt-1">
                {user.country}
              </p>
            )}
          </div>
        </div>

        {user.bio && (
          <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-bg-hover)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {user.streakCount}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">
              Day Streak
            </div>
          </div>
          <div className="bg-[var(--color-bg-hover)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {leetcodeSolved}
            </div>

            <div className="text-xs text-[var(--color-text-muted)] mt-1">
              Solved
            </div>
          </div>
          <div className="bg-[var(--color-bg-hover)] rounded-xl p-4 text-center">
            <div className="text-sm font-medium text-[var(--color-text-secondary)]">
              {memberSince}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">
              Member Since
            </div>
          </div>
        </div>

        {/* LeetCode Connection */}
        <div className="border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LeetCodeIcon className="w-5 h-5 text-amber-500" />
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
                  className="text-sm text-indigo-500 hover:text-indigo-400"
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/profile"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-all"
        >
          <EditIcon className="w-4 h-4" />
          Edit Profile
        </Link>
        <Link
          href="/rooms"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-all"
        >
          <RoomsIcon className="w-4 h-4" />
          View Rooms
        </Link>
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
