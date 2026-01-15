'use client';

import { useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { Input, Textarea } from '@/components/ui';
import { validateName, validateBio } from '@/lib/validations/profile';
import type { ProfileUpdatePayload } from '@/types';

interface PersonalInfoSectionProps {
  name: string | null;
  bio: string | null;
  country: string | null;
  onUpdate: (data: ProfileUpdatePayload) => Promise<boolean>;
}

export function PersonalInfoSection({
  name,
  bio,
  country,
  onUpdate,
}: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState({
    name: name || '',
    bio: bio || '',
    country: country || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name: fieldName, value } = e.target;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const bioError = validateBio(formData.bio);
    if (bioError) {
      newErrors.bio = bioError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setIsLoading(true);
    const success = await onUpdate({
      name: formData.name.trim(),
      bio: formData.bio.trim() || null,
      country: formData.country.trim() || null,
    });
    setIsLoading(false);
    return success;
  };

  const handleCancel = () => {
    setFormData({
      name: name || '',
      bio: bio || '',
      country: country || '',
    });
    setErrors({});
  };

  return (
    <ProfileSection
      title="Personal Information"
      description="Your public profile information"
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
      editContent={
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Your full name"
          />
          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            error={errors.bio}
            helperText={`${formData.bio.length}/500 characters`}
            placeholder="Tell us about yourself..."
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., United States"
          />
        </div>
      }
    >
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-500">Name:</span>
          <span className="ml-2 font-medium">{name || '-'}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Bio:</span>
          <p className="mt-1 text-gray-700">
            {bio || <span className="text-gray-400">No bio set</span>}
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Country:</span>
          <span className="ml-2 font-medium">{country || '-'}</span>
        </div>
      </div>
    </ProfileSection>
  );
}
