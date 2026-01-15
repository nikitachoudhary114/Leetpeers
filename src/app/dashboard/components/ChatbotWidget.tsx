'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  streak: number;
}

interface ChatbotWidgetProps {
  userName: string | null;
  leetcodeUsername?: string | null;
}

const QUICK_QUESTIONS = [
  'What should I learn next?',
  'How do I approach Two Sum?',
  'Tips for binary search?',
  'Best way to learn DP?',
];

const BOT_RESPONSES: Record<string, string> = {
  'how do i approach two sum?': `For Two Sum, there are two main approaches:

1. **Brute Force O(n²):** Check every pair of numbers. Simple but slow.

2. **Hash Map O(n):** As you iterate, store each number's complement (target - num) in a map. Check if current number exists in map.

\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
\`\`\`

The hash map approach is preferred for interviews!`,

  'tips for binary search?': `Binary Search tips:

1. **Template:** Always use \`left <= right\` or \`left < right\` consistently
2. **Mid calculation:** Use \`mid = left + (right - left) // 2\` to avoid overflow
3. **Boundary updates:** Be careful with \`left = mid + 1\` vs \`left = mid\`

Common patterns:
- **Find exact value:** Standard binary search
- **Find leftmost/rightmost:** Adjust boundary updates
- **Search in rotated array:** Compare mid with boundaries

Practice problems: Search Insert Position, Find First and Last Position`,

  'best way to learn dp?': `Dynamic Programming learning path:

1. **Start with basics:**
   - Fibonacci (1D DP)
   - Climbing Stairs
   - House Robber

2. **Understand the pattern:**
   - Identify subproblems
   - Define recurrence relation
   - Add memoization/tabulation

3. **Common DP patterns:**
   - 0/1 Knapsack
   - Unbounded Knapsack
   - LCS/LIS
   - Grid traversal
   - Interval DP

4. **Practice strategy:**
   - Solve 3-5 problems per pattern
   - Write the recurrence first
   - Convert to code

Pro tip: Draw the recursion tree to visualize!`,

  'how to prepare for interviews?': `Interview preparation roadmap:

**Phase 1: Foundations (2-4 weeks)**
- Arrays, Strings, Hash Maps
- Two Pointers, Sliding Window
- Basic recursion

**Phase 2: Core Patterns (4-6 weeks)**
- Binary Search variations
- Trees & Graphs (BFS/DFS)
- Dynamic Programming basics
- Backtracking

**Phase 3: Advanced (2-4 weeks)**
- Heap/Priority Queue
- Union Find
- Tries
- Advanced DP

**Daily routine:**
- 2-3 problems/day
- Review solutions after
- Track patterns, not problems

**Mock interviews:**
- Practice explaining your thought process
- Time yourself (45 min per problem)
- Use platforms like Pramp or interviewing.io`,

  default: `I can help you with LeetCode and coding interview preparation! Here are some topics I can assist with:

- Algorithm explanations (Two Sum, Binary Search, DP, etc.)
- Problem-solving strategies
- Interview preparation tips
- Time/space complexity analysis
- Code optimization techniques

Feel free to ask me anything about coding interviews!`,
};

function generatePersonalizedGreeting(userName: string | null, stats: LeetCodeStats | null): string {
  if (!stats) {
    return `Hey${userName ? ` ${userName}` : ''}! I'm your LeetCode assistant. Connect your LeetCode profile to get personalized recommendations! In the meantime, ask me anything about algorithms or interview prep!`;
  }

  const easyPercent = stats.totalEasy > 0 ? (stats.easySolved / stats.totalEasy) * 100 : 0;
  const mediumPercent = stats.totalMedium > 0 ? (stats.mediumSolved / stats.totalMedium) * 100 : 0;
  const hardPercent = stats.totalHard > 0 ? (stats.hardSolved / stats.totalHard) * 100 : 0;

  let recommendation = '';

  if (easyPercent < 50) {
    recommendation = `I noticed you've solved ${stats.easySolved} Easy problems. Building a strong foundation with Easy problems will help you tackle harder ones!`;
  } else if (mediumPercent < 30) {
    recommendation = `Great progress on Easy problems! Time to level up - Medium problems are key for interviews. You've solved ${stats.mediumSolved} so far.`;
  } else if (hardPercent < 10) {
    recommendation = `Impressive work on Medium problems! Ready to challenge yourself with Hard problems? They'll set you apart in interviews.`;
  } else {
    recommendation = `Outstanding progress! You've solved ${stats.totalSolved} problems. Keep the momentum going!`;
  }

  return `Hey${userName ? ` ${userName}` : ''}! 👋 ${recommendation}\n\nAsk me "What should I learn next?" for personalized recommendations!`;
}

function generatePersonalizedRecommendation(stats: LeetCodeStats | null): string {
  if (!stats) {
    return `To give you personalized recommendations, please connect your LeetCode profile first!\n\nIn the meantime, here's a general study path:\n\n**Beginner Path:**\n1. Two Pointers & Arrays\n2. Hash Maps & Sets\n3. Sliding Window\n4. Binary Search basics\n\n**Intermediate Path:**\n1. Trees & BFS/DFS\n2. Backtracking\n3. Dynamic Programming\n4. Graphs`;
  }

  const easyPercent = stats.totalEasy > 0 ? (stats.easySolved / stats.totalEasy) * 100 : 0;
  const mediumPercent = stats.totalMedium > 0 ? (stats.mediumSolved / stats.totalMedium) * 100 : 0;

  let topics: string[] = [];
  let problems: string[] = [];
  let summary = '';

  if (stats.totalSolved < 50) {
    summary = `You're just getting started with ${stats.totalSolved} problems solved. Let's build a strong foundation!`;
    topics = ['Arrays & Strings', 'Hash Maps', 'Two Pointers', 'Basic Math'];
    problems = ['Two Sum (Easy)', 'Valid Parentheses (Easy)', 'Best Time to Buy Stock (Easy)', 'Merge Two Sorted Lists (Easy)'];
  } else if (easyPercent < 50) {
    summary = `Focus on mastering Easy problems to build pattern recognition.`;
    topics = ['Sliding Window', 'Binary Search', 'Stack & Queue', 'Linked Lists'];
    problems = ['Maximum Subarray (Easy)', 'Binary Search (Easy)', 'Valid Anagram (Easy)', 'Reverse Linked List (Easy)'];
  } else if (mediumPercent < 30) {
    summary = `Great foundation! Time to tackle Medium problems - the heart of coding interviews.`;
    topics = ['DFS/BFS on Trees', 'Backtracking', 'Dynamic Programming Intro', 'Graph Basics'];
    problems = ['3Sum (Medium)', 'Coin Change (Medium)', 'Number of Islands (Medium)', 'Validate BST (Medium)'];
  } else if (mediumPercent < 50) {
    summary = `You're making solid progress on Mediums! Let's diversify your problem types.`;
    topics = ['Advanced DP Patterns', 'Heap/Priority Queue', 'Union Find', 'Monotonic Stack'];
    problems = ['LRU Cache (Medium)', 'Task Scheduler (Medium)', 'Course Schedule (Medium)', 'Daily Temperatures (Medium)'];
  } else {
    summary = `Impressive progress! You're ready for advanced patterns and Hard problems.`;
    topics = ['Segment Trees', 'Advanced Graph Algorithms', 'Complex DP', 'System Design'];
    problems = ['Median from Data Stream (Hard)', 'Word Ladder II (Hard)', 'Trapping Rain Water (Hard)', 'Serialize Binary Tree (Hard)'];
  }

  return `**📊 Analysis based on your ${stats.totalSolved} solved problems:**\n\n${summary}\n\n**🎯 Recommended Topics:**\n${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n**📝 Suggested Problems:**\n${problems.map((p) => `• ${p}`).join('\n')}\n\n**⚡ Quick Tips:**\n• Aim for 2-3 problems daily\n• Review solutions even for solved problems\n• Focus on understanding patterns, not memorizing`;
}

export function ChatbotWidget({ userName, leetcodeUsername }: ChatbotWidgetProps) {
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch LeetCode stats
  useEffect(() => {
    async function fetchStats() {
      if (!leetcodeUsername) {
        setStatsLoaded(true);
        return;
      }

      try {
        const response = await fetch(`/api/leetcode/profile?username=${leetcodeUsername}`);
        if (response.ok) {
          const data = await response.json();
          setLeetcodeStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch LeetCode stats:', error);
      } finally {
        setStatsLoaded(true);
      }
    }

    fetchStats();
  }, [leetcodeUsername]);

  // Set initial greeting once stats are loaded
  useEffect(() => {
    if (statsLoaded && messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: generatePersonalizedGreeting(userName, leetcodeStats),
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [statsLoaded, leetcodeStats, userName, messages.length]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (question: string): string => {
    const normalizedQuestion = question.toLowerCase().trim();

    // Check for personalized recommendation requests
    if (
      normalizedQuestion.includes('what should i learn') ||
      normalizedQuestion.includes('what to learn') ||
      normalizedQuestion.includes('recommend') ||
      normalizedQuestion.includes('suggestion') ||
      normalizedQuestion.includes('next topic') ||
      normalizedQuestion.includes('what next') ||
      normalizedQuestion.includes('what problem')
    ) {
      return generatePersonalizedRecommendation(leetcodeStats || null);
    }

    // Check for progress/stats questions
    if (
      normalizedQuestion.includes('my progress') ||
      normalizedQuestion.includes('my stats') ||
      normalizedQuestion.includes('how am i doing')
    ) {
      if (!leetcodeStats) {
        return `Connect your LeetCode profile to see your progress! Go to Profile settings and add your LeetCode username.`;
      }
      const easyPercent = leetcodeStats.totalEasy > 0 ? ((leetcodeStats.easySolved / leetcodeStats.totalEasy) * 100).toFixed(1) : 0;
      const mediumPercent = leetcodeStats.totalMedium > 0 ? ((leetcodeStats.mediumSolved / leetcodeStats.totalMedium) * 100).toFixed(1) : 0;
      const hardPercent = leetcodeStats.totalHard > 0 ? ((leetcodeStats.hardSolved / leetcodeStats.totalHard) * 100).toFixed(1) : 0;

      return `**📈 Your LeetCode Progress:**\n\n• **Total Solved:** ${leetcodeStats.totalSolved} problems\n• **Easy:** ${leetcodeStats.easySolved}/${leetcodeStats.totalEasy} (${easyPercent}%)\n• **Medium:** ${leetcodeStats.mediumSolved}/${leetcodeStats.totalMedium} (${mediumPercent}%)\n• **Hard:** ${leetcodeStats.hardSolved}/${leetcodeStats.totalHard} (${hardPercent}%)\n• **Acceptance Rate:** ${leetcodeStats.acceptanceRate.toFixed(1)}%\n• **Global Ranking:** #${leetcodeStats.ranking.toLocaleString()}\n\nKeep up the great work! 💪`;
    }

    for (const key of Object.keys(BOT_RESPONSES)) {
      if (key !== 'default' && normalizedQuestion.includes(key)) {
        return BOT_RESPONSES[key];
      }
    }

    // Check for keywords
    if (normalizedQuestion.includes('two sum') || normalizedQuestion.includes('2sum')) {
      return BOT_RESPONSES['how do i approach two sum?'];
    }
    if (normalizedQuestion.includes('binary search')) {
      return BOT_RESPONSES['tips for binary search?'];
    }
    if (normalizedQuestion.includes('dynamic programming') || normalizedQuestion.includes(' dp ') || normalizedQuestion.endsWith(' dp')) {
      return BOT_RESPONSES['best way to learn dp?'];
    }
    if (normalizedQuestion.includes('interview') || normalizedQuestion.includes('prepare')) {
      return BOT_RESPONSES['how to prepare for interviews?'];
    }

    return BOT_RESPONSES['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse = getBotResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">AI Assistant</h2>

      {/* Chat Container */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.sender === 'bot' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-4 h-4 text-white" />
                </div>
              ) : (
                <Avatar name={userName} size="sm" />
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-2 border-t border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-700 border-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <SendIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BotIcon({ className }: { className?: string }) {
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

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}
