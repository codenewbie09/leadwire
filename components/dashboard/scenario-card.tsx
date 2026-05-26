"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardScenario, DashboardSession } from "./types";

interface ScenarioCardProps {
  scenario: DashboardScenario;
  sessions: DashboardSession[];
  stats: {
    total: number;
    completed: number;
    avgScore: number | null;
    topSession: {
      prospectName: string;
      score: number;
      sessionId: string;
    } | null;
  };
  onSessionCreated: () => void;
}

const difficultyVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  easy: "secondary",
  medium: "outline",
  hard: "destructive",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  active: "default",
  completed: "secondary",
};

export default function ScenarioCard({
  scenario,
  sessions,
  stats,
  onSessionCreated,
}: ScenarioCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [prospectName, setProspectName] = useState("");
  const [creating, setCreating] = useState(false);

  const active = sessions.filter((s) => s.status === "active");
  const completed = sessions.filter((s) => s.status === "completed");

  async function handleStartSession() {
    if (!prospectName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          prospectName: prospectName.trim(),
        }),
      });

      if (res.ok) {
        const newSession = await res.json();
        setProspectName("");
        onSessionCreated();
        router.push(`/session/${newSession.id}`);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Clickable header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {scenario.title}
                </span>
                <Badge variant={difficultyVariant[scenario.difficulty] ?? "outline"}>
                  {scenario.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {scenario.personaDescription}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                <span>{scenario.industry}</span>
                <span>{stats.total} sessions</span>
                {stats.avgScore !== null && (
                  <span>Avg score: {stats.avgScore}/10</span>
                )}
                {stats.completed > 0 && (
                  <span>
                    {Math.round((stats.completed / stats.total) * 100)}%
                    completed
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              {stats.topSession && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/session/${stats.topSession!.sessionId}/review`);
                  }}
                >
                  Best: {stats.topSession.score}/10
                </Badge>
              )}
              <svg
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded section */}
        {expanded && (
          <div className="border-t border-border px-4 py-3 bg-muted/30 space-y-3">
            {/* Start Session form */}
            <div className="flex items-center gap-2">
              <Input
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleStartSession()
                }
                placeholder="Prospect name..."
                className="flex-1"
              />
              <Button
                onClick={handleStartSession}
                disabled={creating || !prospectName.trim()}
                size="sm"
              >
                {creating ? "Starting..." : "Start Session"}
              </Button>
            </div>

            {/* Export + stats row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Completed: {stats.completed}</span>
                {stats.total > 0 && (
                  <span>
                    Rate: {Math.round((stats.completed / stats.total) * 100)}%
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  window.open(
                    `/api/scenarios/${scenario.id}/export`,
                    "_blank",
                  );
                }}
              >
                Export CSV
              </Button>
            </div>

            {/* Active sessions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Active ({active.length})
              </h3>
              {active.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-2">
                  No active sessions
                </p>
              )}
              <div className="space-y-1">
                {active.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/session/${s.id}`)}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-card transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {s.prospectName}
                    </span>
                    <Badge
                      variant={statusVariant[s.status] ?? "outline"}
                    >
                      Active
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Completed sessions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Completed ({completed.length})
              </h3>
              {completed.length === 0 && (
                <p className="text-xs text-muted-foreground/60 text-center py-2">
                  No completed sessions
                </p>
              )}
              <div className="space-y-1">
                {completed.map((s) => {
                  const score = s.feedback?.overall ?? null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => router.push(`/session/${s.id}`)}
                      className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-card transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {s.prospectName}
                      </span>
                      <div className="flex items-center gap-2">
                        {score !== null && (
                          <span className="text-xs text-muted-foreground">
                            {score}/10
                          </span>
                        )}
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
