"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatsBarProps {
  totalScenarios: number;
  totalSessions: number;
  completedSessions: number;
  avgScore: number | null;
}

export default function StatsBar({
  totalScenarios,
  totalSessions,
  completedSessions,
  avgScore,
}: StatsBarProps) {
  const stats = [
    {
      label: "Scenarios",
      value: totalScenarios,
    },
    {
      label: "Total Sessions",
      value: totalSessions,
    },
    {
      label: "Completed",
      value: completedSessions,
    },
    {
      label: "Avg Score",
      value: avgScore !== null ? `${avgScore}/10` : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex flex-col items-center justify-center py-3">
            <span className="text-2xl font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
