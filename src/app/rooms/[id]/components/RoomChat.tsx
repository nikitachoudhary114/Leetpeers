'use client';

import { useState, useRef, useEffect } from 'react';
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
  timestamp: Date;
}

interface RoomChatProps {
  roomId: string;
  currentUser: Player;
  players: Player[];
}

// Mock messages for demo
const generateMockMessages = (players: Player[], currentUser: Player): Message[] => {
  if (players.length < 2) return [];

  const otherPlayers = players.filter((p) => p.id !== currentUser.id);
  if (otherPlayers.length === 0) return [];

  const messages: Message[] = [
    {
      id: '1',
      content: 'Hey everyone! Ready for today\'s challenge?',
      senderId: otherPlayers[0]?.id || '',
      sender: otherPlayers[0] || currentUser,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      content: 'Let\'s do it! I\'m aiming for 3 problems today.',
      senderId: currentUser.id,
      sender: currentUser,
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: '3',
      content: 'I just finished Two Sum. Moving on to Binary Search now!',
      senderId: otherPlayers[0]?.id || '',
      sender: otherPlayers[0] || currentUser,
      timestamp: new Date(Date.now() - 1800000),
    },
  ];

  return messages;
};

export function RoomChat({ roomId, currentUser, players }: RoomChatProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    generateMockMessages(players, currentUser)
  );
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      senderId: currentUser.id,
      sender: currentUser,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
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
    <div className="flex flex-col h-[600px] bg-slate-800/30 rounded-2xl border border-slate-700">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Room Chat</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-400">{players.length} online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4">
              <ChatIcon className="w-8 h-8 text-slate-500" />
            </div>
            <h4 className="text-white font-medium mb-1">No messages yet</h4>
            <p className="text-sm text-slate-400">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const showDate =
                index === 0 ||
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-400">
                        {formatDate(message.timestamp)}
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
                        <span className="text-xs text-slate-400 mb-1 block">
                          {message.sender.name || message.sender.username}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isCurrentUser
                            ? 'bg-indigo-500 text-white rounded-br-md'
                            : 'bg-slate-700 text-slate-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <span
                        className={`text-xs text-slate-500 mt-1 block ${
                          isCurrentUser ? 'text-right' : ''
                        }`}
                      >
                        {formatTime(message.timestamp)}
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
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 border-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Messages are stored locally for demo purposes
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
