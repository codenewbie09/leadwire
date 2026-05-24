import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sessions, messages as messagesTable, scenarios } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scenarioId = searchParams.get("scenarioId");
  if (!scenarioId) {
    return NextResponse.json({ error: "scenarioId required" }, { status: 400 });
  }

  const all = await db
    .select()
    .from(sessions)
    .where(eq(sessions.scenarioId, scenarioId))
    .orderBy(sessions.createdAt);

  const scenario = await db.query.scenarios.findFirst({
    where: eq(scenarios.id, scenarioId),
  });

  const rows = await Promise.all(
    all.map(async (s) => {
      const msgs = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.sessionId, s.id));
      const turns = msgs.length;
      const feedback = s.feedback as Record<string, unknown> | null;
      const overallScore = feedback?.overall ?? "";
      const completedDate = s.createdAt?.toISOString?.() ?? "";
      const prospectName = `"${s.prospectName.replace(/"/g, '""')}"`;
      const difficulty = scenario?.difficulty ?? "";
      return `${prospectName},${difficulty},${s.status},${turns},${overallScore},${completedDate}`;
    }),
  );

  const header = "Prospect Name,Difficulty,Status,Turns,Overall Score,Completed Date\n";
  return new NextResponse(header + rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=sessions.csv",
    },
  });
}
