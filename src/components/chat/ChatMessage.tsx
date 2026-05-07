'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageComponentProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function ChatMessageComponent({ message, isLoading }: ChatMessageComponentProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-5 h-5 text-slate-300" />
        </div>
      )}

      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-slate-700 text-slate-100 rounded-br-none'
            : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700'
        }`}
      >
        {isLoading ? (
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0 mt-1">
          <User className="w-5 h-5 text-slate-100" />
        </div>
      )}
    </motion.div>
  );
}
