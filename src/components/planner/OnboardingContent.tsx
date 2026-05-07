"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { SalaryForm } from "@/components/form/SalaryForm";
import { ConversationalFlow } from "@/components/planner/ConversationalFlow";

interface PlanData {
  monthlySalary: number;
  needs: number;
  wants: number;
  goalAmount: number;
  goalDuration: number;
}

export function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEdit = searchParams?.get("edit") === "true" || false;
  const planId = searchParams?.get("id");

  const [initialData, setInitialData] = useState<PlanData | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              needs: json.data.needs ?? 0,
              wants: json.data.wants ?? 0,
              goalAmount: json.data.goalAmount ?? 0,
              goalDuration: json.data.goalDuration ?? 12,
            });
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setFetchError("Error loading plan data");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingPlan(false);
        }
      }
    }

    fetchPlan();
    return () => controller.abort();
  }, [isEdit, planId]);

  const handleSubmit = async (data: PlanData) => {
    setIsSubmitting(true);
    try {
      const endpoint = isEdit && planId ? `/api/plan/${planId}` : "/api/plan";
      const method = isEdit && planId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlySalary: data.monthlySalary,
          needs: data.needs,
          wants: data.wants,
          goals: data.goalAmount > 0 ? [{
            name: "Savings Goal",
            amount: data.goalAmount,
            duration: data.goalDuration,
          }] : [],
        }),
      });

      const json = await response.json();

      if (!json.success) {
        alert("Error saving plan: " + (json.message || "Unknown error"));
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      alert("Error saving plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer className="py-12">
      <div className="max-w-4xl mx-auto">
        {isLoadingPlan && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{fetchError}</p>
          </div>
        )}

        {!isLoadingPlan && (
          <>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {isEdit ? "Update Your Plan" : "Let's Plan Your Financial Future"}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {isEdit
                ? "Update your financial information to refine your plan"
                : "Answer a few questions and we'll create a personalized financial plan for you"}
            </p>

            {isEdit ? (
              <SalaryForm
                initialData={initialData || undefined}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            ) : (
              <ConversationalFlow onSubmit={handleSubmit} isLoading={isSubmitting} />
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
