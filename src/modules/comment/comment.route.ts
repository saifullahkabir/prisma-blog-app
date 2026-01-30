import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.get("/author/:authorId", commentController.getCommentsByAuthor);

router.post(
  "/",
  auth(userRole.USER, userRole.ADMIN),
  commentController.createComment,
);

router.delete(
  "/:commentId",
  auth(userRole.USER, userRole.ADMIN),
  commentController.deleteComment,
);

export const commentRouter = router;
