/**
 * Scoring Utilities for Risk Assessment & Allocation Normalization
 * Used by investmentEngine to make data-driven decisions
 */

export type RiskLevel = "low" | "medium" | "high";

export interface RiskProfile {
  level: RiskLevel;
  score: number;
  factors: string[];
}

/**
 * Normalize percentages to ensure they sum to 100%
 * Used to fix rounding errors in allocation calculations
 */
export function normalizePercentages(values: number[]): number[] {
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === 0) return values;

  const normalized = values.map((v) => (v / sum) * 100);
  const rounded = normalized.map((v) => Math.round(v));

  // Fix rounding errors: if sum != 100, adjust largest value
  const currentSum = rounded.reduce((a, b) => a + b, 0);
  if (currentSum !== 100) {
    const diff = 100 - currentSum;
    const maxIndex = rounded.indexOf(Math.max(...rounded));
    rounded[maxIndex] += diff;
  }

  return rounded;
}

/**
 * Calculate risk score based on financial metrics
 * Factors:
 * - Savings rate (higher = less risk since more buffer)
 * - Goal duration (shorter = lower risk, longer = higher risk tolerance)
 * - Monthly savings (higher = more capacity for risk)
 */
export function calculateRiskScore(
  monthlySalary: number,
  monthlySavings: number,
  goalDuration: number,
  goalAmount: number
): RiskProfile {
  const factors: string[] = [];
  let score = 50; // Base score of 50 (neutral)

  // Handle edge case: zero salary (should not happen due to validation, but be safe)
  if (monthlySalary <= 0 || monthlySavings < 0) {
    return {
      level: "low",
      score: 20,
      factors: ["Zero or negative savings requires maximum conservatism"],
    };
  }

  // Factor 1: Savings Rate (0-25 points)
  const savingsRate = (monthlySavings / monthlySalary) * 100;
  if (savingsRate >= 60) {
    score += 15;
    factors.push("High savings rate (60%+) indicates financial stability");
  } else if (savingsRate >= 40) {
    score += 8;
    factors.push("Good savings rate (40-60%) shows discipline");
  } else if (savingsRate >= 20) {
    score -= 5;
    factors.push("Moderate savings rate (20-40%) limits risk capacity");
  } else {
    score -= 15;
    factors.push("Low savings rate (<20%) requires conservative approach");
  }

  // Factor 2: Time Horizon (0-25 points)
  if (goalDuration > 60) {
    score += 20;
    factors.push("Long-term goal (>5 years) allows growth-focused strategy");
  } else if (goalDuration > 36) {
    score += 12;
    factors.push("Medium-long term goal (3-5 years) supports balanced growth");
  } else if (goalDuration > 12) {
    score += 5;
    factors.push("Medium-term goal (1-3 years) requires stability focus");
  } else {
    score -= 10;
    factors.push("Short-term goal (<12 months) requires conservative approach");
  }

  // Factor 3: Monthly Savings Amount (0-15 points)
  const monthlyBuffer = monthlySavings * 3; // Assume 3-month emergency fund
  const urgencyRatio = monthlyBuffer > 0 ? goalAmount / monthlyBuffer : Infinity;

  if (urgencyRatio < 50) {
    score += 12;
    factors.push("Large monthly savings relative to goal");
  } else if (urgencyRatio < 100) {
    score += 5;
    factors.push("Moderate savings relative to goal");
  } else {
    score -= 5;
    factors.push("Goal is large relative to savings capacity");
  }

  // Factor 4: Achievability Buffer (0-15 points)
  const totalPossibleSavings = monthlySavings * goalDuration;
  const bufferPercentage = totalPossibleSavings > 0
    ? ((totalPossibleSavings - goalAmount) / goalAmount) * 100
    : -100;

  if (bufferPercentage > 50) {
    score += 10;
    factors.push("Strong achievability buffer allows for growth investments");
  } else if (bufferPercentage > 0) {
    score += 3;
    factors.push("Adequate buffer to reach goal with moderate growth");
  } else {
    score -= 8;
    factors.push("Tight goal requires focus on capital preservation");
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine risk level based on score
  let level: RiskLevel;
  if (score >= 65) {
    level = "high";
  } else if (score >= 40) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    level,
    score,
    factors,
  };
}

/**
 * Generate investment explanation based on risk profile
 * User-friendly, structured explanation of why this allocation was recommended
 */
export function generateInvestmentExplanation(
  riskProfile: RiskProfile,
  goalDuration: number,
  savingsRate: number,
  isAchievable: boolean
): {
  summary: string;
  reasoning: string[];
  strategy: string;
} {
  const reasoning: string[] = [];

  // Add risk-level specific reasoning
  if (riskProfile.level === "low") {
    reasoning.push(
      `Your conservative risk profile suggests prioritizing capital preservation through Fixed Deposits (FD) and Recurring Deposits (RD)`
    );
  } else if (riskProfile.level === "medium") {
    reasoning.push(
      `Your balanced risk profile allows a mix of stable instruments (FD/RD) and growth assets (Mutual Funds)`
    );
  } else {
    reasoning.push(
      `Your strong financial position allows significant allocation to growth-focused investments like Mutual Funds`
    );
  }

  // Add goal-duration specific reasoning
  if (goalDuration < 12) {
    reasoning.push(
      `Since your goal is short-term (${goalDuration} months), safer instruments are prioritized to prevent capital loss`
    );
  } else if (goalDuration <= 36) {
    reasoning.push(
      `Your medium-term goal (${goalDuration} months) benefits from balanced growth while maintaining stability`
    );
  } else {
    reasoning.push(
      `Your long-term goal (${goalDuration} months) provides adequate time for market recovery and compound growth`
    );
  }

  // Add savings-rate specific reasoning
  if (savingsRate >= 50) {
    reasoning.push(
      `Your high savings rate (${savingsRate.toFixed(1)}%) provides flexibility for strategic adjustments during market downturns`
    );
  } else if (savingsRate >= 30) {
    reasoning.push(
      `Your healthy savings rate (${savingsRate.toFixed(1)}%) enables moderate exposure to growth instruments`
    );
  } else {
    reasoning.push(
      `Your savings rate (${savingsRate.toFixed(1)}%) requires focus on consistent, lower-volatility investments`
    );
  }

  // Add achievability reasoning
  if (isAchievable) {
    reasoning.push(
      `Your goal is achievable with current savings, allowing for a recommended allocation that balances growth and stability`
    );
  } else {
    reasoning.push(
      `Your goal is challenging, so this allocation prioritizes capital preservation while exploring optimization opportunities`
    );
  }

  // Generate summary
  const summaryMap: Record<RiskLevel, string> = {
    low: "Conservative approach focused on capital protection",
    medium: "Balanced strategy mixing stability and growth",
    high: "Growth-focused allocation with long-term wealth building",
  };

  // Generate strategy
  const strategyMap: Record<RiskLevel, string> = {
    low: "Preserve capital while meeting your goal through reliable, lower-risk investments",
    medium: "Balance growth potential with stability to achieve your goal with moderate confidence",
    high: "Maximize growth potential over your investment horizon with diversified, higher-return instruments",
  };

  return {
    summary: summaryMap[riskProfile.level],
    reasoning,
    strategy: strategyMap[riskProfile.level],
  };
}
