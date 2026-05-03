import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { calculateFinancialPlan } from '@/lib/calculations';
import { parseInputs, validateFinancialInput } from '@/lib/validators';
import { ApiResponse, FinancialPlanOutput } from '@/types/financial';
import connectDB from '@/lib/db';
import FinancialPlan from '@/models/FinancialPlan';
import { generateFinancialInsights } from '@/lib/aiEngine';

/**
 * POST /api/plan
 * Creates and saves a new financial plan for the authenticated user
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please log in.',
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { monthlySalary, monthlyExpenses, goalAmount, goalDuration } = body;

    // Parse and validate input
    const parsedInputs = parseInputs(
      monthlySalary?.toString() ?? '',
      monthlyExpenses?.toString() ?? '',
      goalAmount?.toString() ?? '',
      goalDuration?.toString() ?? ''
    );

    if (!parsedInputs) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input format. Please provide valid numbers.',
        },
        { status: 400 }
      );
    }

    // Validate financial input
    const validationErrors = validateFinancialInput(
      parsedInputs.monthlySalary,
      parsedInputs.monthlyExpenses,
      parsedInputs.goalAmount,
      parsedInputs.goalDuration
    );

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors: validationErrors,
          message: 'Validation failed. Please check your inputs.',
        },
        { status: 400 }
      );
    }

    // Calculate financial plan
    const planOutput = calculateFinancialPlan(parsedInputs);

    // Generate AI insights asynchronously (will fallback if fails)
    const aiInsights = await generateFinancialInsights({
      monthlySalary: parsedInputs.monthlySalary,
      monthlyExpenses: parsedInputs.monthlyExpenses,
      monthlySavings: planOutput.monthlySavings,
      yearlySavings: planOutput.yearlySavings,
      goalAmount: parsedInputs.goalAmount,
      goalDuration: parsedInputs.goalDuration,
      investmentAllocation: planOutput.investmentAllocation,
      taxData: planOutput.taxData,
    });

    // Connect to database and save plan
    await connectDB();

    const financialPlan = await FinancialPlan.create({
      userId: session.user.id,
      monthlySalary: parsedInputs.monthlySalary,
      monthlyExpenses: parsedInputs.monthlyExpenses,
      goalAmount: parsedInputs.goalAmount,
      goalDuration: parsedInputs.goalDuration,
      monthlySavings: planOutput.monthlySavings,
      yearlySavings: planOutput.yearlySavings,
      savingsRate: planOutput.savingsRate,
      isAchievable: planOutput.isAchievable,
      monthsToReachGoal: planOutput.monthsToReachGoal,
      investmentAllocation: planOutput.investmentAllocation,
      investmentExplanation: planOutput.investmentExplanation,
      monthlyPlan: planOutput.monthlyPlan,
      message: planOutput.message,
      taxData: planOutput.taxData,
      aiInsights: aiInsights,
    });

    const response: ApiResponse<any> = {
      success: true,
      data: {
        ...planOutput,
        _id: financialPlan._id,
      },
      message: 'Financial plan created and saved successfully.',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/plan
 * Fetches all financial plans for the authenticated user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please log in.',
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch all plans for this user, sorted by newest first
    const plans = await FinancialPlan.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 plans

    const response: ApiResponse<any> = {
      success: true,
      data: {
        plans,
        latest: plans[0] || null,
      },
      message: 'Plans fetched successfully.',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
