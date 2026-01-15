'use client';

import { ReactNode, useState } from 'react';
import { Card, CardHeader, Button } from '@/components/ui';

interface ProfileSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  editContent: ReactNode;
  onSave: () => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProfileSection({
  title,
  description,
  children,
  editContent,
  onSave,
  onCancel,
  isLoading = false,
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader
        title={title}
        description={description}
        action={
          !isEditing ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : null
        }
      />

      {isEditing ? (
        <div className="space-y-4">
          {editContent}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} isLoading={isLoading} size="sm">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              size="sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        children
      )}
    </Card>
  );
}
