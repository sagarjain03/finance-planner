"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GoalAnalysisResult } from "@/types/financial";
import { GoalCard } from "@/components/goals/GoalCard";
import { HealthScoreCard } from "@/components/health/HealthScoreCard";
import { FinancialPlanOutput } from "@/types/financial";

interface SimulatorResultsProps {
  originalPlan: FinancialPlanOutput;
  simulatedGoals: GoalAnalysisResult[];
  simulatedSavingsRate: number;
}

export function SimulatorResults({
  originalPlan,
  simulatedGoals,
  simulatedSavingsRate,
}: SimulatorResultsProps) {
  // Create a simulated plan for health score calculation
  const simulatedPlan: FinancialPlanOutput = {
    ...originalPlan,
    savingsRate: simulatedSavingsRate,
    goalsAnalysis: simulatedGoals,
  };

  const hasChanges = simulatedSavingsRate !== originalPlan.savingsRate;

  return (
    <div className="space-y-8">
      {/* Summary Changes */}
      {hasChanges && (
        <Card className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
          <CardContent className="p-6">
            <h3 className="font-bold text-indigo-300 mb-4">📊 What Changes?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Current Savings Rate</p>
                <p className="text-2xl font-bold text-indigo-400">
                  {originalPlan.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">→</p>
                <p className="text-2xl font-bold text-purple-400">
                  {simulatedSavingsRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Impact</p>
                <p className={`text-2xl font-bold ${
                  simulatedSavingsRate > originalPlan.savingsRate
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}>
                  {(simulatedSavingsRate - originalPlan.savingsRate).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Impact */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Simulated Goal Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulatedGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Simulated Financial Health
        </h3>
        <div className="max-w-2xl">
          <HealthScoreCard plan={simulatedPlan} />
        </div>
      </div>

      {/* Key Insights */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-gray-100">💡 Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {simulatedGoals.some((g) => g.isAchievable) &&
            simulatedGoals.every((g) => g.isAchievable) && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm text-emerald-400">
                  ✓ All goals are achievable at this savings rate!
                </p>
              </div>
            )}

          {simulatedGoals.some((g) => g.isAchievable) &&
            simulatedGoals.some((g) => !g.isAchievable) && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-sm text-yellow-400">
                  ⚠️ Some goals are achievable, but others need more savings or time.
                </p>
              </div>
            )}

          {simulatedGoals.every((g) => !g.isAchievable) && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">
                ❌ Current savings rate won't reach any goals. Increase savings or
                extend timelines.
              </p>
            </div>
          )}

          {simulatedSavingsRate > originalPlan.savingsRate && (
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
              <p className="text-sm text-indigo-400">
                📈 Increasing savings by{" "}
                {(simulatedSavingsRate - originalPlan.savingsRate).toFixed(1)}%
                would accelerate goal timelines!
              </p>
            </div>
          )}

          {simulatedSavingsRate < originalPlan.savingsRate && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <p className="text-sm text-orange-400">
                ⚠️ Decreasing savings by{" "}
                {Math.abs(
                  simulatedSavingsRate - originalPlan.savingsRate
                ).toFixed(1)}
                % would extend goal timelines significantly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
