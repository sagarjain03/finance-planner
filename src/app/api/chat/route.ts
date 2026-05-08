import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TaxData {
  oldRegimeTax?: number;
  newRegimeTax?: number;
  recommendedRegime?: string;
  [key: string]: number | string | undefined;
}

interface FinancialContext {
  monthlySalary?: number;
  monthlyExpenses?: number;
  monthlySavings?: number;
  savingsRate?: number;
  goalAmount?: number;
  healthScore?: number;
  healthGrade?: string;
  investmentAllocation?: Array<{ type: string; percentage: number }>;
  taxData?: TaxData;
  alerts?: Array<{ type: string; message: string }>;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

function buildContextString(context: FinancialContext): string {
  let contextStr = '';

  if (context.monthlySalary) {
    contextStr += `Monthly Salary: ₹${context.monthlySalary}\n`;
  }
  if (context.monthlyExpenses) {
    contextStr += `Monthly Expenses: ₹${context.monthlyExpenses}\n`;
  }
  if (context.monthlySavings) {
    contextStr += `Monthly Savings: ₹${context.monthlySavings}\n`;
  }
  if (context.savingsRate) {
    contextStr += `Savings Rate: ${context.savingsRate.toFixed(1)}%\n`;
  }
  if (context.goalAmount) {
    contextStr += `Financial Goal: ₹${context.goalAmount}\n`;
  }
  if (context.healthScore) {
    contextStr += `Financial Health Score: ${context.healthScore}/100 (${context.healthGrade})\n`;
  }
  if (context.investmentAllocation && context.investmentAllocation.length > 0) {
    contextStr += `Investment Portfolio: ${context.investmentAllocation.map((inv) => `${inv.type} (${inv.percentage}%)`).join(', ')}\n`;
  }
  if (context.alerts && context.alerts.length > 0) {
    contextStr += `Active Alerts: ${context.alerts.map((a) => a.message).join(', ')}\n`;
  }

  return contextStr;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { message: string; history?: ChatMessage[]; context?: FinancialContext };
    const { message, history = [], context = {} } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy_key') {
      return NextResponse.json(
        {
          response:
            'I apologize, but the AI mentor is currently unavailable. Please ensure the Groq API key is properly configured.',
        },
        { status: 200 }
      );
    }

    const contextString = buildContextString(context);

    const systemPrompt = `You are a beginner-friendly financial mentor helping young earners understand budgeting, savings, investing, taxes, and financial planning. 

Your role:
- Explain financial concepts clearly and conversationally
- Provide personalized advice based on the user's financial situation
- Ask clarifying questions when needed
- Encourage good financial habits
- Keep responses concise (2-3 sentences max initially, expand only if asked)
- Use emojis occasionally to make responses friendly
- Avoid jargon; explain terms in simple language

${contextString ? `User's Financial Context:\n${contextString}` : ''}

Guidelines:
- Be encouraging and supportive
- Provide actionable advice
- Consider the user's current financial situation
- Suggest beginner-friendly strategies
- Always emphasize the importance of emergency funds and consistent saving`;

    // Convert history to Groq format
    const conversationHistory: ChatMessage[] = Array.isArray(history) 
      ? history.filter((msg): msg is ChatMessage => msg && typeof msg === 'object' && 'role' in msg && 'content' in msg)
      : [];

    // Add current user message
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...conversationHistory,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from Groq');
    }

    return NextResponse.json({
      response: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        response: "I'm having trouble processing your request. Please try again.",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 so chat UI can display error message gracefully
    );
  }
}
