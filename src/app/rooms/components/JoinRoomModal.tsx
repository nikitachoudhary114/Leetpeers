'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Button } from '@/components/ui';
import { validateRoomCode } from '@/lib/validations/room';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<boolean>;
}

export function JoinRoomModal({ isOpen, onClose, onSubmit }: JoinRoomModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    const validationError = validateRoomCode(cleanCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const success = await onSubmit(cleanCode);
    setIsLoading(false);

    if (success) {
      setCode('');
      onClose();
    }
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join a Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Code"
          name="code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Enter 6-character code"
          error={error || undefined}
          maxLength={6}
          autoFocus
          className="font-mono tracking-wider"
        />
        <p className="text-sm text-gray-500">
          Ask the room owner for the code to join their study group.
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
            Join Room
          </Button>
        </div>
      </form>
    </Modal>
  );
}
