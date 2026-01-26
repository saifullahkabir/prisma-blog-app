import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  // Create a post with the logged-in user's ID as author
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  tags?: string[];
  isFeatured?: boolean | undefined;
  status?: PostStatus | undefined;
  authorId?: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];

  // Search filter
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  // Tags filter
  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  // Featured filter
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }

  // Status filter
  if (status) {
    andConditions.push({
      status,
    });
  }

  // filter by authorId
  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  // Prisma query
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where:
      andConditions.length > 0
        ? {
            AND: andConditions, // Only add AND if filters exist
          }
        : {}, // No filters → return all posts
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
};
