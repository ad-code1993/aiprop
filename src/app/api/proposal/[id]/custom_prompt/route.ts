import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  // Await params for dynamic API routes in Next.js
  const resolvedParams: { id: string } = typeof (context.params as any).then === "function"
    ? await (context.params as Promise<{ id: string }>)
    : (context.params as { id: string });
  const body = await request.json();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${resolvedParams.id}/custom_prompt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to regenerate proposal with custom prompt");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROPOSAL_CUSTOM_PROMPT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
