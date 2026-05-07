import React from "react";
import { GoalAnalysisResult } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface GoalCardProps {
  goal: GoalAnalysisResult;
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700/50 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
      <div 
        className="absolute bottom-0 left-0 h-1 bg-indigo-500" 
        style={{ width: `${goal.progressPercentage}%`, transition: 'width 1s ease-in-out' }}
      />
      <CardHeader>
        <CardTitle className="text-gray-100 flex justify-between items-center text-lg">
          {goal.name}
          <span className="text-sm font-normal text-gray-400">
            {goal.duration} months
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-400">Target Amount</p>
              <p className="text-2xl font-bold text-gray-100">
                ₹{goal.amount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Status</p>
              <p className={`text-sm font-medium ${goal.isAchievable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {goal.isAchievable ? 'On Track' : 'Off Track'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700/50 flex justify-between text-sm">
            <div>
              <span className="text-gray-400">Allocated: </span>
              <span className="text-gray-200">₹{Math.round(goal.currentSaving).toLocaleString("en-IN")}/mo</span>
            </div>
            {goal.gap > 0 && (
              <div>
                <span className="text-gray-400">Gap: </span>
                <span className="text-rose-400 font-medium">₹{Math.round(goal.gap).toLocaleString("en-IN")}/mo</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
