import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("=== TEST ROUTE STARTED ===");
  try {
    // Log the raw request content to debug
    const rawText = await req.text();
    console.log("Raw request body:", rawText);

    // Only try to parse as JSON if it's valid
    let data;
    try {
      data = JSON.parse(rawText);
      console.log("Parsed JSON:", data);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      data = { raw: rawText };
    }

    return NextResponse.json({
      success: true,
      received: data,
    });
  } catch (error) {
    console.error("Error in test route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}
