import Groq from "groq-sdk";

// Initialize Groq client. It will automatically use process.env.GROQ_API_KEY
// We set a dummy key to prevent crashes if it's missing, but the API call will fail gracefully later.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

export interface AIReportSection {
  title: string;
  summary: string;
  bullets: string[];
}

export interface AIInsights {
  summary: string;
  sections: AIReportSection[];
  insights?: string[];
  recommendations: string[];
  motivation: string;
}

interface FinancialData {
  monthlySalary: number;
  needs?: number;
  wants?: number;
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

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatRupee(value: number): string {
  return INR.format(Number.isFinite(value) ? value : 0);
}

function percent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function deriveHealthContext(data: FinancialData): { score: number; grade: string } {
  if (typeof data.healthScore === "number" && data.healthScore > 0) {
    return { score: Math.round(data.healthScore), grade: data.healthGrade || "Good" };
  }

  const income = Math.max(data.monthlySalary, 1);
  const expenseRatio = (data.monthlyExpenses / income) * 100;
  const savingsRate = data.savingsRate;
  const taxBoost = data.taxData ? Math.min(20, Math.max(5, (data.taxData.potentialTaxSavings / income) * 100)) : 5;
  const savingsScore = savingsRate >= 30 ? 30 : savingsRate >= 20 ? 24 : savingsRate >= 10 ? 16 : savingsRate >= 5 ? 8 : 2;
  const expenseScore = expenseRatio <= 50 ? 25 : expenseRatio <= 60 ? 20 : expenseRatio <= 70 ? 12 : expenseRatio <= 80 ? 6 : 0;
  const taxScore = taxBoost >= 15 ? 20 : taxBoost >= 10 ? 15 : taxBoost >= 5 ? 10 : 5;
  const goalScore = data.goals && data.goals.length > 0 ? 12 : 8;
  const score = Math.min(100, savingsScore + expenseScore + taxScore + goalScore);

  const grade = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs Attention";
  return { score, grade };
}

function buildFallbackInsights(data: FinancialData): AIInsights {
  const salary = Math.max(data.monthlySalary || 0, 0);
  const needs = Math.max(data.needs || 0, 0);
  const wants = Math.max(data.wants || 0, 0);
  const expenses = Math.max(data.monthlyExpenses || 0, needs + wants);
  const savings = Math.max(data.monthlySavings || 0, 0);
  const savingsRate = salary > 0 ? (savings / salary) * 100 : 0;
  const needsRate = salary > 0 ? (needs / salary) * 100 : 0;
  const wantsRate = salary > 0 ? (wants / salary) * 100 : 0;
  const emergencyFundMonths = savings > 0 ? (expenses * 3) / savings : 0;
  const healthContext = deriveHealthContext(data);
  const taxRegime = data.taxData.recommendedRegime === "old" ? "Old Regime" : "New Regime";
  const taxSavings = formatRupee(data.taxData.potentialTaxSavings);

  const goals = data.goals && data.goals.length > 0
    ? data.goals
    : data.goalAmount > 0 && data.goalDuration > 0
      ? [{ name: "Primary Goal", amount: data.goalAmount, duration: data.goalDuration, id: "primary" }]
      : [];

  const mainGoal = goals[0];
  const goalMonthlyNeed = mainGoal && mainGoal.duration > 0 ? mainGoal.amount / mainGoal.duration : 0;
  const goalGap = mainGoal ? goalMonthlyNeed - savings : 0;

  return {
    summary: normalizeText(
      `You earn ${formatRupee(salary)} per month, spend about ${formatRupee(expenses)}, and retain ${formatRupee(savings)} for savings and investing. Your savings rate is ${percent(savingsRate)}, your health score is ${healthContext.score}/100 (${healthContext.grade}), and the main leverage points are spending discipline and goal prioritization.`
    ),
    sections: [
      {
        title: "Financial Summary",
        summary: "A concise view of salary, expenses, savings, and the overall quality of the plan.",
        bullets: [
          `Monthly salary is ${formatRupee(salary)} and monthly expenses are ${formatRupee(expenses)}, leaving ${formatRupee(savings)} to allocate each month.`,
          `Savings rate sits at ${percent(savingsRate)}, which is ${savingsRate >= 20 ? "strong" : "below the preferred 20% benchmark"} for long-term wealth building.`,
          `Financial health is ${healthContext.score}/100 (${healthContext.grade}), so the plan is ${healthContext.score >= 70 ? "tracking well" : "still needs refinement"}.`,
        ],
      },
      {
        title: "Spending Analysis",
        summary: "Needs vs wants and whether spending is crowding out wealth building.",
        bullets: [
          `Needs account for ${formatRupee(needs)} (${percent(needsRate)}) of salary, while wants account for ${formatRupee(wants)} (${percent(wantsRate)}).`,
          `When wants rise too close to salary, savings loses room; a tighter discretionary budget creates more room for goal funding.`,
          data.alerts && data.alerts.length > 0
            ? `Active alerts point to pressure points: ${data.alerts.map((alert) => alert.message).join(" ")}`
            : "No active alerts were generated, which suggests spending is under control for now.",
        ],
      },
      {
        title: "Savings Analysis",
        summary: "How quickly you are building resilience and emergency-fund coverage.",
        bullets: [
          `Your current savings habit produces ${formatRupee(savings)} each month, which can compound well if it is automated early in the month.`,
          `A 3-month emergency buffer would require about ${emergencyFundMonths > 0 ? `${emergencyFundMonths.toFixed(1)} months` : "unfunded"}, so liquidity should be built before taking more investment risk.`,
          `The biggest savings constraint is usually not the income figure alone, but maintaining discipline across recurring expenses and lifestyle drift.`,
        ],
      },
      {
        title: "Investment Strategy",
        summary: "Why the FD, RD, and mutual fund mix fits the time horizon and risk profile.",
        bullets: [
          data.investmentAllocation.map((allocation) => `${allocation.type} receives ${allocation.percentage}% (${formatRupee(allocation.amount)}), so the portfolio is already mapped to the plan's risk profile.`).join(" "),
          `FD and RD allocation should protect short-term money, while mutual funds should carry longer-term goals that can absorb volatility.`,
          `The current mix is best when safety and growth are balanced instead of chasing maximum returns without regard for deadlines.`,
        ],
      },
      {
        title: "Tax Optimization",
        summary: "Regime choice, 80C usage, and how much tax efficiency is being left on the table.",
        bullets: [
          `The recommended tax regime is ${taxRegime}, with estimated tax savings of ${taxSavings}.`,
          `80C utilization is ${formatRupee(data.taxData.utilized80C)}, so any unused headroom should be reviewed against available deductible investments.`,
          `The effective tax rate is ${percent(data.taxData.effectiveTaxRate)}, which should be compared with the cash flow needed for goals and reserves.`,
        ],
      },
      {
        title: "Goal Feasibility",
        summary: "Whether the current pace can actually hit the target dates.",
        bullets: [
          goals.length > 0
            ? `You have ${goals.length} goal${goals.length > 1 ? "s" : ""} in the plan, and the primary target is ${mainGoal ? `${mainGoal.name} at ${formatRupee(mainGoal.amount)} over ${mainGoal.duration} months` : "not yet defined"}.`
            : `No explicit multi-goal list was provided, so feasibility is being assessed from the primary target of ${formatRupee(data.goalAmount)} over ${data.goalDuration} months.`,
          mainGoal
            ? `That goal requires about ${formatRupee(goalMonthlyNeed)} per month; your current savings leaves a gap of ${formatRupee(Math.max(goalGap, 0))} if you want to reach it without extending the timeline.`
            : "Goal feasibility cannot be fully measured until a primary goal amount and duration are available.",
          mainGoal
            ? savings >= goalMonthlyNeed
              ? "The current savings pace makes the goal realistic."
              : "The goal is still possible, but only if savings increase, timeline extends, or goal amount is revised."
            : "Set a concrete target amount and horizon so the plan can judge feasibility accurately.",
        ],
      },
    ],
    recommendations: [
      `Automate ${formatRupee(savings)} into savings and investments immediately after salary credit to avoid leakage.`,
      `Reduce wants spending if it prevents you from funding a 3-month emergency buffer within a reasonable timeline.`,
      `Rebalance the FD/RD/mutual fund mix only after confirming whether the goal is short term or long term.`,
      `Use the tax regime that leaves the highest post-tax cash flow, then direct the difference into goal funding and emergency reserves.`,
      `Revisit the plan whenever income, goals, or alerts change so the report stays aligned with actual cash flow.`,
    ],
    motivation: normalizeText(
      `You already have the structure of a strong plan: ${formatRupee(savings)} of monthly saving power, a visible tax position, and a goal framework that can be tightened with small adjustments. Stay disciplined for the next few months and the numbers will compound in your favor.`
    ),
    insights: [
      `Savings rate is ${percent(savingsRate)} with ${formatRupee(savings)} available each month.`,
      `Health score is ${healthContext.score}/100 (${healthContext.grade}).`,
      `Tax savings are about ${taxSavings}.`,
    ],
  };
}

function normalizeAIInsights(content: string, fallback: AIInsights): AIInsights {
  try {
    const parsed = JSON.parse(content) as Partial<AIInsights> & { sections?: unknown[] };

    const sections = Array.isArray(parsed.sections)
      ? parsed.sections
          .map((section) => {
            if (!section || typeof section !== "object") return null;
            const typedSection = section as Partial<AIReportSection>;
            if (
              typeof typedSection.title !== "string" ||
              typeof typedSection.summary !== "string" ||
              !Array.isArray(typedSection.bullets)
            ) {
              return null;
            }

            return {
              title: typedSection.title,
              summary: typedSection.summary,
              bullets: typedSection.bullets.filter((bullet): bullet is string => typeof bullet === "string"),
            };
          })
          .filter((section): section is AIReportSection => Boolean(section))
      : [];

    if (
      typeof parsed.summary === "string" &&
      sections.length > 0 &&
      Array.isArray(parsed.recommendations) &&
      typeof parsed.motivation === "string"
    ) {
      return {
        summary: parsed.summary,
        sections,
        recommendations: parsed.recommendations.filter((item): item is string => typeof item === "string"),
        motivation: parsed.motivation,
        insights: Array.isArray(parsed.insights)
          ? parsed.insights.filter((item): item is string => typeof item === "string")
          : undefined,
      };
    }

    if (
      typeof parsed.summary === "string" &&
      Array.isArray(parsed.insights) &&
      typeof parsed.motivation === "string"
    ) {
      return {
        summary: parsed.summary,
        sections: [
          {
            title: "Financial Summary",
            summary: "Legacy insight format normalized into the new report structure.",
            bullets: parsed.insights.filter((item): item is string => typeof item === "string"),
          },
        ],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.filter((item): item is string => typeof item === "string")
          : fallback.recommendations,
        motivation: parsed.motivation,
        insights: parsed.insights.filter((item): item is string => typeof item === "string"),
      };
    }
  } catch {
    // Fall through to fallback.
  }

  return fallback;
}

export async function generateFinancialInsights(
  data: FinancialData
): Promise<AIInsights> {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("dummy")) {
    console.warn("Groq API Key is missing or dummy. Using fallback AI insights.");
    return buildFallbackInsights(data);
  }

  const healthContext = data.healthScore
    ? `Current Financial Health Score: ${data.healthScore}/100 (${data.healthGrade})`
    : (() => {
        const derived = deriveHealthContext(data);
        return `Current Financial Health Score: ${derived.score}/100 (${derived.grade})`;
      })();

  const needsContext = typeof data.needs === "number"
    ? `- Monthly Needs: ₹${data.needs}`
    : "- Monthly Needs: not provided";

  const wantsContext = typeof data.wants === "number"
    ? `- Monthly Wants: ₹${data.wants}`
    : "- Monthly Wants: not provided";

  const reportPrompt = `
You are a senior private wealth analyst writing for a premium fintech app.

Write a long-form Personalized Financial Analysis Report based on the exact user numbers below.

Rules:
- Return valid JSON only.
- Do not use markdown.
- Do not write generic advice.
- Use user-specific numbers in every section.
- Keep the tone premium, analytical, and direct.
- Explain what the numbers mean, not just what the user should do.
- If a detail is unavailable, acknowledge it briefly and infer conservatively.

User Financial Profile:
- Monthly Salary: ₹${data.monthlySalary}
${needsContext}
${wantsContext}
- Monthly Expenses: ₹${data.monthlyExpenses}
- Monthly Savings: ₹${data.monthlySavings}
- Yearly Savings: ₹${data.yearlySavings}
- Savings Rate: ${data.savingsRate.toFixed(1)}%
- ${healthContext}

Goals:
${data.goals && data.goals.length > 0 
  ? data.goals.map((goal) => `- ${goal.name}: ₹${goal.amount} in ${goal.duration} months`).join('\n')
  : `- Primary Goal: ₹${data.goalAmount} in ${data.goalDuration} months`}

Active Alerts:
${data.alerts && data.alerts.length > 0 
  ? data.alerts.map((alert) => `- ${alert.message}`).join('\n')
  : '- No active alerts.'}

Investment Allocation:
${data.investmentAllocation.map((allocation) => `- ${allocation.type}: ${allocation.percentage}% (₹${allocation.amount})`).join('\n')}

Tax Data:
- Recommended Regime: ${data.taxData.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}
- 80C Utilized: ₹${data.taxData.utilized80C}
- Potential Tax Savings: ₹${data.taxData.potentialTaxSavings}
- Effective Tax Rate: ${data.taxData.effectiveTaxRate}%

Required JSON structure:
{
  "summary": "2-4 sentence overview of the user's financial situation, savings strength, health score, and the key trade-offs visible in the numbers.",
  "sections": [
    {
      "title": "Financial Summary",
      "summary": "A concise framing of salary, expenses, savings, and health score.",
      "bullets": ["...", "...", "..."]
    },
    {
      "title": "Spending Analysis",
      "summary": "Needs vs wants, overspending, and budget pressure.",
      "bullets": ["...", "...", "..."]
    },
    {
      "title": "Savings Analysis",
      "summary": "Savings habit and emergency fund readiness.",
      "bullets": ["...", "...", "..."]
    },
    {
      "title": "Investment Strategy",
      "summary": "Explain FD, RD, and mutual fund allocation in plain language.",
      "bullets": ["...", "...", "..."]
    },
    {
      "title": "Tax Optimization",
      "summary": "Regime choice, 80C usage, and tax efficiency.",
      "bullets": ["...", "...", "..."]
    },
    {
      "title": "Goal Feasibility",
      "summary": "Whether goals are realistic and what would need to change.",
      "bullets": ["...", "...", "..."]
    }
  ],
  "recommendations": [
    "3-5 actionable recommendations tied to the user's numbers and goals"
  ],
  "motivation": "A personalized encouragement message grounded in the user's real progress."
}
`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const chatCompletion = await groq.chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful and expert financial advisor. You always respond in valid JSON format only.",
          },
          {
            role: "user",
            content: reportPrompt,
          },
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0.35,
        response_format: { type: "json_object" },
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq");
    }

    return normalizeAIInsights(content, buildFallbackInsights(data));
  } catch (error: unknown) {
    console.error("AI Engine Error:", error instanceof Error ? error.message : String(error));
    return buildFallbackInsights(data);
  }
}
