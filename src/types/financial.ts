/**
 * Financial Types & Interfaces
 * Used for API requests, responses, and calculations
 */

export interface Goal {
  id: string;
  name: string;
  amount: number;
  duration: number; // in months
  createdAt: Date;
}

export interface Alert {
  type: "overspending" | "low_savings" | "goal_delay";
  message: string;
}

export interface FinancialPlanInput {
  monthlySalary: number;
  /** Needs (rent, food, bills) — replaces flat monthlyExpenses */
  needs: number;
  /** Wants (shopping, entertainment) */
  wants: number;
  /** Derived: needs + wants */
  monthlyExpenses: number;
  /** Legacy support */
  goalAmount?: number;
  /** Legacy support */
  goalDuration?: number;
  /** Phase 2: Multi-goal support */
  goals?: Goal[];
}

export interface BudgetFeedback {
  needsStatus: "over" | "ideal" | "under";
  wantsStatus: "over" | "ideal" | "under";
  savingsStatus: "low" | "good" | "excellent";
  actualNeedsPct: number;
  actualWantsPct: number;
  actualSavingsPct: number;
  message: string;
}

export interface Achievement {
  unlocked: boolean;
  message: string;
}

export interface MonthlySavingsData {
  month: number;
  saved: number;
  cumulativeSavings: number;
}

export interface InvestmentAllocation {
  type: string;
  percentage: number;
  amount: number;
}

export interface TaxData {
  oldRegimeTax: number;
  newRegimeTax: number;
  recommendedRegime: "old" | "new";
  potentialTaxSavings: number;
  utilized80C: number;
  effectiveTaxRate: number;
  netIncome: number;
}

export interface InvestmentExplanation {
  summary: string;
  reasoning: string[];
  riskLevel: "low" | "medium" | "high";
  strategy: string;
}

export interface GoalAnalysisResult {
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
}

export interface AIInsights {
  summary: string;
  insights: string[];
  recommendations: string[];
  motivation: string;
}

export interface FinancialPlanOutput {
  input: FinancialPlanInput;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  isAchievable: boolean;
  monthsToReachGoal: number | null;
  investmentAllocation: InvestmentAllocation[];
  investmentExplanation: InvestmentExplanation;
  monthlyPlan: MonthlySavingsData[];
  message: string;
  taxData: TaxData;
  budgetFeedback: BudgetFeedback;
  achievement: Achievement;
  aiInsights?: AIInsights;
  goalsAnalysis?: GoalAnalysisResult[];
  alerts?: Alert[];
  goalAmount?: number;
  goalDuration?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}
