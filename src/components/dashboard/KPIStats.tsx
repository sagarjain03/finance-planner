'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingDown, PiggyBank, Target } from 'lucide-react';

interface KPIStatsProps {
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
}

export function KPIStats(props: KPIStatsProps) {
  const stats = [
    {
      label: 'Monthly Salary',
      value: formatCurrency(props.monthlySalary ?? 0),
      icon: Wallet,
      accent: 'text-slate-100',
    },
    {
      label: 'Fixed Expenses',
      value: formatCurrency(props.monthlyExpenses ?? 0),
      icon: TrendingDown,
      accent: 'text-slate-200',
    },
    {
      label: 'Monthly Savings',
      value: formatCurrency(props.monthlySavings ?? 0),
      subtitle: `${(props.savingsRate ?? 0).toFixed(1)}% of income`,
      icon: PiggyBank,
      accent: 'text-slate-100',
    },
    {
      label: 'Yearly Savings',
      value: formatCurrency(props.yearlySavings ?? 0),
      icon: Target,
      accent: 'text-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl p-6 group relative overflow-hidden flex flex-col justify-between min-h-[140px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/15"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-400">
                {stat.label}
              </p>
              <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-black text-slate-100 tracking-tight">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs font-medium text-slate-300 mt-1.5 inline-block px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
