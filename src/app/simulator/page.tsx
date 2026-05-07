"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FinancialPlanOutput, GoalAnalysisResult } from "@/types/financial";
import { PageContainer } from "@/components/shared/PageContainer";
import { QuickStatsCards } from "@/components/shared/QuickStatsCards";
import { SimulatorControls } from "@/components/simulator/SimulatorControls";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";

export default function SimulatorPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<FinancialPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedSalary, setSimulatedSalary] = useState<number>(50000);
  const [simulatedExpenses, setSimulatedExpenses] = useState<number>(30000);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch("/api/plan");
        const data = await response.json();
        
        if (!data.success || !data.data?.latest) {
          router.push("/onboarding");
          return;
        }

        const latestPlan = data.data.latest;
        setPlan(latestPlan);
        setSimulatedSalary(latestPlan.input?.monthlySalary || latestPlan.monthlySalary || 50000);
        setSimulatedExpenses(latestPlan.input?.monthlyExpenses || latestPlan.monthlyExpenses || 30000);
      } catch (error) {
        console.error("Failed to load plan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, [router]);

  // Calculate simulated goals based on simulated salary and expenses
  const simulatedAnalysis = useMemo(() => {
    if (!plan) return [];

    const simulatedMonthlySavings = simulatedSalary - simulatedExpenses;
    const goals = plan.input?.goals || [];
    
    const goalsAnalysis: GoalAnalysisResult[] = [];
    const totalRequiredMonthly = goals.reduce((sum, g) => sum + (g.amount / g.duration), 0);

    goals.forEach(goal => {
      const requiredMonthlySaving = goal.amount / goal.duration;
      const proportion = totalRequiredMonthly > 0 ? requiredMonthlySaving / totalRequiredMonthly : 0;
      const allocatedMonthlySaving = simulatedMonthlySavings > 0 ? simulatedMonthlySavings * proportion : 0;
      
      const gap = requiredMonthlySaving - allocatedMonthlySaving;
      const isAchievable = allocatedMonthlySaving >= requiredMonthlySaving;
      const monthsToReachGoal = allocatedMonthlySaving > 0 ? Math.ceil(goal.amount / allocatedMonthlySaving) : null;
      const progressPercentage = goal.duration > 0 ? Math.min(100, Math.round((allocatedMonthlySaving / requiredMonthlySaving) * 100)) : 0;

      goalsAnalysis.push({
        id: goal.id,
        name: goal.name,
        amount: goal.amount,
        duration: goal.duration,
        requiredMonthlySaving,
        currentSaving: allocatedMonthlySaving,
        gap: gap > 0 ? gap : 0,
        isAchievable,
        monthsToReachGoal,
        progressPercentage,
      });
    });

    return goalsAnalysis;
  }, [plan, simulatedSalary, simulatedExpenses]);

  const simulatedSavingsRate = simulatedSalary > 0 
    ? ((simulatedSalary - simulatedExpenses) / simulatedSalary) * 100 
    : 0;

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

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </PageContainer>
    );
  }

  if (!plan) return null;

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
            Advanced What-If Simulator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Experiment with different financial scenarios. Adjust salary, expenses, or savings to see impact on your goals and financial health.
          </p>
        </motion.div>

        {/* Quick Info Cards */}
        <motion.div variants={itemVariants}>
          <QuickStatsCards
            salary={simulatedSalary}
            expenses={simulatedExpenses}
            showSavingsRate={true}
          />
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <SimulatorControls
            monthlySalary={simulatedSalary}
            monthlyExpenses={simulatedExpenses}
            savingsRate={simulatedSavingsRate}
            onSalaryChange={setSimulatedSalary}
            onExpensesChange={setSimulatedExpenses}
            onSavingsRateChange={() => {}} // Not used in new version
          />
        </motion.div>

        {/* Results */}
        <motion.div variants={itemVariants}>
          <SimulatorResults
            originalPlan={plan}
            simulatedGoals={simulatedAnalysis}
            simulatedSavingsRate={simulatedSavingsRate}
          />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
