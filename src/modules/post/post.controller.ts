import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { userRole } from "../../middlewares/auth";
import { date, success } from "better-auth/*";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: "Post creation failed",
      error: err,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    // Parse search query
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    // Parse tags query
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // Parse isFeatured query (convert string → boolean)
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    // Parse status query
    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch posts",
      error: err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const result = await postService.getPostById(postId as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch post by id",
      error: err,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are Unauthorized!");
    }
    const result = await postService.getMyPosts(user.id);
    res.status(200).json({
      success: true,
      message: "Retrieve my posts",
      data: result,
    });
  } catch (err) {
    console.log(err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch my posts";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { postId } = req.params;

    const isAdmin = user.role === userRole.ADMIN;
    console.log(isAdmin);
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin,
    );

    res.status(200).json({
      success: true,
      message: "Post update successfully!",
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Post update failed!";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const { postId } = req.params;
    const isAdmin = user.role === userRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      isAdmin,
    );
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Post delete failed!";
    res.status(400).json({
      success: false,
      message,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();
    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stats fetched failed";
    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
