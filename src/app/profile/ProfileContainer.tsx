'use client';

import { useState, useCallback } from 'react';
import type { UserWithRooms, ProfileUpdatePayload } from '@/types';
import { VerifiableProfileSection } from './components/VerifiableProfileSection';
import { Avatar } from '@/components/ui/Avatar';
import { AvatarSelector, CHARACTER_AVATARS } from '@/components/CharacterAvatars';

interface ProfileContainerProps {
  initialUser: UserWithRooms;
}

export default function ProfileContainer({ initialUser }: ProfileContainerProps) {
  const [user, setUser] = useState<UserWithRooms>(initialUser);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const handleUpdate = useCallback(
    async (data: ProfileUpdatePayload): Promise<boolean> => {
      setGlobalError(null);
      setGlobalSuccess(null);

      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          setGlobalError(result.error || 'Failed to update profile');
          return false;
        }

        setUser((prev) => ({ ...prev, ...result.user }));
        setGlobalSuccess('Profile updated successfully');
        setTimeout(() => setGlobalSuccess(null), 3000);
        return true;
      } catch {
        setGlobalError('Network error. Please try again.');
        return false;
      }
    },
    []
  );

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {globalError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {globalError}
          <button onClick={() => setGlobalError(null)} className="ml-auto text-red-400 hover:text-red-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {globalSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {globalSuccess}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar
            src={user.avatarUrl}
            name={user.name || user.email}
            size="2xl"
            className="shadow-xl shadow-indigo-500/20"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{user.name || 'Anonymous'}</h1>
            <p className="text-[var(--color-text-muted)]">@{user.username || 'username'}</p>
            <p className="text-sm text-[var(--color-text-disabled)] mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <AvatarSelectionSection
        currentAvatar={user.avatarUrl}
        onUpdate={handleUpdate}
        onAvatarChange={(avatarUrl) => {
          setUser((prev) => ({ ...prev, avatarUrl }));
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-2xl border border-orange-500/20 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{user.streakCount}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Day Streak</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{user.problemsSolved}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Problems Solved</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-2xl border border-indigo-500/20 p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{formatDate(user.createdAt)}</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Member Since</p>
        </div>
      </div>

      {/* LeetCode Section */}
      <VerifiableProfileSection
        title="LeetCode Account"
        description="Connect your LeetCode account to track progress"
        icon={<LeetCodeIcon />}
        iconBg="bg-amber-500/20"
        iconColor="text-amber-400"
        username={user.leetcodeProfile}
        isVerified={user.leetcodeVerified}
        type="leetcode"
        linkPrefix="https://leetcode.com/u/"
        linkText="View LeetCode Profile"
        onVerified={(username) => {
          setUser((prev) => ({
            ...prev,
            leetcodeProfile: username,
            leetcodeVerified: true,
          }));
        }}
      />

      {/* GitHub Section */}
      <VerifiableProfileSection
        title="GitHub Account"
        description="Link your GitHub profile to showcase your work"
        icon={<GitHubIcon />}
        iconBg="bg-slate-700"
        iconColor="text-white"
        username={user.githubProfile}
        isVerified={user.githubVerified}
        type="github"
        linkPrefix="https://github.com/"
        linkText="View GitHub Profile"
        onVerified={(username) => {
          setUser((prev) => ({
            ...prev,
            githubProfile: username,
            githubVerified: true,
          }));
        }}
      />

      {/* Personal Info Section */}
      <PersonalInfoSection user={user} onUpdate={handleUpdate} />
    </div>
  );
}

// Avatar Selection Section
function AvatarSelectionSection({
  currentAvatar,
  onUpdate,
  onAvatarChange,
}: {
  currentAvatar: string | null;
  onUpdate: (data: ProfileUpdatePayload) => Promise<boolean>;
  onAvatarChange: (avatarUrl: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const success = await onUpdate({ avatarUrl: selectedAvatar || null });
    setIsLoading(false);
    if (success) {
      onAvatarChange(selectedAvatar);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setSelectedAvatar(currentAvatar || '');
    setIsEditing(false);
  };

  const currentAvatarData = CHARACTER_AVATARS.find((a) => a.id === currentAvatar);

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Character Avatar</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Choose an avatar that represents you</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
          >
            Change
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <AvatarSelector
            selectedId={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Avatar'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mt-2">
          <Avatar src={currentAvatar} name={currentAvatarData?.name || 'Select Avatar'} size="xl" />
          <div>
            <p className="text-[var(--color-text-primary)] font-medium">
              {currentAvatarData?.name || <span className="text-[var(--color-text-muted)]">No avatar selected</span>}
            </p>
            {currentAvatarData && (
              <p className="text-sm text-[var(--color-text-muted)]">Click &quot;Change&quot; to select a different avatar</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Personal Info Section
function PersonalInfoSection({
  user,
  onUpdate,
}: {
  user: UserWithRooms;
  onUpdate: (data: ProfileUpdatePayload) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    country: user.country || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const success = await onUpdate({
      name: form.name,
      bio: form.bio || null,
      country: form.country || null,
    });
    setIsLoading(false);
    if (success) setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || '',
      bio: user.bio || '',
      country: user.country || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Personal Information</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Update your personal details</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-[var(--color-border-hover)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none hover:border-[var(--color-border-hover)]"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-[var(--color-border-hover)]"
              placeholder="Your country"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mt-2">
          <div>
            <span className="text-sm text-[var(--color-text-muted)]">Name: </span>
            <span className="text-[var(--color-text-primary)]">{user.name || <span className="text-[var(--color-text-muted)]">Not set</span>}</span>
          </div>
          <div>
            <span className="text-sm text-[var(--color-text-muted)]">Bio: </span>
            <span className="text-[var(--color-text-primary)]">{user.bio || <span className="text-[var(--color-text-muted)]">No bio yet</span>}</span>
          </div>
          <div>
            <span className="text-sm text-[var(--color-text-muted)]">Country: </span>
            <span className="text-[var(--color-text-primary)]">{user.country || <span className="text-[var(--color-text-muted)]">Not set</span>}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function LeetCodeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}
