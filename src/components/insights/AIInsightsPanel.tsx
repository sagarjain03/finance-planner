"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  TrendingUp,
  AlertCircle,
  Target,
  Lightbulb,
  Star,
} from "lucide-react";

interface AIInsights {
  summary: string;
  insights: string[];
  recommendations?: string[];
  motivation?: string;
}

interface AIInsightsPanelProps {
  insights: AIInsights;
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-linear-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
        <CardHeader>
          <CardTitle className="text-indigo-300 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Financial Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">{insights.summary}</p>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-gray-100 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {insights.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-indigo-400 font-bold shrink-0">
                  {idx + 1}.
                </span>
                <span className="text-gray-300">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex gap-2"
                >
                  <CheckIcon />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Motivation */}
      {insights.motivation && (
        <Card className="bg-linear-to-r from-emerald-600/10 to-teal-600/10 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-emerald-300 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Keep Going! 🚀
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-100 leading-relaxed italic">
              "{insights.motivation}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0 text-green-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
