"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProspectBrief } from "@/components/chat/types";

interface BriefPanelProps {
  prospectName: string;
  brief: ProspectBrief;
  difficulty?: string;
  onClose?: () => void;
}

const difficultyClasses: Record<string, string> = {
  easy: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  medium:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  hard: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

export default function BriefPanel({
  prospectName,
  brief,
  difficulty,
  onClose,
}: BriefPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Prospect
        </h3>
        <p className="text-sm font-medium text-foreground mt-1">
          {prospectName}
        </p>
        {brief.role && (
          <p className="text-xs text-muted-foreground">{brief.role}</p>
        )}
        {brief.company && (
          <p className="text-xs text-muted-foreground/70">{brief.company}</p>
        )}
      </div>

      {difficulty && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Difficulty
          </h3>
          <Badge
            className={cn(
              "mt-1",
              difficultyClasses[difficulty] ||
                "bg-gray-100 text-gray-800 border-gray-200"
            )}
          >
            {difficulty}
          </Badge>
        </div>
      )}

      {brief.triggerEvent && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Trigger
          </h3>
          <p className="text-xs text-muted-foreground italic mt-1">
            {brief.triggerEvent}
          </p>
        </div>
      )}

      {brief.painPoints.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pain Points
          </h3>
          <ul className="mt-1 space-y-1">
            {brief.painPoints.map((p, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex items-start gap-1.5"
              >
                <span className="text-muted-foreground/50 mt-0.5 shrink-0">
                  &bull;
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {brief.personality && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Personality
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {brief.personality}
          </p>
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="w-full text-sm text-primary font-medium hover:text-primary/80 transition-colors lg:hidden"
        >
          Close
        </button>
      )}
    </div>
  );
}
