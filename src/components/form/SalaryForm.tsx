"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormErrors } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { InputField } from "./InputField";

interface FormData {
  monthlySalary: string;
  fixedExpenses: string;
  savingsGoalAmount: string;
  goalDurationMonths: string;
}

interface SalaryFormProps {
  /** Plan ID when editing an existing plan */
  editPlanId?: string | null;
  /** Pre-fill values when editing */
  initialData?: {
    monthlySalary: number;
    monthlyExpenses: number;
    goalAmount: number;
    goalDuration: number;
  } | null;
}

const EMPTY_FORM: FormData = {
  monthlySalary: "",
  fixedExpenses: "",
  savingsGoalAmount: "",
  goalDurationMonths: "",
};

export function SalaryForm({ editPlanId, initialData }: SalaryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditMode = Boolean(editPlanId);

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        monthlySalary: String(initialData.monthlySalary),
        fixedExpenses: String(initialData.monthlyExpenses),
        savingsGoalAmount: String(initialData.goalAmount),
        goalDurationMonths: String(initialData.goalDuration),
      });
    }
  }, [initialData]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.monthlySalary || parseFloat(formData.monthlySalary) <= 0) {
      newErrors.monthlySalary = "Monthly salary must be greater than 0";
    }

    if (!formData.fixedExpenses || parseFloat(formData.fixedExpenses) < 0) {
      newErrors.fixedExpenses = "Fixed expenses must be 0 or greater";
    }

    if (
      !formData.savingsGoalAmount ||
      parseFloat(formData.savingsGoalAmount) <= 0
    ) {
      newErrors.savingsGoalAmount = "Savings goal must be greater than 0";
    }

    if (
      !formData.goalDurationMonths ||
      parseInt(formData.goalDurationMonths) <= 0
    ) {
      newErrors.goalDurationMonths = "Goal duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      setApiError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const payload = {
        monthlySalary: formData.monthlySalary,
        monthlyExpenses: formData.fixedExpenses,
        goalAmount: formData.savingsGoalAmount,
        goalDuration: formData.goalDurationMonths,
      };

      const url = isEditMode ? `/api/plan/${editPlanId}` : "/api/plan";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        setApiError(data.message || "Failed to save financial plan");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("API Error:", error);
      setApiError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.monthlySalary !== "" &&
    formData.fixedExpenses !== "" &&
    formData.savingsGoalAmount !== "" &&
    formData.goalDurationMonths !== "" &&
    Object.keys(errors).length === 0;

  return (
    <Card className="glass-card border border-white/[0.05] shadow-2xl">
      <CardHeader className="pb-4 border-b border-white/[0.05]">
        <CardTitle className="text-white">
          {isEditMode ? "Update Financial Plan" : "Financial Information"}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {isEditMode
            ? "Adjust your details and we'll recalculate your plan"
            : "Enter your details to calculate your personalized savings plan"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">{apiError}</p>
            </div>
          )}

          <InputField
            id="monthlySalary"
            label="Monthly Salary"
            type="number"
            placeholder="e.g., 5000"
            value={formData.monthlySalary}
            onChange={handleInputChange("monthlySalary")}
            error={errors.monthlySalary}
            required
            disabled={isLoading}
          />

          <InputField
            id="fixedExpenses"
            label="Fixed Expenses"
            type="number"
            placeholder="e.g., 1500"
            value={formData.fixedExpenses}
            onChange={handleInputChange("fixedExpenses")}
            error={errors.fixedExpenses}
            required
            disabled={isLoading}
          />

          <InputField
            id="savingsGoalAmount"
            label="Savings Goal Amount"
            type="number"
            placeholder="e.g., 10000"
            value={formData.savingsGoalAmount}
            onChange={handleInputChange("savingsGoalAmount")}
            error={errors.savingsGoalAmount}
            required
            disabled={isLoading}
          />

          <InputField
            id="goalDurationMonths"
            label="Goal Duration (Months)"
            type="number"
            placeholder="e.g., 12"
            value={formData.goalDurationMonths}
            onChange={handleInputChange("goalDurationMonths")}
            error={errors.goalDurationMonths}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full text-[#0A0D14] bg-white hover:bg-slate-200 text-base h-12 mt-8 rounded-xl font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            disabled={!isFormValid || isLoading}
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Calculating..."
              : isEditMode
                ? "Update Plan →"
                : "View Your Dashboard →"}
          </Button>

          {isEditMode && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:text-white rounded-xl h-12"
              onClick={() => router.push("/dashboard")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
