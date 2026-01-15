'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Badge, Button, Modal } from '@/components/ui';

interface RoomHeaderProps {
  room: {
    id: string;
    name: string | null;
    code: string;
    dailyTarget: number;
    streakCount: number;
    ownerId: string;
    owner: {
      id: string;
      username: string | null;
      name: string | null;
    };
    _count: {
      players: number;
    };
  };
  userId: string;
}

export function RoomHeader({ room, userId }: RoomHeaderProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [dailyTarget, setDailyTarget] = useState(room.dailyTarget);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = room.ownerId === userId;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateTarget = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/room/${room.id}/set-target`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ dailyTarget }),
      });

      if (res.ok) {
        setShowSettings(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/room/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: room.id }),
      });

      if (res.ok) {
        router.push('/rooms');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Room Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/rooms')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <BackIcon className="w-5 h-5 text-slate-400" />
              </button>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-white">
                    {room.name || 'Unnamed Room'}
                  </h1>
                  {isOwner && <Badge variant="premium">Owner</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Code: {room.code}</span>
                    {copied ? (
                      <CheckIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </button>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm text-slate-400">
                    {room._count.players} members
                  </span>
                </div>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <FireIcon className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-lg font-bold text-orange-400">{room.streakCount}</div>
                  <div className="text-xs text-orange-400/70">Day Streak</div>
                </div>
              </div>

              {/* Daily Target */}
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <TargetIcon className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-lg font-bold text-indigo-400">{room.dailyTarget}</div>
                  <div className="text-xs text-indigo-400/70">Daily Target</div>
                </div>
              </div>

              {/* Actions */}
              {isOwner ? (
                <Button variant="secondary" onClick={() => setShowSettings(true)}>
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </Button>
              ) : (
                <Button variant="danger" onClick={() => setShowLeaveConfirm(true)}>
                  <LeaveIcon className="w-4 h-4" />
                  Leave
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Room Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Daily Target (problems/day)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-700 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleUpdateTarget}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Confirmation Modal */}
      <Modal
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        title="Leave Room"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to leave this room? You can rejoin later using the room code.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowLeaveConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleLeaveRoom}
              disabled={loading}
            >
              {loading ? 'Leaving...' : 'Leave Room'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LeaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
