import { NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 * 1. For the current user session, get all the friend requests that have been received.
 */
const handler = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      receiverId: session?.user?.id,
      status: "PENDING",
    },
  });

  return NextResponse.json(
    new ApiResponse(
      200,
      requests,
      requests.length > 0
        ? "Friend requests retrieved successfully"
        : "No pending friend requests found"
    )
  );
};

export const GET = apiRouteWrapper(handler);
