import { Router } from "express";
import { createComment, deleteComment, fetchComments, showComment, updateComment } from "../controller/comment.controller.js";

const router = Router();

router.post("/", createComment);
router.put("/:id", updateComment);
router.get("/", fetchComments);
router.get("/:id", showComment);
router.delete("/:id", deleteComment);

export default router;
