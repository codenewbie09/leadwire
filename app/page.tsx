"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  personaDescription: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  prospectName: string;
  status: "active" | "booked" | "rejected";
  createdAt: string;
}

type View = "list" | "new" | "prospect";

export default function Dashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [persona, setPersona] = useState("");
  const [creating, setCreating] = useState(false);
  const [prospectInput, setProspectInput] = useState("");
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Record<string, Conversation[]>>({});
  const [view, setView] = useState<View>("list");
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const res = await fetch("/api/campaigns");
    if (res.ok) {
      const data = await res.json();
      setCampaigns(data);
    }
  }

  async function fetchConversations(campaignId: string) {
    const res = await fetch(`/api/conversations?campaignId=${campaignId}`);
    if (res.ok) {
      const data = await res.json();
      setConversations((prev) => ({ ...prev, [campaignId]: data }));
    }
  }

  async function createCampaign(e: FormEvent) {
    e.preventDefault();
    if (!persona.trim()) return;
    setCreating(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaDescription: persona.trim() }),
    });
    if (res.ok) {
      setPersona("");
      await fetchCampaigns();
    }
    setCreating(false);
  }

  async function createConversation(campaignId: string) {
    if (!prospectInput.trim()) return;
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        prospectName: prospectInput.trim(),
      }),
    });
    if (res.ok) {
      const conv = await res.json();
      setProspectInput("");
      setView("list");
      setActiveCampaign(null);
      router.push(`/conversation/${conv.id}`);
    }
  }

  function toggleCampaign(campaignId: string) {
    if (activeCampaign === campaignId) {
      setActiveCampaign(null);
    } else {
      setActiveCampaign(campaignId);
      if (!conversations[campaignId]) {
        fetchConversations(campaignId);
      }
    }
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-800",
      booked: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Leadwire</h1>
          </div>
          <p className="text-sm text-gray-500">LinkedIn Outreach Agent</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Campaign</h2>
          <form onSubmit={createCampaign}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Persona
            </label>
            <textarea
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="e.g. VP of Sales at a B2B SaaS company, 50-200 employees"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              rows={3}
            />
            <button
              type="submit"
              disabled={creating || !persona.trim()}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
          {campaigns.length === 0 && (
            <p className="text-sm text-gray-500 py-8 text-center">No campaigns yet. Create one above.</p>
          )}
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleCampaign(campaign.id)}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {campaign.personaDescription}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${activeCampaign === campaign.id ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCampaign === campaign.id && (
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      value={prospectInput}
                      onChange={(e) => setProspectInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createConversation(campaign.id)}
                      placeholder="Prospect name..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => createConversation(campaign.id)}
                      disabled={!prospectInput.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Start
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(!conversations[campaign.id] || conversations[campaign.id].length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-2">No conversations yet</p>
                    )}
                    {(conversations[campaign.id] || []).map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => router.push(`/conversation/${conv.id}`)}
                        className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">{conv.prospectName}</span>
                        {statusBadge(conv.status)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
