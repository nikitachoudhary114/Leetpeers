import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional().nullable(),
  leetcodeProfile: z
    .string()
    .regex(/^[a-zA-Z0-9_-]*$/, 'Invalid LeetCode username format')
    .max(50, 'Username too long')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  githubProfile: z
    .string()
    .regex(/^[a-zA-Z0-9_-]*$/, 'Invalid GitHub username format')
    .max(50, 'Username too long')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  linkedinProfile: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  country: z.string().max(100, 'Country name too long').optional().nullable(),
  avatarUrl: z
    .string()
    .url('Invalid avatar URL')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Validation helper for individual fields
export function validateLeetCodeUsername(username: string): string | null {
  if (!username) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Invalid LeetCode username format (letters, numbers, - and _ only)';
  }
  if (username.length > 50) {
    return 'Username too long (max 50 characters)';
  }
  return null;
}

export function validateGitHubUsername(username: string): string | null {
  if (!username) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Invalid GitHub username format (letters, numbers, - and _ only)';
  }
  if (username.length > 50) {
    return 'Username too long (max 50 characters)';
  }
  return null;
}

export function validateBio(bio: string): string | null {
  if (bio.length > 500) {
    return 'Bio must be under 500 characters';
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.length > 100) {
    return 'Name too long (max 100 characters)';
  }
  return null;
}
