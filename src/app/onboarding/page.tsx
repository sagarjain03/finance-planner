"use client";

import { Suspense } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { OnboardingContent } from "@/components/planner/OnboardingContent";

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <PageContainer className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </PageContainer>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
