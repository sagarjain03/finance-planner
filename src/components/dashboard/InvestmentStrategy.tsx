'use client';

import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface InvestmentStrategyProps {
  investmentExplanation: {
    summary: string;
    reasoning: string[];
    riskLevel: 'low' | 'medium' | 'high';
    strategy: string;
  } | null;
  investmentAllocation: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
  goalDuration: number;
}

const RISK_STYLES = {
  low: {
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  medium: {
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  high: {
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
    icon: ShieldAlert,
    iconColor: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
};

export function InvestmentStrategy({
  investmentExplanation,
  investmentAllocation = [],
  goalDuration = 0,
}: InvestmentStrategyProps) {
  const explanation = investmentExplanation ?? {
    summary: 'Allocation based on your profile',
    reasoning: [],
    riskLevel: 'medium' as const,
    strategy: 'Balanced allocation',
  };

  const styles = RISK_STYLES[explanation.riskLevel] ?? RISK_STYLES.medium;
  const RiskIcon = styles.icon;

  return (
    <div className="space-y-8">
      {/* Strategy + Allocation row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Risk & Strategy */}
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-200">Investment Strategy</h3>
            <p className="text-sm text-slate-400">Personalized recommendation for your {goalDuration}-month goal</p>
          </div>
          
          <div className="flex-1 space-y-5">
            <div className={`p-5 rounded-xl border ${styles.border} ${styles.bg} backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RiskIcon className={`w-5 h-5 ${styles.iconColor}`} />
                  <span className="text-xs font-semibold text-slate-300 tracking-wider">RISK LEVEL</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${styles.badge}`}>
                  {explanation.riskLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {explanation.summary}
              </p>
            </div>

            <div className="p-5 bg-white/[0.02] rounded-xl border border-white/[0.05]">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Strategy
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {explanation.strategy}
              </p>
            </div>
          </div>
        </div>

        {/* Allocation breakdown */}
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-200">Allocation Breakdown</h3>
            <p className="text-sm text-slate-400">Distribution across {goalDuration}-month timeframe</p>
          </div>
          
          <div className="flex-1 space-y-6">
            {investmentAllocation.map((item) => (
              <div key={item.type} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-semibold text-sm text-slate-200 block mb-1">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatCurrency(item.amount ?? 0)}
                    </span>
                  </div>
                  <span className="font-black text-blue-400 text-lg">
                    {item.percentage ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden border border-white/[0.05]">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation reasoning */}
      {(explanation.reasoning?.length ?? 0) > 0 && (
        <div className="relative glass-card rounded-2xl p-6 md:p-8 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-200">Why This Allocation?</h3>
              <p className="text-sm text-slate-400">Key factors behind your personalized recommendation</p>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explanation.reasoning.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl border border-white/[0.05]"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
