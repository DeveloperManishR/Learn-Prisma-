import express from "express";
import "dotenv/config";
import routes from "./routes/index.js";
const app = express();
const Port = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use('/api',routes)
app.use(routes)
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(4000, () => console.log("server is running"));
