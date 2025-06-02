// Use the correct typing approach for Next.js App Router pages
"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { MarkdownRenderer } from "@/components/ProposalMarkdown";
import api from "@/lib/api";

const styleOptions = [
  { value: "formal", label: "Formal" },
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "casual", label: "Casual" },
];

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "technical", label: "Technical" },
  { value: "friendly", label: "Friendly" },
];

export default function RegenerateProposalPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState("");
  const [tone, setTone] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [regeneratedProposal, setRegeneratedProposal] = useState("");
  const [activeTab, setActiveTab] = useState("preset");

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      let endpoint = "";
      let body = {};

      if (activeTab === "preset") {
        endpoint = `/proposal/${id}/generate`;
        body = { style, tone };
      } else {
        endpoint = `/proposal/${id}/custom_prompt`;
        body = { prompt: customPrompt };
      }

      const response = await api.post(endpoint, body);
      setRegeneratedProposal(response.data.proposal);
      toast({
        title: "Success",
        description: "Proposal regenerated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to regenerate proposal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add handler to load the latest proposal
  const handleLoadLatest = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/proposal/${id}/latest`);
      setRegeneratedProposal(response.data.proposal);
      toast({
        title: "Loaded",
        description: "Latest proposal loaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not load latest proposal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Regenerate Proposal</h1>
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "preset"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("preset")}
        >
          Preset Options
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "custom"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("custom")}
        >
          Custom Prompt
        </button>
      </div>
      {activeTab === "preset" ? (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <Label htmlFor="customPrompt">Custom Prompt</Label>
          <Textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom instructions for regenerating the proposal..."
            rows={4}
          />
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={handleRegenerate} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Regenerate Proposal
        </Button>
        <Button
          onClick={handleLoadLatest}
          disabled={isLoading}
          className="ml-2"
          variant="secondary"
        >
          Load Latest Proposal
        </Button>
      </div>
      {regeneratedProposal && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Regenerated Proposal</h2>
          <div className="prose max-w-none p-4 border rounded-lg bg-white">
            <MarkdownRenderer content={regeneratedProposal} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(regeneratedProposal)}
            >
              Copy to Clipboard
            </Button>
            <Button onClick={() => router.push(`/proposal/${id}/edit`)}>
              Edit Proposal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
