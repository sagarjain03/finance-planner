"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";

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
    subtitle: "This helps us understand your earning capacity.",
    key: "monthlySalary",
    type: "number",
    placeholder: "e.g. 50000",
    icon: "💰",
  },
  {
    id: 2,
    title: "How much do you spend on needs?",
    subtitle: "Rent, groceries, utilities, bills.",
    key: "needs",
    type: "number",
    placeholder: "e.g. 25000",
    icon: "🏠",
  },
  {
    id: 3,
    title: "How much do you spend on wants?",
    subtitle: "Entertainment, shopping, dining.",
    key: "wants",
    type: "number",
    placeholder: "e.g. 12000",
    icon: "🎯",
  },
  {
    id: 4,
    title: "Choose your investment style",
    subtitle: "This helps personalize your investment strategy.",
    key: "riskLevel",
    type: "select",
    options: ["Conservative", "Moderate", "Aggressive"],
    icon: "📈",
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

  const isStepValid =
    formData[currentStep.key as keyof FormData]?.trim() !== "";

  return (
    <div className="h-full  text-white flex  px-6 py-16">
      <div className="w-full max-w-3xl">
        

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-500 mb-3">
            <span>
              Step {step} of {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-zinc-700 to-zinc-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="bg-zinc-800/90 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden rounded-2xl">
              <div className="p-10 md:p-14">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-8"
                >
                  {currentStep.icon}
                </motion.div>

                {/* Question */}
                <h2 className="text-4xl font-bold tracking-tight mb-3">
                  {currentStep.title}
                </h2>

                <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                  {currentStep.subtitle}
                </p>

                {/* Input */}
                {currentStep.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={currentStep.placeholder}
                    value={formData[currentStep.key as keyof FormData]}
                    onChange={(e) => handleChange(e.target.value)}
                    className="h-14 rounded-2xl border border-white/10 bg-black/40 text-white placeholder:text-zinc-600 text-lg focus-visible:ring-1 focus-visible:ring-zinc-500"
                    autoFocus
                  />
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {currentStep.options?.map((option) => (
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        key={option}
                        onClick={() => handleChange(option)}
                        className={`rounded-2xl border px-6 py-5 text-left transition-all duration-200 ${
                          formData.riskLevel === option
                            ? "bg-zinc-900 border-zinc-700 shadow-lg shadow-black/30"
                            : "bg-zinc-950 border-white/10 hover:border-zinc-700 hover:bg-zinc-900/60"
                        }`}
                      >
                        <div className="font-semibold text-white mb-1">
                          {option}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {option === "Conservative" &&
                            "Lower risk, stable growth"}
                          {option === "Moderate" &&
                            "Balanced risk and returns"}
                          {option === "Aggressive" &&
                            "Higher risk, long-term growth"}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex-1 h-12 rounded-xl border-white/10 bg-zinc-950 hover:bg-zinc-900 text-zinc-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid || isLoading}
                    className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    {step === STEPS.length ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isLoading
                          ? "Generating Plan..."
                          : "Generate My Plan"}
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {STEPS.map((s) => (
            <motion.div
              key={s.id}
              animate={{
                width: s.id <= step ? 28 : 8,
              }}
              className={`h-2 rounded-full ${
                s.id <= step
                  ? "bg-zinc-500"
                  : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}