import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { calculateFinancialPlan } from '@/lib/calculations';
import { calculateHealthScore } from '@/lib/healthScore';
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
    const { monthlySalary, needs, wants, goalAmount, goalDuration, goals } = body;

    // Parse and validate input
    const parsedInputs = parseInputs(
      monthlySalary?.toString() ?? '',
      needs?.toString() ?? '',
      wants?.toString() ?? '',
      goalAmount?.toString() ?? '',
      goalDuration?.toString() ?? '',
      goals
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
      parsedInputs.needs,
      parsedInputs.wants,
      parsedInputs.goalAmount,
      parsedInputs.goalDuration,
      parsedInputs.goals
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
    const savingsRate = parsedInputs.monthlySalary > 0 
      ? (planOutput.monthlySavings / parsedInputs.monthlySalary) * 100 
      : 0;
    const healthScoreInput = {
      ...planOutput,
      input: parsedInputs,
    };
    const healthScoreResult = calculateHealthScore(healthScoreInput);
    
    const aiInsights = await generateFinancialInsights({
      monthlySalary: parsedInputs.monthlySalary,
      needs: parsedInputs.needs,
      wants: parsedInputs.wants,
      monthlyExpenses: parsedInputs.monthlyExpenses,
      monthlySavings: planOutput.monthlySavings,
      yearlySavings: planOutput.yearlySavings,
      savingsRate,
      goalAmount: parsedInputs.goalAmount ?? 0,
      goalDuration: parsedInputs.goalDuration ?? 0,
      investmentAllocation: planOutput.investmentAllocation,
      taxData: planOutput.taxData,
      goals: parsedInputs.goals,
      alerts: planOutput.alerts,
      healthScore: healthScoreResult.score,
      healthGrade: healthScoreResult.grade,
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
        needs: parsedInputs.needs,
        wants: parsedInputs.wants,
        monthlyExpenses: parsedInputs.monthlyExpenses,
        goalAmount: planOutput.goalAmount,
        goalDuration: planOutput.goalDuration,
        goals: parsedInputs.goals,
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
        budgetFeedback: planOutput.budgetFeedback,
        achievement: planOutput.achievement,
        goalsAnalysis: planOutput.goalsAnalysis,
        alerts: planOutput.alerts,
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
