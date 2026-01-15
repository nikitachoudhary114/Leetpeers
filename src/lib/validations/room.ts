import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Room name is required')
    .max(50, 'Room name must be under 50 characters')
    .transform((val) => val.trim()),
});

export const joinRoomSchema = z.object({
  code: z
    .string()
    .length(6, 'Room code must be exactly 6 characters')
    .transform((val) => val.toUpperCase()),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type JoinRoomFormData = z.infer<typeof joinRoomSchema>;

// Validation helpers
export function validateRoomName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Room name is required';
  }
  if (trimmed.length > 50) {
    return 'Room name must be under 50 characters';
  }
  return null;
}

export function validateRoomCode(code: string): string | null {
  const cleaned = code.trim().toUpperCase();
  if (!cleaned) {
    return 'Room code is required';
  }
  if (cleaned.length !== 6) {
    return 'Room code must be exactly 6 characters';
  }
  return null;
}
