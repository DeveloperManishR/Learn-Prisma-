import prisma from "../db/db.config.js";
import {
  comparePassword,
  hashedPassword,
} from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
import {
  sucessResponse,
  errorResponse,
  HTTP_STATUS,
} from "../utils/response.js";
import { sendEmail } from "../config/mailer.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: parseInt(process.env.EXPIRE_ACCESS_TOKEN_TIME),
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: parseInt(process.env.EXPIRE_REFRESH_TOKEN_TIME),
  });
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: process.env.EXPIRE_ACCESS_TOKEN_TIME * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: process.env.EXPIRE_REFRESH_TOKEN_TIME * 1000,
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Email not found");
    }

    const checkPassword = await comparePassword(password, user.password);

    if (!checkPassword) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, "Incorrect password");
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    setCookies(res, accessToken, refreshToken);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return sucessResponse(
      res,
      HTTP_STATUS.OK,
      "Login successfully",
      userWithoutPassword
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Login failed",
      error.message
    );
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return errorResponse(res, HTTP_STATUS.CONFLICT, "Email already exists");
    }

    const hashPassword = await hashedPassword(password);

    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createUser;

    return sucessResponse(
      res,
      HTTP_STATUS.CREATED,
      "User created successfully",
      userWithoutPassword
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Registration failed",
      error.message
    );
  }
};

export const profileUser = (req, res) => {
  try {
  } catch (error) {}
};

export const updateProfile = () => {
  try {
  } catch (error) {}
};

export const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const payload = {
      toEmail: email,
      subject: "Test Email",
      body: "<h1>Test Email</h1>",
    };
    console.log("payloadpayload", payload);

    await sendEmail(payload.toEmail, payload.subject, payload.body);
    return sucessResponse(res, HTTP_STATUS.OK, "Email sent successfully");
  } catch (error) {
    console.log("err", error);
  }
};

export const refreshToken = async (req, res) => {
  const incomingRefreshToken = req?.cookies?.refreshToken;

  try {
    if (!incomingRefreshToken) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, "No refresh token");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });
    if (!user) {
      return errorResponse(res, HTTP_STATUS.UNAUTHORIZED, "User not found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Refresh Token is Expired"
      );
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

     await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    setCookies(res, accessToken, refreshToken);

    return sucessResponse(res, HTTP_STATUS.OK, "Access token refreshed", {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("etwr3ef", err);
  }
};
