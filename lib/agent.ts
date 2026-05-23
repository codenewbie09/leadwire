import { db } from "@/db";
import { campaigns, conversations, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { callOpenRouter } from "./openrouter";

function buildSystemPrompt(
  personaDescription: string,
  prospectName: string,
): string {
  return `You are an AI SDR (Sales Development Representative) running LinkedIn outreach.

Target persona: ${personaDescription}
Prospect name: ${prospectName}

Your goals in order:
1. Send a short, personalized opener. No pitch yet.
2. Ask one relevant question to understand their situation.
3. Qualify: learn their role, team size, and pain points.
4. If they are a fit, propose a 15-minute discovery call.
5. If not a fit, politely disengage.

Rules:
- Write like a real LinkedIn DM. 1-3 sentences max. No buzzwords.
- Never say "I hope this finds you well" or anything robotic.
- Ask only ONE question per message.
- Do not pitch until you have qualified them.
- Once they accept a meeting → set status to "booked".
- If they decline or are clearly not a fit → set status to "rejected".

You MUST respond with ONLY valid JSON wrapped in curly braces. No markdown. No backticks. No extra text.

Example:
{"message": "your DM here", "status": "active", "reasoning": "one-line note"}`;
}

export async function runAgentTurn(conversationId: string) {
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
    with: { campaign: true },
  });

  if (!conversation) throw new Error("Conversation not found");
  if (conversation.status !== "active") {
    throw new Error(`Conversation is already ${conversation.status}`);
  }

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  const systemPrompt = buildSystemPrompt(
    conversation.campaign.personaDescription,
    conversation.prospectName,
  );

  const formattedHistory = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const result = await callOpenRouter(systemPrompt, formattedHistory);

  await db.insert(messages).values({
    conversationId,
    role: "assistant",
    content: result.message,
  });

  if (result.status !== "active") {
    await db
      .update(conversations)
      .set({ status: result.status })
      .where(eq(conversations.id, conversationId));
  }

  return result;
}
