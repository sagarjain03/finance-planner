import Groq from "groq-sdk";

// Initialize Groq client. It will automatically use process.env.GROQ_API_KEY
// We set a dummy key to prevent crashes if it's missing, but the API call will fail gracefully later.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

export interface AIInsights {
  summary: string;
  insights: string[];
}

interface FinancialData {
  monthlySalary: number;
  monthlyExpenses: number;
  monthlySavings: number;
  yearlySavings: number;
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
}

const FALLBACK_INSIGHTS: AIInsights = {
  summary: "Your financial plan looks solid. You are on track to meet your goals by saving consistently.",
  insights: [
    "Keep your expenses strictly to the planned budget to ensure consistent savings.",
    "Invest your allocated amounts early in the month to benefit from compounding.",
    "Review your financial goals and plan every 6 months to adjust for life changes.",
  ],
};

export async function generateFinancialInsights(
  data: FinancialData
): Promise<AIInsights> {
  // If the key is specifically "dummy_key_replace_me" or "dummy_key", don't even try to call the API
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("dummy")) {
    console.warn("Groq API Key is missing or dummy. Using fallback AI insights.");
    return FALLBACK_INSIGHTS;
  }

  const prompt = `
Explain this financial plan in simple language for a beginner. Be concise, clear, and helpful.

User Financial Data:
- Monthly Salary: ₹${data.monthlySalary}
- Monthly Expenses: ₹${data.monthlyExpenses}
- Monthly Savings: ₹${data.monthlySavings}
- Goal Amount: ₹${data.goalAmount}
- Goal Duration: ${data.goalDuration} months

Recommended Investment Allocation:
${data.investmentAllocation.map((alloc) => `- ${alloc.type}: ${alloc.percentage}% (₹${alloc.amount})`).join("\n")}

Tax Analysis Data:
- Recommended Regime: ${data.taxData.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
- Utilized 80C Deduction: ₹${data.taxData.utilized80C}
- Tax Savings vs other regime: ₹${data.taxData.potentialTaxSavings}
- Effective Tax Rate: ${data.taxData.effectiveTaxRate}%

Respond ONLY with a valid JSON object matching this structure:
{
  "summary": "A 2-3 sentence overall summary of their financial situation and path to their goal.",
  "insights": [
    "A bullet point explaining why this specific investment allocation makes sense based on their goal duration.",
    "A bullet point explaining their tax savings in simple terms, explicitly mentioning the exact numbers from the Tax Analysis Data provided above.",
    "A bullet point with a simple risk management or budgeting tip."
  ]
}
`;

  try {
    // Add timeout handling to prevent hanging API requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const chatCompletion = await groq.chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful and expert financial advisor. You always respond in valid JSON format.",
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
    if (typeof parsed.summary !== "string" || !Array.isArray(parsed.insights)) {
      throw new Error("Invalid response shape from Groq");
    }

    return parsed;
  } catch (error: any) {
    console.error("AI Engine Error:", error.message || error);
    // Graceful fallback if AI fails (timeout, rate limit, parsing error)
    return FALLBACK_INSIGHTS;
  }
}
