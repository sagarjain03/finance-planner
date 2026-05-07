import {
  FinancialPlanInput,
  FinancialPlanOutput,
  MonthlySavingsData,
  InvestmentAllocation,
  BudgetFeedback,
  Achievement,
  GoalAnalysisResult,
  Goal,
} from "@/types/financial";
import { generateSmartAllocation, convertAllocationToAmounts } from "./investmentEngine";
import { optimizeTaxStrategy } from "./taxEngine";
import { generateAlerts } from "./alertsEngine";

// ─── 50/30/20 Ideal Targets ──────────────────────────────────────────────────
const IDEAL_NEEDS_PCT = 50;
const IDEAL_WANTS_PCT = 30;
const IDEAL_SAVINGS_PCT = 20;

/**
 * Generates a structured 50/30/20 budget feedback object.
 */
function generateBudgetFeedback(
  monthlySalary: number,
  needs: number,
  wants: number,
  monthlySavings: number
): BudgetFeedback {
  if (monthlySalary <= 0) {
    return {
      needsStatus: "ideal",
      wantsStatus: "ideal",
      savingsStatus: "low",
      actualNeedsPct: 0,
      actualWantsPct: 0,
      actualSavingsPct: 0,
      message: "Enter a valid salary to see budget feedback.",
    };
  }

  const actualNeedsPct = Math.round((needs / monthlySalary) * 100);
  const actualWantsPct = Math.round((wants / monthlySalary) * 100);
  const actualSavingsPct = Math.round((monthlySavings / monthlySalary) * 100);

  // Needs status
  let needsStatus: BudgetFeedback["needsStatus"];
  if (actualNeedsPct > IDEAL_NEEDS_PCT) needsStatus = "over";
  else if (actualNeedsPct < IDEAL_NEEDS_PCT - 10) needsStatus = "under";
  else needsStatus = "ideal";

  // Wants status
  let wantsStatus: BudgetFeedback["wantsStatus"];
  if (actualWantsPct > IDEAL_WANTS_PCT) wantsStatus = "over";
  else if (actualWantsPct < IDEAL_WANTS_PCT - 10) wantsStatus = "under";
  else wantsStatus = "ideal";

  // Savings status
  let savingsStatus: BudgetFeedback["savingsStatus"];
  if (actualSavingsPct >= 30) savingsStatus = "excellent";
  else if (actualSavingsPct >= IDEAL_SAVINGS_PCT) savingsStatus = "good";
  else savingsStatus = "low";

  // Human-readable summary message
  const messages: string[] = [];
  if (needsStatus === "over") messages.push("Your needs spending is above the recommended 50%.");
  if (wantsStatus === "over") messages.push("You're spending more than 30% on wants — consider trimming.");
  if (savingsStatus === "low") messages.push("Savings below 20% — try to reduce expenses.");
  if (savingsStatus === "excellent") messages.push("Excellent! You're saving over 30% of your income.");
  if (savingsStatus === "good" && messages.length === 0) messages.push("Good balance! You're following the 50/30/20 rule.");

  return {
    needsStatus,
    wantsStatus,
    savingsStatus,
    actualNeedsPct,
    actualWantsPct,
    actualSavingsPct,
    message: messages.join(" "),
  };
}

/**
 * Generates an achievement object based on savings rate.
 */
function generateAchievement(savingsRate: number): Achievement {
  if (savingsRate > 20) {
    return {
      unlocked: true,
      message: "🎉 Great job! You are saving more than the recommended 20%.",
    };
  }
  return {
    unlocked: false,
    message: "",
  };
}

/**
 * Calculates a comprehensive financial plan based on input data.
 * Supports both legacy single-goal and new multi-goal formats.
 */
export function calculateFinancialPlan(input: FinancialPlanInput): FinancialPlanOutput {
  const {
    monthlySalary,
    needs,
    wants,
    monthlyExpenses,
    goalAmount: legacyGoalAmount,
    goalDuration: legacyGoalDuration,
    goals: inputGoals,
  } = input;

  // Normalize goals. If no goals array, create one from legacy fields
  const goals: Goal[] = inputGoals && inputGoals.length > 0 
    ? inputGoals 
    : (legacyGoalAmount && legacyGoalDuration ? [{
        id: "legacy-goal",
        name: "Savings Goal",
        amount: legacyGoalAmount,
        duration: legacyGoalDuration,
        createdAt: new Date(),
      }] : []);

  // For overall plan fallback calculation (e.g. main charts), use the first goal or sum
  const primaryGoalAmount = goals.length > 0 ? goals.reduce((sum, g) => sum + g.amount, 0) : 0;
  // Use max duration for overall timeline
  const primaryGoalDuration = goals.length > 0 ? Math.max(...goals.map(g => g.duration)) : 1;

  // Calculate monthly and yearly savings
  const monthlySavings = monthlySalary - monthlyExpenses;
  const yearlySavings = monthlySavings * 12;

  // Calculate savings rate as percentage (handle divide-by-zero)
  const savingsRate = monthlySalary > 0 ? (monthlySavings / monthlySalary) * 100 : 0;

  // Multi-goal analysis
  // Simple heuristic: distribute monthly savings proportionally to the goal's monthly required saving
  const goalsAnalysis: GoalAnalysisResult[] = [];
  
  // Total required monthly saving across all goals
  const totalRequiredMonthly = goals.reduce((sum, g) => sum + (g.amount / g.duration), 0);

  goals.forEach(goal => {
    const requiredMonthlySaving = goal.amount / goal.duration;
    
    // Distribute actual monthly savings proportionally based on need
    const proportion = totalRequiredMonthly > 0 ? requiredMonthlySaving / totalRequiredMonthly : 0;
    const allocatedMonthlySaving = monthlySavings > 0 ? monthlySavings * proportion : 0;
    
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

  // Check if primary combined goal is achievable (legacy check)
  const totalPossibleSavings = monthlySavings * primaryGoalDuration;
  const isAchievable = monthlySavings > 0 && totalPossibleSavings >= primaryGoalAmount;

  // Calculate months needed to reach combined goal
  const monthsToReachGoal = monthlySavings > 0 ? Math.ceil(primaryGoalAmount / monthlySavings) : null;

  // Generate 12-month savings plan based on primary goal duration
  const monthlyPlan: MonthlySavingsData[] = generateMonthlySavingsPlan(
    monthlySavings,
    Math.min(12, primaryGoalDuration)
  );

  // Generate smart investment allocation with explanation
  const smartAllocationResult = generateSmartAllocation(
    monthlySalary,
    monthlySavings,
    primaryGoalDuration,
    primaryGoalAmount,
    savingsRate,
    isAchievable
  );

  // Convert raw percentages to amounts
  const investmentAllocation: InvestmentAllocation[] = convertAllocationToAmounts(
    smartAllocationResult.allocation,
    primaryGoalAmount
  );

  // Generate status message
  const message = isAchievable
    ? `Your goal is achievable! You'll reach ₹${primaryGoalAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} in approximately ${monthsToReachGoal} months.`
    : monthlySavings <= 0
    ? `Your expenses are equal to or greater than your salary. Please adjust your expenses to start saving.`
    : `Your combined goal may be challenging with current savings. Consider increasing income or reducing expenses.`;

  // Optimize tax strategy based on income and ELSS allocation
  const taxData = optimizeTaxStrategy(monthlySalary, investmentAllocation);

  // 50/30/20 budget feedback
  const budgetFeedback = generateBudgetFeedback(monthlySalary, needs, wants, monthlySavings);

  // Achievement system
  const achievement = generateAchievement(savingsRate);

  // Alerts system
  const alerts = generateAlerts(monthlySalary, needs, wants, monthlySavings, savingsRate, goalsAnalysis);

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
    budgetFeedback,
    achievement,
    goalsAnalysis,
    alerts,
    goalAmount: primaryGoalAmount,
    goalDuration: primaryGoalDuration,
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
