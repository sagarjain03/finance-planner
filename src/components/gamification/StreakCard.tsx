"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Flame } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  lastActivityDate,
}: StreakCardProps) {
  const isActive =
    lastActivityDate &&
    new Date().getTime() - lastActivityDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-500/30 relative overflow-hidden">
      {/* Flame background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <CardHeader>
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Flame className="w-5 h-5 fill-orange-500" />
          Activity Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-4xl font-black text-orange-400">{currentStreak}</p>
            <p className="text-gray-400">day{currentStreak !== 1 ? "s" : ""}</p>
          </div>
          <p className="text-sm text-gray-400">
            {isActive
              ? "🔥 Keep it going! Check in tomorrow to maintain your streak."
              : "Start your streak by checking back tomorrow!"}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-400 mb-1">Personal Best</p>
          <p className="text-2xl font-bold text-orange-300">{longestStreak} days</p>
        </div>
      </CardContent>
    </Card>
  );
}
