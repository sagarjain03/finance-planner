"use client";

import React, { useState } from "react";
import { Flashcard, type LearningTerm } from "./Flashcard";
import { LearningDialog } from "./LearningDialog";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlashcardDeckProps {
  cards: LearningTerm[];
  onComplete?: () => void;
}

export function FlashcardDeck({ cards, onComplete }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<LearningTerm | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const isComplete = completed.has(currentCard.id);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMastered = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(currentCard.id);
    setCompleted(newCompleted);

    if (newCompleted.size === cards.length) {
      onComplete?.();
    } else {
      handleNext();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <>
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm font-medium text-indigo-400">
            {completed.size} mastered
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard (trigger-only) */}
      <Flashcard term={currentCard} onLearnMore={(t) => setSelectedTerm(t)} />

      {/* Actions */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-3 flex-1 justify-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Skip
          </Button>
          <Button
            onClick={handleMastered}
            className={`bg-gradient-to-r ${
              isComplete
                ? "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                : "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            }`}
          >
            {isComplete ? "✓ Mastered" : "I Know This"}
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Completion Message */}
      {completed.size === cards.length && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/50">
          <h3 className="text-xl font-bold text-emerald-400 mb-2">🎉 Congratulations!</h3>
          <p className="text-gray-300">
            You've mastered all {cards.length} financial concepts. Great job on improving your financial literacy!
          </p>
        </div>
      )}
    </div>
    {/* Dialog for current card (used in deck) */}
    <LearningDialog
      term={selectedTerm}
      isOpen={!!selectedTerm}
      onClose={() => setSelectedTerm(null)}
      relatedTopics={
        selectedTerm
          ? cards.filter((c) => c.id !== selectedTerm.id && c.category === selectedTerm.category).slice(0, 3)
          : []
      }
    />
    </>
  );
}
