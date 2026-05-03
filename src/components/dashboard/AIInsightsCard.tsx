import { Sparkles, ArrowRight } from "lucide-react";
import { DashboardPlan } from "@/types/dashboard";

interface AIInsightsCardProps {
  insights?: DashboardPlan['aiInsights'];
}

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  if (!insights || !insights.summary) {
    return null;
  }

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70" />

      <div className="relative p-6 sm:p-8 z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">
            Smart AI Insights
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0B0F17]/50 rounded-xl p-5 border border-white/[0.05] shadow-inner">
            <p className="text-slate-300 leading-relaxed font-medium">
              {insights.summary}
            </p>
          </div>
          
          {insights.insights && insights.insights.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Key Takeaways</h4>
              <ul className="space-y-4">
                {insights.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                    <span className="flex-shrink-0 mt-0.5 p-1 rounded-full bg-blue-500/10 text-blue-400">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="text-sm text-slate-300 leading-relaxed">
                      {insight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
