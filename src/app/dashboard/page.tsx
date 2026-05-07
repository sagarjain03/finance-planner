'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Button } from '@/components/ui/Button';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { DashboardPlan } from '@/types/dashboard';
import { KPIStats } from '@/components/dashboard/KPIStats';
import { SavingsLineChart } from '@/components/dashboard/SavingsLineChart';
import { AllocationPieChart } from '@/components/dashboard/AllocationPieChart';
import { SavingsBarChart } from '@/components/dashboard/SavingsBarChart';
import { GoalAnalysis } from '@/components/dashboard/GoalAnalysis';
import { InvestmentStrategy } from '@/components/dashboard/InvestmentStrategy';
import { AIInsightsPanel } from '@/components/insights/AIInsightsPanel';
import { CreditCardWidget } from '@/components/dashboard/CreditCardWidget';
import { TaxStrategyCard } from '@/components/dashboard/TaxStrategyCard';
import { BudgetFeedbackCard } from '@/components/dashboard/BudgetFeedbackCard';
import { AchievementBanner } from '@/components/dashboard/AchievementBanner';
import { SmartAlertsCard } from '@/components/alerts/SmartAlertsCard';
import { HealthScoreCard } from '@/components/health/HealthScoreCard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { Reveal } from '@/components/shared/Reveal';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<DashboardPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/plan', { signal });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch your financial plan');
        }

        const json = await res.json();
        if (!signal?.aborted) {
          setPlan(json.data?.latest ?? null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (!signal?.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch plan'
          );
        }
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status !== 'authenticated') return;

    const controller = new AbortController();
    void (async () => {
      await fetchPlan(controller.signal);
    })();
    return () => controller.abort();
  }, [status, router, fetchPlan]);

  // --- Loading ---
  if (status === 'loading' || isLoading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <PageContainer>
        <ErrorState error={error} onRetry={() => fetchPlan()} />
      </PageContainer>
    );
  }

  // --- Empty ---
  if (!plan) {
    return (
      <PageContainer>
        <EmptyState />
      </PageContainer>
    );
  }

  // --- Dashboard ---
  return (
    <>
      <PageContainer className="py-12">
        <div className="space-y-10">
          {/* Header + Visual Card */}
          <Reveal className="flex flex-col lg:flex-row lg:items-center justify-between gap-8" delay={0.02}>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                <span className="text-white">
                  Dashboard
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl leading-8">{plan.message ?? ''}</p>
            </div>
            <div className="lg:w-1/3">
              <CreditCardWidget
                goalAmount={plan.goalAmount ?? 0}
                userName={session?.user?.name || "Premium Member"}
              />
            </div>
          </Reveal>

          {/* Achievement Banner — shown above KPIs when unlocked */}
          <Reveal delay={0.04}>
            <AchievementBanner achievement={plan.achievement} />
          </Reveal>

          {/* KPI Cards */}
          <Reveal delay={0.06}>
            <KPIStats
              monthlySalary={plan.monthlySalary}
              monthlyExpenses={plan.monthlyExpenses}
              monthlySavings={plan.monthlySavings}
              yearlySavings={plan.yearlySavings}
              savingsRate={plan.savingsRate}
            />
          </Reveal>

          {/* Health Score */}
          <Reveal delay={0.08}>
            <HealthScoreCard plan={plan} />
          </Reveal>

          {/* Charts Row 1 — Line + Pie */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-5 gap-8" delay={0.1}>
            <div className="lg:col-span-3">
              <SavingsLineChart
                monthlyPlan={plan.monthlyPlan ?? []}
                goalAmount={plan.goalAmount ?? 0}
              />
            </div>
            <div className="lg:col-span-2">
              <AllocationPieChart allocation={plan.investmentAllocation ?? []} />
            </div>
          </Reveal>

          {/* Charts Row 2 — Bar + Goal */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-8" delay={0.12}>
            <SavingsBarChart
              monthlySalary={plan.monthlySalary}
              monthlyExpenses={plan.monthlyExpenses}
              monthlySavings={plan.monthlySavings}
            />
            <GoalAnalysis
              isAchievable={plan.isAchievable}
              goalAmount={plan.goalAmount ?? 0}
              goalDuration={plan.goalDuration ?? 1}
              monthsToReachGoal={plan.monthsToReachGoal}
              monthlySavings={plan.monthlySavings}
            />
          </Reveal>

          {/* ── Phase 1 New Row: Budget + Tax ── */}
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-8" delay={0.14}>
            <BudgetFeedbackCard
              budgetFeedback={plan.budgetFeedback}
              monthlySalary={plan.monthlySalary}
            />
            <TaxStrategyCard taxData={plan.taxData} />
          </Reveal>

          {/* Phase 2: Smart Alerts */}
          {plan.alerts && plan.alerts.length > 0 && (
            <Reveal delay={0.16}>
              <SmartAlertsCard alerts={plan.alerts} />
            </Reveal>
          )}

          {/* AI Insights */}
          {plan.aiInsights && plan.aiInsights.summary && (
            <Reveal delay={0.18}>
              <AIInsightsPanel insights={plan.aiInsights} />
            </Reveal>
          )}

          {/* Investment Strategy + Explanation */}
          <Reveal delay={0.2}>
            <InvestmentStrategy
              investmentExplanation={plan.investmentExplanation ?? null}
              investmentAllocation={plan.investmentAllocation ?? []}
              goalDuration={plan.goalDuration ?? 1}
            />
          </Reveal>

          {/* Actions */}
          <Reveal className="flex gap-4 justify-center pt-8 border-t border-white/10" delay={0.22}>
            <Button
              onClick={() =>
                router.push(
                  `/onboarding?edit=true&id=${plan._id}`
                )
              }
              className="h-12 px-8 bg-white hover:bg-slate-200 text-[#0A0D14] font-semibold rounded-xl shadow-none"
            >
              Edit Plan
            </Button>
            <Button
              onClick={() => router.push('/onboarding')}
              variant="outline"
              className="h-12 px-8 bg-white/3 border-white/10 text-slate-300 hover:bg-white/6 hover:text-white rounded-xl"
            >
              Create New Plan
            </Button>
          </Reveal>
        </div>
      </PageContainer>

      {/* Floating Chat Button */}
      <FloatingChatButton
        context={{
          monthlySalary: plan.monthlySalary,
          monthlyExpenses: plan.monthlyExpenses,
          monthlySavings: plan.monthlySavings,
          savingsRate: plan.savingsRate,
          goalAmount: plan.goalAmount,
          investmentAllocation: plan.investmentAllocation,
          taxData: plan.taxData,
          alerts: plan.alerts,
        }}
      />
    </>
  );
}
