import { Receipt, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import { DashboardPlan } from "@/types/dashboard";

interface TaxStrategyCardProps {
  taxData?: DashboardPlan["taxData"];
}

const INR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function TaxStrategyCard({ taxData }: TaxStrategyCardProps) {
  if (!taxData) return null;

  const {
    oldRegimeTax,
    newRegimeTax,
    recommendedRegime,
    potentialTaxSavings,
    utilized80C,
    effectiveTaxRate,
    netIncome,
  } = taxData;

  const isNew = recommendedRegime === "new";

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden group">
      {/* Accent top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70" />
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 sm:p-8 z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <Receipt className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Tax Strategy</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your income &amp; investment allocation
            </p>
          </div>

          {/* Recommended badge */}
          <span
            className={`ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              isNew
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isNew ? "New Regime Recommended" : "Old Regime Recommended"}
          </span>
        </div>

        {/* Regime Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Old Regime */}
          <div
            className={`rounded-xl p-4 border transition-all ${
              !isNew
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-white/[0.02] border-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {!isNew && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              {isNew && <AlertCircle className="w-4 h-4 text-slate-500" />}
              <span className="text-sm font-semibold text-slate-300">
                Old Regime
              </span>
            </div>
            <p className="text-2xl font-black text-white">{INR(oldRegimeTax)}</p>
            <p className="text-xs text-slate-500 mt-1">Annual tax liability</p>
            {utilized80C > 0 && (
              <p className="text-xs text-amber-400 mt-2">
                80C utilized: {INR(utilized80C)}
              </p>
            )}
          </div>

          {/* New Regime */}
          <div
            className={`rounded-xl p-4 border transition-all ${
              isNew
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-white/[0.02] border-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isNew && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {!isNew && <AlertCircle className="w-4 h-4 text-slate-500" />}
              <span className="text-sm font-semibold text-slate-300">
                New Regime
              </span>
            </div>
            <p className="text-2xl font-black text-white">{INR(newRegimeTax)}</p>
            <p className="text-xs text-slate-500 mt-1">Annual tax liability</p>
            <p className="text-xs text-emerald-400 mt-2">
              Simplified slabs, no deductions
            </p>
          </div>
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-500 font-medium">
                Potential Savings
              </span>
            </div>
            <p className="text-xl font-black text-emerald-400">
              {INR(potentialTaxSavings)}
            </p>
            <p className="text-xs text-slate-600 mt-1">vs. other regime</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500 font-medium">
                Effective Rate
              </span>
            </div>
            <p className="text-xl font-black text-white">
              {effectiveTaxRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-600 mt-1">of yearly income</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-500 font-medium">
                Net Annual Income
              </span>
            </div>
            <p className="text-xl font-black text-white">{INR(netIncome)}</p>
            <p className="text-xs text-slate-600 mt-1">after tax</p>
          </div>
        </div>
      </div>
    </div>
  );
}
