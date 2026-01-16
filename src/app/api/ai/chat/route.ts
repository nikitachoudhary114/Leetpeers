import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const SYSTEM_PROMPT = `You are LeetBot, an expert coding interview tutor and LeetCode assistant. Your role is to:

1. Help users understand algorithms and data structures
2. Explain problem-solving approaches for coding challenges
3. Provide tips for technical interviews
4. Analyze code and suggest improvements
5. Give personalized study recommendations based on user progress

Guidelines:
- Be encouraging and supportive
- Explain concepts clearly with examples when helpful
- Use markdown formatting for code blocks
- When explaining solutions, break them into steps
- Focus on teaching patterns rather than memorization
- Keep responses concise but comprehensive

You have access to the user's LeetCode statistics if they've connected their profile. Use this information to provide personalized recommendations.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } }
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50)
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message
      }
    });

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to mock responses when API key is not configured
      const fallbackResponse = generateFallbackResponse(message);

      await prisma.aIMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: fallbackResponse
        }
      });

      return NextResponse.json({
        response: fallbackResponse,
        conversationId: conversation.id
      });
    }

    // Build message history for context
    const messageHistory = conversation.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));
    messageHistory.push({ role: 'user', content: message });

    // Get user's LeetCode stats for context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { leetcodeProfile: true, streakCount: true, problemsSolved: true }
    });

    let systemPrompt = SYSTEM_PROMPT;
    if (user?.leetcodeProfile) {
      systemPrompt += `\n\nUser's LeetCode profile: ${user.leetcodeProfile}
Problems solved: ${user.problemsSolved || 0}
Current streak: ${user.streakCount || 0} days`;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messageHistory
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

    // Save assistant response
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantResponse
      }
    });

    // Update conversation title if it's the first message
    if (conversation.messages.length === 0) {
      await prisma.aIConversation.update({
        where: { id: conversation.id },
        data: { title: message.slice(0, 50) }
      });
    }

    return NextResponse.json({
      response: assistantResponse,
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// Fallback responses when OpenAI API key is not configured
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('two sum') || lowerMessage.includes('2sum')) {
    return `For Two Sum, there are two main approaches:

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

The hash map approach is preferred for interviews!`;
  }

  if (lowerMessage.includes('binary search')) {
    return `Binary Search tips:

1. **Template:** Always use \`left <= right\` or \`left < right\` consistently
2. **Mid calculation:** Use \`mid = left + (right - left) // 2\` to avoid overflow
3. **Boundary updates:** Be careful with \`left = mid + 1\` vs \`left = mid\`

Common patterns:
- **Find exact value:** Standard binary search
- **Find leftmost/rightmost:** Adjust boundary updates
- **Search in rotated array:** Compare mid with boundaries

Practice problems: Search Insert Position, Find First and Last Position`;
  }

  if (lowerMessage.includes('dp') || lowerMessage.includes('dynamic programming')) {
    return `Dynamic Programming learning path:

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

Pro tip: Draw the recursion tree to visualize!`;
  }

  if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
    return `Interview preparation roadmap:

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
- Track patterns, not problems`;
  }

  if (lowerMessage.includes('recommend') || lowerMessage.includes('what should i') || lowerMessage.includes('next')) {
    return `Here's a recommended study path based on common interview patterns:

**Beginner Path:**
1. Two Pointers & Arrays
2. Hash Maps & Sets
3. Sliding Window
4. Binary Search basics

**Intermediate Path:**
1. Trees & BFS/DFS
2. Backtracking
3. Dynamic Programming
4. Graphs

**Suggested Problems to Start:**
- Two Sum (Easy)
- Valid Parentheses (Easy)
- Maximum Subarray (Medium)
- Coin Change (Medium)

Focus on understanding the patterns, not memorizing solutions!`;
  }

  return `I can help you with LeetCode and coding interview preparation! Here are some topics I can assist with:

- Algorithm explanations (Two Sum, Binary Search, DP, etc.)
- Problem-solving strategies
- Interview preparation tips
- Time/space complexity analysis
- Code optimization techniques

Feel free to ask me specific questions about algorithms, data structures, or interview preparation!

*Note: For full AI capabilities, please configure the OpenAI API key.*`;
}
