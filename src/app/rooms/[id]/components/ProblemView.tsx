'use client';

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import type { Problem } from './problemsData';

interface ProblemViewProps {
  problem: Problem;
  roomId?: string;
  onBack: () => void;
}

type Language = 'python' | 'javascript' | 'java' | 'cpp';
type Tab = 'description' | 'solution' | 'hints' | 'results';

interface TestResult {
  input: string;
  expected: string;
  actual: string | null;
  passed: boolean;
  time: number | null;
  memory: number | null;
  status: string;
}

interface ExecutionResult {
  results: TestResult[];
  summary: {
    passed: number;
    total: number;
    allPassed: boolean;
    status?: string;
  };
  isDemo?: boolean;
}

const languageLabels: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++',
};

export function ProblemView({ problem, roomId, onBack }: ProblemViewProps) {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(problem.starterCode[language]);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [showSolution, setShowSolution] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
    setShowSolution(false);
    setExecutionResult(null);
    setError(null);
  };

  const revealHint = (index: number) => {
    if (!hintsRevealed.includes(index)) {
      setHintsRevealed([...hintsRevealed, index]);
    }
  };

  // Run code against visible test cases
  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setExecutionResult(null);

    try {
      const testCases = problem.examples.map(e => ({
        input: e.input,
        expected: e.output,
      }));

      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExecutionResult(data);
        setActiveTab('results');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to run code');
      }
    } catch (err) {
      console.error('Run error:', err);
      setError('Failed to connect to server');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code for full evaluation
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setExecutionResult(null);

    try {
      // Include both visible and hidden test cases
      const testCases = [
        ...problem.examples.map(e => ({
          input: e.input,
          expected: e.output,
          isHidden: false,
        })),
        // Add some hidden test cases (simulated)
        ...generateHiddenTestCases(problem),
      ];

      const response = await fetch('/api/code/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemSlug: problem.title.toLowerCase().replace(/\s+/g, '-'),
          problemId: problem.id,
          roomId,
          testCases,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExecutionResult(data);
        setActiveTab('results');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit code');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
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
      <div className="lg:w-1/2 bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors"
            >
              <BackIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-muted)]">#{problem.id}</span>
                <h2 className="font-semibold text-[var(--color-text-primary)] truncate">{problem.title}</h2>
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
            {(['description', 'solution', 'hints', 'results'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                } ${tab === 'results' && executionResult ? 'text-indigo-400' : ''}`}
              >
                {tab}
                {tab === 'results' && executionResult && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                    executionResult.summary.allPassed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {executionResult.summary.passed}/{executionResult.summary.total}
                  </span>
                )}
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
                <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-sans leading-relaxed">
                  {problem.description}
                </pre>
              </div>

              {/* Examples */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Examples</h4>
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[var(--color-bg-primary)] rounded-xl p-4 border border-[var(--color-border)]"
                    >
                      <div className="text-xs text-[var(--color-text-muted)] mb-2">Example {index + 1}</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-[var(--color-text-muted)]">Input: </span>
                          <code className="text-emerald-400">{example.input}</code>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Output: </span>
                          <code className="text-amber-400">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="text-[var(--color-text-muted)] text-xs mt-2">
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
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Constraints</h4>
                <ul className="list-disc list-inside space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm text-[var(--color-text-muted)]">
                      <code className="text-[var(--color-text-secondary)]">{constraint}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-[var(--color-border)]">
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
                  <div className="w-16 h-16 bg-[var(--color-bg-hover)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LockIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Solution Hidden</h4>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6">
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
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Approach</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {problem.solution.approach}
                    </p>
                  </div>

                  {/* Complexity */}
                  <div className="flex gap-4">
                    <div className="flex-1 bg-[var(--color-bg-primary)] rounded-xl p-4 border border-[var(--color-border)]">
                      <div className="text-xs text-[var(--color-text-muted)] mb-1">Time Complexity</div>
                      <code className="text-emerald-400 font-semibold">
                        {problem.solution.timeComplexity}
                      </code>
                    </div>
                    <div className="flex-1 bg-[var(--color-bg-primary)] rounded-xl p-4 border border-[var(--color-border)]">
                      <div className="text-xs text-[var(--color-text-muted)] mb-1">Space Complexity</div>
                      <code className="text-amber-400 font-semibold">
                        {problem.solution.spaceComplexity}
                      </code>
                    </div>
                  </div>

                  {/* Solution Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Solution Code</h4>
                      <div className="flex gap-1">
                        {(Object.keys(languageLabels) as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              language === lang
                                ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                                : 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {languageLabels[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                      <pre className="p-4 text-sm text-[var(--color-text-secondary)] overflow-x-auto">
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
                <div key={index} className="bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                  {hintsRevealed.includes(index) ? (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <LightbulbIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Hint {index + 1}</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)]">{hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => revealHint(index)}
                      className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LockIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                        <span className="text-sm text-[var(--color-text-muted)]">Hint {index + 1}</span>
                      </div>
                      <span className="text-xs text-indigo-400">Click to reveal</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              {!executionResult ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[var(--color-bg-hover)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PlayIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">No Results Yet</h4>
                  <p className="text-[var(--color-text-muted)] text-sm">
                    Run your code to see results here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className={`p-4 rounded-xl border ${
                    executionResult.summary.allPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      {executionResult.summary.allPassed ? (
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <XCircleIcon className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <h4 className={`font-semibold ${
                          executionResult.summary.allPassed ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {executionResult.summary.allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                        </h4>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {executionResult.summary.passed} / {executionResult.summary.total} test cases passed
                        </p>
                      </div>
                    </div>
                    {executionResult.isDemo && (
                      <p className="text-xs text-amber-400 mt-2">
                        Demo mode: Configure JUDGE0_API_KEY for real code execution
                      </p>
                    )}
                  </div>

                  {/* Individual Results */}
                  <div className="space-y-3">
                    {executionResult.results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          result.passed
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-red-500/5 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            Test Case {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            result.passed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-[var(--color-text-muted)]">Input: </span>
                            <code className="text-[var(--color-text-secondary)]">{result.input}</code>
                          </div>
                          <div>
                            <span className="text-[var(--color-text-muted)]">Expected: </span>
                            <code className="text-emerald-400">{result.expected}</code>
                          </div>
                          {result.actual !== null && (
                            <div>
                              <span className="text-[var(--color-text-muted)]">Output: </span>
                              <code className={result.passed ? 'text-emerald-400' : 'text-red-400'}>
                                {result.actual}
                              </code>
                            </div>
                          )}
                          {result.time && result.memory && (
                            <div className="flex gap-4 text-xs text-[var(--color-text-muted)] mt-1">
                              <span>Runtime: {result.time.toFixed(0)}ms</span>
                              <span>Memory: {(result.memory / 1000).toFixed(1)}MB</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="lg:w-1/2 bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        {/* Language Selector */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex gap-1">
            {(Object.keys(languageLabels) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === lang
                    ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
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
              onClick={() => {
                setCode(problem.starterCode[language]);
                setExecutionResult(null);
                setError(null);
              }}
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
            className="w-full h-full bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)] font-mono resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            {isRunning ? 'Running...' : isSubmitting ? 'Submitting...' : 'Ready to run'}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
            >
              {isRunning ? (
                <LoadingIcon className="w-4 h-4 animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
              Run
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
            >
              {isSubmitting ? (
                <LoadingIcon className="w-4 h-4 animate-spin" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate hidden test cases for submission
function generateHiddenTestCases(problem: Problem): Array<{ input: string; expected: string; isHidden: boolean }> {
  // In a real implementation, these would come from the database
  // For now, we generate based on problem ID
  const hiddenCases = [];

  // Add some edge cases based on problem type
  if (problem.id === 1) { // Two Sum
    hiddenCases.push(
      { input: 'nums = [1,2,3,4,5], target = 9', expected: '[3,4]', isHidden: true },
      { input: 'nums = [0,4,3,0], target = 0', expected: '[0,3]', isHidden: true },
    );
  } else if (problem.id === 2) { // Valid Parentheses
    hiddenCases.push(
      { input: 's = "((())"', expected: 'true', isHidden: true },
      { input: 's = "([)]"', expected: 'false', isHidden: true },
    );
  }

  return hiddenCases;
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
