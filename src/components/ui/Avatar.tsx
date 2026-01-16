'use client';

import { CHARACTER_AVATARS, isCharacterAvatar } from '@/components/CharacterAvatars';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const emojiSizeClasses = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className = '',
  showBorder = true,
}: AvatarProps) {
  // Check if this is a character avatar
  if (src && isCharacterAvatar(src)) {
    const avatar = CHARACTER_AVATARS.find((a) => a.id === src) || CHARACTER_AVATARS[0];

    return (
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br ${avatar.bgGradient}
          flex items-center justify-center
          ${showBorder ? `ring-2 ring-[var(--color-border)] ring-offset-1 ring-offset-[var(--color-bg-primary)]` : ''}
          ${className}
        `}
        title={avatar.name}
      >
        <span className={`select-none ${emojiSizeClasses[size]}`}>{avatar.emoji}</span>
      </div>
    );
  }

  // Regular image avatar
  if (src && !isCharacterAvatar(src)) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`
          ${sizeClasses[size]}
          rounded-full
          object-cover
          ${showBorder ? 'ring-2 ring-[var(--color-border)]' : ''}
          ${className}
        `}
      />
    );
  }

  // Fallback to initials
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const colorIndex = name ? name.charCodeAt(0) % 5 : 0;
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
  ];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br ${gradients[colorIndex]}
        flex items-center justify-center
        font-semibold text-white
        ${showBorder ? 'ring-2 ring-[var(--color-border)]' : ''}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
