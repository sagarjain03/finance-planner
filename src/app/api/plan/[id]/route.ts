import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { calculateFinancialPlan } from '@/lib/calculations';
import { parseInputs, validateFinancialInput } from '@/lib/validators';
import connectDB from '@/lib/db';
import FinancialPlan from '@/models/FinancialPlan';
import { generateFinancialInsights } from '@/lib/aiEngine';

/**
 * PUT /api/plan/:id
 * Updates an existing financial plan — recalculates all derived data
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || id.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan ID.' },
        { status: 400 }
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

    // Recalculate everything
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

    await connectDB();

    // Find and verify ownership
    const existingPlan = await FinancialPlan.findById(id);

    if (!existingPlan) {
      return NextResponse.json(
        { success: false, message: 'Plan not found.' },
        { status: 404 }
      );
    }

    if (existingPlan.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to edit this plan.' },
        { status: 403 }
      );
    }

    // Update the plan in-place
    const updatedPlan = await FinancialPlan.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedPlan,
        message: 'Financial plan updated successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/plan/[id] Error:', error);

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
 * GET /api/plan/:id
 * Fetches a single plan by ID (used by edit form to pre-fill data)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || id.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan ID.' },
        { status: 400 }
      );
    }

    await connectDB();

    const plan = await FinancialPlan.findById(id);

    if (!plan) {
      return NextResponse.json(
        { success: false, message: 'Plan not found.' },
        { status: 404 }
      );
    }

    if (plan.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to view this plan.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: plan,
        message: 'Plan fetched successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/plan/[id] Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
