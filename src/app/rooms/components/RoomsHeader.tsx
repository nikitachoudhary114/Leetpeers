import { Button } from '@/components/ui';

interface RoomsHeaderProps {
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function RoomsHeader({ onCreateClick, onJoinClick }: RoomsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Rooms</h1>
        <p className="text-gray-500 mt-1">Manage your LeetCode study groups</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onJoinClick}>
          Join Room
        </Button>
        <Button onClick={onCreateClick}>Create Room</Button>
      </div>
    </div>
  );
}
