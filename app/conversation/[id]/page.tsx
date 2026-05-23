"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  prospectName: string;
  status: "active" | "booked" | "rejected";
  campaignId: string;
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      fetchConversation();
      fetchMessages();
    }
  }, [id]);

  async function fetchConversation() {
    const res = await fetch(`/api/conversations/${id}`);
    if (res.ok) {
      const data = await res.json();
      setConversation(data);
    }
  }

  async function fetchMessages() {
    const res = await fetch(`/api/messages?conversationId=${id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }

  async function sendReply() {
    if (!input.trim() || sending) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: id, content: input.trim() }),
    });
    setInput("");
    if (res.ok) {
      await fetchMessages();
      await fetchConversation();
    }
    setSending(false);
  }

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    booked: "bg-blue-100 text-blue-800 border-blue-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    booked: "Booked ✓",
    rejected: "Rejected",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {conversation?.prospectName || "Loading..."}
              </h1>
            </div>
          </div>
          {conversation && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border ${
                statusColors[conversation.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {statusLabels[conversation.status] || conversation.status}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-6 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
                  : "bg-blue-600 text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Loading messages...</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          {conversation?.status === "active" ? (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Reply as prospect..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendReply}
                disabled={sending || !input.trim()}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          ) : conversation ? (
            <div
              className={`text-center py-3 rounded-xl text-sm font-medium ${
                conversation.status === "booked"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {conversation.status === "booked"
                ? "This conversation is closed — Booked ✓"
                : "This conversation is closed — Rejected"}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
