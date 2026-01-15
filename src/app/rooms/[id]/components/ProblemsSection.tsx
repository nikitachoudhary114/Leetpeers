'use client';

import { useState } from 'react';
import { ProblemsList } from './ProblemsList';
import { ProblemView } from './ProblemView';
import type { Problem } from './problemsData';

export function ProblemsSection() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  if (selectedProblem) {
    return (
      <ProblemView
        problem={selectedProblem}
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
