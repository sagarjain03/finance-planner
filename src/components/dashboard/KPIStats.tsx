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
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-400',
      borderColor: 'group-hover:border-blue-500/30'
    },
    {
      label: 'Fixed Expenses',
      value: formatCurrency(props.monthlyExpenses ?? 0),
      icon: TrendingDown,
      color: 'from-red-500/20 to-red-500/5',
      iconColor: 'text-red-400',
      borderColor: 'group-hover:border-red-500/30'
    },
    {
      label: 'Monthly Savings',
      value: formatCurrency(props.monthlySavings ?? 0),
      subtitle: `${(props.savingsRate ?? 0).toFixed(1)}% of income`,
      icon: PiggyBank,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/30'
    },
    {
      label: 'Yearly Savings',
      value: formatCurrency(props.yearlySavings ?? 0),
      icon: Target,
      color: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-400',
      borderColor: 'group-hover:border-purple-500/30'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`glass-card glass-card-hover rounded-2xl p-6 group relative overflow-hidden flex flex-col justify-between min-h-[140px] transition-all duration-300 ${stat.borderColor}`}
        >
          {/* Subtle Background Gradient */}
          <div className={`absolute -inset-px bg-gradient-to-br ${stat.color} opacity-50 z-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-400">
                {stat.label}
              </p>
              <div className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.05]">
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-black text-slate-100 tracking-tight">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-xs font-medium text-emerald-400/80 mt-1.5 bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full">
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
