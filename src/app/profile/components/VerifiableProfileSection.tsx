'use client';

import { useState, useEffect, useCallback } from 'react';

interface VerifiableProfileSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  username: string | null;
  isVerified: boolean;
  type: 'leetcode' | 'github';
  linkPrefix: string;
  linkText: string;
  onVerified: (username: string) => void;
}

interface VerificationState {
  code: string;
  username: string;
  expiresAt: string;
}

export function VerifiableProfileSection({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  username,
  isVerified,
  type,
  linkPrefix,
  linkText,
  onVerified,
}: VerifiableProfileSectionProps) {
  const [mode, setMode] = useState<'view' | 'connect' | 'pending'>('view');
  const [inputUsername, setInputUsername] = useState('');
  const [verification, setVerification] = useState<VerificationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for pending verification on mount
  const checkPendingVerification = useCallback(async () => {
    try {
      const res = await fetch(`/api/verify/status?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hasPending) {
          setVerification({
            code: data.code,
            username: data.username,
            expiresAt: data.expiresAt,
          });
          setMode('pending');
        }
      }
    } catch (err) {
      console.error('Failed to check verification status:', err);
    }
  }, [type]);

  useEffect(() => {
    if (!username && !isVerified) {
      checkPendingVerification();
    }
  }, [username, isVerified, checkPendingVerification]);

  const handleStartVerification = async () => {
    if (!inputUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, username: inputUsername.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to start verification');
        return;
      }

      setVerification({
        code: data.code,
        username: inputUsername.trim(),
        expiresAt: data.expiresAt,
      });
      setMode('pending');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      if (data.success) {
        setSuccessMessage(data.message);
        setMode('view');
        setVerification(null);
        onVerified(data.username);
      } else {
        setError(data.error || 'Verification code not found in bio');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = async () => {
    try {
      await fetch(`/api/verify/status?type=${type}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to cancel verification:', err);
    }
    setVerification(null);
    setMode('view');
    setInputUsername('');
    setError(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const platformName = type === 'leetcode' ? 'LeetCode' : 'GitHub';
  const profileUrl = type === 'leetcode'
    ? 'https://leetcode.com/profile/'
    : 'https://github.com/settings/profile';

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                  <VerifiedIcon className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
          <VerifiedIcon className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* View Mode - Show connected account */}
      {mode === 'view' && username && isVerified && (
        <div className="mt-2">
          <p className="text-white font-medium flex items-center gap-2">
            @{username}
            <span className="text-emerald-400">
              <VerifiedIcon className="w-4 h-4" />
            </span>
          </p>
          <a
            href={`${linkPrefix}${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {linkText}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* View Mode - Not connected */}
      {mode === 'view' && !username && !isVerified && (
        <div className="mt-2">
          <p className="text-slate-500 mb-4">Not connected</p>
          <button
            onClick={() => setMode('connect')}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Connect {platformName}
          </button>
        </div>
      )}

      {/* Connect Mode - Enter username */}
      {mode === 'connect' && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter your {platformName} username
            </label>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder={`Your ${platformName} username`}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStartVerification}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Starting...' : 'Start Verification'}
            </button>
            <button
              onClick={() => {
                setMode('view');
                setInputUsername('');
                setError(null);
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending Mode - Show verification instructions */}
      {mode === 'pending' && verification && (
        <div className="space-y-4 mt-4">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-white mb-3">
              Verification Steps for @{verification.username}
            </h4>
            <ol className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  1
                </span>
                <span>
                  Go to your{' '}
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    {platformName} profile settings
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  2
                </span>
                <span>Add this code to your profile bio:</span>
              </li>
            </ol>

            {/* Verification Code */}
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-slate-900 rounded-lg text-amber-400 font-mono text-sm">
                {verification.code}
              </code>
              <button
                onClick={() => copyToClipboard(verification.code)}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <CopyIcon className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            <ol start={3} className="mt-3 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  3
                </span>
                <span>Save your profile changes on {platformName}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  4
                </span>
                <span>Click &quot;Verify Now&quot; below</span>
              </li>
            </ol>

            <p className="mt-4 text-xs text-slate-500">
              Code expires at {new Date(verification.expiresAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCheckVerification}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingIcon className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <VerifiedIcon className="w-4 h-4" />
                  Verify Now
                </>
              )}
            </button>
            <button
              onClick={handleCancelVerification}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
