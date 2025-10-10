import prisma from "../db/db.config.js";
import { redisClient } from "../db/redis.config.js";
import {
  errorResponse,
  HTTP_STATUS,
  sucessResponse,
} from "../utils/response.js";

export const createNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    const { filename } = req.file;

    console.log("efvef", req.file);

    const createNews = await prisma.news.create({
      data: {
        userId,
        title,
        content,
        image: filename,
      },
    });

    return sucessResponse(res, HTTP_STATUS.CREATED, "News created", createNews);
  } catch (error) {
    console.log("err", error);
  }
};

export const getNews = async (req, res) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;

  if (page <= 0) page = 1;
  if (limit <= 0 || limit > 100) limit = 10;

  const skip = (page - 1) * limit;

  // Cache key based on pagination
  const cacheKey = `news:page=${page}:limit=${limit}`;

  try {
    // 1️⃣ Check if cache exists
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return sucessResponse(res, HTTP_STATUS.OK, "News fetched from cache", parsed);
    }

    // 2️⃣ Fetch from DB if not in cache
    const allNews = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);

    const responsePayload = {
      data: allNews,
      pagination: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    };

    // 3️⃣ Store in Redis for 5 minutes (300 seconds)
    await redisClient.set(cacheKey, JSON.stringify(responsePayload), "EX", 60*60);

    return sucessResponse(res, HTTP_STATUS.OK, "News fetched", responsePayload);
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};


export const updateNews = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id } = req.params;

    console.log(req.body, "idid", id);

    const { title, content } = req.body;

    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!news) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, "News not found");
    }

    if (userId !== news.userId) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You are not authorized to update this news"
      );
    }

    const updateNews = await prisma.news.update({
      where: {
        id: news.id,
      },
      data: {
        title,
        content,
      },
    });

    return sucessResponse(res, HTTP_STATUS.OK, "News updated", updateNews);

    console.log("newcsa", news);
  } catch (error) {
    console.log("ertrf", error);
  }
};

export const deleteNews = (req, res) => {
  try {
  } catch (error) {}
};
