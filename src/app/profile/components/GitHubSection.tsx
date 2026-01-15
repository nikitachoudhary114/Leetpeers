'use client';

import { useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { Input } from '@/components/ui';
import { validateGitHubUsername } from '@/lib/validations/profile';
import type { ProfileUpdatePayload } from '@/types';

interface GitHubSectionProps {
  githubProfile: string | null;
  onUpdate: (data: ProfileUpdatePayload) => Promise<boolean>;
}

export function GitHubSection({ githubProfile, onUpdate }: GitHubSectionProps) {
  const [username, setUsername] = useState(githubProfile || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const validationError = validateGitHubUsername(username);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    const success = await onUpdate({ githubProfile: username || null });
    setIsLoading(false);
    return success;
  };

  const handleCancel = () => {
    setUsername(githubProfile || '');
    setError(null);
  };

  return (
    <ProfileSection
      title="GitHub Account"
      description="Link your GitHub profile to showcase your work"
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
      editContent={
        <Input
          label="GitHub Username"
          name="githubProfile"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          placeholder="your_github_username"
          error={error || undefined}
        />
      }
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Username:</span>
          <span className="font-medium">
            {githubProfile || (
              <span className="text-gray-400">Not connected</span>
            )}
          </span>
        </div>
        {githubProfile && (
          <a
            href={`https://github.com/${githubProfile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            View GitHub Profile
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
