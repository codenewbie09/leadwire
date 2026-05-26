# PitchPerfect — Design System & UI/UX

## Design Principles

- **Fast over fancy.** Every interaction completes or shows progress within 300ms. No spinners where skeletons work, no modals where inline panels work.
- **Content is the interface.** The prospect brief, the chat, the scorecard — these are the product. Chrome (nav bars, footers, borders) recedes.
- **Typographic hierarchy, not decorative elements.** Size, weight, and color carry meaning. No gratuitous icons, dividers, or badges.
- **One primary action per view.** Every screen has exactly one thing the user should do next. Everything else is secondary.

---

## Design Tokens

### Color Palette

Derived from the brand anchor `#0a66c2` (leadwire blue). Restricted palette — no more than 6 semantic colors.

```css
/* Neutral scale — the real interface */
--gray-50:  #f8fafc;    /* page background */
--gray-100: #f1f5f9;    /* card / panel surface */
--gray-200: #e2e8f0;    /* borders, dividers */
--gray-300: #cbd5e1;    /* disabled, placeholder */
--gray-500: #64748b;    /* secondary text */
--gray-700: #334155;    /* body text */
--gray-900: #0f172a;    /* headings */

/* Accent — single source of truth for interactive color */
--accent:     #0a66c2;
--accent-dim: #004182;
--accent-subtle: #eef4ff;   /* hover state bg */
--accent-ring: #93c5fd;     /* focus ring */

/* Semantic — used only in scorecard and status */
--green: #16a34a;    /* 7+ score, completed */
--amber: #ca8a04;    /* 4-6 score, in progress */
--red:   #dc2626;    /* 0-3 score, warning */

/* Surface — chat bubbles */
--bubble-self:   var(--accent);
--bubble-prospect: var(--gray-100);
```

### Typography

Single typeface (Inter or Geist — both free, both excellent on screen). No decorative fonts.

```
--font-body:   'Inter', system-ui, sans-serif;  /* 400 / 500 */
--font-mono:   'JetBrains Mono', monospace;      /* score number, code */

--text-xs:   0.75rem  (12px)  / 1rem    — labels, timestamps
--text-sm:   0.875rem (14px)  / 1.25rem — secondary, brief panels
--text-base: 1rem     (16px)  / 1.5rem  — body, chat messages
--text-lg:   1.125rem (18px)  / 1.5rem  — section titles
--text-xl:   1.25rem  (20px)  / 1.5rem  — page headings
--text-2xl:  1.5rem   (24px)  / 1.25   — hero heading
--text-5xl:  3rem     (48px)  / 1.1    — score number (display)

--tracking-tight: -0.01em;  /* headings */
--leading-relaxed: 1.75;    /* prose / chat body */
```

### Spacing

Use a 4px base unit. Common values expressed as Tailwind classes:

```
p-3  (12px)   — tight card padding
p-4  (16px)   — default card / section padding
p-6  (24px)   — generous page padding
p-8  (32px)   — hero / empty state

gap-2  (8px)   — tight element groups
gap-3  (12px)  — form fields
gap-4  (16px)  — card lists
gap-6  (24px)  — page sections
```

### Shadows

Three elevations. Never more.

```
--shadow-sm:   0 1px 2px rgb(0 0 0 / 0.04);
--shadow-md:   0 4px 12px rgb(0 0 0 / 0.06);
--shadow-lg:   0 8px 24px rgb(0 0 0 / 0.08);
```

### Border Radius

- `rounded-lg` (8px) — cards, inputs, buttons
- `rounded-xl` (12px) — modals, dialogs
- `rounded-full` — pills, badges, avatars

---

## Component Architecture

### UI Library: shadcn/ui

Free, open-source, Tailwind-native, tree-shakeable. Install only the components you use — no bundle bloat.

**Required primitives:**
- `Button` — variants: primary, secondary, ghost, danger. Sizes: sm, default, lg.
- `Input` / `Textarea` — with label, error state, character count.
- `Card` — container with optional header and footer slots.
- `Dialog` — modal for scorecard.
- `Select` — for difficulty, model picker.
- `Badge` — difficulty level, session status.
- `Skeleton` — loading placeholders.
- `Tooltip` — micro-copy on score labels.
- `Sheet` — slide-in prospect brief on mobile.
- `Tabs` — dashboard sections (active vs completed sessions).

**Do not install:** `Carousel`, `Calendar`, `DatePicker`, `Table` — not needed.

### Custom Components

```
components/
├── ui/                  # shadcn primitives (generated)
├── layout/
│   ├── header.tsx       # minimal nav — logo, user menu (when auth added)
│   └── page-shell.tsx   # max-width container + padding
├── dashboard/
│   ├── scenario-card.tsx        # scenario thumbnail + stats summary
│   ├── session-row.tsx          # compact session with score preview
│   ├── scenario-form.tsx        # create scenario panel
│   ├── dashboard-empty.tsx      # empty state with illustration
│   └── stats-bar.tsx            # aggregate stats row
├── session/
│   ├── chat-view.tsx            # message list + input bar
│   ├── chat-message.tsx         # single bubble (self or prospect)
│   ├── prospect-sidebar.tsx     # brief panel (fixed on desktop, sheet on mobile)
│   ├── compose-bar.tsx          # text input + send button + context indicator
│   ├── session-header.tsx       # prospect name, status, end-session button
│   ├── typing-indicator.tsx     # animated dots during AI turn
│   └── scorecard-dialog.tsx     # full feedback breakdown
└── shared/
    ├── badge.tsx                # difficulty / status pill
    ├── score-ring.tsx           # circular score display
    ├── empty-state.tsx          # generic empty + CTA
    └── error-fallack.tsx        # inline error + retry
```

---

## Page Designs

### Dashboard (`/`)

**Layout:** Single column, max-w-3xl, centered.

```
┌─────────────────────────────────┐
│  PitchPerfect        [New Scenario] │  ← header, minimal
├─────────────────────────────────┤
│  Create a Scenario              │  ← compact form, expandable
│  ┌───────────────────────────┐  │
│  │ Title  [________________] │  │
│  │ Persona [________________] │  │
│  │ Industry [________________] │  │
│  │ Difficulty [Easy|Med|Hard] │  │
│  │              [Create →]    │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  6 scenarios · 24 sessions      │  ← stats bar
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ SaaS Cold Outreach        │  │  ← scenario card
│  │ Mid-market · Hard         │  │
│  │ 8 sessions · avg 6.2/10   │  │
│  │ ─────────────────────     │  │
│  │ Acme Corp  7.5 ★  → Chat  │  │  ← session rows
│  │ Globex Inc 5.0 ★  → Chat  │  │
│  │ Beta LLC   8.0 ★  → Chat  │  │
│  │             [... +2]      │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Enterprise Sales          │  │  ← another card
│  │ ...                       │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Key UX decisions:**
- Scenarios are the top-level grouping. Sessions live inside them inline.
- The form is always visible but compact. After first use, it stays collapsed with a [+ New] button.
- Each scenario card shows its best session score as a preview — drives motivation.
- Stats bar updates live as sessions complete.

### Chat Session (`/session/[id]`)

**Layout:** Two-column on desktop (sidebar + chat), single-column stack on mobile.

```
┌──────────────────────────────────────────────────┐
│ ← Dashboard    Acme Corp - Alice Chen    [End]   │  ← session header
├──────────┬───────────────────────────────────────┤
│          │                        12:30          │
│ Brief    │  ┌──────────────────────────────┐     │
│ Panel    │  │ Hi Alice, I noticed Acme...   │     │  ← SDR message (right)
│          │  └──────────────────────────────┘     │
│ Prospect │                                       │
│ Alice    │  ┌──────────────────────────────┐     │
│ Chen     │  │ I'm not sure we need...      │     │  ← prospect (left)
│          │  └──────────────────────────────┘     │
│ Role     │                                       │
│ VP Eng   │  ┌──────────────────────────────┐     │
│          │  │ Let me share what I've seen   │     │
│ Company  │  │ with similar teams...         │     │
│ Acme     │  └──────────────────────────────┘     │
│ Corp     │                                       │
│          │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐     │
│ Pain     │    ● ● ●  typing...                  │  ← typing indicator
│ Points   │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘     │
│          │                                       │
│ [cost]   │  ┌──────────────────────────────────┐ │
│ [time]   │  │ [ Type your response... ] [Send] │ │  ← compose bar
│          │  └──────────────────────────────────┘ │
│ Trigger  │                                       │
│ ...      │                                       │
│          │                                       │
│ Difficulty: Hard                                 │
└──────────┴───────────────────────────────────────┘
```

**Key UX decisions:**
- Prospect brief is a persistent sidebar on desktop (always visible — contextual awareness is critical for sales training). On mobile it becomes a bottom sheet triggered by a tap on the prospect name.
- Chat bubbles: prospect on the left (gray), SDR on the right (accent blue). Text left-aligned within bubbles. Timestamps on hover only (reduces noise).
- Typing indicator is three animated dots on a gray bubble. Appears the moment the backend receives the request — no waiting for the response to start streaming.
- Compose bar is always visible at the bottom. Disabled + shows "Prospect is thinking..." during AI turn.
- Scorecard appears as a dialog after the session ends. Can also be reopened from the session header bar.
- End button in the header triggers the feedback generation and transitions to completed state.

### Review / Share (`/review/[id]`, `/share/[id]`)

```
┌──────────────────────────────────────┐
│  Session Review                      │
│  Acme Corp · Alice Chen · 12 turns   │
├──────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │ Overall │ │ Opener │ │ Quali  │ │  │
│  │   7.5   │ │  8.0   │ │  6.5   │ │  │
│  │  /10    │ │  /10   │ │  /10   │ │  │
│  └──────┘ └──────┘ └──────┘ └──────┘│
├──────────────────────────────────────┤
│  Coach Notes                         │
│  Strong opener strategy but needed   │
│  to qualify earlier. Objection       │
│  handling was effective.             │
├──────────────────────────────────────┤
│  Full Transcript                     │
│  ┌──────────────────────────────┐    │
│  │ Prospect: I'm not sure...    │    │
│  │ SDR:     Let me share...     │    │
│  │ ...                          │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

**Key UX decisions:**
- Score ring components (circular progress) for each category — more scannable than bars at a glance.
- Transcript is collapsed by default with a "Show transcript" toggle. The scores and coach notes are the primary content.
- Share page is identical but with a banner "Review shared by Prateek" and no edit controls.
- Export button → prints/PDF or CSV download for attaching to CRM notes.

---

## Interaction Patterns

### Snappy Transitions

- Page transitions: `next-view-transitions` (built into Next.js 16) — instant, no loading flash.
- Dialog: scale in from center (0.95 → 1, 200ms ease-out). Backdrop fades in (150ms).
- Create scenario: form submits, new card appears at top of list with a brief highlight flash (Tailwind `animate-pulse` for 600ms).
- Score ring: counts up from 0 to final value over 600ms with ease-out.

### Optimistic Updates

- **Start session:** Create the DB row immediately, show "Generating prospect brief..." state on the session card, then patch when the AI responds. User navigates to chat instantly, sees a loading brief panel instead of a blank page.
- **Send message:** Append the user's message to the chat immediately, then show the typing indicator. Replace the optimistic message on error.

### Streaming

- AI responses stream character-by-character into the prospect bubble using server-sent events (or the Vercel AI SDK `useChat` hook). User reads the response as it's generated — cuts perceived latency to near zero.

### Micro-interactions

- **Hover on score ring:** Tooltip shows the detailed breakdown for that category.
- **Click on prospect name (mobile):** Bottom sheet slides up with the brief.
- **Cmd+Enter:** Submit the compose bar from anywhere. Enter sends normally, Shift+Enter adds a newline.
- **Auto-scroll:** Chat scrolls to bottom when new messages arrive, unless the user has scrolled up to read history. A small "Jump to bottom" button appears when scrolled away.
- **Scorecard triggers confetti-free:** A subtle checkmark animation on the overall score ring. No emoji, no celebration graphics.

---

## Empty States

Every list view has three states and they all feel intentional.

**No scenarios yet:**
```
┌──────────────────────────────────────┐
│                                      │
│   No scenarios yet                   │
│   Create your first sales scenario   │
│   to start practicing.               │
│                                      │
│   [Create your first scenario]       │
│                                      │
│   —                                 │
│   Quickstart: pick a template        │
│   SaaS cold outreach                 │
│   Enterprise sales                   │
│   Product demo                       │
│                                      │
└──────────────────────────────────────┘
```

**No sessions in a scenario:**
```
  No practice sessions yet
  Start a session with this scenario to
  get scored feedback.
  [Start practice →]
```

**No results match filter:**
```
  No matches
  Try adjusting your search or filter.
```

---

## Responsive Breakpoints

```
sm:  640px   — single column, sidebar becomes sheet
md:  768px   — dashboard two-column (scenario grid)
lg: 1024px   — chat two-column layout
xl: 1280px   — max-width constraints, generous spacing
```

---

## Accessibility

- All interactive elements are keyboard-reachable and have visible focus rings (`—accent-ring`).
- Color is never the only indicator. Score values are always displayed as numbers alongside color.
- Chat messages have `role="log"` and `aria-live="polite"` for screen readers. New messages are announced.
- Typing indicator uses `aria-label="Prospect is typing"` instead of relying on the visual dots alone.
- Dialog is focus-trapped and closes on Escape.

---

## Performance Budgets

| Metric | Target |
|--------|--------|
| First load (JS) | < 80KB |
| Dashboard page render | < 500ms |
| Chat message round-trip (stream) | First token < 1s |
| Scorecard dialog open | < 100ms |
| Lighthouse Performance | > 90 |

---

## Implementation Order

1. **Design tokens + globals.css** — set up the color palette, typography, spacing as CSS custom properties. Move away from Tailwind arbitrary values.
2. **Install shadcn/ui primitives** — `Button`, `Input`, `Card`, `Dialog`, `Skeleton`, `Badge`, `Select`.
3. **Build shared components** — `ScoreRing`, `Badge`, `EmptyState`, `ErrorFallack`.
4. **Redesign the dashboard** — scenario card + session row components, empty state, inline create form.
5. **Redesign the chat view** — two-column layout, chat bubble component, prospect sidebar, typing indicator, compose bar.
6. **Redesign scorecard** — dialog with score rings instead of bars, coach notes section.
7. **Add micro-interactions** — optimistic session creation, streaming chat, score count-up animation, auto-scroll with "jump to bottom" button.
8. **Add responsive behavior** — mobile sheets, breakpoint layouts, collapsible sidebar.
9. **Accessibility audit** — keyboard navigation, screen reader labels, focus management.
