'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Button } from '@/components/ui';
import { validateRoomName } from '@/lib/validations/room';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateRoomName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const success = await onSubmit(name.trim());
    setIsLoading(false);

    if (success) {
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="e.g., Daily LeetCode Grind"
          error={error || undefined}
          autoFocus
        />
        <p className="text-sm text-[var(--color-text-muted)]">
          You&apos;ll receive a unique room code to share with others.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
}
