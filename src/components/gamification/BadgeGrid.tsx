"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Trophy, Lock, Star } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface BadgeGridProps {
  badges: Badge[];
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  first_goal: <Trophy className="w-8 h-8" />,
  high_savings: <Star className="w-8 h-8" />,
  goal_achieved: <Trophy className="w-8 h-8" />,
  tax_master: <Star className="w-8 h-8" />,
  investor: <Trophy className="w-8 h-8" />,
  budget_pro: <Star className="w-8 h-8" />,
};

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                badge.unlocked
                  ? "bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/30 hover:border-yellow-500/50"
                  : "bg-gray-900/50 border-gray-700/30 opacity-50"
              }`}
            >
              <div
                className={`text-4xl mb-3 flex justify-center ${
                  badge.unlocked ? "opacity-100" : "opacity-40"
                }`}
              >
                {BADGE_ICONS[badge.id] || <Trophy className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold text-center text-gray-200 text-sm mb-1">
                {badge.name}
              </h3>
              <p className="text-xs text-gray-400 text-center">
                {badge.description}
              </p>
              {badge.unlockedAt && (
                <p className="text-xs text-yellow-400 text-center mt-2">
                  ✓ Unlocked
                </p>
              )}
              {!badge.unlocked && (
                <div className="flex justify-center mt-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
