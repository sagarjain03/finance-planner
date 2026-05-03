/**
 * Dashboard Types
 * Shared type for plan data consumed by all dashboard components
 */

export interface DashboardPlan {
  _id: string;
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  goalAmount: number;
  goalDuration: number;
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
  createdAt: string;
}
