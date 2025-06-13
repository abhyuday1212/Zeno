import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/apiErrors";

export function apiRouteWrapper<
  T extends (req: NextRequest) => Promise<NextResponse> | Promise<any>
>(handler: T) {
  return async (req: NextRequest) => {
    try {
      const result = await handler(req);
      // If handler returned a NextResponse, just pass it through.
      if (result instanceof NextResponse) {
        return result;
      }
      // Otherwise assume it’s your ApiResponse
      return NextResponse.json(result);
    } catch (err: any) {
      console.error("apiRouteWrapper caught error:", err);

      // Normalize to ApiError
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(500, err.message || "Internal Server Error");

      const payload = {
        status: false,
        message: apiError.message,
        data: null,
      };

      return NextResponse.json(payload, { status: apiError.statusCode });
    }
  };
}
