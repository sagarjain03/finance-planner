"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-dashed border-2 border-slate-300 dark:border-slate-700">
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mb-4 p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
          {description}
        </p>

        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}
