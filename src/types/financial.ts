/**
 * Financial Types & Interfaces
 * Used for API requests, responses, and calculations
 */

export interface FinancialPlanInput {
  monthlySalary: number;
  monthlyExpenses: number;
  goalAmount: number;
  goalDuration: number;
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
