export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ScoreCategory {
  score: number;
  feedback: string;
}

export interface Feedback {
  opener: ScoreCategory;
  qualification: ScoreCategory;
  objectionHandling: ScoreCategory;
  closing: ScoreCategory;
  overall: number;
  notes: string;
}

export interface ProspectBrief {
  company: string;
  role: string;
  painPoints: string[];
  triggerEvent: string;
  personality: string;
}

export interface SessionData {
  id: string;
  prospectName: string;
  status: "active" | "completed";
  feedback: Feedback | null;
  prospectBrief: ProspectBrief | null;
}
