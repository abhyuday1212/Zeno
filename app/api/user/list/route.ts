import { NextRequest, NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiError } from "@/utils/apiErrors";
import { ApiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import prisma from "@/db/index";

/**
 * Get users with pagination and search functionality
 * Query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10)
 * - search: search term for name or email
 * - excludeFriends: boolean to exclude current user's friends (default: false)
 */
const handler = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const sizePerPage = parseInt(url.searchParams.get("sizePerPage") || "10");
  const search = url.searchParams.get("search") || "";
  const excludeFriends = url.searchParams.get("excludeFriends") === "true";

  const skip = (page - 1) * sizePerPage;

  // Base query filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    // Don't include the current user in results
    id: { not: session.user.id },
  };

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // If excludeFriends is true, fetch and exclude user's friends
  if (excludeFriends) {
    // Get all friendships where the current user is involved
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    // Extract friend IDs
    const friendIds = friendships.map((friendship) =>
      friendship.user1Id === session.user.id
        ? friendship.user2Id
        : friendship.user1Id
    );

    // Add condition to exclude friends
    if (friendIds.length > 0) {
      whereClause.id = {
        ...whereClause.id,
        notIn: friendIds,
      };
    }
  }

  // Execute query with pagination
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        userType: true,
        createdAt: true,
      },
      skip,
      take: sizePerPage,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / sizePerPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return NextResponse.json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page,
          sizePerPage,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
      "Users retrieved successfully"
    )
  );
};

export const GET = apiRouteWrapper(handler);
