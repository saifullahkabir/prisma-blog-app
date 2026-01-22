import { Router } from "express";
import { postController } from "./post.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.get("/", postController.getAllPost);
router.post("/", auth(userRole.USER), postController.createPost);

export const postRouter = router;
