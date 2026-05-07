"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DashboardPlan } from "@/types/dashboard";
import { FinancialPlanOutput } from "@/types/financial";
import {
  calculateHealthScore,
  HealthScoreResult,
  getScoreColor,
  getGradeColor,
} from "@/lib/healthScore";
import { TrendingUp, AlertCircle } from "lucide-react";

interface HealthScoreCardProps {
  plan: DashboardPlan | FinancialPlanOutput;
}

export function HealthScoreCard({ plan }: HealthScoreCardProps) {
  const scoreResult = useMemo((): HealthScoreResult => {
    // Handle both DashboardPlan and FinancialPlanOutput types
    // DashboardPlan has fields at root level, FinancialPlanOutput has input nested
    const monthlySalary = 'monthlySalary' in plan ? plan.monthlySalary : (plan as any).input?.monthlySalary || 0;
    const monthlyExpenses = 'monthlyExpenses' in plan ? plan.monthlyExpenses : (plan as any).input?.monthlyExpenses || 0;
    const needs = 'needs' in plan ? plan.needs : (plan as any).input?.needs || 0;
    const wants = 'wants' in plan ? plan.wants : (plan as any).input?.wants || 0;
    const taxData = plan.taxData || {
      oldRegimeTax: 0,
      newRegimeTax: 0,
      recommendedRegime: "new" as const,
      potentialTaxSavings: 0,
      utilized80C: 0,
      effectiveTaxRate: 0,
      netIncome: monthlySalary,
    };
    
    // Convert to FinancialPlanOutput structure for health score calculation
    const convertedPlan: FinancialPlanOutput = {
      input: {
        monthlySalary,
        monthlyExpenses,
        goals: [],
        needs: needs,
        wants: wants,
      },
      monthlySavings: plan.monthlySavings,
      yearlySavings: plan.yearlySavings,
      savingsRate: plan.savingsRate,
      isAchievable: plan.isAchievable,
      monthsToReachGoal: null,
      investmentAllocation: 'investmentAllocation' in plan ? plan.investmentAllocation : [],
      investmentExplanation: 'investmentExplanation' in plan ? plan.investmentExplanation : {
        summary: "",
        reasoning: [],
        riskLevel: "medium" as const,
        strategy: "",
      },
      monthlyPlan: 'monthlyPlan' in plan ? plan.monthlyPlan : [],
      message: "",
      taxData,
      budgetFeedback: 'budgetFeedback' in plan && plan.budgetFeedback ? plan.budgetFeedback : {
        needsStatus: "ideal" as const,
        wantsStatus: "ideal" as const,
        savingsStatus: "good" as const,
        actualNeedsPct: 0,
        actualWantsPct: 0,
        actualSavingsPct: 0,
        message: "",
      },
      achievement: 'achievement' in plan && plan.achievement ? plan.achievement : { unlocked: false, message: "" },
      goalsAnalysis: 'goalsAnalysis' in plan ? plan.goalsAnalysis : undefined,
      alerts: 'alerts' in plan ? plan.alerts : undefined,
    };

    return calculateHealthScore(convertedPlan);
  }, [plan]);
// "bg-[#0B0F17]/90 border border-white/[0.1]
  return (
    <Card className="bg-white bg-[#0B0F17]/90 border border-white/[0.1]backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Circle */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress circle with conic gradient */}
              <defs>
                <style>{`
                  @keyframes gradientRotation {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(scoreResult.score / 100) * 282.7} 282.7`}
                strokeLinecap="round"
                className="text-zinc-800 transition-all duration-500"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-4xl font-black ${getGradeColor(scoreResult.grade)}`}>
                {scoreResult.score}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">out of 100</p>
            </div>
          </div>

          <div className="text-center">
            <p className={`text-2xl font-bold ${getGradeColor(scoreResult.grade)}`}>
              {scoreResult.grade}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your financial health rating</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-gray-200">Score Breakdown</h4>

          {[
            {
              label: "Savings Rate",
              points: scoreResult.factors.savingsRateScore,
              max: 30,
            },
            {
              label: "Expense Ratio",
              points: scoreResult.factors.expenseRatioScore,
              max: 25,
            },
            {
              label: "Goal Progress",
              points: scoreResult.factors.goalProgressScore,
              max: 25,
            },
            {
              label: "Tax Efficiency",
              points: scoreResult.factors.taxEfficiencyScore,
              max: 20,
            },
          ].map((factor) => (
            <div key={factor.label} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{factor.label}</span>
                <span className="text-indigo-400 font-semibold">
                  {factor.points}/{factor.max}
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                  style={{
                    width: `${(factor.points / factor.max) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {scoreResult.recommendations.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-gray-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {scoreResult.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-gray-300 flex gap-2">
                  <span className="text-indigo-400 shrink-0">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
