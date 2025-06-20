import prisma from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth.config";

export async function fetchNonFriendUsers() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
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

  return prisma.user.findMany({
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
}

export async function fetchFriendRequests() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { received: [], sent: [] };
  }

  const userId = session.user.id;

  const [received, sent] = await Promise.all([
    // Received requests
    prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    // Sent requests
    prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return { received, sent };
}
