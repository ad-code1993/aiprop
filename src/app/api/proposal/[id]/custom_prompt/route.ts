import { NextResponse, type NextRequest } from "next/server";
import axios from "axios";

interface RequestBody {
  // Define your expected request body structure here
  [key: string]: unknown; // Or use specific types if you know the structure
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const body: RequestBody = await request.json();

    const response = await axios.post("https://example.com/api", {
      id,
      ...body,
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
