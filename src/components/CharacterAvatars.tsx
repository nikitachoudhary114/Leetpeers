'use client';

// 10 Unique Character Avatars
export const CHARACTER_AVATARS = [
  {
    id: 'avatar-ninja',
    name: 'Ninja Coder',
    emoji: '🥷',
    bgGradient: 'from-slate-700 to-slate-900',
    borderColor: 'border-slate-500',
  },
  {
    id: 'avatar-robot',
    name: 'Code Bot',
    emoji: '🤖',
    bgGradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-400',
  },
  {
    id: 'avatar-wizard',
    name: 'Algorithm Wizard',
    emoji: '🧙‍♂️',
    bgGradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
  },
  {
    id: 'avatar-astronaut',
    name: 'Space Coder',
    emoji: '👨‍🚀',
    bgGradient: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-400',
  },
  {
    id: 'avatar-fox',
    name: 'Clever Fox',
    emoji: '🦊',
    bgGradient: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-400',
  },
  {
    id: 'avatar-dragon',
    name: 'Code Dragon',
    emoji: '🐉',
    bgGradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
  },
  {
    id: 'avatar-unicorn',
    name: 'Debug Unicorn',
    emoji: '🦄',
    bgGradient: 'from-pink-400 to-purple-500',
    borderColor: 'border-pink-400',
  },
  {
    id: 'avatar-owl',
    name: 'Wise Owl',
    emoji: '🦉',
    bgGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400',
  },
  {
    id: 'avatar-cat',
    name: 'Hacker Cat',
    emoji: '🐱',
    bgGradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-400',
  },
  {
    id: 'avatar-alien',
    name: 'Alien Dev',
    emoji: '👽',
    bgGradient: 'from-lime-400 to-green-500',
    borderColor: 'border-lime-400',
  },
];

interface CharacterAvatarProps {
  avatarId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-sm',
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl',
  xl: 'w-16 h-16 text-2xl',
  '2xl': 'w-20 h-20 text-3xl',
};

export function CharacterAvatar({
  avatarId,
  size = 'md',
  className = '',
  showBorder = true,
}: CharacterAvatarProps) {
  const avatar = CHARACTER_AVATARS.find((a) => a.id === avatarId) || CHARACTER_AVATARS[0];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br ${avatar.bgGradient}
        flex items-center justify-center
        ${showBorder ? `ring-2 ${avatar.borderColor} ring-offset-2 ring-offset-[var(--color-bg-primary)]` : ''}
        ${className}
      `}
      title={avatar.name}
    >
      <span className="select-none">{avatar.emoji}</span>
    </div>
  );
}

interface AvatarSelectorProps {
  selectedId: string | null;
  onSelect: (avatarId: string) => void;
}

export function AvatarSelector({ selectedId, onSelect }: AvatarSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Choose Your Avatar
      </h3>
      <p className="text-sm text-[var(--color-text-muted)]">
        Select a character avatar that represents you in the community.
      </p>

      <div className="grid grid-cols-5 gap-4 p-4 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)]">
        {CHARACTER_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`
              relative p-2 rounded-xl transition-all duration-200
              ${
                selectedId === avatar.id
                  ? 'bg-indigo-500/20 ring-2 ring-indigo-500 scale-110'
                  : 'hover:bg-[var(--color-bg-hover)] hover:scale-105'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <CharacterAvatar avatarId={avatar.id} size="xl" showBorder={false} />
              <span className="text-xs text-[var(--color-text-muted)] text-center leading-tight">
                {avatar.name}
              </span>
            </div>
            {selectedId === avatar.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Helper function to check if a string is a character avatar ID
export function isCharacterAvatar(avatarUrl: string | null | undefined): boolean {
  if (!avatarUrl) return false;
  return avatarUrl.startsWith('avatar-');
}

// Get avatar data by ID
export function getAvatarById(avatarId: string) {
  return CHARACTER_AVATARS.find((a) => a.id === avatarId);
}
