'use client';

import { useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { Input } from '@/components/ui';
import { validateLeetCodeUsername } from '@/lib/validations/profile';
import type { ProfileUpdatePayload } from '@/types';

interface LeetCodeSectionProps {
  leetcodeProfile: string | null;
  onUpdate: (data: ProfileUpdatePayload) => Promise<boolean>;
}

export function LeetCodeSection({
  leetcodeProfile,
  onUpdate,
}: LeetCodeSectionProps) {
  const [username, setUsername] = useState(leetcodeProfile || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const validationError = validateLeetCodeUsername(username);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    const success = await onUpdate({ leetcodeProfile: username || null });
    setIsLoading(false);
    return success;
  };

  const handleCancel = () => {
    setUsername(leetcodeProfile || '');
    setError(null);
  };

  return (
    <ProfileSection
      title="LeetCode Account"
      description="Connect your LeetCode account to track your progress"
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
      editContent={
        <Input
          label="LeetCode Username"
          name="leetcodeProfile"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          placeholder="your_leetcode_username"
          error={error || undefined}
          helperText="Enter your LeetCode username to sync statistics"
        />
      }
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Username:</span>
          <span className="font-medium">
            {leetcodeProfile || (
              <span className="text-gray-400">Not connected</span>
            )}
          </span>
        </div>
        {leetcodeProfile && (
          <a
            href={`https://leetcode.com/u/${leetcodeProfile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            View LeetCode Profile
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </ProfileSection>
  );
}
