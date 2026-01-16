'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';

interface Strategy {
  id: string;
  name: string;
  category: 'array' | 'string' | 'tree' | 'graph' | 'dp' | 'other';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  whenToUse: string[];
  steps: string[];
  codeTemplate: string;
  commonProblems: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

const strategies: Strategy[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'array',
    difficulty: 'Beginner',
    description: 'Use two pointers to traverse an array from different positions, often from both ends or at different speeds.',
    whenToUse: [
      'Searching pairs in a sorted array',
      'Removing duplicates in place',
      'Reversing arrays/strings',
      'Finding subarrays with specific sum',
    ],
    steps: [
      'Initialize two pointers (start/end or slow/fast)',
      'Define the condition to move each pointer',
      'Process elements at pointer positions',
      'Continue until pointers meet or cross',
    ],
    codeTemplate: `def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Process arr[left] and arr[right]
        if condition_to_move_left:
            left += 1
        elif condition_to_move_right:
            right -= 1
        else:
            # Found result
            break
    return result`,
    commonProblems: ['Two Sum II', '3Sum', 'Container With Most Water', 'Trapping Rain Water'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'array',
    difficulty: 'Beginner',
    description: 'Maintain a window of elements and slide it across the array to find optimal subarrays/substrings.',
    whenToUse: [
      'Finding max/min subarray of size k',
      'Longest substring with constraints',
      'Smallest subarray with sum >= target',
      'String permutation/anagram problems',
    ],
    steps: [
      'Initialize window boundaries (start, end)',
      'Expand window by moving end pointer',
      'When constraint violated, shrink from start',
      'Track the optimal result during traversal',
    ],
    codeTemplate: `def sliding_window(arr, k):
    window_start = 0
    result = 0
    window_state = {}  # or other state tracking

    for window_end in range(len(arr)):
        # Add arr[window_end] to window

        # Shrink window if constraint violated
        while window_invalid:
            # Remove arr[window_start] from window
            window_start += 1

        # Update result
        result = max(result, window_end - window_start + 1)

    return result`,
    commonProblems: ['Maximum Subarray', 'Minimum Window Substring', 'Longest Substring Without Repeating Characters', 'Fruit Into Baskets'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) where k is window size or charset',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'array',
    difficulty: 'Intermediate',
    description: 'Divide search space in half repeatedly to find target efficiently in sorted data.',
    whenToUse: [
      'Searching in sorted array',
      'Finding insertion position',
      'Search in rotated sorted array',
      'Finding first/last occurrence',
      'Searching in 2D sorted matrix',
    ],
    steps: [
      'Define search space (left, right boundaries)',
      'Calculate mid point carefully to avoid overflow',
      'Compare mid element with target',
      'Shrink search space by half based on comparison',
      'Handle edge cases (not found, duplicates)',
    ],
    codeTemplate: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # Not found`,
    commonProblems: ['Binary Search', 'Search Insert Position', 'Find First and Last Position', 'Search in Rotated Sorted Array'],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) iterative, O(log n) recursive',
  },
  {
    id: 'dfs-trees',
    name: 'DFS for Trees',
    category: 'tree',
    difficulty: 'Intermediate',
    description: 'Traverse tree depth-first using recursion or stack, processing nodes in preorder, inorder, or postorder.',
    whenToUse: [
      'Tree traversal (preorder/inorder/postorder)',
      'Finding paths in tree',
      'Validating tree properties',
      'Tree construction/modification',
    ],
    steps: [
      'Handle base case (null node)',
      'Process current node (timing depends on order)',
      'Recursively process left subtree',
      'Recursively process right subtree',
      'Combine results from subtrees',
    ],
    codeTemplate: `def dfs(node):
    if not node:
        return base_value

    # Preorder: process here

    left_result = dfs(node.left)

    # Inorder: process here

    right_result = dfs(node.right)

    # Postorder: process here

    return combine(left_result, right_result)`,
    commonProblems: ['Maximum Depth of Binary Tree', 'Path Sum', 'Validate Binary Search Tree', 'Lowest Common Ancestor'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) where h is tree height',
  },
  {
    id: 'bfs',
    name: 'BFS (Level Order)',
    category: 'graph',
    difficulty: 'Intermediate',
    description: 'Traverse level by level using a queue, useful for shortest path and level-based problems.',
    whenToUse: [
      'Level order traversal',
      'Shortest path in unweighted graph',
      'Finding connected components',
      'Multi-source BFS problems',
    ],
    steps: [
      'Initialize queue with starting node(s)',
      'Track visited nodes to avoid cycles',
      'Process nodes level by level',
      'Add unvisited neighbors to queue',
      'Continue until queue empty or target found',
    ],
    codeTemplate: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    level = 0

    while queue:
        level_size = len(queue)
        for _ in range(level_size):
            node = queue.popleft()
            # Process node

            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        level += 1

    return result`,
    commonProblems: ['Binary Tree Level Order Traversal', 'Number of Islands', 'Word Ladder', 'Rotting Oranges'],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'other',
    difficulty: 'Intermediate',
    description: 'Build solutions incrementally, abandoning paths that violate constraints, to find all valid solutions.',
    whenToUse: [
      'Generating all permutations/combinations',
      'Solving puzzles (Sudoku, N-Queens)',
      'Finding all paths in graph',
      'Subset/partition problems',
    ],
    steps: [
      'Define the solution space and constraints',
      'Build solution incrementally with choices',
      'Check if current state violates constraints',
      'If invalid, backtrack (undo last choice)',
      'If complete valid solution, record it',
    ],
    codeTemplate: `def backtrack(state, choices, result):
    if is_complete(state):
        result.append(state.copy())
        return

    for choice in choices:
        if is_valid(state, choice):
            state.add(choice)      # Make choice
            backtrack(state, get_next_choices(choice), result)
            state.remove(choice)   # Undo choice

    return result`,
    commonProblems: ['Permutations', 'Subsets', 'N-Queens', 'Combination Sum', 'Word Search'],
    timeComplexity: 'O(n!) or O(2^n) depending on problem',
    spaceComplexity: 'O(n) for recursion depth',
  },
  {
    id: 'dp-1d',
    name: 'Dynamic Programming (1D)',
    category: 'dp',
    difficulty: 'Intermediate',
    description: 'Break problem into overlapping subproblems, store solutions to avoid recomputation.',
    whenToUse: [
      'Counting ways to reach a goal',
      'Optimization problems (min/max)',
      'Problems with optimal substructure',
      'Fibonacci-like patterns',
    ],
    steps: [
      'Define state: what info describes a subproblem',
      'Define recurrence: how states relate',
      'Identify base cases',
      'Determine computation order',
      'Implement with memoization or tabulation',
    ],
    codeTemplate: `def dp_solution(n):
    # Tabulation approach
    dp = [0] * (n + 1)

    # Base cases
    dp[0] = base_value_0
    dp[1] = base_value_1

    # Fill DP table
    for i in range(2, n + 1):
        dp[i] = recurrence(dp[i-1], dp[i-2], ...)

    return dp[n]`,
    commonProblems: ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence'],
    timeComplexity: 'O(n) or O(n*k)',
    spaceComplexity: 'O(n) or O(1) with optimization',
  },
  {
    id: 'dp-2d',
    name: 'Dynamic Programming (2D)',
    category: 'dp',
    difficulty: 'Advanced',
    description: 'Use 2D state space for problems involving two sequences or grid-based subproblems.',
    whenToUse: [
      'String matching/editing problems',
      'Grid traversal with constraints',
      'Two-sequence alignment',
      'Knapsack-type problems',
    ],
    steps: [
      'Define 2D state: dp[i][j] meaning',
      'Define recurrence using neighbors',
      'Initialize borders/base cases',
      'Fill table in correct order',
      'Trace back if path reconstruction needed',
    ],
    codeTemplate: `def dp_2d(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases (first row and column)
    for i in range(m + 1):
        dp[i][0] = base_value
    for j in range(n + 1):
        dp[0][j] = base_value

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if condition(s1[i-1], s2[j-1]):
                dp[i][j] = dp[i-1][j-1] + something
            else:
                dp[i][j] = best(dp[i-1][j], dp[i][j-1])

    return dp[m][n]`,
    commonProblems: ['Longest Common Subsequence', 'Edit Distance', 'Unique Paths', '0/1 Knapsack'],
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n) or O(n) with optimization',
  },
];

const categoryColors: Record<string, string> = {
  array: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  string: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tree: 'bg-green-500/20 text-green-400 border-green-500/30',
  graph: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  dp: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  other: 'bg-[var(--color-bg-tertiary)]/20 text-[var(--color-text-muted)] border-[var(--color-border)]/30',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced: 'text-red-400',
};

export function SolutionsSection() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredStrategies = categoryFilter === 'all'
    ? strategies
    : strategies.filter(s => s.category === categoryFilter);

  if (selectedStrategy) {
    return (
      <StrategyDetail
        strategy={selectedStrategy}
        onBack={() => setSelectedStrategy(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Solution Strategies</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Learn common patterns and approaches to solve LeetCode problems
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'array', 'tree', 'graph', 'dp', 'other'].map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              categoryFilter === category
                ? 'bg-indigo-500 text-[var(--color-text-primary)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
            }`}
          >
            {category === 'dp' ? 'Dynamic Programming' : category}
          </button>
        ))}
      </div>

      {/* Strategies Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredStrategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy)}
            className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] p-5 text-left hover:border-indigo-500/50 hover:bg-[var(--color-bg-tertiary)]/70 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors">
                  {strategy.name}
                </h3>
                <span className={`text-xs ${difficultyColors[strategy.difficulty]}`}>
                  {strategy.difficulty}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs border ${categoryColors[strategy.category]}`}>
                {strategy.category}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
              {strategy.description}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-[var(--color-text-muted)]">
                Time: <span className="text-emerald-400">{strategy.timeComplexity}</span>
              </span>
              <span className="text-[var(--color-text-muted)]">
                Space: <span className="text-amber-400">{strategy.spaceComplexity}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface StrategyDetailProps {
  strategy: Strategy;
  onBack: () => void;
}

function StrategyDetail({ strategy, onBack }: StrategyDetailProps) {
  const [showCode, setShowCode] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
        >
          <BackIcon className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{strategy.name}</h2>
            <span className={`px-2 py-1 rounded-lg text-xs border ${categoryColors[strategy.category]}`}>
              {strategy.category}
            </span>
            <span className={`text-sm ${difficultyColors[strategy.difficulty]}`}>
              {strategy.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-indigo-400" />
              Overview
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {strategy.description}
            </p>
          </div>

          {/* When to Use */}
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <TargetIcon className="w-4 h-4 text-emerald-400" />
              When to Use
            </h3>
            <ul className="space-y-2">
              {strategy.whenToUse.map((use, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="text-emerald-400 mt-1">•</span>
                  {use}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <StepsIcon className="w-4 h-4 text-amber-400" />
              Step-by-Step Approach
            </h3>
            <ol className="space-y-3">
              {strategy.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[var(--color-text-secondary)] pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Code Template */}
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <CodeIcon className="w-4 h-4 text-purple-400" />
                Code Template
              </h3>
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {showCode ? 'Hide' : 'Show'}
              </button>
            </div>
            {showCode && (
              <div className="p-4 bg-[var(--color-bg-primary)]/50">
                <pre className="text-sm text-[var(--color-text-secondary)] overflow-x-auto">
                  <code>{strategy.codeTemplate}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg-tertiary)]/50 rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Time Complexity</div>
              <code className="text-lg text-emerald-400 font-semibold">
                {strategy.timeComplexity}
              </code>
            </div>
            <div className="bg-[var(--color-bg-tertiary)]/50 rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Space Complexity</div>
              <code className="text-lg text-amber-400 font-semibold">
                {strategy.spaceComplexity}
              </code>
            </div>
          </div>

          {/* Common Problems */}
          <div className="bg-[var(--color-bg-tertiary)]/50 rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <ProblemsIcon className="w-4 h-4 text-cyan-400" />
              Practice These Problems
            </h3>
            <div className="flex flex-wrap gap-2">
              {strategy.commonProblems.map((problem) => (
                <Badge key={problem} variant="default">
                  {problem}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <LightbulbIcon className="w-4 h-4 text-yellow-400" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">★</span>
                Start by identifying the pattern before coding
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">★</span>
                Draw examples on paper first
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">★</span>
                Practice until the pattern becomes second nature
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function StepsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function ProblemsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
