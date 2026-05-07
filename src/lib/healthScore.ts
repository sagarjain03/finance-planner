import { FinancialPlanOutput } from "@/types/financial";

export interface HealthScoreFactors {
  savingsRateScore: number; // 0-30 points
  expenseRatioScore: number; // 0-25 points
  goalProgressScore: number; // 0-25 points
  taxEfficiencyScore: number; // 0-20 points
}

export interface HealthScoreResult {
  score: number; // 0-100
  grade: "Poor" | "Average" | "Good" | "Excellent";
  factors: HealthScoreFactors;
  breakdown: string;
  recommendations: string[];
}

/**
 * Calculate financial health score (0-100) based on key factors
 */
export function calculateHealthScore(
  plan: FinancialPlanOutput
): HealthScoreResult {
  const factors: HealthScoreFactors = {
    savingsRateScore: 0,
    expenseRatioScore: 0,
    goalProgressScore: 0,
    taxEfficiencyScore: 0,
  };

  // Factor 1: Savings Rate (0-30 points)
  // Target: 20%+
  if (plan.savingsRate >= 30) factors.savingsRateScore = 30;
  else if (plan.savingsRate >= 20) factors.savingsRateScore = 25;
  else if (plan.savingsRate >= 10) factors.savingsRateScore = 15;
  else if (plan.savingsRate >= 5) factors.savingsRateScore = 8;
  else factors.savingsRateScore = 0;

  // Factor 2: Expense Ratio (0-25 points)
  // Target: < 60% of income
  const expenseRatio = (plan.input.monthlyExpenses / plan.input.monthlySalary) * 100;
  if (expenseRatio <= 50) factors.expenseRatioScore = 25;
  else if (expenseRatio <= 60) factors.expenseRatioScore = 20;
  else if (expenseRatio <= 70) factors.expenseRatioScore = 12;
  else if (expenseRatio <= 80) factors.expenseRatioScore = 6;
  else factors.expenseRatioScore = 0;

  // Factor 3: Goal Progress (0-25 points)
  // Based on achievability and progress of goals
  if (plan.goalsAnalysis && plan.goalsAnalysis.length > 0) {
    const achievableGoals = plan.goalsAnalysis.filter((g) => g.isAchievable).length;
    const achievePercentage = (achievableGoals / plan.goalsAnalysis.length) * 100;
    const avgProgress =
      plan.goalsAnalysis.reduce((sum, g) => sum + g.progressPercentage, 0) /
      plan.goalsAnalysis.length;

    if (achievePercentage >= 80 && avgProgress >= 80) factors.goalProgressScore = 25;
    else if (achievePercentage >= 60 && avgProgress >= 60) factors.goalProgressScore = 18;
    else if (achievePercentage >= 40 && avgProgress >= 40) factors.goalProgressScore = 12;
    else if (achievePercentage >= 20) factors.goalProgressScore = 6;
    else factors.goalProgressScore = 0;
  }

  // Factor 4: Tax Efficiency (0-20 points)
  // Based on tax savings and recommended regime
  if (plan.taxData) {
    const taxSavingsPercentage =
      (plan.taxData.potentialTaxSavings / plan.input.monthlySalary) * 100;

    if (taxSavingsPercentage >= 15) factors.taxEfficiencyScore = 20;
    else if (taxSavingsPercentage >= 10) factors.taxEfficiencyScore = 15;
    else if (taxSavingsPercentage >= 5) factors.taxEfficiencyScore = 10;
    else factors.taxEfficiencyScore = 5;
  }

  const totalScore =
    factors.savingsRateScore +
    factors.expenseRatioScore +
    factors.goalProgressScore +
    factors.taxEfficiencyScore;

  // Determine grade
  let grade: "Poor" | "Average" | "Good" | "Excellent";
  if (totalScore >= 85) grade = "Excellent";
  else if (totalScore >= 70) grade = "Good";
  else if (totalScore >= 50) grade = "Average";
  else grade = "Poor";

  // Generate recommendations
  const recommendations: string[] = [];

  if (plan.savingsRate < 20) {
    recommendations.push(
      "Increase your savings rate to at least 20% of income"
    );
  }

  if (expenseRatio > 70) {
    recommendations.push("Review and reduce expenses to optimize budget");
  }

  if (plan.goalsAnalysis) {
    const unachievableGoals = plan.goalsAnalysis.filter(
      (g) => !g.isAchievable
    );
    if (unachievableGoals.length > 0) {
      recommendations.push(
        `${unachievableGoals.length} goal(s) need timeline extension or additional savings`
      );
    }
  }

  if (
    plan.taxData &&
    plan.taxData.potentialTaxSavings < plan.input.monthlySalary * 0.05
  ) {
    recommendations.push("Explore tax-saving investment options like ELSS");
  }

  return {
    score: Math.round(totalScore),
    grade,
    factors,
    breakdown: `${totalScore.toFixed(0)}/100 - ${grade}`,
    recommendations: recommendations.slice(0, 3), // Top 3 recommendations
  };
}

/**
 * Get color based on health score
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return "from-emerald-500 to-teal-500";
  if (score >= 70) return "from-blue-500 to-indigo-500";
  if (score >= 50) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-rose-500";
}

/**
 * Get text color based on grade
 */
export function getGradeColor(grade: string): string {
  if (grade === "Excellent") return "text-emerald-400";
  if (grade === "Good") return "text-blue-400";
  if (grade === "Average") return "text-yellow-400";
  return "text-red-400";
}
