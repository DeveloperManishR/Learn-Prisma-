import { Router } from "express";
import UserRoutes from "./user.route.js";
import PostRoutes from "./post.route.js";
import CommentRoutes from "./comment.route.js";

const router = Router();
router.use("/api/user", UserRoutes);
router.use("/api/post", PostRoutes);
router.use("/api/comment", CommentRoutes);

export default router;
