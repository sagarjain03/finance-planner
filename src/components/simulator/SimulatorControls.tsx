"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

interface SimulatorControlsProps {
  monthlySalary: number;
  monthlyExpenses: number;
  savingsRate: number;
  onSalaryChange: (value: number) => void;
  onExpensesChange: (value: number) => void;
  onSavingsRateChange: (value: number) => void;
}

export function SimulatorControls({
  monthlySalary,
  monthlyExpenses,
  savingsRate,
  onSalaryChange,
  onExpensesChange,
  onSavingsRateChange,
}: SimulatorControlsProps) {
  const monthlySavings = monthlySalary - monthlyExpenses;
  const calculatedSavingsRate = monthlySalary > 0 
    ? ((monthlySavings / monthlySalary) * 100) 
    : 0;

  return (
    <Card className="bg-gray-800/80 border-indigo-500/30">
      <CardHeader>
        <CardTitle className="text-gray-100">Adjust Your Finances</CardTitle>
        <CardDescription className="text-gray-400">
          Move the sliders to simulate different financial scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Salary Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-200">
              Monthly Salary
            </label>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-400">
                ₹{monthlySalary.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {((monthlySalary / 50000) * 100).toFixed(0)}% of ₹50,000
              </p>
            </div>
          </div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={monthlySalary}
            onChange={(e) => onSalaryChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹10k</span>
            <span>₹500k</span>
          </div>
        </div>

        {/* Expenses Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-200">
              Monthly Expenses
            </label>
            <div className="text-right">
              <p className="text-lg font-bold text-red-400">
                ₹{monthlyExpenses.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {monthlySalary > 0 ? ((monthlyExpenses / monthlySalary) * 100).toFixed(0) : 0}% of salary
              </p>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={monthlySalary * 0.95}
            step="1000"
            value={monthlyExpenses}
            onChange={(e) => onExpensesChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹0</span>
            <span>₹{(monthlySalary * 0.95).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}</span>
          </div>
        </div>

        {/* Calculated Savings Summary */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-3">
          <h3 className="font-semibold text-emerald-400">Monthly Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Income</span>
              <span className="text-emerald-400 font-semibold">
                ₹{monthlySalary.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expenses</span>
              <span className="text-red-400 font-semibold">
                -₹{monthlyExpenses.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-700/50 flex justify-between">
              <span className="text-gray-200 font-semibold">Savings</span>
              <span className={`font-bold ${monthlySavings >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                ₹{monthlySavings.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-200 font-semibold">Savings Rate</span>
              <span className="text-indigo-400 font-bold">
                {calculatedSavingsRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {monthlyExpenses >= monthlySalary && (
          <div className="p4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">
              ⚠️ Expenses exceed income! Adjust salary or reduce expenses.
            </p>
          </div>
        )}

        {calculatedSavingsRate < 10 && monthlySavings > 0 && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-400">
              💡 Low savings rate. Consider reducing expenses or increasing income.
            </p>
          </div>
        )}

        {calculatedSavingsRate >= 30 && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <p className="text-sm text-emerald-400">
              🎉 Excellent savings rate! You're on track for financial success.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
