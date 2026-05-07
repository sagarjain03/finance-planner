/**
 * FinancialPlan Model
 * Stores user's financial planning data with investment recommendations
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFinancialPlan extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;
  monthlySalary: number;
  monthlyExpenses: number;
  needs: number;
  wants: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  goalAmount?: number;
  goalDuration?: number;
  isAchievable: boolean;
  monthsToReachGoal: number | null;
  goals?: Array<{
    id: string;
    name: string;
    amount: number;
    duration: number;
    createdAt: Date;
  }>;
  goalsAnalysis?: Array<{
    id: string;
    name: string;
    amount: number;
    duration: number;
    requiredMonthlySaving: number;
    currentSaving: number;
    gap: number;
    isAchievable: boolean;
    monthsToReachGoal: number | null;
    progressPercentage: number;
  }>;
  alerts?: Array<{
    type: 'overspending' | 'low_savings' | 'goal_delay';
    message: string;
  }>;
  investmentAllocation: Array<{
    type: string;
    percentage: number;
    amount: number;
  }>;
  investmentExplanation: {
    summary: string;
    reasoning: string[];
    riskLevel: 'low' | 'medium' | 'high';
    strategy: string;
  };
  monthlyPlan: Array<{
    month: number;
    saved: number;
    cumulativeSavings: number;
  }>;
  message: string;
  taxData: {
    oldRegimeTax: number;
    newRegimeTax: number;
    recommendedRegime: "old" | "new";
    potentialTaxSavings: number;
    utilized80C: number;
    effectiveTaxRate: number;
    netIncome: number;
  };
  aiInsights: {
    summary: string;
    insights: string[];
  };
  budgetFeedback: {
    needsStatus: 'over' | 'ideal' | 'under';
    wantsStatus: 'over' | 'ideal' | 'under';
    savingsStatus: 'low' | 'good' | 'excellent';
    actualNeedsPct: number;
    actualWantsPct: number;
    actualSavingsPct: number;
    message: string;
  };
  achievement: {
    unlocked: boolean;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FinancialPlanSchema = new Schema<IFinancialPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for faster queries
    },
    monthlySalary: {
      type: Number,
      required: true,
      min: 0,
    },
    needs: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    wants: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    monthlyExpenses: {
      type: Number,
      required: true,
      min: 0,
    },
    monthlySavings: {
      type: Number,
      required: true,
    },
    yearlySavings: {
      type: Number,
      required: true,
    },
    savingsRate: {
      type: Number,
      required: true,
    },
    goalAmount: {
      type: Number,
      min: 0,
    },
    goalDuration: {
      type: Number,
      min: 1,
    },
    goals: [
      {
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        duration: { type: Number, required: true },
        createdAt: { type: Date, required: true, default: Date.now },
      },
    ],
    goalsAnalysis: [
      {
        _id: false,
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        duration: { type: Number, required: true },
        requiredMonthlySaving: { type: Number, required: true },
        currentSaving: { type: Number, required: true },
        gap: { type: Number, required: true },
        isAchievable: { type: Boolean, required: true },
        monthsToReachGoal: { type: Number, default: null },
        progressPercentage: { type: Number, required: true },
      },
    ],
    alerts: [
      {
        _id: false,
        type: { type: String, enum: ['overspending', 'low_savings', 'goal_delay'], required: true },
        message: { type: String, required: true },
      },
    ],
    isAchievable: {
      type: Boolean,
      required: true,
    },
    monthsToReachGoal: {
      type: Number,
      default: null,
    },
    investmentAllocation: [
      {
        _id: false,
        type: { type: String },
        percentage: Number,
        amount: Number,
      },
    ],
    investmentExplanation: {
      _id: false,
      summary: String,
      reasoning: [String],
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
      },
      strategy: String,
    },
    monthlyPlan: [
      {
        _id: false,
        month: Number,
        saved: Number,
        cumulativeSavings: Number,
      },
    ],
    message: String,
    aiInsights: {
      _id: false,
      summary: { type: String, default: '' },
      insights: { type: [String], default: [] },
    },
    budgetFeedback: {
      _id: false,
      needsStatus: { type: String, enum: ['over', 'ideal', 'under'], default: 'ideal' },
      wantsStatus: { type: String, enum: ['over', 'ideal', 'under'], default: 'ideal' },
      savingsStatus: { type: String, enum: ['low', 'good', 'excellent'], default: 'low' },
      actualNeedsPct: { type: Number, default: 0 },
      actualWantsPct: { type: Number, default: 0 },
      actualSavingsPct: { type: Number, default: 0 },
      message: { type: String, default: '' },
    },
    achievement: {
      _id: false,
      unlocked: { type: Boolean, default: false },
      message: { type: String, default: '' },
    },
    taxData: {
      _id: false,
      oldRegimeTax: { type: Number, required: true },
      newRegimeTax: { type: Number, required: true },
      recommendedRegime: { type: String, enum: ['old', 'new'], required: true },
      potentialTaxSavings: { type: Number, required: true },
      utilized80C: { type: Number, required: true },
      effectiveTaxRate: { type: Number, required: true },
      netIncome: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user plan queries
FinancialPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.FinancialPlan ||
  mongoose.model<IFinancialPlan>('FinancialPlan', FinancialPlanSchema);
