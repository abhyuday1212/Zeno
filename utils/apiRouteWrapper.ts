import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/utils/apiErrors"

export const apiRouteWrapper = (handler: Function) => {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("Handler Error:", error);
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
};
