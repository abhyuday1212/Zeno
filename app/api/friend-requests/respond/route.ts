import { NextRequest, NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 Steps to respond to a friend request as a receiver:
 * 1. Get the current session user (this is the **receiver** of the friend request).
 * 2. Check if a friend request exists from the **sender** to the current user in the FriendRequest table.
 * 3. Parse the payload from the request (e.g., status: "accepted" or "rejected").
 * 4. If accepted:
 *    - Create a friendship record in the Friendship table (between sender and receiver).
 *    - Delete the friend request (optional but recommended for cleanup).
 * 5. If rejected:
 *    - Delete the friend request.
 */
const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const { receiverId, requestAction } = await req.json();

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  // Get current session user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new ApiError(404, "Logged-in user not found");
  }

  // find the friend request already exists
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      senderId: receiverId,
      receiverId: currentUser.id,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    if (requestAction === "ACCEPTED") {
      // Create friendship record
      await prisma.friendship.create({
        data: {
          user1Id: receiverId,
          user2Id: currentUser.id,
        },
      });

      // Update friend request status to accepted
      await prisma.friendRequest.update({
        where: { id: existingRequest.id },
        data: { status: "ACCEPTED" },
      });

      return NextResponse.json(
        new ApiResponse(200, null, "Friend request accepted successfully!")
      );
    } else if (requestAction === "REJECTED") {
      // Delete the friend request
      await prisma.friendRequest.delete({
        where: { id: existingRequest.id },
      });

      return NextResponse.json(
        new ApiResponse(200, null, "Friend request rejected successfully!")
      );
    }
  }

  // Create friend request
  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: currentUser.id,
      receiverId: receiverId,
      status: "PENDING",
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(
    new ApiResponse(200, friendRequest, "Friend request Send Successfully!")
  );
};

export const POST = apiRouteWrapper(handler);
