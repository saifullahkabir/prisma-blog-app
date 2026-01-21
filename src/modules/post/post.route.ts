import { Router } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(userRole.USER), postController.createPost);
router.get("/", postController.getAllPost);

export const postRouter = router;
