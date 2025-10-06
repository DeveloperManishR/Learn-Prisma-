import { Router } from "express";
import { loginUser, profileUser, registerUser } from "../controller/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = Router();

//router.post('/login',loginUser)
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',authenticateUser,profileUser)
router.put('profile',authenticateUser,profileUser)

export default router