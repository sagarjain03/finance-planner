import { Trophy, X } from "lucide-react";
import { useState } from "react";
import { DashboardPlan } from "@/types/dashboard";

interface AchievementBannerProps {
  achievement?: DashboardPlan["achievement"];
}

export function AchievementBanner({ achievement }: AchievementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!achievement?.unlocked || dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* Shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

      <div className="flex-shrink-0 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
        <Trophy className="w-6 h-6 text-amber-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-300">Achievement Unlocked!</p>
        <p className="text-sm text-amber-200/80 mt-0.5">{achievement.message}</p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Dismiss achievement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
