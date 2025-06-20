import { NextResponse } from "next/server";
import prisma from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const friendsList = await prisma.user.findMany({
      where: {
        OR: [
          {
            user1Friendships: {
              some: {
                user2Id: currentUserId,
              },
            },
          },
          {
            user2Friendships: {
              some: {
                user1Id: currentUserId,
              },
            },
          },
          {
            sentFriendRequests: {
              some: {
                receiverId: currentUserId,
                status: { in: ["PENDING", "ACCEPTED"] },
              },
            },
          },
          {
            receivedFriendRequests: {
              some: {
                senderId: currentUserId,
                status: { in: ["PENDING", "ACCEPTED"] },
              },
            },
          },
          {
            id: currentUserId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const excludeUserIds = friendsList.map((user) => user.id);

    const nonFriendUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludeUserIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        userType: true,
      },
    });

    return NextResponse.json(nonFriendUsers);
  } catch (error) {
    console.error("Error fetching non-friend users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
