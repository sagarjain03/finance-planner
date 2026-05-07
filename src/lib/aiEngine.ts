import Groq from "groq-sdk";
import { calculateHealthScore } from "./healthScore";

// Initialize Groq client. It will automatically use process.env.GROQ_API_KEY
// We set a dummy key to prevent crashes if it's missing, but the API call will fail gracefully later.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

export interface AIInsights {
  summary: string;
  insights: string[];
  recommendations: string[];
  motivation: string;
}

interface FinancialData {
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  goalAmount: number;
  goalDuration: number;
  investmentAllocation: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
  taxData: {
    oldRegimeTax: number;
    newRegimeTax: number;
    recommendedRegime: "old" | "new";
    potentialTaxSavings: number;
    utilized80C: number;
    effectiveTaxRate: number;
  };
  goals?: Array<{ name: string; amount: number; duration: number; id: string }>;
  alerts?: Array<{ type: string; message: string }>;
  healthScore?: number;
  healthGrade?: string;
}

const FALLBACK_INSIGHTS: AIInsights = {
  summary: "Your financial plan looks solid. You are on track to meet your goals by saving consistently.",
  insights: [
    "Keep your expenses strictly to the planned budget to ensure consistent savings.",
    "Invest your allocated amounts early in the month to benefit from compounding.",
    "Review your financial goals and plan every 6 months to adjust for life changes.",
  ],
  recommendations: [
    "Build an emergency fund of 3-6 months of expenses",
    "Automate your savings to ensure consistency",
    "Review your insurance coverage periodically",
  ],
  motivation: "You're building a strong financial foundation. Keep up the great work!"
};

export async function generateFinancialInsights(
  data: FinancialData
): Promise<AIInsights> {
  // If the key is specifically "dummy_key_replace_me" or "dummy_key", don't even try to call the API
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("dummy")) {
    console.warn("Groq API Key is missing or dummy. Using fallback AI insights.");
    return FALLBACK_INSIGHTS;
  }

  const healthContext = data.healthScore 
    ? `Current Financial Health Score: ${data.healthScore}/100 (${data.healthGrade})` 
    : "Health score calculation pending";

  const prompt = `
You are an expert financial advisor. Provide personalized, actionable financial guidance in simple language for a beginner.

User Financial Profile:
- Monthly Salary: ₹${data.monthlySalary}
- Monthly Expenses: ₹${data.monthlyExpenses}
- Monthly Savings: ₹${data.monthlySavings}
- Savings Rate: ${data.savingsRate.toFixed(1)}%
- Yearly Savings: ₹${data.yearlySavings}
- ${healthContext}

Goals:
${data.goals && data.goals.length > 0 
  ? data.goals.map(g => `- ${g.name}: ₹${g.amount} in ${g.duration} months`).join('\n')
  : `- Primary Goal: ₹${data.goalAmount} in ${data.goalDuration} months`}

Active Alerts:
${data.alerts && data.alerts.length > 0 
  ? data.alerts.map(a => `- ⚠️ ${a.message}`).join('\n')
  : '- ✓ No active alerts. Budget is well-balanced.'}

Investment Allocation:
${data.investmentAllocation.map((alloc) => `- ${alloc.type}: ${alloc.percentage}% (₹${alloc.amount})`).join("\n")}

Tax Optimization:
- Recommended Regime: ${data.taxData.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
- 80C Deduction Utilized: ₹${data.taxData.utilized80C}
- Potential Tax Savings: ₹${data.taxData.potentialTaxSavings}
- Effective Tax Rate: ${data.taxData.effectiveTaxRate}%

Respond ONLY with a valid JSON object matching this exact structure:
{
  "summary": "A 2-3 sentence overview of their financial situation, health score interpretation, and overall path to achieving goals.",
  "insights": [
    "First insight explaining the investment allocation strategy based on goal timelines and risk profile.",
    "Second insight addressing specific goals and how current savings will impact timeline.",
    "Third insight explaining tax savings in concrete terms using exact numbers from Tax Optimization data.",
    "Fourth insight about their savings rate effectiveness and comparison to financial benchmarks."
  ],
  "recommendations": [
    "First actionable recommendation specific to their situation (e.g., increase emergency fund, adjust goal timeline).",
    "Second recommendation about automation or investment optimization.",
    "Third recommendation addressing any gaps or risks identified in their plan."
  ],
  "motivation": "A personalized, encouraging message (1-2 sentences) acknowledging their progress and inspiring them to continue."
}`;

  try {
    // Add timeout handling to prevent hanging API requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const chatCompletion = await groq.chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful and expert financial advisor. You always respond in valid JSON format only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192", // Fast and reliable model for JSON tasks
        temperature: 0.5,
        response_format: { type: "json_object" },
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq");
    }

    const parsed = JSON.parse(content) as AIInsights;
    
    // Validate output shape
    if (
      typeof parsed.summary !== "string" || 
      !Array.isArray(parsed.insights) ||
      !Array.isArray(parsed.recommendations) ||
      typeof parsed.motivation !== "string"
    ) {
      throw new Error("Invalid response shape from Groq");
    }

    return parsed;
  } catch (error: any) {
    console.error("AI Engine Error:", error.message || error);
    // Graceful fallback if AI fails (timeout, rate limit, parsing error)
    return FALLBACK_INSIGHTS;
  }
}
