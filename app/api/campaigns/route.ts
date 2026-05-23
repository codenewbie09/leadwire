import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns } from "@/db/schema";

export async function POST(req: NextRequest) {
  const { personaDescription } = await req.json();
  if (!personaDescription) {
    return NextResponse.json(
      { error: "personaDescription required" },
      { status: 400 },
    );
  }
  const [campaign] = await db
    .insert(campaigns)
    .values({ personaDescription })
    .returning();
  return NextResponse.json(campaign);
}

export async function GET() {
  const all = await db.select().from(campaigns).orderBy(campaigns.createdAt);
  return NextResponse.json(all);
}
