/**
 * Dashboard Types
 * Shared type for plan data consumed by all dashboard components
 */

export interface DashboardPlan {
  _id: string;
  monthlySalary: number;
  monthlyExpenses: number;
  needs?: number;
  wants?: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  goalAmount?: number;
  goalDuration?: number;
  isAchievable: boolean;
  monthsToReachGoal: number | null;
  investmentAllocation: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
  investmentExplanation: {
    summary: string;
    reasoning: string[];
    riskLevel: 'low' | 'medium' | 'high';
    strategy: string;
  };
  monthlyPlan: Array<{
    month: number;
    saved: number;
    cumulativeSavings: number;
  }>;
  message: string;
  aiInsights?: {
    summary: string;
    insights: string[];
    recommendations?: string[];
    motivation?: string;
  };
  taxData?: {
    oldRegimeTax: number;
    newRegimeTax: number;
    recommendedRegime: "old" | "new";
    potentialTaxSavings: number;
    utilized80C: number;
    effectiveTaxRate: number;
    netIncome: number;
  };
  budgetFeedback?: {
    needsStatus: "over" | "ideal" | "under";
    wantsStatus: "over" | "ideal" | "under";
    savingsStatus: "low" | "good" | "excellent";
    actualNeedsPct: number;
    actualWantsPct: number;
    actualSavingsPct: number;
    message: string;
  };
  achievement?: {
    unlocked: boolean;
    message: string;
  };
  goals?: Array<{
    id: string;
    name: string;
    amount: number;
    duration: number;
    createdAt: Date;
  }>;
  goalsAnalysis?: Array<{
    id: string;
    name: string;
    amount: number;
    duration: number;
    requiredMonthlySaving: number;
    currentSaving: number;
    gap: number;
    isAchievable: boolean;
    monthsToReachGoal: number | null;
    progressPercentage: number;
  }>;
  alerts?: Array<{
    type: "overspending" | "low_savings" | "goal_delay";
    message: string;
  }>;
  createdAt: string;
}
