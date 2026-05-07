'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';
import { ChatMessageComponent, type ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export interface FinancialContext {
  monthlySalary?: number;
  monthlyExpenses?: number;
  monthlySavings?: number;
  savingsRate?: number;
  goalAmount?: number;
  healthScore?: number;
  healthGrade?: string;
  investmentAllocation?: Array<{ type: string; percentage: number }>;
  taxData?: any;
  alerts?: Array<{ type: string; message: string }>;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  context?: FinancialContext;
}

const SUGGESTED_QUESTIONS = [
  'How can I improve my savings?',
  'What is a good emergency fund?',
  'How do I start investing?',
  'What is the 50-30-20 rule?',
  'How can I reduce my expenses?',
];

export function ChatWindow({ isOpen, onClose, context = {} }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-full max-w-md h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Financial Mentor</h3>
                <p className="text-xs text-slate-500">Always here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center">
                <MessageCircle className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-300 font-semibold mb-2">Hi there! 👋</p>
                <p className="text-slate-500 text-sm mb-6 max-w-xs">
                  I'm your AI financial mentor. Ask me anything about budgeting, saving, investing, or your personal plan.
                </p>
                <div className="space-y-2 w-full">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-xs transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <ChatMessageComponent
                    message={{
                      id: 'loading',
                      role: 'assistant',
                      content: '',
                      timestamp: new Date(),
                    }}
                    isLoading
                  />
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
