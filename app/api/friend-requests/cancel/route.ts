import { NextRequest, NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions); // sender

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const { existingRequestId } = await req.json();

  if (!existingRequestId) {
    throw new ApiError(400, "Existing Request ID is required");
  }
  // Delete the friend request
  const deletedRequest = await prisma.friendRequest.delete({
    where: { id: existingRequestId },
  });

  if (!deletedRequest) {
    throw new ApiError(500, "Failed to reject friend request");
  }

  return NextResponse.json(
    new ApiResponse(200, null, "Friend request rejected successfully!")
  );
};

export const POST = apiRouteWrapper(handler);
