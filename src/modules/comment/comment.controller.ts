import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: err,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comment",
      error: err,
    });
  }
};

const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.getCommentsByAuthor(authorId as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch author comments",
      error: err,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentService.deleteComment(
      commentId as string,
      user?.id as string,
    );
    res.status(200).json({
      success: true,
      message: "Comment successfully deleted",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Comment delete failed",
      error: err?.message,
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
};
