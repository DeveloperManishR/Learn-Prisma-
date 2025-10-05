import { Router } from "express";
import { createUser, fetchUsers, updateUser } from "../controller/user.controller.js";

const router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.get("/", fetchUsers);
export default router;
