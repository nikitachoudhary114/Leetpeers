'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-[var(--color-bg-hover)] border border-[var(--color-border)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] hover:border-[var(--color-border-hover)]"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Track */}
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[var(--color-bg-hover)]' : 'bg-indigo-100'
        }`}
      />

      {/* Thumb */}
      <span
        className={`absolute top-0.5 w-7 h-7 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border ${
          theme === 'dark'
            ? 'left-0.5 bg-[var(--color-bg-tertiary)] border-[var(--color-border)]'
            : 'left-8 bg-white border-indigo-200'
        }`}
      >
        {theme === 'dark' ? (
          <MoonIcon className="w-4 h-4 text-indigo-400" />
        ) : (
          <SunIcon className="w-4 h-4 text-amber-500" />
        )}
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}
