import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { runAgentTurn } from "@/lib/agent";

export async function POST(req: NextRequest) {
  const { campaignId, prospectName } = await req.json();
  if (!campaignId || !prospectName) {
    return NextResponse.json(
      { error: "campaignId and prospectName required" },
      { status: 400 },
    );
  }

  const [conversation] = await db
    .insert(conversations)
    .values({ campaignId, prospectName })
    .returning();

  await runAgentTurn(conversation.id);

  return NextResponse.json(conversation);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }
  const all = await db
    .select()
    .from(conversations)
    .where(eq(conversations.campaignId, campaignId))
    .orderBy(conversations.createdAt);
  return NextResponse.json(all);
}
