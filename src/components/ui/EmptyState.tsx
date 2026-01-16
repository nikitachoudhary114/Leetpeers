import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="mx-auto w-12 h-12 text-[var(--color-text-muted)] mb-4">{icon}</div>
      )}
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && <p className="text-[var(--color-text-muted)] mb-4 max-w-sm mx-auto">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
