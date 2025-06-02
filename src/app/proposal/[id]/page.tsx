// Add this to disable static generation
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Icons } from "@/components/icons";
import api from "@/lib/api";

interface Proposal {
  client_name: string;
  project_title: string;
  problem_statement: string;
  proposed_solution: string;
  previous_experience?: string | null;
  objectives: string;
  implementation_plan: string;
  benefits: string;
  timeline: string;
  budget?: string | null;
  deliverables: string;
  technologies: string;
  project_goals?: string | null;
}

export default function ProposalPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/proposal/${id}`)
      .then((res) => {
        setProposal(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch proposal");
        setProposal(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProposalPreviewLoading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!proposal) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Proposal Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          The proposal you&apos;re looking for doesn&apos;t exist or may have
          been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Proposal Preview</CardTitle>
          <CardDescription>
            Review your generated proposal before sending
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mb-6 flex justify-end gap-2">
        <Button asChild>
          <Link href={`/proposal/${id}/regenerate`}>
            <Icons.refresh className="mr-2 h-4 w-4" />
            Regenerate Proposal
          </Link>
        </Button>
        {/* Latest Proposal Loader Button */}
        <LatestProposalLoader sessionId={id} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PreviewCard title="Client Information">
          <div className="space-y-2">
            <PreviewField label="Client Name" value={proposal.client_name} />
          </div>
        </PreviewCard>

        <PreviewCard title="Project Details">
          <div className="space-y-4">
            <PreviewField
              label="Project Title"
              value={proposal.project_title}
            />
            <PreviewField
              label="Project Goals"
              value={proposal.objectives}
              isTextArea
            />
          </div>
        </PreviewCard>

        <PreviewCard title="Technical Specifications">
          <div className="space-y-4">
            <PreviewField label="Technologies" value={proposal.technologies} />
            <PreviewField
              label="Deliverables"
              value={proposal.deliverables}
              isTextArea
            />
          </div>
        </PreviewCard>

        <PreviewCard title="Timeline">
          <div className="space-y-2">
            <PreviewField
              label="Project Timeline"
              value={proposal.timeline}
              isTextArea
            />
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

// --- Client component for loading latest proposal ---

function LatestProposalLoader({ sessionId }: { sessionId: string }) {
  const [latest, setLatest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/proposal/${sessionId}/latest`,
        {
          headers: { accept: "application/json" },
        }
      );
      if (!res.ok)
        throw new Error("No generated proposal found for this session");
      const data = await res.json();
      setLatest(data.proposal);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to load latest proposal");
      setLatest(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end w-full">
      <Button onClick={handleLoad} disabled={loading} variant="secondary">
        {loading ? "Loading..." : "Load Latest Proposal"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {latest && (
        <Card className="mt-4 w-full">
          <CardHeader>
            <CardTitle>Latest Regenerated Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose whitespace-pre-line">{latest}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PreviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PreviewField({
  label,
  value,
  isTextArea = false,
}: {
  label: string;
  value: string | null | undefined;
  isTextArea?: boolean;
}) {
  const displayValue = value ?? "";
  return (
    <div>
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {isTextArea ? (
        <div className="bg-gray-50 rounded-md p-4 min-h-[100px] border">
          {displayValue ? (
            <p className="whitespace-pre-line">{displayValue}</p>
          ) : (
            <p className="text-gray-400 italic">Not provided</p>
          )}
        </div>
      ) : (
        <p className="bg-gray-50 rounded-md p-3 border">
          {displayValue || (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </p>
      )}
    </div>
  );
}

export function ProposalPreviewLoading() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </CardHeader>
      </Card>

      {[...Array(4)].map((_, i) => (
        <Card key={i} className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-1/5 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-1/5 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <PreviewCard title="Client Information">
          <div className="space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </PreviewCard>

        <PreviewCard title="Project Details">
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </PreviewCard>

        <PreviewCard title="Technical Specifications">
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </PreviewCard>

        <PreviewCard title="Timeline">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
          </div>
        </PreviewCard>
      </div> */}
    </div>
  );
}

// Consider adding an Error Boundary for better UX: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
