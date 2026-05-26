import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { scenarios } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const allScenarios = await db.query.scenarios.findMany({
    where: eq(scenarios.userId, userId),
    with: { sessions: true },
    orderBy: (scenarios, { desc }) => [desc(scenarios.createdAt)],
  });

  let globalTotalScenarios = 0;
  let globalTotalSessions = 0;
  let globalCompletedSessions = 0;
  let globalScoreSum = 0;
  let globalScoreCount = 0;

  const scenariosData = allScenarios.map((scenario) => {
    const allSessions = scenario.sessions ?? [];
    const completed = allSessions.filter((s) => s.status === "completed");
    const sessionScores = completed
      .map((s) => {
        const fb = s.feedback as {
          overall?: number;
          opener?: { score: number };
          qualification?: { score: number };
          objectionHandling?: { score: number };
          closing?: { score: number };
          notes?: string;
        } | null;
        return fb?.overall ?? null;
      })
      .filter((s): s is number => s !== null);

    const avgScore =
      sessionScores.length > 0
        ? Math.round(
            (sessionScores.reduce((sum, s) => sum + s, 0) /
              sessionScores.length) *
              10,
          ) / 10
        : null;

    let topSession: {
      prospectName: string;
      score: number;
      sessionId: string;
    } | null = null;

    if (completed.length > 0) {
      let bestScore = -1;
      for (const s of completed) {
        const fb = s.feedback as {
          overall?: number;
        } | null;
        const score = fb?.overall ?? -1;
        if (score > bestScore) {
          bestScore = score;
          topSession = {
            prospectName: s.prospectName,
            score,
            sessionId: s.id,
          };
        }
      }
    }

    globalTotalScenarios += 1;
    globalTotalSessions += allSessions.length;
    globalCompletedSessions += completed.length;
    if (sessionScores.length > 0) {
      globalScoreSum += sessionScores.reduce((sum, s) => sum + s, 0);
      globalScoreCount += sessionScores.length;
    }

    return {
      id: scenario.id,
      title: scenario.title,
      personaDescription: scenario.personaDescription,
      industry: scenario.industry,
      difficulty: scenario.difficulty as "easy" | "medium" | "hard",
      createdAt: scenario.createdAt?.toISOString() ?? new Date().toISOString(),
      sessions: allSessions.map((s) => ({
        id: s.id,
        scenarioId: s.scenarioId,
        prospectName: s.prospectName,
        status: s.status as "active" | "completed",
        feedback: s.feedback as object | null,
        createdAt: s.createdAt?.toISOString() ?? new Date().toISOString(),
      })),
      stats: {
        total: allSessions.length,
        completed: completed.length,
        avgScore,
        topSession,
      },
    };
  });

  const globalAvgScore =
    globalScoreCount > 0
      ? Math.round((globalScoreSum / globalScoreCount) * 10) / 10
      : null;

  return NextResponse.json({
    scenarios: scenariosData,
    globalStats: {
      totalScenarios: globalTotalScenarios,
      totalSessions: globalTotalSessions,
      completedSessions: globalCompletedSessions,
      avgScore: globalAvgScore,
    },
  });
}
