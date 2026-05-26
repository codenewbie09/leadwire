# PitchPerfect — Resume-Worthy Upgrade Plan

## Target: "Ship a real SaaS product, end-to-end"

Current state: 0 auth, 0 stars, basic desktop-first UI, deployed on Vercel.
Target state: Auth-protected SaaS app with polished UI, responsive design, live demo, and a story to tell in interviews.

Estimated effort: 3–5 days of focused work.

---

## Phase 1 — UI Overhaul (2 days)

### 1.1 Install shadcn/ui + set up design tokens

- `npx shadcn@latest init` (configured for the existing Tailwind setup)
- Install: Button, Input, Card, Dialog, Skeleton, Badge, Select, Tooltip, Sheet, Tabs
- Update `globals.css` with the DESIGN.md token palette (leadwire blue `#0a66c2`, neutral scale, semantic colors)
- Switch body font to Inter from `next/font/google`

### 1.2 Rebuild the dashboard

- Move the hero section into a proper `<LandingHero />` component
- "New Scenario" form → `ScenarioForm.tsx` component, collapsible (shown on first visit, collapsed to [+ New] button after)
- Scenario list → `ScenarioCard.tsx` components with inline session rows per DESIGN.md
- Stats bar between form and scenarios (total scenarios, sessions, avg score)
- Empty state component with CTA (not just "No scenarios yet" text)
- N+1 fetch fix: consolidate `/api/scenarios`, `/api/sessions`, `/api/stats` into a single `/api/dashboard` endpoint

### 1.3 Rebuild the chat view

- Two-column layout: chat (flex-1) + prospect brief sidebar (w-72 on desktop, sheet on mobile)
- Chat bubble component `<ChatMessage>` with `role="log"` a11y
- Typing indicator as a separate component with `aria-label`
- Compose bar with Cmd+Enter support, disabled state during AI turn
- Session header with back arrow, prospect name, status, end-session button
- Auto-scroll with "jump to bottom" button when scrolled up
- Scorecard dialog with `<ScoreRing>` circular progress instead of bars

### 1.4 Responsive polish

- Dashboard: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for scenario grid (when multiple exist)
- Dashboard: `grid-cols-1 sm:grid-cols-2` for active/completed sections (not cramped 2-col on mobile)
- Mobile nav bar with back and menu actions
- Touch-friendly compose bar (larger tap targets on mobile)
- Test at 375px, 768px, 1024px, 1440px

**Interview talking point:** "I redesigned the entire UI around a token-based design system, replaced raw Tailwind classes with semantic design tokens, and made the app fully responsive across 4 breakpoints — the same workflow product teams use."

---

## Phase 2 — Auth + User Isolation (1 day)

### 2.1 Install NextAuth v5 (Auth.js)

```bash
npm install next-auth@beta @auth/core
npx shadcn@latest add button
```

### 2.2 Set up providers

- Google OAuth (free, most common for demos)
- GitHub OAuth (free, developer-friendly)
- Magic link / email (optional, adds ~1 hour)

### 2.3 Protect routes

- Wrap layout in `<SessionProvider>`
- `middleware.ts` to protect `/session/*` and `/api/*`
- Redirect unauthenticated users to a landing page (not the dashboard)

### 2.4 Add user_id to DB schema

- Add `userId` column to `scenarios` and `sessions` tables
- All queries filter by `userId`
- Migrate existing data (user migration script)
- All API routes check `session.user.id` before returning data

### 2.5 Landing page (public)

- A single landing page at `/` with: hero, screenshot gallery, "Get started" CTA → sign in
- After sign-in, redirect to `/dashboard`
- This replaces the current "dashboard is the landing page" pattern

**Interview talking point:** "I implemented full auth with NextAuth v5 — Google and GitHub OAuth, protected API routes with middleware, scoped all database queries to the authenticated user. This is the same auth architecture used at companies like Vercel and Cal.com."

---

## Phase 3 — Polish + Demo (1 day)

### 3.1 Error boundaries

- `<ErrorFallack>` component wrapping each route
- Graceful error state for API failures (retry button, not blank page)
- Toast notifications for create/delete actions

### 3.2 Loading states

- `<Skeleton>` cards while fetching scenarios
- `<Skeleton>` chat bubbles while loading session history
- `<Skeleton>` scorecard while feedback generates
- Remove all `Loading...` text placeholders

### 3.3 README refresh

- Update with screenshots of the new UI
- Add a demo section: "Try it live at pp-sales.vercel.app"
- Add a "Features" table: what it does, what stack it uses
- Add a "Local dev" section with one-command setup
- Add proper license (MIT)
- Add `sales`, `ai-training`, `nextjs`, `sales-roleplay` topics to GitHub repo

### 3.4 Deploy the polished version

```bash
git push
# Vercel auto-deploys from main
```

- Verify auth flow end-to-end on production
- Verify mobile layout on real device / Chrome DevTools
- Test with a real scenario + session + scorecard + share link

**Interview talking point:** "I shipped a production SaaS application with auth, CI/CD via Vercel, error monitoring, and responsive design — all the things you'd see in a real startup codebase."

---

## Phase 4 — The Story (1 day, optional but high ROI)

### 4.1 Write a dev.to post

**Title idea:** "Building an AI Sales Coach with Next.js 16, Drizzle, and Groq — Architecture, Mistakes, and Lessons"

**Sections:**
- Why I built it (learning sales for internships)
- Architecture decisions (why Drizzle over Prisma, why Groq, why streaming vs polling)
- The hardest bug (the prompt engineering to get the AI prospect to stay in character)
- What I'd do differently (auth from day one, design system first, optimistic updates)
- Live demo link + GitHub

### 4.2 Record a 2-minute screencast (optional)

- Loom or QuickTime screen recording
- Walk through: login → create scenario → practice conversation → see scorecard → share link
- Post on LinkedIn + Twitter

### 4.3 Add a CHANGELOG.md

- v0.1 — Initial release with basic CRUD and Groq integration
- v0.2 — Auth, responsive UI, scorecard redesign
- Future: multi-model support, team rooms, custom AI personas

---

## Resume Impact Summary

| Before | After |
|---|---|
| No auth | Google/GitHub OAuth with protected routes |
| Desktop-only UI | Fully responsive across 4 breakpoints |
| `Loading...` text | Skeleton loading states everywhere |
| Raw Tailwind classes | Token-based design system |
| Landing page = dashboard | Proper landing page + auth gate |
| 0 stars, 0 topics | MIT license, GitHub topics, deployed demo |
| Reads like a homework project | Reads like a shipped SaaS product |

**Estimated interview conversation:** 10 minutes. They'll ask about auth architecture, the design system decisions, the AI prompt engineering, and how you handled state management. All of that is answerable with this upgrade.

---

## What NOT to do (for now)

- Multi-model provider support (cool, but doesn't add interview signal)
- Team/org features (too complex, unclear ROI)
- Stripe billing (pretend it's free in interviews — "I wanted to focus on product quality first")
- Docker compose (only helps if the interviewer is infra-focused)
- E2E tests (unit + integration is enough for a portfolio project)
