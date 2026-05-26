# PitchPerfect -- AI Sales Roleplay Training

Practice sales conversations against AI prospects that respond in-character based on their persona, pain points, and personality. Get scored on opener quality, qualification, objection handling, and closing technique.

## Live Demo

https://pp-sales.vercel.app

## Features

| Feature | Description |
|---------|-------------|
| Auth methods | Sign in with Google, GitHub, or continue as a guest |
| AI roleplay | Realistic prospect personas that respond in-character using Groq LLM |
| Scoring | Auto-generated scorecard evaluating opener, qualification, objection handling, closing, and overall |
| Responsive UI | Desktop-first with mobile-friendly collapse panels |
| Shareable reviews | Share completed session transcripts and scorecards via public links |
| CSV export | Export session history for tracking progress over time |
| Best Session badge | Quick-link to the highest-scoring completed session per scenario |

## Screenshots

- Dashboard with hero section, scenario creation form, and scenario list -- screenshot coming soon
- Chat interface with prospect brief sidebar and message bubbles -- screenshot coming soon
- Scorecard modal with category breakdown and color-coded scores -- screenshot coming soon
- Public share page for external review -- screenshot coming soon

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Database ORM:** Drizzle ORM
- **Database:** Neon (PostgreSQL)
- **Component Library:** shadcn/ui (canary v4)
- **Styling:** Tailwind CSS v4
- **AI API:** Groq (llama-3.1-8b-instant)
- **Authentication:** NextAuth v5
- **Deployment:** Vercel

## Architecture Overview

The app follows a straightforward serverless architecture:

1. **Pages** use the App Router -- a dashboard, session chat, review, and public share page.
2. **API routes** handle database CRUD and AI turn logic, all co-located under `/app/api/`.
3. **Drizzle ORM** connects to a Neon PostgreSQL database with tables for scenarios, sessions, and messages.
4. **Groq API** powers the AI prospect -- each session maintains a prospect persona generated at session creation, and every SDR message triggers an in-character response.
5. **NextAuth v5** manages authentication with Google and GitHub OAuth providers plus a credentials-based guest mode.
6. **shadcn/ui** components provide the visual foundation, styled with Tailwind v4 CSS variables for dark/light mode support.

## Getting Started

```bash
git clone https://github.com/codenewbie09/pitchperfect
cd pitchperfect
cp .env.example .env.local
npm install
npm run dev
```

Fill in `DATABASE_URL` (Neon connection string) and `GROQ_API_KEY` in `.env.local`, then run database migrations:

```bash
npx drizzle-kit migrate
```

Open http://localhost:3000 in your browser.

## Running Tests

```bash
npm test            # Run once
npm run test:watch  # Watch mode
npm run test:coverage  # With coverage report
```

## License

MIT -- see [LICENSE](./LICENSE) for details.
