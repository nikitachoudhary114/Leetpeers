'use client';

import { useState } from 'react';
import { Avatar, Button } from '@/components/ui';

interface Player {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
}

interface VideoSectionProps {
  players: Player[];
  currentUserId: string;
}

export function VideoSection({ players, currentUserId }: VideoSectionProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const currentUser = players.find((p) => p.id === currentUserId);
  const otherPlayers = players.filter((p) => p.id !== currentUserId);

  if (!isInCall) {
    return (
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
            <VideoIcon className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Video Call</h3>
          <p className="text-slate-400 mb-6 max-w-md">
            Start a video call with your study group to collaborate in real-time and solve problems together.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {players.slice(0, 5).map((player) => (
                <Avatar
                  key={player.id}
                  src={player.avatarUrl}
                  name={player.name || player.username}
                  size="md"
                  className="ring-2 ring-slate-800"
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {players.length} members available
            </span>
          </div>

          <Button variant="primary" onClick={() => setIsInCall(true)} className="px-8">
            <VideoIcon className="w-5 h-5" />
            Start Call
          </Button>

          <p className="text-xs text-slate-500 mt-4">
            This is a UI demo - video functionality coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Video Grid */}
      <div className="p-4">
        <div
          className={`grid gap-3 ${
            players.length <= 2
              ? 'grid-cols-1 md:grid-cols-2'
              : players.length <= 4
              ? 'grid-cols-2'
              : 'grid-cols-2 md:grid-cols-3'
          }`}
        >
          {/* Current User (Large) */}
          <div
            className={`relative aspect-video bg-slate-900 rounded-xl overflow-hidden ${
              players.length <= 2 ? 'col-span-1' : ''
            }`}
          >
            {isCameraOff ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <Avatar
                  src={currentUser?.avatarUrl}
                  name={currentUser?.name || currentUser?.username}
                  size="xl"
                />
                <span className="mt-3 text-sm text-slate-400">
                  {currentUser?.name || currentUser?.username}
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                <Avatar
                  src={currentUser?.avatarUrl}
                  name={currentUser?.name || currentUser?.username}
                  size="xl"
                />
              </div>
            )}

            {/* Name Tag */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur rounded-lg">
              <span className="text-sm text-white font-medium">
                {currentUser?.name || currentUser?.username} (You)
              </span>
              {isMuted && <MicOffIcon className="w-4 h-4 text-red-400" />}
            </div>
          </div>

          {/* Other Participants */}
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 flex items-center justify-center">
                <Avatar
                  src={player.avatarUrl}
                  name={player.name || player.username}
                  size="lg"
                />
              </div>

              {/* Name Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur rounded-lg">
                <span className="text-sm text-white font-medium">
                  {player.name || player.username}
                </span>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {players.length < 4 && (
            <div className="aspect-video bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center">
              <UserPlusIcon className="w-8 h-8 text-slate-600 mb-2" />
              <span className="text-sm text-slate-500">Invite members</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen Share Banner */}
      {isScreenSharing && (
        <div className="mx-4 mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScreenShareIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-400">You are sharing your screen</span>
          </div>
          <button
            onClick={() => setIsScreenSharing(false)}
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            Stop Sharing
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-xl transition-colors ${
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {isMuted ? (
              <MicOffIcon className="w-6 h-6" />
            ) : (
              <MicIcon className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-4 rounded-xl transition-colors ${
              isCameraOff
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {isCameraOff ? (
              <VideoOffIcon className="w-6 h-6" />
            ) : (
              <VideoIcon className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-xl transition-colors ${
              isScreenSharing
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <ScreenShareIcon className="w-6 h-6" />
          </button>

          <div className="w-px h-10 bg-slate-700 mx-2" />

          <button
            onClick={() => setIsInCall(false)}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            <PhoneOffIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function VideoOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function MicOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      />
    </svg>
  );
}

function ScreenShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
      />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  );
}
