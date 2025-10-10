import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import apiRoutes from "./routes/index.js";
import cors from "cors"
import helmet from "helmet";
import { limiter } from "./config/ratelimiter.js";

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware

app.use(helmet());
app.use(cors())
app.use(express.json()); // for JSON
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cookieParser());
app.use(express.static("public"));
app.use(limiter)
// Routes
app.get("/", (req, res) => {
  return res.send("Hi Everyone.");
});

app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
