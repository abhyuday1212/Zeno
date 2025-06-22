import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./apiErrors";
import { ApiResponse } from "./apiResponse";

export const apiRouteWrapper = (
  handler: (req: NextRequest) => Promise<NextResponse>
) => {
  return async (req: NextRequest) => {
    try {
      console.log(`API Route: ${req.method} ${req.url}`);

      // Don't clone the request - pass the original NextRequest directly
      // The handler will read the body when needed
      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack"
      );

      if (error instanceof ApiError) {
        return NextResponse.json(
          new ApiResponse(error.statusCode, null, error.message),
          { status: error.statusCode }
        );
      }

      // Generic error
      return NextResponse.json(
        new ApiResponse(500, null, "Internal server error"),
        { status: 500 }
      );
    }
  };
};
