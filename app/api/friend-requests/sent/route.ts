// app/api/your-endpoint/route.ts (or .js depending on your setup)
import { NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 * 1. For the current user (sender), get all the sent friend requesta which is pending.
 */
const handler = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const requests = await prisma.friendRequest.findMany({
    where: {
      senderId: session?.user?.id,
      status: "PENDING",
    },
  });

  if (!requests || requests.length === 0) {
    return NextResponse.json(
      new ApiResponse(404, null, "No friend requests received")
    );
  }

  return NextResponse.json(
    new ApiResponse(200, requests, "User data received successfully")
  );
};

export const GET = apiRouteWrapper(handler);
