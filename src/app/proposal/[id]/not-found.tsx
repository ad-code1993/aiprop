import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Proposal Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        The proposal you're looking for doesn't exist or may have been deleted.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
