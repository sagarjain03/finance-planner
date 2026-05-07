'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Flashcard } from '@/components/learning/Flashcard';
import { LearningDialog } from '@/components/learning/LearningDialog';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { learningTerms, type LearningTerm } from '@/data/learningTerms';
import { motion } from 'framer-motion';

type Category = 'investments' | 'savings' | 'budgeting' | 'taxes' | 'goals';

const categories: { value: Category; label: string }[] = [
  { value: 'investments', label: '📈 Investments' },
  { value: 'savings', label: '💰 Savings' },
  { value: 'budgeting', label: '📊 Budgeting' },
  { value: 'taxes', label: '🏛️ Taxes' },
  { value: 'goals', label: '🎯 Goals' },
];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('investments');
  const [selectedTerm, setSelectedTerm] = useState<LearningTerm | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const filteredTerms = learningTerms.filter((term) => term.category === selectedCategory);
  
  // Find related topics for the selected term
  const getRelatedTopics = (term: LearningTerm): LearningTerm[] => {
    return learningTerms
      .filter((t) => t.id !== term.id && t.category === term.category)
      .slice(0, 3);
  };

  return (
    <>
      <PageContainer className="py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl font-black text-zinc-100 mb-3">
              Financial Learning Hub
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl">
              Learn financial concepts explained in simple language. Click on any flashcard to reveal detailed explanations with real-world examples.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-zinc-100 text-zinc-900 shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Terms Grid */}
          <motion.div variants={itemVariants} className="space-y-4">
            <p className="text-sm text-zinc-400 font-semibold">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} in this category
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTerms.map((term, index) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Flashcard term={term} onLearnMore={() => setSelectedTerm(term)} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-2xl bg-zinc-800 border border-zinc-700"
          >
            <h3 className="text-xl font-bold text-zinc-100 mb-4">💡 Learning Tips</h3>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex gap-3">
                <span className="text-2xl">📚</span>
                <span>Start with basic concepts in budgeting and savings before moving to investments</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🔁</span>
                <span>Review terms multiple times to strengthen your understanding</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">✍️</span>
                <span>Apply these concepts to your own financial situation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <span>Use our AI mentor to ask follow-up questions and clarify doubts</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Learning Dialog */}
        <LearningDialog
          term={selectedTerm}
          isOpen={!!selectedTerm}
          onClose={() => setSelectedTerm(null)}
          relatedTopics={selectedTerm ? getRelatedTopics(selectedTerm) : []}
        />
      </PageContainer>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </>
  );
}
