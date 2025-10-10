import { Router } from "express";
import UserRoutes from "./user.route.js";
import NewsRoutes from "./news.route.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use('/user',UserRoutes)
router.use('/news',authenticateUser,NewsRoutes)


export default router