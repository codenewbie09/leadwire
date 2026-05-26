"use client";

import type { Message } from "@/components/chat/types";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-card text-card-foreground border border-border rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isAssistant ? "text-muted-foreground" : "text-primary-foreground/70"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
