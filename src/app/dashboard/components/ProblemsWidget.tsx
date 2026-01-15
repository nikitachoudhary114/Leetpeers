'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';

// Problem types and data (shared with room problems)
interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Solution {
  approach: string;
  code: Record<string, string>;
  timeComplexity: string;
  spaceComplexity: string;
}

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Example[];
  constraints: string[];
  tags: string[];
  hints: string[];
  solution: Solution;
  starterCode: Record<string, string>;
}

// Extended problem set for dashboard practice
const problems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    tags: ['Array', 'Hash Table'],
    hints: ['Try using a hash map to store values you\'ve seen'],
    solution: {
      approach: 'Use a hash map to store each number and its index. For each number, check if its complement exists in the map.',
      code: { python: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i' },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: { python: 'def twoSum(nums, target):\n    # Your code here\n    pass' },
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    tags: ['String', 'Stack'],
    hints: ['Use a stack to keep track of opening brackets'],
    solution: {
      approach: 'Use a stack. Push opening brackets, pop and match for closing brackets.',
      code: { python: 'def isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0' },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: { python: 'def isValid(s):\n    # Your code here\n    pass' },
  },
  {
    id: 3,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction possible.' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    tags: ['Array', 'Dynamic Programming'],
    hints: ['Track the minimum price seen so far'],
    solution: {
      approach: 'Keep track of minimum price and maximum profit while iterating.',
      code: { python: 'def maxProfit(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n    return max_profit' },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: { python: 'def maxProfit(prices):\n    # Your code here\n    pass' },
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    hints: ['Use Kadane\'s algorithm'],
    solution: {
      approach: 'Kadane\'s Algorithm: Track current sum and max sum. Reset current sum when it goes negative.',
      code: { python: 'def maxSubArray(nums):\n    max_sum = curr_sum = nums[0]\n    for num in nums[1:]:\n        curr_sum = max(num, curr_sum + num)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum' },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: { python: 'def maxSubArray(nums):\n    # Your code here\n    pass' },
  },
  {
    id: 5,
    title: '3Sum',
    difficulty: 'Medium',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    tags: ['Array', 'Two Pointers', 'Sorting'],
    hints: ['Sort the array first, then use two pointers'],
    solution: {
      approach: 'Sort array, fix one element, use two pointers to find pairs that sum to its negative.',
      code: { python: 'def threeSum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total < 0:\n                left += 1\n            elif total > 0:\n                right -= 1\n            else:\n                result.append([nums[i], nums[left], nums[right]])\n                while left < right and nums[left] == nums[left+1]:\n                    left += 1\n                while left < right and nums[right] == nums[right-1]:\n                    right -= 1\n                left += 1\n                right -= 1\n    return result' },
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    starterCode: { python: 'def threeSum(nums):\n    # Your code here\n    pass' },
  },
  {
    id: 6,
    title: 'Coin Change',
    difficulty: 'Medium',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    tags: ['Array', 'Dynamic Programming', 'BFS'],
    hints: ['Use dynamic programming with dp[i] = min coins to make amount i'],
    solution: {
      approach: 'DP: dp[i] represents minimum coins for amount i. For each amount, try all coins.',
      code: { python: 'def coinChange(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1' },
      timeComplexity: 'O(amount * coins)',
      spaceComplexity: 'O(amount)',
    },
    starterCode: { python: 'def coinChange(coins, amount):\n    # Your code here\n    pass' },
  },
  {
    id: 7,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
    tags: ['Linked List', 'Heap', 'Divide and Conquer'],
    hints: ['Use a min-heap to efficiently get the smallest element'],
    solution: {
      approach: 'Use a min-heap to always extract the smallest node from all lists.',
      code: { python: 'import heapq\n\ndef mergeKLists(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst.val, i, lst))\n    dummy = ListNode(0)\n    curr = dummy\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next' },
      timeComplexity: 'O(N log k)',
      spaceComplexity: 'O(k)',
    },
    starterCode: { python: 'def mergeKLists(lists):\n    # Your code here\n    pass' },
  },
  {
    id: 8,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    hints: ['Water at each position = min(maxLeft, maxRight) - height'],
    solution: {
      approach: 'Two pointers: Track max heights from left and right, process smaller side.',
      code: { python: 'def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water += right_max - height[right]\n            right -= 1\n    return water' },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: { python: 'def trap(height):\n    # Your code here\n    pass' },
  },
];

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';
type ViewMode = 'list' | 'problem';

interface ProblemsWidgetProps {
  userStreak: number;
}

export function ProblemsWidget({ userStreak }: ProblemsWidgetProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());

  const filteredProblems = difficulty === 'All'
    ? problems
    : problems.filter((p) => p.difficulty === difficulty);

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const handleSolveProblem = (problemId: number) => {
    setSolvedProblems((prev) => new Set([...prev, problemId]));
  };

  if (viewMode === 'problem' && selectedProblem) {
    return (
      <ProblemDetailView
        problem={selectedProblem}
        isSolved={solvedProblems.has(selectedProblem.id)}
        onBack={() => {
          setViewMode('list');
          setSelectedProblem(null);
        }}
        onMarkSolved={() => handleSolveProblem(selectedProblem.id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Practice Problems</h2>
          <p className="text-sm text-slate-400 mt-1">
            Solve problems at your own pace
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <FireIcon className="w-5 h-5 text-orange-400" />
          <span className="text-lg font-bold text-orange-400">{userStreak}</span>
          <span className="text-sm text-slate-400">day streak</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{solvedProblems.size}</div>
          <div className="text-xs text-slate-400 mt-1">Solved Today</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {problems.filter((p) => p.difficulty === 'Easy').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Easy</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {problems.filter((p) => p.difficulty === 'Medium').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Medium</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {problems.filter((p) => p.difficulty === 'Hard').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Hard</div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        {(['All', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              difficulty === d
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => {
          const isSolved = solvedProblems.has(problem.id);
          return (
            <button
              key={problem.id}
              onClick={() => {
                setSelectedProblem(problem);
                setViewMode('problem');
              }}
              className="w-full bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-left hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSolved ? 'bg-emerald-500/20' : 'bg-slate-700'
                  }`}>
                    {isSolved ? (
                      <CheckIcon className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-sm text-slate-400">#{problem.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                    difficultyColors[problem.difficulty]
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Problem Detail View Component
interface ProblemDetailViewProps {
  problem: Problem;
  isSolved: boolean;
  onBack: () => void;
  onMarkSolved: () => void;
}

function ProblemDetailView({ problem, isSolved, onBack, onMarkSolved }: ProblemDetailViewProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <BackIcon className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">#{problem.id}</span>
            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
            <span
              className={`px-2.5 py-1 rounded-lg text-sm font-medium border ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
            {isSolved && (
              <Badge variant="success" size="sm">Solved</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        {problem.tags.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>

      {/* Description */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Description</h3>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
          {problem.description}
        </pre>
      </div>

      {/* Examples */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Examples</h3>
        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-slate-900/50 rounded-xl p-4">
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
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Constraints</h3>
        <ul className="list-disc list-inside space-y-1">
          {problem.constraints.map((constraint, index) => (
            <li key={index} className="text-sm text-slate-400">
              <code className="text-slate-300">{constraint}</code>
            </li>
          ))}
        </ul>
      </div>

      {/* Hints */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <LightbulbIcon className="w-4 h-4 text-amber-400" />
            Hints
          </h3>
          <ChevronIcon className={`w-5 h-5 text-slate-400 transition-transform ${showHints ? 'rotate-180' : ''}`} />
        </button>
        {showHints && (
          <ul className="mt-4 space-y-2">
            {problem.hints.map((hint, index) => (
              <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400">•</span>
                {hint}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Solution */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CodeIcon className="w-4 h-4 text-indigo-400" />
            Solution
          </h3>
          <ChevronIcon className={`w-5 h-5 text-slate-400 transition-transform ${showSolution ? 'rotate-180' : ''}`} />
        </button>
        {showSolution && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-xs text-slate-500 mb-2">Approach</h4>
              <p className="text-sm text-slate-300">{problem.solution.approach}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Time Complexity</div>
                <code className="text-emerald-400">{problem.solution.timeComplexity}</code>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Space Complexity</div>
                <code className="text-amber-400">{problem.solution.spaceComplexity}</code>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4">
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{problem.solution.code.python}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!isSolved && (
          <button
            onClick={onMarkSolved}
            className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            Mark as Solved
          </button>
        )}
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
        >
          Back to Problems
        </button>
      </div>
    </div>
  );
}

// Icons
function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
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

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
