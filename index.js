import "dotenv/config";
import cookieParser from "cookie-parser";

import express from "express";
import apiRoutes from "./routes/index.js";
const PORT = process.env.PORT || 4000;
const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  return res.send("Hi Everyone.");
});

app.use('/api',apiRoutes)
app.listen(PORT, (req, res) => {
  console.log(`Server is running on PORT ${PORT}`);
});
