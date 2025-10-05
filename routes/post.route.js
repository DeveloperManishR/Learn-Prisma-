import { Router } from "express";
import { createPost, deletePost, fetchPosts, showPost, updatePost } from "../controller/post.controller.js";

const router = Router();

router.post("/", createPost);
router.put("/:id", updatePost);
router.get("/", fetchPosts);
router.get("/:id", showPost);
router.delete("/:id", deletePost);

export default router;
