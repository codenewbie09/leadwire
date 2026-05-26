"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComposeBarProps {
  onSend: (content: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export default function ComposeBar({
  onSend,
  disabled,
  placeholder = "Reply as the SDR...",
}: ComposeBarProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || sending || disabled) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setInput("");
    } finally {
      setSending(false);
    }
  }, [input, sending, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
    if (
      (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ||
      (e.key === "Enter" && e.shiftKey)
    ) {
      // Cmd+Enter / Ctrl+Enter / Shift+Enter also sends
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const isDisabled = disabled || sending || !input.trim();

  return (
    <div className="border-t border-border bg-card shrink-0">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 max-w-3xl">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isDisabled}
            size="default"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
