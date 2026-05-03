'use client';

import { formatCurrency } from '@/lib/utils';

interface GoalAnalysisProps {
  isAchievable: boolean;
  goalAmount: number;
  goalDuration: number;
  monthsToReachGoal: number | null;
  monthlySavings: number;
}

export function GoalAnalysis({
  isAchievable = false,
  goalAmount = 0,
  goalDuration = 0,
  monthsToReachGoal,
  monthlySavings = 0,
}: GoalAnalysisProps) {
  const achievable = isAchievable && monthlySavings > 0;

  const rows = [
    { label: 'Goal Amount', value: formatCurrency(goalAmount) },
    { label: 'Your Target', value: `${goalDuration} months` },
    {
      label: 'Realistic Timeline',
      value: monthsToReachGoal ? `${monthsToReachGoal} months` : 'Not feasible',
      highlight: true,
    },
    {
      label: 'Required Monthly',
      value: goalDuration > 0 ? formatCurrency(goalAmount / goalDuration) : '—',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-200">Goal Analysis</h3>
        <p className="text-sm text-slate-400">Is your goal achievable with current savings?</p>
      </div>
      <div className="space-y-5">
        {/* Status badge */}
        <div
          className={`p-5 rounded-xl border ${
            achievable
              ? 'border-emerald-500/20 bg-emerald-500/10'
              : 'border-amber-500/20 bg-amber-500/10'
          }`}
        >
          <p
            className={`text-lg font-black ${
              achievable ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {achievable ? '✓ Goal is Achievable' : '⚠ Goal is Challenging'}
          </p>
          <p
            className={`text-sm mt-2 leading-relaxed ${
              achievable ? 'text-emerald-300/80' : 'text-amber-300/80'
            }`}
          >
            {achievable
              ? `You can reach ${formatCurrency(goalAmount)} in ~${monthsToReachGoal} months with consistent savings.`
              : monthlySavings <= 0
                ? 'Your expenses are equal to or greater than your salary.'
                : `Your goal requires ${formatCurrency(goalAmount / goalDuration)}/mo but you can only save ${formatCurrency(monthlySavings)}/mo.`}
          </p>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg"
            >
              <span className="text-slate-400 font-semibold text-sm">
                {row.label}
              </span>
              <span
                className={`font-bold text-sm ${
                  row.highlight ? 'text-blue-400' : 'text-slate-200'
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
