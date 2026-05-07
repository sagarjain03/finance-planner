'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow, type FinancialContext } from './ChatWindow';

interface FloatingChatButtonProps {
  context?: FinancialContext;
}

export function FloatingChatButton({ context }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-colors ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-600'
            : 'bg-slate-800 hover:bg-slate-700'
        } flex items-center justify-center text-slate-100 group`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-12 right-0 px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm font-semibold whitespace-nowrap pointer-events-none"
          >
            Ask Mentor 💡
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 right-2 w-2 h-2 bg-slate-800 rotate-45 transform translate-y-1"
            />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} context={context} />
    </>
  );
}
