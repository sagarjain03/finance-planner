import { PieChart, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { DashboardPlan } from "@/types/dashboard";

interface BudgetFeedbackCardProps {
  budgetFeedback?: DashboardPlan["budgetFeedback"];
  monthlySalary: number;
}

type StatusIcon = "over" | "ideal" | "under";

const IDEAL_NEEDS = 50;
const IDEAL_WANTS = 30;
const IDEAL_SAVINGS = 20;

function StatusBadge({ status, label }: { status: string; label: string }) {
  const map: Record<
    string,
    { color: string; icon: React.ReactNode; bg: string; border: string }
  > = {
    over: {
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    ideal: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: <Minus className="w-3.5 h-3.5" />,
    },
    under: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: <TrendingDown className="w-3.5 h-3.5" />,
    },
    low: {
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      icon: <TrendingDown className="w-3.5 h-3.5" />,
    },
    good: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: <Minus className="w-3.5 h-3.5" />,
    },
    excellent: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
  };

  const style = map[status] ?? map.ideal;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${style.color} ${style.bg} ${style.border}`}
    >
      {style.icon}
      {label}
    </span>
  );
}

function ProgressBar({
  actual,
  ideal,
  color,
}: {
  actual: number;
  ideal: number;
  color: string;
}) {
  const clamped = Math.min(100, actual);
  const isOver = actual > ideal;
  return (
    <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${isOver ? "bg-rose-500" : color}`}
        style={{ width: `${clamped}%` }}
      />
      {/* Ideal marker */}
      <div
        className="absolute top-0 w-0.5 h-full bg-white/30"
        style={{ left: `${ideal}%` }}
      />
    </div>
  );
}

export function BudgetFeedbackCard({
  budgetFeedback,
  monthlySalary,
}: BudgetFeedbackCardProps) {
  if (!budgetFeedback) return null;

  const {
    actualNeedsPct,
    actualWantsPct,
    actualSavingsPct,
    needsStatus,
    wantsStatus,
    savingsStatus,
    message,
  } = budgetFeedback;

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden group">
      {/* Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 sm:p-8 z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
            <PieChart className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">50/30/20 Budget</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              How your spending compares to the ideal split
            </p>
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          </div>
        )}

        {/* Breakdown rows */}
        <div className="space-y-5">
          {/* Needs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  Needs
                </span>
                <StatusBadge
                  status={needsStatus}
                  label={`${actualNeedsPct}% (ideal 50%)`}
                />
              </div>
              <span className="text-xs text-slate-500">
                ₹
                {Math.round((monthlySalary * actualNeedsPct) / 100).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
            <ProgressBar
              actual={actualNeedsPct}
              ideal={IDEAL_NEEDS}
              color="bg-blue-500"
            />
          </div>

          {/* Wants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  Wants
                </span>
                <StatusBadge
                  status={wantsStatus}
                  label={`${actualWantsPct}% (ideal 30%)`}
                />
              </div>
              <span className="text-xs text-slate-500">
                ₹
                {Math.round((monthlySalary * actualWantsPct) / 100).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
            <ProgressBar
              actual={actualWantsPct}
              ideal={IDEAL_WANTS}
              color="bg-purple-500"
            />
          </div>

          {/* Savings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  Savings
                </span>
                <StatusBadge
                  status={savingsStatus}
                  label={`${actualSavingsPct}% (ideal 20%)`}
                />
              </div>
              <span className="text-xs text-slate-500">
                ₹
                {Math.round(
                  (monthlySalary * actualSavingsPct) / 100
                ).toLocaleString("en-IN")}
              </span>
            </div>
            <ProgressBar
              actual={actualSavingsPct}
              ideal={IDEAL_SAVINGS}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Legend */}
        <p className="text-xs text-slate-600 mt-5">
          The vertical line on each bar marks the ideal target. Stay left of
          it for Needs/Wants; stay right for Savings.
        </p>
      </div>
    </div>
  );
}
