import { RoomCard } from './RoomCard';
import { EmptyState, Button } from '@/components/ui';
import type { RoomWithPlayers } from '@/types';

interface RoomListProps {
  rooms: RoomWithPlayers[];
  userId: string;
  onRoomClick: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function RoomList({
  rooms,
  userId,
  onRoomClick,
  onLeaveRoom,
  onCreateClick,
  onJoinClick,
}: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        title="No rooms yet"
        description="Create a new room or join an existing one to start practicing with others."
        action={
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={onJoinClick}>
              Join Room
            </Button>
            <Button onClick={onCreateClick}>Create Room</Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isOwner={room.ownerId === userId}
          onClick={() => onRoomClick(room.id)}
          onLeave={() => onLeaveRoom(room.id)}
        />
      ))}
    </div>
  );
}
