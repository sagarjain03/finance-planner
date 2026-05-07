'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertCircle, Lightbulb } from 'lucide-react';

export interface LearningTerm {
  id: string;
  term: string;
  shortExplanation: string;
  detailedExplanation: string;
  example: string;
  category: 'investments' | 'savings' | 'budgeting' | 'taxes' | 'goals';
}

export interface LearningDialogProps {
  term: LearningTerm | null;
  isOpen: boolean;
  onClose: () => void;
  relatedTopics?: LearningTerm[];
}

export function LearningDialog({ term, isOpen, onClose, relatedTopics = [] }: LearningDialogProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'example' | 'tips'>('overview');

  if (!term) return null;

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 "
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-zinc-950 to-black shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 p-6 border-b border-white/10 bg-zinc-900/80 backdrop-blur-sm flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-zinc-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {term.category}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-zinc-100">
                  {term.term}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6 flex gap-2 border-b border-white/10 overflow-x-auto">
              {['overview', 'detailed', 'example', 'tips'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`pb-4 px-4 font-semibold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-zinc-100 border-b-2 border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  {tab === 'overview' && '📖 Overview'}
                  {tab === 'detailed' && '📚 Detailed'}
                  {tab === 'example' && '💡 Example'}
                  {tab === 'tips' && '🎯 Tips'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
                        <p className="text-zinc-300 leading-relaxed text-lg">
                          {term.shortExplanation}
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Category
                          </p>
                          <p className="text-zinc-200 capitalize">{term.category}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            Difficulty
                          </p>
                          <p className="text-zinc-200">Beginner Friendly</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'detailed' && (
                    <div className="p-6 rounded-xl bg-zinc-900/60 border border-white/10 space-y-4">
                      <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap">
                        {term.detailedExplanation}
                      </p>
                    </div>
                  )}

                  {activeTab === 'example' && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-zinc-900/60 border border-white/10">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-zinc-300 mb-2">Real-World Scenario</p>
                            <p className="text-zinc-400 leading-relaxed">
                              {term.example}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tips' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {[
                          `Start small: You don't need a lot of money to understand ${term.term.toLowerCase()}`,
                          'Practice: Apply this concept to your own financial situation',
                          'Learn more: Explore related topics to build stronger financial knowledge',
                          'Ask questions: Use our AI chatbot to clarify any doubts',
                        ].map((tip, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 flex gap-3">
                            <Lightbulb className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                            <p className="text-zinc-300 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                    Related Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedTopics.map((topic) => (
                      <button
                        key={topic.id}
                        className="p-3 text-left rounded-lg bg-zinc-900/60 border border-white/10 hover:border-zinc-600 transition-colors group"
                      >
                        <p className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-400">
                          {topic.category.toUpperCase()}
                        </p>
                        <p className="text-zinc-200 font-semibold group-hover:text-zinc-100">
                          {topic.term}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-6 border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
