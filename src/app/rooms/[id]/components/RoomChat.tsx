'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar } from '@/components/ui';

interface Player {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: Player;
  createdAt: string;
}

interface RoomChatProps {
  roomId: string;
  currentUser: Player;
  players: Player[];
}

const POLL_INTERVAL = 3000; // Poll every 3 seconds

export function RoomChat({ roomId, currentUser, players }: RoomChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages
  const fetchMessages = useCallback(async (isInitial = false) => {
    try {
      const url = new URL(`/api/rooms/${roomId}/messages`, window.location.origin);
      if (!isInitial && lastMessageIdRef.current) {
        url.searchParams.set('after', lastMessageIdRef.current);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        const newMessages: Message[] = data.messages || [];

        if (newMessages.length > 0) {
          lastMessageIdRef.current = newMessages[newMessages.length - 1].id;

          if (isInitial) {
            setMessages(newMessages);
          } else {
            setMessages((prev) => {
              // Avoid duplicates
              const existingIds = new Set(prev.map(m => m.id));
              const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
              return [...prev, ...uniqueNewMessages];
            });
          }
        }
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load messages');
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to connect to server');
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [roomId]);

  // Initial fetch and polling
  useEffect(() => {
    fetchMessages(true);

    // Start polling
    const poll = () => {
      pollTimeoutRef.current = setTimeout(async () => {
        await fetchMessages(false);
        poll();
      }, POLL_INTERVAL);
    };
    poll();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [fetchMessages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const messageContent = input.trim();
    setInput('');
    setSending(true);

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderId: currentUser.id,
      sender: currentUser,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? data.message : m))
        );
        lastMessageIdRef.current = data.message.id;
      } else {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        setError('Failed to send message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-[600px] bg-[var(--color-bg-tertiary)] rounded-2xl border border-[var(--color-border)]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Room Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-[var(--color-text-muted)]">{players.length} members</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--color-text-muted)] mt-2">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[var(--color-bg-hover)] rounded-2xl flex items-center justify-center mb-4">
              <ChatIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-[var(--color-text-primary)] font-medium mb-1">No messages yet</h4>
            <p className="text-sm text-[var(--color-text-muted)]">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const showDate =
                index === 0 ||
                formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-[var(--color-bg-hover)] rounded-full text-xs text-[var(--color-text-muted)]">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar
                      src={message.sender.avatarUrl}
                      name={message.sender.name || message.sender.username}
                      size="sm"
                    />
                    <div
                      className={`max-w-[70%] ${
                        isCurrentUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      {!isCurrentUser && (
                        <span className="text-xs text-[var(--color-text-muted)] mb-1 block">
                          {message.sender.name || message.sender.username}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isCurrentUser
                            ? 'bg-indigo-500 text-[var(--color-text-primary)] rounded-br-md'
                            : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] rounded-bl-md'
                        } ${message.id.startsWith('temp-') ? 'opacity-70' : ''}`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <span
                        className={`text-xs text-[var(--color-text-muted)] mt-1 block ${
                          isCurrentUser ? 'text-right' : ''
                        }`}
                      >
                        {formatTime(message.createdAt)}
                        {message.id.startsWith('temp-') && ' • Sending...'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 bg-[var(--color-bg-hover)] border-none rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <SendIcon className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
          Messages are saved and synced automatically
        </p>
      </div>
    </div>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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
