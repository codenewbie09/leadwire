"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">PitchPerfect</h1>
        <div className="flex items-center gap-3">
          {session?.user && (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user.name ?? session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
