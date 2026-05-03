import {
  FinancialPlanInput,
  FinancialPlanOutput,
  MonthlySavingsData,
  InvestmentAllocation,
} from "@/types/financial";
import { generateSmartAllocation, convertAllocationToAmounts } from "./investmentEngine";
import { optimizeTaxStrategy } from "./taxEngine";

export function calculateFinancialPlan(input: FinancialPlanInput): FinancialPlanOutput {
  const {
    monthlySalary,
    monthlyExpenses,
    goalAmount,
    goalDuration,
  } = input;

  // Calculate monthly and yearly savings
  const monthlySavings = monthlySalary - monthlyExpenses;
  const yearlySavings = monthlySavings * 12;

  // Calculate savings rate as percentage (handle divide-by-zero)
  const savingsRate = monthlySalary > 0 ? (monthlySavings / monthlySalary) * 100 : 0;

  // Check if goal is achievable
  const totalPossibleSavings = monthlySavings * goalDuration;
  const isAchievable = monthlySavings > 0 && totalPossibleSavings >= goalAmount;

  // Calculate months needed to reach goal (handle divide-by-zero)
  const monthsToReachGoal = monthlySavings > 0 ? Math.ceil(goalAmount / monthlySavings) : null;

  // Generate 12-month savings plan
  const monthlyPlan: MonthlySavingsData[] = generateMonthlySavingsPlan(
    monthlySavings,
    Math.min(12, goalDuration)
  );

  // Generate smart investment allocation with explanation
  const smartAllocationResult = generateSmartAllocation(
    monthlySalary,
    monthlySavings,
    goalDuration,
    goalAmount,
    savingsRate,
    isAchievable
  );

  // Convert raw percentages to amounts
  const investmentAllocation: InvestmentAllocation[] = convertAllocationToAmounts(
    smartAllocationResult.allocation,
    goalAmount
  );

  // Generate status message
  const message = isAchievable
    ? `Your goal is achievable! You'll reach $${goalAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} in approximately ${monthsToReachGoal} months.`
    : monthlySavings <= 0
    ? `Your expenses are equal to or greater than your salary. Please adjust your expenses to start saving.`
    : `Your goal may be challenging with current savings. Consider increasing income or reducing expenses.`;

  // Optimize tax strategy based on income and ELSS allocation
  const taxData = optimizeTaxStrategy(monthlySalary, investmentAllocation);

  return {
    input,
    monthlySavings,
    yearlySavings,
    savingsRate,
    isAchievable,
    monthsToReachGoal,
    investmentAllocation,
    investmentExplanation: smartAllocationResult.explanation,
    monthlyPlan,
    message,
    taxData,
  };
}

export function generateMonthlySavingsPlan(
  monthlySavings: number,
  months: number
): MonthlySavingsData[] {
  const plan: MonthlySavingsData[] = [];
  let cumulativeSavings = 0;

  for (let month = 1; month <= months; month++) {
    cumulativeSavings += monthlySavings;
    plan.push({
      month,
      saved: monthlySavings,
      cumulativeSavings: Math.round(cumulativeSavings * 100) / 100,
    });
  }

  return plan;
}
