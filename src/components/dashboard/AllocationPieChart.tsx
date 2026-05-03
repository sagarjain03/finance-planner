'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface AllocationPieChartProps {
  allocation: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { type: string; amount: number; percentage: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0B0F17]/90 border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-xs font-semibold text-slate-400">{d.type}</p>
      <p className="text-sm font-bold text-slate-200">
        {formatCurrency(d.amount)} ({d.percentage}%)
      </p>
    </div>
  );
}

function CustomLabel(props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  const cx = props.cx ?? 0;
  const cy = props.cy ?? 0;
  const midAngle = props.midAngle ?? 0;
  const innerRadius = props.innerRadius ?? 0;
  const outerRadius = props.outerRadius ?? 0;
  const percent = props.percent ?? 0;

  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function AllocationPieChart({ allocation = [] }: AllocationPieChartProps) {
  const data = allocation.filter((a) => (a.percentage ?? 0) > 0);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-200">Investment Allocation</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No allocation data
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-200">Investment Allocation</h3>
        <p className="text-sm text-slate-400">Recommended asset distribution</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              outerRadius={95}
              innerRadius={55}
              dataKey="percentage"
              nameKey="type"
              labelLine={false}
              label={CustomLabel}
              strokeWidth={4}
              stroke="#0B0F17"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value: string) => (
                <span className="text-xs font-medium text-slate-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
