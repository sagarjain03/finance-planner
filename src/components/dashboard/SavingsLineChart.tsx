'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import { formatCurrency } from '@/lib/utils';

interface SavingsLineChartProps {
  monthlyPlan: Array<{
    month: number;
    saved: number;
    cumulativeSavings: number;
  }>;
  goalAmount: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-[#0B0F17]/90 border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-xs font-semibold text-slate-400">{data.payload.name}</p>
      <p className="text-sm font-bold text-blue-400">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}

export function SavingsLineChart({
  monthlyPlan = [],
  goalAmount = 0,
}: SavingsLineChartProps) {
  const chartData = monthlyPlan.map((m) => ({
    name: `Mo ${m.month}`,
    cumulative: m.cumulativeSavings ?? 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-200">Savings Trajectory</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...chartData.map((d) => d.cumulative),
    goalAmount
  );

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-200">Savings Trajectory</h3>
        <p className="text-sm text-slate-400">
          Cumulative savings over {chartData.length} months
        </p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#ffffff10' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              domain={[0, Math.ceil(maxValue * 1.1)]}
            />
            <Tooltip content={<CustomTooltip />} />
            {goalAmount > 0 && (
              <ReferenceLine
                y={goalAmount}
                stroke="#10b981"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: 'Goal',
                  position: 'right',
                  fill: '#10b981',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#savingsGradient)"
              dot={{ r: 4, fill: '#0B0F17', strokeWidth: 2, stroke: '#3b82f6' }}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0B0F17', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
