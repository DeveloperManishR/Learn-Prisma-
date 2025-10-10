import { Router } from "express";
import {
  createNews,
  deleteNews,
  getNews,
  updateNews,
} from "../controller/news.controller.js";
const router = Router();
import {uploadImages} from "../middleware/upload.middleware.js"
router.post("/",uploadImages.single("image"), createNews);
router.get("/", getNews);
router.put("/:id",uploadImages.single("image"), updateNews);
router.delete("/:id", deleteNews);

export default router;
