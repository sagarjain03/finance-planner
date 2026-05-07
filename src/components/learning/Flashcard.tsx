"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";

export interface LearningTerm {
  id: string;
  term: string;
  shortExplanation: string;
  detailedExplanation: string;
  example: string;
  category: "investments" | "savings" | "budgeting" | "taxes" | "goals";
}

interface FlashcardProps {
  term: LearningTerm;
  onLearnMore: (term: LearningTerm) => void;
}

export function Flashcard({ term, onLearnMore }: FlashcardProps) {
  return (
    <Card
      onClick={() => onLearnMore(term)}
      className={`bg-linear-to-br from-slate-800 to-slate-900 border-2 border-slate-700 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-slate-600 h-64 flex flex-col justify-between p-6`}
    >
      <div>
        <p className={`text-sm font-semibold uppercase tracking-wider mb-2 text-slate-400`}>
          {term.category}
        </p>
        <h3 className="text-2xl font-black text-slate-100">
          {term.term}
        </h3>
      </div>

      <div>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">
          {term.shortExplanation}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore(term);
          }}
          className={`text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors`}
        >
          Learn more →
        </button>
      </div>
    </Card>
  );
}
