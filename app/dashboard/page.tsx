"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatsBar from "@/components/dashboard/stats-bar";
import ScenarioForm from "@/components/dashboard/scenario-form";
import ScenarioCard from "@/components/dashboard/scenario-card";
import EmptyState from "@/components/dashboard/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData, DashboardScenario, DashboardSession } from "@/components/dashboard/types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const scenarios = data?.scenarios ?? [];
  const globalStats = data?.globalStats ?? {
    totalScenarios: 0,
    totalSessions: 0,
    completedSessions: 0,
    avgScore: null,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <StatsBar
          totalScenarios={globalStats.totalScenarios}
          totalSessions={globalStats.totalSessions}
          completedSessions={globalStats.completedSessions}
          avgScore={globalStats.avgScore}
        />

        <ScenarioForm onScenarioCreated={fetchDashboard} />

        {scenarios.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Scenarios
            </h2>
            {scenarios.map((scenario: DashboardScenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                sessions={scenario.sessions}
                stats={scenario.stats}
                onSessionCreated={fetchDashboard}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
