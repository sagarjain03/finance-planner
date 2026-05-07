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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl max-h-[90vh] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="sticky top-0 p-6 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {term.category}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-100">
                  {term.term}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6 flex gap-2 border-b border-slate-700 overflow-x-auto">
              {['overview', 'detailed', 'example', 'tips'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`pb-4 px-4 font-semibold text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-slate-100 border-b-2 border-slate-100'
                      : 'text-slate-500 hover:text-slate-400'
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
                      <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="text-slate-300 leading-relaxed text-lg">
                          {term.shortExplanation}
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Category
                          </p>
                          <p className="text-slate-200 capitalize">{term.category}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Difficulty
                          </p>
                          <p className="text-slate-200">Beginner Friendly</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'detailed' && (
                    <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                      <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
                        {term.detailedExplanation}
                      </p>
                    </div>
                  )}

                  {activeTab === 'example' && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                        <div className="flex items-start gap-3 mb-4">
                          <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-slate-300 mb-2">Real-World Scenario</p>
                            <p className="text-slate-400 leading-relaxed">
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
                          <div key={idx} className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex gap-3">
                            <Lightbulb className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-slate-300 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    Related Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedTopics.map((topic) => (
                      <button
                        key={topic.id}
                        className="p-3 text-left rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors group"
                      >
                        <p className="text-xs font-semibold text-slate-500 group-hover:text-slate-400">
                          {topic.category.toUpperCase()}
                        </p>
                        <p className="text-slate-200 font-semibold group-hover:text-slate-100">
                          {topic.term}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-6 border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-colors"
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
