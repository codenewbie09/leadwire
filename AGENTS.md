# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

# PitchPerfect — AI Coding Agent Instructions

You are working on **PitchPerfect**, an AI sales roleplay training app. Follow these instructions exactly. Do not skip steps. Do not ask for clarification unless a step is explicitly blocked.

---

## Project Overview

PitchPerfect lets users practice sales conversations against an AI prospect that responds in-character. After the session ends, an AI sales coach scores the user's performance.

**Flow:**

1. User creates a scenario (persona description + difficulty: easy / medium / hard)
2. AI generates a realistic prospect brief (company, role, pain points, trigger event, personality)
3. User plays the SDR — sends the first message
4. AI responds in-character as the prospect
5. Session ends when the SDR proposes a meeting (or the prospect walks away)
6. AI delivers a scorecard: opener, qualification, objection handling, closing, overall score
7. Shareable review link for completed sessions

**Live URL:** https://pp-sales.vercel.app
**Repo:** https://github.com/codenewbie09/pitchperfect
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Drizzle ORM · PostgreSQL (Neon) · Groq API · Vercel

---

## Agent Rules

- TypeScript everywhere. No `.js` files.
- `async/await` only. No `.then()` chains.
- Never use `any` unless unavoidable — use proper types.
- Every file must compile before moving to the next step.
- Verify each step works before proceeding.
- Do not build anything not listed here.

---

## Step 0 — Read Skills Before Writing Any Code

Skills are located at:

```
/mnt/skills/public/
  frontend-design/SKILL.md   ← read before writing ANY React/UI code
```

**Required reads before starting:**

1. Read `/mnt/skills/public/frontend-design/SKILL.md` before writing any UI code.

Re-read before every new React component. If a skill conflicts with an explicit instruction here, follow this file.

---

## Environment Variables

```env
DATABASE_URL=postgresql://REPLACE_WITH_NEON_CONNECTION_STRING
GROQ_API_KEY=REPLACE_WITH_GROQ_KEY
```

Note: This project uses `GROQ_API_KEY` directly (unlike Leadwire which had a legacy `OPENROUTER_API_KEY` name). Do not confuse the two.

---

## Current File Structure

```
pitchperfect/
├── app/
│   ├── page.tsx                        # Scenario dashboard
│   ├── session/[id]/
│   │   └── page.tsx                    # Active session / chat view
│   ├── review/[id]/
│   │   └── page.tsx                    # Scorecard view (post-session)
│   ├── share/[id]/
│   │   └── page.tsx                    # Public shareable transcript
│   └── api/
│       ├── scenarios/route.ts          # CRUD for scenarios
│       ├── sessions/route.ts           # Create session + generate brief
│       ├── messages/route.ts           # Save SDR message + trigger prospect turn
│       ├── sessions/[id]/feedback/
│       │   └── route.ts               # Generate + store scorecard
│       ├── sessions/[id]/share/
│       │   └── route.ts               # Public share data (no auth)
│       └── scenarios/[id]/stats/
│           └── route.ts               # Per-scenario analytics
├── db/
│   ├── schema.ts
│   └── index.ts
├── lib/
│   └── prospect.ts                     # Core AI logic (do not restructure)
├── drizzle.config.ts
└── .env.local
```

---

## Database Schema

```ts
// db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "completed",
]);

export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  personaDescription: text("persona_description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id")
    .references(() => scenarios.id)
    .notNull(),
  prospectName: text("prospect_name").notNull(),
  prospectBrief: jsonb("prospect_brief"), // { company, role, painPoints, triggerEvent, personality }
  status: sessionStatusEnum("status").default("active").notNull(),
  feedback: jsonb("feedback"), // scorecard, stored after session ends
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  role: text("role").notNull(), // "user" (SDR) | "assistant" (prospect)
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Run migrations after any schema change:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## Core AI Logic — `lib/prospect.ts`

**This file is already implemented. Do not restructure it.**

It exports three functions — understand what each does before calling them:

### `generateProspectBrief(prospectName, personaDescription, difficulty)`

Called once when a session is created. Returns `{ company, role, painPoints, triggerEvent, personality }`. Store the result as `sessions.prospectBrief` (jsonb).

Difficulty affects personality:

- `easy` → enthusiastic, obvious pain, clear buying signals
- `medium` → neutral, asks thoughtful questions
- `hard` → skeptical, raises objections on pricing/competitors/timing

### `runProspectTurn(sessionId)`

Called after every SDR message. Reads full session + message history from DB, builds the in-character system prompt, calls Groq, returns `{ message, status }`.

**Server-side completion override is already implemented:** if the SDR has sent ≥2 messages and used a closing signal (schedule, meeting, call, demo, book, etc.) → forces `status: "completed"` regardless of model output.

When `status === "completed"`:

1. Save the prospect's final message to DB
2. Update `sessions.status` to `"completed"`
3. Immediately trigger `generateFeedback` and store result in `sessions.feedback`

### `generateFeedback(history)`

Called once when session completes. Takes full message history, returns scorecard:

```ts
{
  opener: { score: number, feedback: string },       // 1-10
  qualification: { score: number, feedback: string },
  objectionHandling: { score: number, feedback: string },
  closing: { score: number, feedback: string },
  overall: number,
  notes: string
}
```

Store in `sessions.feedback` (jsonb).

**Fallback model:** If `llama-3.1-8b-instant` errors consistently, switch to `mixtral-8x7b-32768`. Change only the `model` string in `callGroq` inside `prospect.ts`.

---

## API Routes

### `POST /api/scenarios`

Create a scenario. Body: `{ personaDescription, difficulty }`. Returns created scenario.

### `GET /api/scenarios`

List all scenarios ordered by `createdAt` desc.

### `POST /api/sessions`

Create a session. Body: `{ scenarioId, prospectName }`.

Steps inside this route (in order):

1. Insert session row
2. Call `generateProspectBrief(prospectName, scenario.personaDescription, scenario.difficulty)`
3. Store brief in `sessions.prospectBrief`
4. Return session — do NOT fire first prospect turn here. The SDR sends the first message.

### `GET /api/sessions?scenarioId=`

List sessions for a scenario with status.

### `POST /api/messages`

Body: `{ sessionId, content }`.

Steps:

1. Verify session is `active` — return 400 if not
2. Insert SDR message with `role: "user"`
3. Call `runProspectTurn(sessionId)`
4. Insert prospect response with `role: "assistant"`
5. If `status === "completed"`:
   - Update `sessions.status` to `"completed"`
   - Call `generateFeedback` with full history
   - Store feedback in `sessions.feedback`
6. Return `{ message, status, feedback? }`

### `GET /api/sessions/[id]/feedback`

Return `sessions.feedback` for a completed session. Return 404 if not completed yet.

### `GET /api/sessions/[id]/share`

Public endpoint — no auth. Returns session + messages + feedback. Used by `/share/[id]`.

### `GET /api/scenarios/[id]/stats`

Returns:

```json
{
  "total": 12,
  "completed": 8,
  "completionRate": 0.67,
  "avgOverallScore": 6.4,
  "avgTurns": 5.2,
  "scoreDistribution": {
    "opener": 7.1,
    "qualification": 6.2,
    "objectionHandling": 5.8,
    "closing": 6.8
  }
}
```

---

## Frontend Pages

**Read `/mnt/skills/public/frontend-design/SKILL.md` before writing any of these.**

Install shadcn/ui for components:

```bash
npx shadcn@latest init
```

### Page 1: Dashboard (`app/page.tsx`)

- Form to create a scenario: textarea for persona description, difficulty selector (Easy / Medium / Hard toggle), submit button
- List of scenarios as cards showing: persona (truncated), difficulty badge, session count, avg score if any
- Each card has a "Start Session" button → modal asking for prospect name → POST `/api/sessions` → navigate to `/session/[id]`
- Clicking a completed session on a card navigates to `/review/[id]`

### Page 2: Session / Chat (`app/session/[id]/page.tsx`)

- Status badge at top: green "Active", blue "Completed"
- Chat bubbles: SDR messages on the right (you), prospect on the left (AI)
- Show prospect name + company from brief at the top as context
- Text input + "Send" button at bottom if `active`
- On send: POST `/api/messages` → append both messages → re-fetch
- If response returns `status: "completed"` → hide input, show "Session complete" banner + "View Scorecard" button → navigate to `/review/[id]`
- Show a subtle typing indicator (CSS animation) while waiting for prospect response

### Page 3: Scorecard (`app/review/[id]/page.tsx`)

- Fetch feedback from `GET /api/sessions/[id]/feedback`
- Show four score cards: Opener, Qualification, Objection Handling, Closing — each with score/10 and one-line feedback
- Show overall score prominently (large number)
- Show `notes` (AI coach summary) below
- Show full conversation transcript below the scorecard
- "Share" button → copy `/share/[id]` link to clipboard
- "Try Again" button → creates a new session with same scenario

### Page 4: Public Share (`app/share/[id]/page.tsx`)

- Public, no auth required
- Shows: prospect name, scenario difficulty, full transcript
- Shows scorecard (all four scores + overall + notes)
- "Powered by PitchPerfect" footer with link to home
- This is what gets sent to job applications as proof

---

## Known Issues & Fixes

### 1. Session completion not triggering consistently

**Problem:** `runProspectTurn` server-side override checks `userMessages.length >= 2` but also requires a closing signal in any user message. If the SDR says "want to schedule a call?" on message 1, it won't trigger until message 2.

**Fix already in place:** The override fires when `userMessages.length >= 2 && sdrClosing`. This is intentional — a single message close is too aggressive. Do not change this threshold.

**If completion still doesn't trigger:** Check that `sessions.status` is being updated in `POST /api/messages` after `runProspectTurn` returns `"completed"`. This is the most common bug — the turn runs but the status write is missed.

### 2. `generateFeedback` called with empty history

**Problem:** If called before messages are committed, feedback is blank.

**Fix:** Always call `generateFeedback` AFTER inserting the prospect's final message in `POST /api/messages`. The order matters:

```
insert SDR message → runProspectTurn → insert prospect message → generateFeedback
```

### 3. Groq returns non-JSON for prospect turns

**Problem:** `llama-3.1-8b-instant` occasionally wraps output in markdown despite the prompt.

**Fix already in place:** `extractJSON` in `prospect.ts` has three fallback strategies. Do not modify it. If it still fails, switch to `mixtral-8x7b-32768`.

---

## Features to Build (priority order)

### ✅ Feature 1 — Core loop (prospect.ts is done)

`generateProspectBrief`, `runProspectTurn`, `generateFeedback` are implemented. Wire them into API routes.

### Feature 2 — Session UI with typing indicator

The most important UX detail. A fake 1-1.5s delay + animated dots before the prospect message appears makes it feel real. Implement as a local `isTyping` state in the session page.

### Feature 3 — Scorecard page

Visualize scores as progress bars or circular indicators. shadcn/ui `Progress` component works well here.

### Feature 4 — Public share page

Required for portfolio/application use. `/share/[id]` must work without login.

### Feature 5 — Scenario analytics

`GET /api/scenarios/[id]/stats` + a stats section on the dashboard card. Shows avg score and completion rate per scenario.

### Feature 6 — CSV export

Download all sessions for a scenario as CSV: prospect name, difficulty, overall score, turns taken, completed date. One API route + one button on the dashboard.

---

## Scope Boundaries

Do NOT build:

- User authentication / login
- Real LinkedIn or CRM integration
- Voice or audio features
- Multi-user / team features
- Mobile-specific layouts

If a feature is not listed above, do not build it.

---

## Error Handling Checklist

Before marking any feature done, verify:

- [ ] Groq returns malformed JSON → `extractJSON` fallback handles it, app does not crash
- [ ] Session already completed → `POST /api/messages` returns 400, not 500
- [ ] `generateFeedback` fails → session still closes, `feedback` stays null, review page shows "Feedback unavailable"
- [ ] `prospectBrief` is null → `runProspectTurn` uses fallback strings (already guarded in prospect.ts)
- [ ] Groq API key missing → clear error in console, 500 with message in API response
- [ ] Share page loads for a non-existent ID → 404 page, not crash
- [ ] SDR sends empty message → reject at API level before calling Groq
