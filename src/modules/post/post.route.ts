import { Router } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.get("/", postController.getAllPost);
router.get(
  "/my-posts",
  auth(userRole.USER, userRole.ADMIN),
  postController.getMyPosts,
); // age static route rakte hbe nahoi express e error aste pare
router.get("/:postId", postController.getPostById); // static er pore dynamic

router.post(
  "/",
  auth(userRole.USER, userRole.ADMIN),
  postController.createPost,
);

router.patch(
  "/:postId",
  auth(userRole.USER, userRole.ADMIN),
  postController.updatePost,
);

router.delete(
  "/:postId",
  auth(userRole.USER, userRole.ADMIN),
  postController.deletePost,
);

export const postRouter = router;
