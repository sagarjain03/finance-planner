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

interface GoalInput {
  id: string;
  name: string;
  amount: string;
  duration: string;
}

interface FormData {
  monthlySalary: string;
  needs: string;
  wants: string;
  goals: GoalInput[];
}

interface SalaryFormProps {
  /** Plan ID when editing an existing plan */
  editPlanId?: string | null;
  /** Pre-fill values when editing */
  initialData?: {
    monthlySalary: number;
    needs?: number;
    wants?: number;
    monthlyExpenses?: number;
    goalAmount?: number;
    goalDuration?: number;
    goals?: Array<{ id: string; name: string; amount: number; duration: number }>;
  } | null;
}

const EMPTY_FORM: FormData = {
  monthlySalary: "",
  needs: "",
  wants: "",
  goals: [{ id: crypto.randomUUID(), name: "", amount: "", duration: "" }],
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
      // Support both new (needs+wants) and legacy (monthlyExpenses) plans
      const needsValue = initialData.needs ?? 0;
      const wantsValue =
        initialData.wants ??
        (initialData.monthlyExpenses
          ? initialData.monthlyExpenses - needsValue
          : 0);

      let initialGoals: GoalInput[] = [];
      if (initialData.goals && initialData.goals.length > 0) {
        initialGoals = initialData.goals.map((g) => ({
          id: g.id,
          name: g.name,
          amount: String(g.amount),
          duration: String(g.duration),
        }));
      } else if (initialData.goalAmount && initialData.goalDuration) {
        initialGoals = [{
          id: crypto.randomUUID(),
          name: "Main Savings Goal",
          amount: String(initialData.goalAmount),
          duration: String(initialData.goalDuration),
        }];
      } else {
        initialGoals = [{ id: crypto.randomUUID(), name: "", amount: "", duration: "" }];
      }

      setFormData({
        monthlySalary: String(initialData.monthlySalary),
        needs: String(needsValue),
        wants: String(wantsValue),
        goals: initialGoals,
      });
    }
  }, [initialData]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.monthlySalary || parseFloat(formData.monthlySalary) <= 0) {
      newErrors.monthlySalary = "Monthly salary must be greater than 0";
    }

    if (formData.needs === "" || parseFloat(formData.needs) < 0) {
      newErrors.needs = "Needs (rent, food, bills) must be 0 or greater";
    }

    if (formData.wants === "" || parseFloat(formData.wants) < 0) {
      newErrors.wants = "Wants (shopping, entertainment) must be 0 or greater";
    }

    // Cross-field: total expenses must be less than salary
    const salary = parseFloat(formData.monthlySalary) || 0;
    const totalExpenses =
      (parseFloat(formData.needs) || 0) + (parseFloat(formData.wants) || 0);
    if (salary > 0 && totalExpenses >= salary) {
      newErrors.wants =
        "Total expenses (needs + wants) must be less than your salary";
    }

    if (formData.goals.length === 0) {
      newErrors.goals = "At least one goal is required";
    }

    formData.goals.forEach((goal, idx) => {
      if (!goal.name.trim()) newErrors[`goal_${idx}_name`] = "Goal name is required";
      if (!goal.amount || parseFloat(goal.amount) <= 0) newErrors[`goal_${idx}_amount`] = "Goal amount must be > 0";
      if (!goal.duration || parseInt(goal.duration) <= 0) newErrors[`goal_${idx}_duration`] = "Duration must be > 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
        needs: formData.needs,
        wants: formData.wants,
        goals: formData.goals.map(g => ({
          id: g.id,
          name: g.name,
          amount: parseFloat(g.amount),
          duration: parseInt(g.duration)
        })),
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
    formData.needs !== "" &&
    formData.wants !== "" &&
    formData.goals.every(g => g.name !== "" && g.amount !== "" && g.duration !== "") &&
    Object.keys(errors).length === 0;

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { id: crypto.randomUUID(), name: "", amount: "", duration: "" }]
    }));
  };

  const removeGoal = (id: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  const updateGoal = (id: string, field: keyof GoalInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, [field]: value } : g)
    }));
    setApiError(null);
  };

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
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm font-medium text-red-400">{apiError}</p>
            </div>
          )}

          <InputField
            id="monthlySalary"
            label="Monthly Salary"
            type="number"
            placeholder="e.g., 50000"
            value={formData.monthlySalary}
            onChange={handleInputChange("monthlySalary")}
            error={errors.monthlySalary}
            required
            disabled={isLoading}
          />

          {/* 50/30/20 section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Expense Breakdown (50/30/20)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] space-y-4">
              <InputField
                id="needs"
                label="Needs — Rent, Food, Bills (target: 50%)"
                type="number"
                placeholder="e.g., 25000"
                value={formData.needs}
                onChange={handleInputChange("needs")}
                error={errors.needs}
                required
                disabled={isLoading}
              />
              <InputField
                id="wants"
                label="Wants — Shopping, Entertainment (target: 30%)"
                type="number"
                placeholder="e.g., 15000"
                value={formData.wants}
                onChange={handleInputChange("wants")}
                error={errors.wants}
                required
                disabled={isLoading}
              />

              {/* Live total display */}
              {formData.needs !== "" && formData.wants !== "" && (
                <div className="text-xs text-slate-500 pt-1">
                  Total expenses:{" "}
                  <span className="text-slate-300 font-semibold">
                    ₹
                    {(
                      (parseFloat(formData.needs) || 0) +
                      (parseFloat(formData.wants) || 0)
                    ).toLocaleString("en-IN")}
                  </span>
                  {formData.monthlySalary && (
                    <span className="ml-2 text-slate-500">
                      / ₹
                      {parseFloat(formData.monthlySalary).toLocaleString(
                        "en-IN"
                      )}{" "}
                      salary
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Multi-Goal Section */}
          <div className="space-y-3 pt-4 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Financial Goals
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addGoal} className="h-8 text-xs border-white/[0.1] bg-white/[0.02]">
                + Add Goal
              </Button>
            </div>
            
            {errors.goals && <p className="text-sm text-red-400">{errors.goals}</p>}

            {formData.goals.map((goal, idx) => (
              <div key={goal.id} className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] space-y-4 relative">
                {formData.goals.length > 1 && (
                  <button type="button" onClick={() => removeGoal(goal.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    ✕
                  </button>
                )}
                <InputField
                  id={`goal_${idx}_name`}
                  label="Goal Name"
                  type="text"
                  placeholder="e.g., Emergency Fund, New Car"
                  value={goal.name}
                  onChange={(e) => updateGoal(goal.id, "name", e.target.value)}
                  error={errors[`goal_${idx}_name`]}
                  required
                  disabled={isLoading}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id={`goal_${idx}_amount`}
                    label="Amount (₹)"
                    type="number"
                    placeholder="e.g., 500000"
                    value={goal.amount}
                    onChange={(e) => updateGoal(goal.id, "amount", e.target.value)}
                    error={errors[`goal_${idx}_amount`]}
                    required
                    disabled={isLoading}
                  />
                  <InputField
                    id={`goal_${idx}_duration`}
                    label="Duration (Months)"
                    type="number"
                    placeholder="e.g., 24"
                    value={goal.duration}
                    onChange={(e) => updateGoal(goal.id, "duration", e.target.value)}
                    error={errors[`goal_${idx}_duration`]}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            ))}
          </div>

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
