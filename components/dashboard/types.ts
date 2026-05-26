export interface DashboardSession {
  id: string;
  scenarioId: string;
  prospectName: string;
  status: "active" | "completed";
  feedback: {
    overall?: number;
    opener?: { score: number; feedback: string };
    qualification?: { score: number; feedback: string };
    objectionHandling?: { score: number; feedback: string };
    closing?: { score: number; feedback: string };
    notes?: string;
  } | null;
  createdAt: string;
}

export interface ScenarioStats {
  total: number;
  completed: number;
  avgScore: number | null;
  topSession: {
    prospectName: string;
    score: number;
    sessionId: string;
  } | null;
}

export interface DashboardScenario {
  id: string;
  title: string;
  personaDescription: string;
  industry: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  sessions: DashboardSession[];
  stats: ScenarioStats;
}

export interface GlobalStats {
  totalScenarios: number;
  totalSessions: number;
  completedSessions: number;
  avgScore: number | null;
}

export interface DashboardData {
  scenarios: DashboardScenario[];
  globalStats: GlobalStats;
}
