"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { scoreColor, scoreTextColor } from "@/lib/utils";
import type { Feedback } from "@/components/chat/types";

interface ScorecardDialogProps {
  feedback: Feedback;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { key: "opener" as const, label: "Opener" },
  { key: "qualification" as const, label: "Qualification" },
  { key: "objectionHandling" as const, label: "Objection Handling" },
  { key: "closing" as const, label: "Closing" },
];

export default function ScorecardDialog({
  feedback,
  open,
  onOpenChange,
}: ScorecardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Score</DialogTitle>
          <DialogDescription>
            Performance breakdown for this practice session
          </DialogDescription>
        </DialogHeader>

        <div className="text-center mb-2">
          <span className="text-4xl font-bold text-foreground">
            {feedback.overall}
          </span>
          <span className="text-muted-foreground text-lg">/10</span>
          <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
        </div>

        <div className="space-y-3">
          {categories.map(({ key, label }) => {
            const cat = feedback[key];
            return (
              <div key={key} className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <span
                    className={`text-sm font-bold ${scoreTextColor(cat.score)}`}
                  >
                    {cat.score}/10
                  </span>
                </div>
                <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${scoreColor(cat.score)}`}
                    style={{ width: `${cat.score * 10}%` }}
                  />
                </div>
                {cat.feedback && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {cat.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {feedback.notes && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-1">
              Coach Notes
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {feedback.notes}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
