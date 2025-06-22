import { NextRequest, NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 Steps to send a friend request:
1. Get current session user
2. Check if users are already friends
3. Check if friend request already exists
4. Create friend request
 */
const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    throw new ApiError(400, "Invalid request body");
  }

  const { receiverId } = body;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new ApiError(404, "Logged-in user not found");
  }

  if (currentUser.id === receiverId) {
    throw new ApiError(400, "You cannot send a friend request to yourself");
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: currentUser.id, user2Id: receiverId },
        { user1Id: receiverId, user2Id: currentUser.id },
      ],
    },
  });

  if (existingFriendship) {
    throw new ApiError(400, "You are already friends");
  }

  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: receiverId },
        { senderId: receiverId, receiverId: currentUser.id },
      ],
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw new ApiError(400, "Friend request already exists");
  }

  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: currentUser.id,
      receiverId,
      status: "PENDING",
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(
    new ApiResponse(200, friendRequest, "Friend request sent successfully!")
  );
};

export const POST = apiRouteWrapper(handler);
