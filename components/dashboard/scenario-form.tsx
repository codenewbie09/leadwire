"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScenarioFormProps {
  onScenarioCreated: () => void;
}

export default function ScenarioForm({ onScenarioCreated }: ScenarioFormProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [personaDescription, setPersonaDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !personaDescription.trim() || !industry.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, personaDescription, industry, difficulty }),
      });

      if (res.ok) {
        setTitle("");
        setPersonaDescription("");
        setIndustry("");
        setDifficulty("medium");
        onScenarioCreated();
      }
    } finally {
      setCreating(false);
    }
  }

  if (collapsed) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setCollapsed(false)}
      >
        + New Scenario
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>New Scenario</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VP of Sales Outreach"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Target Persona
            </label>
            <Textarea
              value={personaDescription}
              onChange={(e) => setPersonaDescription(e.target.value)}
              placeholder="e.g. VP of Sales at a B2B SaaS company, 50-200 employees"
              rows={3}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-foreground">
                Industry
              </label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, SaaS, Healthcare"
              />
            </div>
            <div className="w-full sm:w-40 space-y-1">
              <label className="text-sm font-medium text-foreground">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              creating ||
              !title.trim() ||
              !personaDescription.trim() ||
              !industry.trim()
            }
          >
            {creating ? "Creating..." : "Create Scenario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
