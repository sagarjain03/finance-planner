"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface FormData {
  monthlySalary: string;
  needs: string;
  wants: string;
  riskLevel: string;
}

interface ConversationalFlowProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

const STEPS = [
  {
    id: 1,
    title: "What's your monthly salary?",
    subtitle: "This helps us calculate your savings potential",
    key: "monthlySalary",
    type: "number",
    placeholder: "e.g., 50000",
    icon: "💰",
  },
  {
    id: 2,
    title: "How much on needs monthly?",
    subtitle: "Rent, groceries, bills, utilities (target: 50%)",
    key: "needs",
    type: "number",
    placeholder: "e.g., 25000",
    icon: "🏠",
  },
  {
    id: 3,
    title: "How much on wants monthly?",
    subtitle: "Entertainment, shopping, dining (target: 30%)",
    key: "wants",
    type: "number",
    placeholder: "e.g., 15000",
    icon: "🎉",
  },
  {
    id: 4,
    title: "What's your risk level?",
    subtitle: "Conservative, Moderate, or Aggressive",
    key: "riskLevel",
    type: "select",
    options: ["Conservative", "Moderate", "Aggressive"],
    icon: "📊",
  },
];

export function ConversationalFlow({
  onSubmit,
  isLoading = false,
}: ConversationalFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    monthlySalary: "",
    needs: "",
    wants: "",
    riskLevel: "",
  });

  const currentStep = STEPS[step - 1];
  const progress = (step / STEPS.length) * 100;

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentStep.key]: value,
    }));
  };

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = formData[currentStep.key as keyof FormData]?.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0B0F17] dark:to-[#1a1f2e] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Step {step} of {STEPS.length}
            </h2>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white dark:bg-slate-900/80 border-0 shadow-2xl backdrop-blur-xl">
              <div className="p-12">
                {/* Icon */}
                <div className="text-6xl mb-6">{currentStep.icon}</div>

                {/* Question */}
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
                  {currentStep.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  {currentStep.subtitle}
                </p>

                {/* Input Field */}
                {currentStep.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={currentStep.placeholder}
                    value={formData[currentStep.key as keyof FormData]}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-14 text-lg mb-8 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    autoFocus
                  />
                ) : (
                  <div className="flex gap-3 mb-8">
                    {currentStep.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleChange(option)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                          formData.riskLevel === option
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex-1 h-12 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid || isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50"
                  >
                    {step === STEPS.length ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isLoading ? "Creating Plan..." : "Create Plan"}
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicators */}
        <div className="flex gap-2 mt-12 justify-center">
          {STEPS.map((s) => (
            <motion.div
              key={s.id}
              className={`h-2 rounded-full transition-all ${
                s.id <= step
                  ? "bg-indigo-500 w-6"
                  : "bg-slate-300 dark:bg-slate-700 w-2"
              }`}
              initial={false}
              animate={{
                width: s.id <= step ? 24 : 8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
