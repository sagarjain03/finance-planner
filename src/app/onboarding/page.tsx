"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { SalaryForm } from "@/components/form/SalaryForm";

interface PlanData {
  monthlySalary: number;
  monthlyExpenses: number;
  goalAmount: number;
  goalDuration: number;
}

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const planId = searchParams.get("id");

  const [initialData, setInitialData] = useState<PlanData | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch existing plan data when editing
  useEffect(() => {
    if (!isEdit || !planId) return;

    const controller = new AbortController();

    async function fetchPlan() {
      setIsLoadingPlan(true);
      setFetchError(null);

      try {
        const res = await fetch(`/api/plan/${planId}`, {
          signal: controller.signal,
        });
        const json = await res.json();

        if (!controller.signal.aborted) {
          if (!json.success) {
            setFetchError(json.message || "Failed to load plan");
          } else {
            setInitialData({
              monthlySalary: json.data.monthlySalary,
              monthlyExpenses: json.data.monthlyExpenses,
              goalAmount: json.data.goalAmount,
              goalDuration: json.data.goalDuration,
            });
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setFetchError("Failed to load plan data. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingPlan(false);
      }
    }

    fetchPlan();
    return () => controller.abort();
  }, [isEdit, planId]);

  return (
    <PageContainer className="flex items-center justify-center min-h-[calc(100vh-73px)] py-12">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              {isEdit ? "Edit Your Plan" : "Your Financial Info"}
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            {isEdit
              ? "Update your numbers and we'll recalculate everything"
              : "Tell us about your financial situation to create your personalized plan"}
          </p>
        </div>

        {/* Loading state for edit mode */}
        {isLoadingPlan && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-slate-600 font-medium">Loading your plan...</p>
          </div>
        )}

        {/* Fetch error */}
        {fetchError && (
          <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl text-center">
            <p className="text-red-700 font-semibold">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-600 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Show form when ready */}
        {!isLoadingPlan && !fetchError && (
          <SalaryForm
            editPlanId={isEdit && planId ? planId : null}
            initialData={initialData}
          />
        )}
      </div>
    </PageContainer>
  );
}
