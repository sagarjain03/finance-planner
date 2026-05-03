import { InvestmentAllocation } from "@/types/financial";

export interface TaxData {
  oldRegimeTax: number;
  newRegimeTax: number;
  recommendedRegime: "old" | "new";
  potentialTaxSavings: number;
  utilized80C: number;
  effectiveTaxRate: number;
  netIncome: number;
}

/**
 * Calculates tax based on the New Tax Regime slabs
 * Includes standard deduction of 50k and 87A rebate
 */
function calculateNewRegimeTax(yearlyIncome: number): number {
  // Standard deduction
  let taxableIncome = Math.max(0, yearlyIncome - 50000);

  // 87A Rebate: if taxable income <= 7L, tax is 0
  if (taxableIncome <= 700000) {
    return 0;
  }

  let tax = 0;

  // Slabs for New Regime
  // 0-3L -> 0%
  // 3-6L -> 5%
  // 6-9L -> 10%
  // 9-12L -> 15%
  // 12-15L -> 20%
  // 15L+ -> 30%

  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.3;
    taxableIncome = 1500000;
  }
  if (taxableIncome > 1200000) {
    tax += (taxableIncome - 1200000) * 0.2;
    taxableIncome = 1200000;
  }
  if (taxableIncome > 900000) {
    tax += (taxableIncome - 900000) * 0.15;
    taxableIncome = 900000;
  }
  if (taxableIncome > 600000) {
    tax += (taxableIncome - 600000) * 0.1;
    taxableIncome = 600000;
  }
  if (taxableIncome > 300000) {
    tax += (taxableIncome - 300000) * 0.05;
  }

  // Adding 4% Health and Education Cess
  return Math.round(tax * 1.04);
}

/**
 * Calculates tax based on the Old Tax Regime slabs
 * Accounts for 80C deductions
 */
function calculateOldRegimeTax(yearlyIncome: number, utilized80C: number): number {
  // Standard deduction
  let taxableIncome = Math.max(0, yearlyIncome - 50000);
  
  // Apply 80C deduction
  taxableIncome = Math.max(0, taxableIncome - utilized80C);

  // 87A Rebate: if taxable income <= 5L under old regime, tax is 0
  if (taxableIncome <= 500000) {
    return 0;
  }

  let tax = 0;

  // Slabs for Old Regime (Below 60 years)
  // 0-2.5L -> 0%
  // 2.5-5L -> 5%
  // 5-10L -> 20%
  // 10L+ -> 30%

  if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.3;
    taxableIncome = 1000000;
  }
  if (taxableIncome > 500000) {
    tax += (taxableIncome - 500000) * 0.2;
    taxableIncome = 500000;
  }
  if (taxableIncome > 250000) {
    tax += (taxableIncome - 250000) * 0.05;
  }

  // Adding 4% Health and Education Cess
  return Math.round(tax * 1.04);
}

/**
 * Optimizes the tax strategy by computing both regimes,
 * identifying pure 80C from investments (ELSS),
 * and returning the structured tax data.
 */
export function optimizeTaxStrategy(
  monthlySalary: number,
  investmentAllocation: InvestmentAllocation[]
): TaxData {
  const yearlyIncome = monthlySalary * 12;

  // 1. Identify 80C from ELSS
  // Assuming ELSS is labeled as 'ELSS' or 'Mutual Funds' (if all MFs are ELSS) in allocation.
  // The investmentEngine uses 'Mutual Funds' as the key.
  const mfAllocation = investmentAllocation.find(
    (a) => a.type === "Mutual Funds" || a.type === "ELSS"
  );
  
  // Convert monthly MF investment to yearly
  const yearlyMFInvestment = mfAllocation ? mfAllocation.amount * 12 : 0;
  
  // Max 80C limit is 1.5L
  const utilized80C = Math.min(yearlyMFInvestment, 150000);

  // 2. Calculate both regimes
  const newRegimeTax = calculateNewRegimeTax(yearlyIncome);
  const oldRegimeTax = calculateOldRegimeTax(yearlyIncome, utilized80C);

  // 3. Compare and recommend
  const recommendedRegime = newRegimeTax <= oldRegimeTax ? "new" : "old";
  const actualTax = recommendedRegime === "new" ? newRegimeTax : oldRegimeTax;
  
  // Potential savings if they chose the optimal one vs the non-optimal one
  const potentialTaxSavings = Math.abs(oldRegimeTax - newRegimeTax);

  const effectiveTaxRate = yearlyIncome > 0 ? (actualTax / yearlyIncome) * 100 : 0;
  const netIncome = yearlyIncome - actualTax;

  return {
    oldRegimeTax,
    newRegimeTax,
    recommendedRegime,
    potentialTaxSavings,
    utilized80C,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100, // round to 2 decimal places
    netIncome,
  };
}
