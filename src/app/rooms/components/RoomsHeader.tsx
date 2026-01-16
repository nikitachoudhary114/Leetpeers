import { Button } from '@/components/ui';

interface RoomsHeaderProps {
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function RoomsHeader({ onCreateClick, onJoinClick }: RoomsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">My Rooms</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Manage your LeetCode study groups</p>
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
