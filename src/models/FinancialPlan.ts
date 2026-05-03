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
  monthlySavings: number;
  yearlySavings: number;
  savingsRate: number;
  goalAmount: number;
  goalDuration: number;
  isAchievable: boolean;
  monthsToReachGoal: number | null;
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
      required: true,
      min: 0,
    },
    goalDuration: {
      type: Number,
      required: true,
      min: 1,
    },
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
