"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MonthlySavingsData } from "@/types/financial";
import { TrendingDown, TrendingUp, Calendar } from "lucide-react";

interface WeeklySummaryProps {
  monthlyPlan: MonthlySavingsData[];
  targetExpenses: number;
}

export function WeeklySummary({ monthlyPlan, targetExpenses }: WeeklySummaryProps) {
  const summary = useMemo(() => {
    if (!monthlyPlan || monthlyPlan.length === 0) {
      return null;
    }

    const lastMonth = monthlyPlan[monthlyPlan.length - 1];
    const previousMonth =
      monthlyPlan.length > 1 ? monthlyPlan[monthlyPlan.length - 2] : lastMonth;

    const currentBalance = lastMonth.cumulativeSavings;
    const previousBalance = previousMonth.cumulativeSavings;
    const weeklyGrowth = currentBalance - previousBalance;
    const growthPercentage =
      previousBalance > 0
        ? ((weeklyGrowth / previousBalance) * 100).toFixed(1)
        : "0";

    // Calculate average monthly savings
    const avgSavings =
      monthlyPlan.reduce((sum, m) => sum + m.saved, 0) / monthlyPlan.length;
    // Compare against target expenses to estimate savings trend
    // If targetExpenses is high, lower savings is expected; if target is low, we should have high savings
    const savingsTrend = avgSavings > (targetExpenses * 0.2) ? "healthy" : "low";
    const savingsDifference = avgSavings;

    return {
      currentBalance,
      weeklyGrowth,
      growthPercentage,
      avgSavings,
      savingsTrend,
      savingsDifference,
      totalMonths: monthlyPlan.length,
    };
  }, [monthlyPlan, targetExpenses]);

  if (!summary) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-6">
          <p className="text-gray-400 text-center">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Month {summary.totalMonths} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cumulative Savings */}
          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <p className="text-sm text-gray-400">Cumulative Savings</p>
            <p className="text-2xl font-bold text-indigo-400 mt-2">
              ₹{summary.currentBalance.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
              {summary.weeklyGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {summary.weeklyGrowth >= 0 ? "+" : ""}
              ₹
              {Math.abs(summary.weeklyGrowth).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}{" "}
              ({summary.growthPercentage}%)
            </p>
          </div>

          {/* Average Monthly Savings */}
          <div
            className={`p-4 rounded-lg border ${
              summary.savingsTrend === "healthy"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <p className="text-sm text-gray-400">Average Monthly Savings</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                summary.savingsTrend === "healthy"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              ₹{summary.avgSavings.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                summary.savingsTrend === "healthy"
                  ? "text-green-300"
                  : "text-yellow-300"
              }`}
            >
              {summary.savingsTrend === "healthy" ? "✓" : "⚠️"}
              Savings trajectory: {summary.savingsTrend === "healthy" ? "Excellent 📈" : "Needs work 📊"}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-300 font-semibold">💡 This Month's Insight</p>
          <p className="text-sm text-blue-200 mt-2">
            {summary.weeklyGrowth >= 0 ? (
              <>
                Your savings have grown by ₹{summary.weeklyGrowth.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })} this month. Keep up the great momentum!
              </>
            ) : (
              <>
                Your savings dipped slightly by ₹{Math.abs(summary.weeklyGrowth).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}. Review your expenses and adjust next month.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
