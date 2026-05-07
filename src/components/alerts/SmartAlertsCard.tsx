import React from "react";
import { Alert } from "@/types/financial";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface SmartAlertsCardProps {
  alerts?: Alert[];
}

export function SmartAlertsCard({ alerts }: SmartAlertsCardProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-6 text-center text-gray-400">
          No active alerts. Your financial plan is looking good!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <span className="text-xl">🚨</span> Smart Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            let bgColor = "bg-gray-800";
            let borderColor = "border-gray-700";
            let textColor = "text-gray-200";

            if (alert.type === "overspending") {
              bgColor = "bg-rose-500/10";
              borderColor = "border-rose-500/30";
              textColor = "text-rose-400";
            } else if (alert.type === "low_savings") {
              bgColor = "bg-amber-500/10";
              borderColor = "border-amber-500/30";
              textColor = "text-amber-400";
            } else if (alert.type === "goal_delay") {
              bgColor = "bg-indigo-500/10";
              borderColor = "border-indigo-500/30";
              textColor = "text-indigo-400";
            }

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border ${bgColor} ${borderColor} flex items-start gap-3`}
              >
                <div className="mt-1">
                  {alert.type === "overspending" && "⚠️"}
                  {alert.type === "low_savings" && "📉"}
                  {alert.type === "goal_delay" && "⏳"}
                </div>
                <p className={`text-sm ${textColor} leading-relaxed`}>
                  {alert.message}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
