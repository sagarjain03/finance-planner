import React from "react";
import { GoalAnalysisResult } from "@/types/financial";
import { GoalCard } from "./GoalCard";

interface GoalListProps {
  goals: GoalAnalysisResult[];
}

export function GoalList({ goals }: GoalListProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700/50">
        <p>No goals defined yet. Add some goals to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
