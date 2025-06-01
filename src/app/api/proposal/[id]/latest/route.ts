import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { params } = await context;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${params.id}/latest`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      return new NextResponse("No generated proposal found for this session", { status: 404 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROPOSAL_LATEST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
