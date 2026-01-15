'use client';

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import type { Problem } from './problemsData';

interface ProblemViewProps {
  problem: Problem;
  onBack: () => void;
}

type Language = 'python' | 'javascript' | 'java' | 'cpp';
type Tab = 'description' | 'solution' | 'hints';

const languageLabels: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++',
};

export function ProblemView({ problem, onBack }: ProblemViewProps) {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(problem.starterCode[language]);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [showSolution, setShowSolution] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
    setShowSolution(false);
  };

  const revealHint = (index: number) => {
    if (!hintsRevealed.includes(index)) {
      setHintsRevealed([...hintsRevealed, index]);
    }
  };

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[700px]">
      {/* Left Panel - Problem Description */}
      <div className="lg:w-1/2 bg-slate-800/30 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <BackIcon className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">#{problem.id}</span>
                <h2 className="font-semibold text-white truncate">{problem.title}</h2>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-sm font-medium border ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(['description', 'solution', 'hints'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'description' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {problem.description}
                </pre>
              </div>

              {/* Examples */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Examples</h4>
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 rounded-xl p-4 border border-slate-700"
                    >
                      <div className="text-xs text-slate-500 mb-2">Example {index + 1}</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Input: </span>
                          <code className="text-emerald-400">{example.input}</code>
                        </div>
                        <div>
                          <span className="text-slate-400">Output: </span>
                          <code className="text-amber-400">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="text-slate-400 text-xs mt-2">
                            <span className="font-medium">Explanation: </span>
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Constraints</h4>
                <ul className="list-disc list-inside space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm text-slate-400">
                      <code className="text-slate-300">{constraint}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-700">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="space-y-6">
              {!showSolution ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LockIcon className="w-8 h-8 text-slate-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Solution Hidden</h4>
                  <p className="text-slate-400 text-sm mb-6">
                    Try solving the problem first before viewing the solution.
                  </p>
                  <Button variant="primary" onClick={() => setShowSolution(true)}>
                    Reveal Solution
                  </Button>
                </div>
              ) : (
                <>
                  {/* Approach */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Approach</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {problem.solution.approach}
                    </p>
                  </div>

                  {/* Complexity */}
                  <div className="flex gap-4">
                    <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">Time Complexity</div>
                      <code className="text-emerald-400 font-semibold">
                        {problem.solution.timeComplexity}
                      </code>
                    </div>
                    <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">Space Complexity</div>
                      <code className="text-amber-400 font-semibold">
                        {problem.solution.spaceComplexity}
                      </code>
                    </div>
                  </div>

                  {/* Solution Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">Solution Code</h4>
                      <div className="flex gap-1">
                        {(Object.keys(languageLabels) as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              language === lang
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            {languageLabels[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                      <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                        <code>{problem.solution.code[language]}</code>
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'hints' && (
            <div className="space-y-4">
              {problem.hints.map((hint, index) => (
                <div key={index} className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                  {hintsRevealed.includes(index) ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <LightbulbIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white">Hint {index + 1}</span>
                      </div>
                      <p className="text-sm text-slate-300">{hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => revealHint(index)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LockIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">Hint {index + 1}</span>
                      </div>
                      <span className="text-xs text-indigo-400">Click to reveal</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="lg:w-1/2 bg-slate-800/30 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
        {/* Language Selector */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex gap-1">
            {(Object.keys(languageLabels) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === lang
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCode(problem.starterCode[language])}
            >
              <ResetIcon className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-slate-900 rounded-xl border border-slate-700 p-4 text-sm text-slate-300 font-mono resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            This is a practice environment. Code execution coming soon!
          </p>
          <div className="flex gap-2">
            <Button variant="secondary">
              <PlayIcon className="w-4 h-4" />
              Run
            </Button>
            <Button variant="primary">
              <CheckIcon className="w-4 h-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
