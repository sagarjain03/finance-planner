'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { FinancialPlanOutput } from '@/types/financial';

interface QuickStatsCardsProps {
  plan?: FinancialPlanOutput | null;
  salary?: number;
  expenses?: number;
  defaultSalary?: number;
  defaultExpenses?: number;
  showSavingsRate?: boolean;
}

export function QuickStatsCards({
  plan,
  salary,
  expenses,
  defaultSalary = 50000,
  defaultExpenses = 30000,
  showSavingsRate = true,
}: QuickStatsCardsProps) {
  const monthlySalary = salary ?? plan?.input?.monthlySalary ?? plan?.monthlySalary ?? defaultSalary;
  const monthlyExpenses = expenses ?? plan?.input?.monthlyExpenses ?? plan?.monthlyExpenses ?? defaultExpenses;
  const monthlySavings = monthlySalary - monthlyExpenses;
  const savingsRate = monthlySalary > 0 ? ((monthlySalary - monthlyExpenses) / monthlySalary) * 100 : 0;

  const stats = [
    {
      label: 'Monthly Income',
      value: monthlySalary,
      color: 'text-emerald-500',
    },
    {
      label: 'Monthly Expenses',
      value: monthlyExpenses,
      color: 'text-red-500',
    },
    {
      label: 'Monthly Savings',
      value: monthlySavings,
      color: 'text-emerald-500',
    },
  ];

  if (showSavingsRate) {
    stats.push({
      label: 'Savings Rate',
      value: savingsRate,
      color: 'text-blue-500',
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-2">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>
              {stat.label === 'Savings Rate'
                ? `${stat.value.toFixed(1)}%`
                : `₹${stat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
