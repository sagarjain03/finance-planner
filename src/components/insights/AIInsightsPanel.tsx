"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  ChartSpline,
  ChevronDown,
  FileText,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import type { AIInsights } from "@/types/financial";

interface AIInsightsPanelProps {
  insights?: Partial<AIInsights> & { summary: string };
  isLoading?: boolean;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Financial Summary": TrendingUp,
  "Spending Analysis": BadgeIndianRupee,
  "Savings Analysis": PiggyBank,
  "Investment Strategy": BriefcaseBusiness,
  "Tax Optimization": ShieldCheck,
  "Goal Feasibility": ChartSpline,
};

export function AIInsightsPanel({ insights, isLoading = false }: AIInsightsPanelProps) {
  const sections = useMemo(() => {
    if (insights?.sections && insights.sections.length > 0) {
      return insights.sections;
    }

    if (insights?.insights && insights.insights.length > 0) {
      return [
        {
          title: "Key Takeaways",
          summary: "Legacy insight list normalized into the new report format.",
          bullets: insights.insights,
        },
      ];
    }

    return [];
  }, [insights]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (isLoading) {
    return <AIInsightsLoadingState />;
  }

  if (!insights) {
    return null;
  }

  return (
    <Card className="border-white/10 bg-zinc-950/90">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-slate-50">Personalized Financial Analysis Report</CardTitle>
            <p className="mt-1 text-sm text-slate-400">Structured analysis based on your salary, goals, tax profile, alerts, and investment allocation.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5" />
            Executive Summary
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-200">{insights.summary}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sections.map((section, index) => {
          const Icon = sectionIcons[section.title] || Lightbulb;
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{section.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{section.summary}</p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false} mode="wait">
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <ul className="space-y-3">
                          {section.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="flex gap-3 text-sm leading-7 text-slate-300">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/3">
            <CardHeader>
              <CardTitle className="text-base text-slate-50 flex items-center gap-2">
                <Target className="h-4.5 w-4.5 text-slate-300" />
                Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(insights.recommendations || []).map((recommendation, index) => (
                  <li key={index} className="flex gap-3 rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm leading-6 text-slate-300">
                    <span className="shrink-0 font-medium text-slate-500">0{index + 1}</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {insights.motivation && (
            <Card className="border-white/10 bg-white/3">
              <CardHeader>
                <CardTitle className="text-base text-slate-50 flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-slate-300" />
                  Encouragement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-300">{insights.motivation}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIInsightsLoadingState() {
  return (
    <Card className="border-white/10 bg-zinc-950/90">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-slate-50">Generating your report...</CardTitle>
            <p className="mt-1 text-sm text-slate-400">Pulling together salary, tax, goals, and investment data.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
            </span>
            <span>Building personalized analysis</span>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 rounded-full bg-white/5" style={{ width: `${90 - index * 10}%` }} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-40 rounded-2xl border border-white/10 bg-white/3 animate-pulse" />
          <div className="h-40 rounded-2xl border border-white/10 bg-white/3 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
