import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl text-center space-y-8">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          AI-Powered Proposal Generator
        </h1>
        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Answer a few smart questions — we&apos;ll generate a complete proposal.
        </p>
        {/* CTA Button */}
        <div className="pt-6">
          <Button asChild size="lg" className="group text-lg">
            <Link href="/proposal/new">
              Start Interactive Proposal
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
