"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, Info } from "lucide-react";

interface SessionHeaderProps {
  prospectName: string;
  role?: string;
  company?: string;
  status: "active" | "completed";
  onBack: () => void;
  onToggleBrief?: () => void;
}

const statusClasses: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  completed:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};

export default function SessionHeader({
  prospectName,
  role,
  company,
  status,
  onBack,
  onToggleBrief,
}: SessionHeaderProps) {
  return (
    <header className="bg-card border-b border-border shrink-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
              {prospectName || "Loading..."}
            </h1>
            {(role || company) && (
              <p className="text-xs text-muted-foreground truncate">
                {[role, company].filter(Boolean).join(" at ")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onToggleBrief && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleBrief}
              className="lg:hidden"
              aria-label="Toggle prospect info"
            >
              <Info className="w-5 h-5" />
            </Button>
          )}
          <Badge className={statusClasses[status] || ""}>
            {status === "completed" ? "Completed" : "Active"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
