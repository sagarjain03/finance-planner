"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FinancialPlanOutput } from "@/types/financial";
import { PageContainer } from "@/components/shared/PageContainer";
import { QuickStatsCards } from "@/components/shared/QuickStatsCards";
import { SmartAlertsCard } from "@/components/alerts/SmartAlertsCard";
import { AIInsightsPanel, AIInsightsLoadingState } from "@/components/insights/AIInsightsPanel";
import { WeeklySummary } from "@/components/insights/WeeklySummary";
import { HealthScoreCard } from "@/components/health/HealthScoreCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Zap } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

export default function InsightsPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<FinancialPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch("/api/plan");
        const data = await response.json();
        
        if (!data.success || !data.data?.latest) {
          router.push("/onboarding");
          return;
        }

        setPlan(data.data.latest);
      } catch (error) {
        console.error("Failed to load plan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, [router]);

  if (isLoading) {
    return (
      <PageContainer className="py-12">
        <AIInsightsLoadingState />
      </PageContainer>
    );
  }

  if (!plan) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <PageContainer className="py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Financial Insights & Analysis
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-8">
            AI-powered recommendations and detailed analysis of your financial progress.
          </p>
        </Reveal>

        {/* Quick Stats */}
        <Reveal delay={0.03}>
          <QuickStatsCards plan={plan} />
        </Reveal>

        {/* Health Score */}
        <Reveal className="max-w-2xl" delay={0.06}>
          <HealthScoreCard plan={plan} />
        </Reveal>

        {/* AI Insights Panel */}
        {plan.aiInsights && (
          <Reveal delay={0.09}>
            <AIInsightsPanel insights={plan.aiInsights} />
          </Reveal>
        )}

        {/* Monthly Summary */}
        <Reveal delay={0.12}>
          <WeeklySummary 
            monthlyPlan={plan?.monthlyPlan ?? []} 
            targetExpenses={plan?.input?.monthlyExpenses ?? 30000}
          />
        </Reveal>

        {/* Smart Alerts */}
        {plan.alerts && plan.alerts.length > 0 ? (
          <Reveal delay={0.15}>
            <SmartAlertsCard alerts={plan.alerts} />
          </Reveal>
        ) : (
          <Reveal delay={0.15}>
            <Card className="border-dashed border border-white/10 bg-white/3">
              <CardContent className="p-12 text-center">
                <div className="mb-4 inline-block p-3 rounded-full bg-white/5 border border-white/10">
                  <Zap className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Alerts</h3>
                <p className="text-slate-400">Your finances are looking good! Keep maintaining your budget.</p>
              </CardContent>
            </Card>
          </Reveal>
        )}
      </motion.div>
    </PageContainer>
  );
}
