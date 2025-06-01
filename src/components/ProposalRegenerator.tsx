"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RegeneratorProps {
  sessionId: string;
  onProposalGenerated: (proposal: string) => void;
}

export default function ProposalRegenerator({
  sessionId,
  onProposalGenerated,
}: RegeneratorProps) {
  const [style, setStyle] = useState("");
  const [tone, setTone] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("style"); // 'style' or 'custom'
  const [generatedProposal, setGeneratedProposal] = useState("");

  const regenerateWithStyle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proposal/${sessionId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, tone }),
      });
      const data = await response.json();
      setGeneratedProposal(data.proposal);
      onProposalGenerated(data.proposal);
    } catch (error) {
      console.error("Regeneration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateWithCustomPrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proposal/${sessionId}/custom_prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });
      const data = await response.json();
      setGeneratedProposal(data.proposal);
      onProposalGenerated(data.proposal);
    } catch (error) {
      console.error("Custom regeneration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h3 className="text-lg font-semibold">Regenerate Proposal</h3>
        <p className="text-sm text-muted-foreground">
          Customize your proposal with different styles or prompts
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "style"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("style")}
          >
            Style & Tone
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
        {activeTab === "style" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Writing Style</Label>
                <Select onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={regenerateWithStyle} disabled={loading}>
                {loading ? "Generating..." : "Regenerate Proposal"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-prompt">Custom Instructions</Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., &lsquo;Make the proposal more technical&rsquo;, &lsquo;Focus on cybersecurity aspects&rsquo;, &lsquo;Add a budget section&rsquo;, etc."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={regenerateWithCustomPrompt} disabled={loading}>
                {loading ? "Generating..." : "Generate with Prompt"}
              </Button>
            </div>
          </div>
        )}
        {generatedProposal && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-2">Generated Proposal</h4>
            <div className="prose max-w-none bg-muted/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">{generatedProposal}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 py-3">
        <p className="text-xs text-muted-foreground">
          Note: Regenerated proposals are saved with the session but don&apos;t
          overwrite original fields
        </p>
      </CardFooter>
    </Card>
  );
}
