import { Alert, GoalAnalysisResult } from "@/types/financial";

export function generateAlerts(
  monthlySalary: number,
  needs: number,
  wants: number,
  monthlySavings: number,
  savingsRate: number,
  goalsAnalysis: GoalAnalysisResult[]
): Alert[] {
  const alerts: Alert[] = [];

  // Overspending alert
  const totalExpenses = needs + wants;
  if (totalExpenses > monthlySalary * 0.8) {
    alerts.push({
      type: "overspending",
      message: `You are spending ${Math.round((totalExpenses / monthlySalary) * 100)}% of your salary. Consider reducing your 'wants' to increase savings.`,
    });
  }

  // Low savings alert
  if (savingsRate < 10 && monthlySalary > 0) {
    alerts.push({
      type: "low_savings",
      message: `Your savings rate is very low (${Math.round(savingsRate)}%). Try to aim for at least 20%.`,
    });
  }

  // Goal delay warning
  const unachievableGoals = goalsAnalysis.filter((g) => !g.isAchievable);
  if (unachievableGoals.length > 0) {
    const names = unachievableGoals.map((g) => g.name).join(", ");
    alerts.push({
      type: "goal_delay",
      message: `At your current savings rate, you will not reach: ${names}. Consider extending the timeline or increasing savings.`,
    });
  }

  return alerts;
}
