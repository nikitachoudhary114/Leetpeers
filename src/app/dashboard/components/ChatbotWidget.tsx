'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar } from '@/components/ui';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  _count: { messages: number };
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

export function ChatbotWidget({ userName }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation history
  const fetchConversations = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/ai/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Load a specific conversation
  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/ai/conversations/${convId}`);
      if (response.ok) {
        const data = await response.json();
        const loadedMessages: Message[] = data.conversation.messages.map((m: { id: string; role: string; content: string; createdAt: string }) => ({
          id: m.id,
          content: m.content,
          sender: m.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(m.createdAt)
        }));
        setMessages(loadedMessages);
        setConversationId(convId);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // Delete a conversation
  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/ai/conversations/${convId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== convId));
        if (conversationId === convId) {
          startNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setMessages([{
      id: '1',
      content: getGreeting(),
      sender: 'bot',
      timestamp: new Date(),
    }]);
    setConversationId(null);
    setShowHistory(false);
  };

  // Get greeting message
  const getGreeting = () => {
    return `Hey${userName ? ` ${userName}` : ''}! I'm your LeetCode assistant. I can help you with:

- Algorithm explanations
- Problem-solving strategies
- Interview preparation tips
- Personalized recommendations

What would you like to learn today?`;
  };

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      startNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationId
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Update conversation ID if this is a new conversation
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Handle error
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I could not connect to the server. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">AI Assistant</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              if (!showHistory) fetchConversations();
            }}
            className="px-3 py-1.5 text-sm bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-tertiary)] rounded-lg text-[var(--color-text-secondary)] transition-colors flex items-center gap-2"
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </button>
          <button
            onClick={startNewChat}
            className="px-3 py-1.5 text-sm bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-400 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      {/* Conversation History Panel */}
      {showHistory && (
        <div className="bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-4 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Chat History</h3>
          {loadingHistory ? (
            <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-[var(--color-text-muted)] text-sm">No previous conversations</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    conversationId === conv.id
                      ? 'bg-indigo-500/20 border border-indigo-500/30'
                      : 'bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-elevated)]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)] truncate">{conv.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {conv._count.messages} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="p-1 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)] flex flex-col h-[500px]">
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
                    : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-[var(--color-text-muted)]'
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
              <div className="bg-[var(--color-bg-hover)] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 py-2 border-t border-[var(--color-border)]">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-elevated)] rounded-full text-xs text-[var(--color-text-secondary)] whitespace-nowrap transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-[var(--color-bg-hover)] border-none rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

      <p className="text-xs text-[var(--color-text-muted)] text-center">
        Conversations are saved automatically. Your chat history is private and secure.
      </p>
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

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
