import type { UserWithRooms } from '@/types';

interface ProfileHeaderProps {
  user: UserWithRooms;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || 'User avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-medium text-gray-500">
            {user.name?.charAt(0).toUpperCase() ||
              user.email.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-gray-900 truncate">
          {user.name || 'No name set'}
        </h2>
        <p className="text-gray-500 truncate">{user.email}</p>
        {user.username && (
          <p className="text-sm text-gray-400">@{user.username}</p>
        )}
      </div>
    </div>
  );
}
