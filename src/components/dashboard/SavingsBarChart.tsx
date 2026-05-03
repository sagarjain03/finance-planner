'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SavingsBarChartProps {
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

const BAR_COLORS: Record<string, string> = {
  Salary: '#3b82f6',
  Expenses: '#ef4444',
  Savings: '#22c55e',
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0B0F17]/90 border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-xs font-semibold text-slate-400">{d.name}</p>
      <p className="text-sm font-bold text-slate-200">{formatCurrency(d.value)}</p>
    </div>
  );
}

export function SavingsBarChart({
  monthlySalary = 0,
  monthlyExpenses = 0,
  monthlySavings = 0,
}: SavingsBarChartProps) {
  const data = [
    { name: 'Salary', value: monthlySalary },
    { name: 'Expenses', value: monthlyExpenses },
    { name: 'Savings', value: monthlySavings },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-200">Monthly Breakdown</h3>
        <p className="text-sm text-slate-400">Salary vs Expenses vs Savings</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#ffffff10' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={BAR_COLORS[entry.name] ?? '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
