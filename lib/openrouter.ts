export type AgentStatus = "active" | "booked" | "rejected";

export interface AgentResponse {
  message: string;
  status: AgentStatus;
}

function extractStatus(text: string): AgentStatus {
  if (/"status"\s*:\s*"(booked)"/i.test(text)) return "booked";
  if (/"status"\s*:\s*"(rejected)"/i.test(text)) return "rejected";
  return "active";
}

function extractMessage(text: string): string {
  const match = text.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  return match ? match[1] : text;
}

export async function callOpenRouter(
  systemPrompt: string,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<AgentResponse> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Leadwire",
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [{ role: "system", content: systemPrompt }, ...history],
        temperature: 0.7,
        max_tokens: 300,
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";

  const clean = raw.replace(/```json\n?|```/g, "").trim();

  for (const text of [clean, `{${clean}}`]) {
    try {
      const parsed = JSON.parse(text);
      return {
        message: parsed.message ?? clean,
        status: (["active", "booked", "rejected"].includes(parsed.status)
          ? parsed.status
          : "active") as AgentStatus,
      };
    } catch {
      continue;
    }
  }

  return { message: extractMessage(clean), status: extractStatus(clean) };
}
