'use client';

import { useState } from 'react';
import { ProblemsList } from './ProblemsList';
import { ProblemView } from './ProblemView';
import type { Problem } from './problemsData';

interface ProblemsSectionProps {
  roomId: string;
}

export function ProblemsSection({ roomId }: ProblemsSectionProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  if (selectedProblem) {
    return (
      <ProblemView
        problem={selectedProblem}
        roomId={roomId}
        onBack={() => setSelectedProblem(null)}
      />
    );
  }

  return (
    <div className="grid lg:grid-cols-1 gap-4">
      <ProblemsList
        onSelectProblem={setSelectedProblem}
        selectedProblemId={null}
      />
    </div>
  );
}
