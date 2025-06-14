// app/api/your-endpoint/route.ts (or .js depending on your setup)
import { NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 * 1. Find all the existing friends for the current user session.
 */
const handler = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const friends = await prisma.friendship.findMany({
    where: {
      user1Id: session?.user?.id,
    },
  });

  if (!friends || friends.length === 0) {
    return NextResponse.json(
      new ApiResponse(404, null, "No friend requests received")
    );
  }

  return NextResponse.json(
    new ApiResponse(200, friends, "User data received successfully")
  );
};

export const GET = apiRouteWrapper(handler);
