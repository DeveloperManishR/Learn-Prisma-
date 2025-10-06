import bcrypt from "bcrypt";
import { errorResponse, HTTP_STATUS } from "../utils/response.js";
import jwt from "jsonwebtoken";
import prisma from "../db/db.config.js";
export const hashedPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const authenticateUser = async (req, res, next) => {
  try {
    // use req.cookies (plural) not req.cookie
    const accessToken = req.cookies?.accessToken;

    

    if (!accessToken) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "No access token provided"
      );
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized - Invalid or expired access token"
    );
  }
};
