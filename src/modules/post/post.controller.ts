import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    if(!req.user){
     return res.status(401).json({
        success: false,
        message: "Unauthorized!"
      })
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
    const result = await postService.getAllPost();
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

export const postController = {
  createPost,
  getAllPost
};
