import { NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";

export async function GET(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const { id } = params;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${id}/latest`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as AxiosError).response &&
      (error as AxiosError).response!.status === 404
    ) {
      return new NextResponse("No generated proposal found for this session", { status: 404 });
    }
    console.error("[PROPOSAL_LATEST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const { id } = params;
  try {
    const json = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/proposal/${id}/generate`,
      json,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return new NextResponse("Failed to generate proposal", { status: 500 });
    }
    console.error("[PROPOSAL_GENERATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
