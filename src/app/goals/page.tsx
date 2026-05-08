"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FinancialPlanOutput } from "@/types/financial";
import { PageContainer } from "@/components/shared/PageContainer";
import { GoalList } from "@/components/goals/GoalList";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/empty/EmptyState";
import { Target, TrendingUp, Award, Plus } from "lucide-react";

export default function GoalsPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<(FinancialPlanOutput & { _id?: string }) | null>(null);
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

  const hasGoals = plan.goalsAnalysis && plan.goalsAnalysis.length > 0;
  const completedGoals = hasGoals ? plan.goalsAnalysis!.filter(g => g.isAchievable).length : 0;
  const totalGoalAmount = hasGoals ? plan.goalsAnalysis!.reduce((sum, g) => sum + g.amount, 0) : 0;

  return (
    <PageContainer className="py-12">
      <div className="space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-3">Your Financial Goals</h1>
              <p className="text-lg text-zinc-400">
                Track your savings targets and monitor progress towards your dreams
              </p>
            </div>
            <Button 
              onClick={() => router.push("/onboarding?edit=true&id=" + (plan?._id || ''))}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50 h-12 px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manage Goals
            </Button>
          </div>
        </motion.div>

        {/* Goal Stats */}
        {hasGoals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className=" pt-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">Total Goal Amount</p>
                    <p className="text-3xl font-black text-zinc-900 dark:text-white mt-2">
                      ₹{totalGoalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <Target className="w-12 h-12 text-indigo-500/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="pt-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">Total Goals</p>
                    <p className="text-3xl font-black text-zinc-900 dark:text-white mt-2">
                      {plan.goalsAnalysis?.length || 0}
                    </p>
                  </div>
                  <Award className="w-12 h-12 text-purple-500/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="pt-4 bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">Achievable Goals</p>
                    <p className="text-3xl font-black text-emerald-500 mt-2">
                      {completedGoals}/{plan.goalsAnalysis?.length || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-emerald-500/20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Goals List or Empty State */}
        {hasGoals ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GoalList goals={plan.goalsAnalysis || []} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EmptyState
              icon={Target}
              title="No Goals Yet"
              description="Create your first financial goal to start tracking your progress towards your dreams"
              action={{
                label: "Create Your First Goal",
                onClick: () => router.push("/onboarding?edit=true&id=" + (plan?._id || '')),
              }}
            />
          </motion.div>
        )}
      </div>
    </PageContainer>
  );
}
