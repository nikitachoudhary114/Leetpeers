'use client';

import { useState } from 'react';
import { problems, type Problem } from './problemsData';

interface ProblemsListProps {
  onSelectProblem: (problem: Problem) => void;
  selectedProblemId: number | null;
}

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

export function ProblemsList({ onSelectProblem, selectedProblemId }: ProblemsListProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const problemCounts = {
    All: problems.length,
    Easy: problems.filter((p) => p.difficulty === 'Easy').length,
    Medium: problems.filter((p) => p.difficulty === 'Medium').length,
    Hard: problems.filter((p) => p.difficulty === 'Hard').length,
  };

  return (
    <div className="bg-[var(--color-bg-tertiary)]/30 rounded-2xl border border-[var(--color-border)] h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-4">
          <CodeIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-[var(--color-text-primary)]">Problems</h3>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-bg-hover)] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {(['All', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === diff
                  ? diff === 'All'
                    ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                    : difficultyColors[diff as keyof typeof difficultyColors]
                  : 'bg-[var(--color-bg-hover)]/50 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {diff}
              <span className="ml-1.5 text-xs opacity-70">({problemCounts[diff]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProblems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[var(--color-text-muted)]">No problems found</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]/50">
            {filteredProblems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => onSelectProblem(problem)}
                className={`w-full p-4 text-left hover:bg-[var(--color-bg-tertiary)]/50 transition-colors ${
                  selectedProblemId === problem.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--color-text-muted)]">#{problem.id}</span>
                      <h4 className="font-medium text-[var(--color-text-primary)] truncate">{problem.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${
                          difficultyColors[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      {problem.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
