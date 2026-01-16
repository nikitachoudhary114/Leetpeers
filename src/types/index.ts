// User types derived from Prisma schema
export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  leetcodeProfile: string | null;
  leetcodeVerified: boolean;
  bio: string | null;
  avatarUrl: string | null;
  githubProfile: string | null;
  githubVerified: boolean;
  linkedinProfile: string | null;
  country: string | null;
  timezone: string;
  streakCount: number;
  problemsSolved: number;
  lastTotalSolved: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Per-room streak info
export interface RoomStreak {
  roomId: string;
  roomName: string | null;
  roomCode: string;
  streakCount: number;
  lastActiveDate: Date | string | null;
}

// LeetCode stats breakdown
export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface RoomSummary {
  id: string;
  name: string | null;
  code: string;
  createdAt: Date | string;
  ownerId?: string;
}

export interface UserWithRooms extends User {
  rooms: RoomSummary[];
  ownedRooms: RoomSummary[];
}

// Room types
export interface Room {
  id: string;
  name: string | null;
  code: string;
  createdAt: Date | string;
  dailyTarget: number;
  streakCount: number;
  ownerId: string;
}

export interface RoomOwner {
  id: string;
  username: string | null;
  name: string | null;
}

export interface RoomPlayer {
  id: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface RoomWithPlayers extends Room {
  owner: RoomOwner;
  players: RoomPlayer[];
  _count?: {
    players: number;
  };
}

// API Response types
export interface ApiError {
  error: string;
}

export interface ApiSuccess<T> {
  message?: string;
  data?: T;
}

// Form state types
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// Profile update payload
export interface ProfileUpdatePayload {
  name?: string;
  bio?: string | null;
  leetcodeProfile?: string | null;
  githubProfile?: string | null;
  linkedinProfile?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  timezone?: string;
}
