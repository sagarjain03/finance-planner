/**
 * Smart Investment Suggestion Engine
 * Generates intelligent, explainable investment recommendations
 * based on risk profiling and financial metrics
 */

import { normalizePercentages, calculateRiskScore, generateInvestmentExplanation, RiskLevel } from "./scoring";

export interface InvestmentAllocationRaw {
  fdPercentage: number;
  rdPercentage: number;
  mfPercentage: number;
}

export interface InvestmentExplanation {
  summary: string;
  reasoning: string[];
  riskLevel: RiskLevel;
  strategy: string;
}

export interface SmartAllocationResult {
  allocation: InvestmentAllocationRaw;
  explanation: InvestmentExplanation;
}

/**
 * Calculate weighted investment allocation based on risk profile
 * Uses multiple factors to determine optimal distribution
 *
 * Weighted formula:
 * - Risk Level determines base allocation
 * - Goal Duration adjusts growth vs stability
 * - Savings Rate adjusts flexibility vs conservatism
 *
 * Edge cases handled:
 * - Negative savings: Conservative allocation
 * - Zero salary: Conservative allocation
 * - Very short goals: High safety allocation
 */
function calculateWeightedAllocation(
  riskScore: number,
  goalDuration: number,
  savingsRate: number
): InvestmentAllocationRaw {
  let fd = 30; // Base: Fixed Deposit (stable)
  let rd = 40; // Base: Recurring Deposit (semi-liquid)
  let mf = 30; // Base: Mutual Funds (growth)

  // RISK SCORE ADJUSTMENT (0-100 scale)
  // Low risk (0-40): Heavy FD/RD, minimal MF
  // Medium risk (40-70): Balanced FD/RD/MF
  // High risk (70-100): Heavy MF, moderate FD
  if (riskScore < 40) {
    fd = 50;
    rd = 40;
    mf = 10;
  } else if (riskScore < 70) {
    fd = 30;
    rd = 40;
    mf = 30;
  } else {
    fd = 15;
    rd = 25;
    mf = 60;
  }

  // GOAL DURATION ADJUSTMENT
  // Edge case: Very short goals (<6 months) need maximum safety
  if (goalDuration < 6) {
    fd = 70;
    rd = 30;
    mf = 0;
  }
  // Short-term (<12 months): Increase safety (FD/RD)
  else if (goalDuration < 12) {
    fd += 15;
    mf = Math.max(0, mf - 15);
  }
  // Medium-term (12-36 months): Balanced
  else if (goalDuration <= 36) {
    // Keep balanced
  }
  // Long-term (>36 months): Increase growth (MF)
  else {
    mf += 20;
    fd = Math.max(10, fd - 10);
  }

  // SAVINGS RATE ADJUSTMENT (higher savings = more risk capacity)
  // Very low savings (<10%): Maximum conservatism
  if (savingsRate < 10) {
    mf = Math.max(0, mf - 15);
    fd += 15;
    rd += 5;
  }
  // Low savings (<20%): Reduce risk
  else if (savingsRate < 20) {
    mf = Math.max(5, mf - 10);
    fd += 10;
  }
  // High savings (>50%): Increase risk
  else if (savingsRate > 50) {
    mf = Math.min(70, mf + 10);
    fd = Math.max(10, fd - 10);
  }

  // Normalize to ensure sum = 100%
  const normalized = normalizePercentages([fd, rd, mf]);

  return {
    fdPercentage: normalized[0],
    rdPercentage: normalized[1],
    mfPercentage: normalized[2],
  };
}

/**
 * Generate smart investment allocation with explanation
 * Main entry point for investment engine
 */
export function generateSmartAllocation(
  monthlySalary: number,
  monthlySavings: number,
  goalDuration: number,
  goalAmount: number,
  savingsRate: number,
  isAchievable: boolean
): SmartAllocationResult {
  // Step 1: Calculate risk profile
  const riskProfile = calculateRiskScore(
    monthlySalary,
    monthlySavings,
    goalDuration,
    goalAmount
  );

  // Step 2: Calculate weighted allocation
  const allocation = calculateWeightedAllocation(
    riskProfile.score,
    goalDuration,
    savingsRate
  );

  // Step 3: Generate explanation
  const explanation = generateInvestmentExplanation(
    riskProfile,
    goalDuration,
    savingsRate,
    isAchievable
  );

  return {
    allocation,
    explanation: {
      ...explanation,
      riskLevel: riskProfile.level,
    },
  };
}

/**
 * Convert raw allocation percentages to amounts
 */
export function convertAllocationToAmounts(
  allocation: InvestmentAllocationRaw,
  goalAmount: number
): Array<{ type: string; percentage: number; amount: number }> {
  return [
    {
      type: "Fixed Deposit (FD)",
      percentage: allocation.fdPercentage,
      amount: Math.round((goalAmount * allocation.fdPercentage) / 100 * 100) / 100,
    },
    {
      type: "Recurring Deposit (RD)",
      percentage: allocation.rdPercentage,
      amount: Math.round((goalAmount * allocation.rdPercentage) / 100 * 100) / 100,
    },
    {
      type: "Mutual Funds (MF)",
      percentage: allocation.mfPercentage,
      amount: Math.round((goalAmount * allocation.mfPercentage) / 100 * 100) / 100,
    },
  ];
}
