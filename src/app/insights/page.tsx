"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FinancialPlanOutput } from "@/types/financial";
import { PageContainer } from "@/components/shared/PageContainer";
import { QuickStatsCards } from "@/components/shared/QuickStatsCards";
import { SmartAlertsCard } from "@/components/alerts/SmartAlertsCard";
import { AIInsightsPanel } from "@/components/insights/AIInsightsPanel";
import { WeeklySummary } from "@/components/insights/WeeklySummary";
import { HealthScoreCard } from "@/components/health/HealthScoreCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Zap } from "lucide-react";

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
      <PageContainer className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3">
            Financial Insights & Analysis
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            AI-powered recommendations and detailed analysis of your financial progress
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <QuickStatsCards plan={plan} />
        </motion.div>

        {/* Health Score */}
        <motion.div variants={itemVariants} className="max-w-2xl">
          <HealthScoreCard plan={plan} />
        </motion.div>

        {/* AI Insights Panel */}
        {plan.aiInsights && (
          <motion.div variants={itemVariants}>
            <AIInsightsPanel insights={plan.aiInsights} />
          </motion.div>
        )}

        {/* Monthly Summary */}
        <motion.div variants={itemVariants}>
          <WeeklySummary 
            monthlyPlan={plan?.monthlyPlan ?? []} 
            targetExpenses={plan?.input?.monthlyExpenses ?? 30000}
          />
        </motion.div>

        {/* Smart Alerts */}
        {plan.alerts && plan.alerts.length > 0 ? (
          <motion.div variants={itemVariants}>
            <SmartAlertsCard alerts={plan.alerts} />
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-dashed border-2 border-emerald-300 dark:border-emerald-700">
              <CardContent className="p-12 text-center">
                <div className="mb-4 inline-block p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Zap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Alerts</h3>
                <p className="text-slate-600 dark:text-slate-400">Your finances are looking good! Keep maintaining your budget.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
