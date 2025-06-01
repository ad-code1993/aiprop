import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  // Await context if it's a Promise (for dynamic API routes)
  const ctx = await context;
  const { params } = ctx;
  // TODO: Add authentication if needed
  const body = await request.json();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${params.id}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to regenerate proposal");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROPOSAL_REGENERATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
