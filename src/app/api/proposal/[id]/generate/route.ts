import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const { id } = params;
  const body = await request.json();
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${id}/generate`;
    const response = await axios.post(apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("[PROPOSAL_REGENERATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
