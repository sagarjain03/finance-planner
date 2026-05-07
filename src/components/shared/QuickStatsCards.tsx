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
    },
    {
      label: 'Monthly Expenses',
      value: monthlyExpenses,
    },
    {
      label: 'Monthly Savings',
      value: monthlySavings,
    },
  ];

  if (showSavingsRate) {
    stats.push({
      label: 'Savings Rate',
      value: savingsRate,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-white/10 bg-white/3">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 font-semibold mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-slate-100">
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
