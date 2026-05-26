"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import SessionHeader from "@/components/chat/session-header";
import ChatMessage from "@/components/chat/chat-message";
import TypingIndicator from "@/components/chat/typing-indicator";
import ComposeBar from "@/components/chat/compose-bar";
import ScorecardDialog from "@/components/chat/scorecard-dialog";
import BriefPanel from "@/components/chat/brief-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { Message, SessionData } from "@/components/chat/types";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [waitingForAI, setWaitingForAI] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showMobileBrief, setShowMobileBrief] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      Promise.all([fetchSession(), fetchMessages()]).finally(() =>
        setLoading(false)
      );
    }
  }, [id]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, waitingForAI]);

  useEffect(() => {
    if (session?.status === "completed" && session?.feedback) {
      setShowScorecard(true);
    }
  }, [session?.status, session?.feedback]);

  async function fetchSession() {
    const res = await fetch(`/api/sessions/${id}`);
    if (res.ok) setSession(await res.json());
  }

  async function fetchMessages() {
    const res = await fetch(`/api/messages?sessionId=${id}`);
    if (res.ok) setMessages(await res.json());
  }

  async function sendReply(content: string) {
    if (!content.trim()) return;
    setWaitingForAI(true);

    const res = await fetch(`/api/sessions/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      await fetchMessages();
      await fetchSession();
    }
    setWaitingForAI(false);
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex max-w-5xl mx-auto w-full">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 sm:px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto flex flex-col gap-4">
              {/* Assistant skeleton bubble */}
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-sm p-4 border border-border">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
                  <Skeleton className="h-3 w-16 mt-2 rounded-md" />
                </div>
              </div>

              {/* User skeleton bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm p-4 bg-primary/20">
                  <Skeleton className="h-4 w-full rounded-md bg-primary/30" />
                  <Skeleton className="h-3 w-16 mt-2 rounded-md bg-primary/30" />
                </div>
              </div>

              {/* Assistant skeleton bubble */}
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-sm p-4 border border-border">
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
                  <Skeleton className="h-3 w-16 mt-2 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Loaded State ---
  const isFirstTurn = messages.length === 0;
  const brief = session?.prospectBrief;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader
        prospectName={session?.prospectName ?? ""}
        role={brief?.role}
        company={brief?.company}
        status={session?.status ?? "active"}
        onBack={() => router.push("/dashboard")}
        onToggleBrief={brief ? () => setShowMobileBrief(true) : undefined}
      />

      <div className="flex-1 flex max-w-5xl mx-auto w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isLast={i === messages.length - 1}
              />
            ))}

            {waitingForAI && <TypingIndicator />}

            {messages.length === 0 && !waitingForAI && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your prospect is ready. Send your opener.
                  </p>
                  {brief && (
                    <div className="bg-card border border-border rounded-xl p-4 text-left max-w-sm mx-auto">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Prospect Brief
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {session?.prospectName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {brief.role} at {brief.company}
                      </p>
                      {brief.triggerEvent && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {brief.triggerEvent}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={chatEnd} />
          </div>

          {session?.status === "active" ? (
            <ComposeBar
              onSend={sendReply}
              disabled={waitingForAI}
              placeholder={
                isFirstTurn
                  ? "Write your opener as the SDR..."
                  : "Reply as the SDR..."
              }
            />
          ) : (
            <div className="border-t border-border bg-card shrink-0">
              <div className="px-4 sm:px-6 py-4">
                <div className="bg-accent text-accent-foreground text-center py-3 rounded-xl text-sm font-medium">
                  This session is complete.{" "}
                  <button
                    onClick={() => setShowScorecard(true)}
                    className="underline font-semibold"
                  >
                    View scorecard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {brief && (
          <aside className="hidden lg:block w-72 shrink-0 border-l border-border bg-card p-5 overflow-y-auto">
            <BriefPanel
              prospectName={session?.prospectName ?? ""}
              brief={brief}
            />
          </aside>
        )}
      </div>

      {showMobileBrief && brief && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMobileBrief(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-card shadow-xl p-5 overflow-y-auto">
            <BriefPanel
              prospectName={session?.prospectName ?? ""}
              brief={brief}
              onClose={() => setShowMobileBrief(false)}
            />
          </div>
        </div>
      )}

      {showScorecard && session?.feedback && (
        <ScorecardDialog
          feedback={session.feedback}
          open={showScorecard}
          onOpenChange={setShowScorecard}
        />
      )}
    </div>
  );
}
