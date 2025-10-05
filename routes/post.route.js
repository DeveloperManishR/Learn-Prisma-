import { Router } from "express";
import { createPost, deletePost, fetchPosts, searchPost, showPost, updatePost } from "../controller/post.controller.js";

const router = Router();


router.get("/", fetchPosts);
router.get("/search", searchPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.get("/:id", showPost);
router.delete("/:id", deletePost);

export default router;
