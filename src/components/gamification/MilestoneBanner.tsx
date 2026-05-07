"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedAt?: Date;
}

interface MilestoneBannerProps {
  milestones: Milestone[];
  compact?: boolean;
}

const MILESTONE_EMOJIS: Record<string, string> = {
  first_goal: "🎯",
  high_savings: "📈",
  goal_achieved: "🏆",
  tax_optimized: "💰",
  joined_app: "👋",
  first_plan: "📋",
};

export function MilestoneBanner({
  milestones,
  compact = false,
}: MilestoneBannerProps) {
  const achievedMilestones = milestones.filter((m) => m.achieved);

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/30 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-purple-300">
              {achievedMilestones.length} Milestones Achieved
            </p>
            <p className="text-xs text-gray-400">
              {milestones.length - achievedMilestones.length} more to go!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Milestones
        </h3>

        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                milestone.achieved
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-gray-900/30 border-gray-700/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl mt-1">
                  {MILESTONE_EMOJIS[milestone.id] || "🌟"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-100">
                      {milestone.title}
                    </h4>
                    {milestone.achieved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                  {milestone.achievedAt && (
                    <p className="text-xs text-emerald-400 mt-2">
                      ✓ Achieved{" "}
                      {new Date(milestone.achievedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-indigo-400">
              {achievedMilestones.length}/{milestones.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
              style={{
                width: `${(achievedMilestones.length / milestones.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
