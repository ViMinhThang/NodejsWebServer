import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connecDB from "./config/db.js";
import loginRoutes from "./routes/loginRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import fs from "fs";
import path from "path";
const port = process.env.PORT || 5000;
dotenv.config();
connecDB();

const videoStoragePath = path.join(process.cwd(), "storage/videos");

if (!fs.existsSync(videoStoragePath)) {
  fs.mkdirSync(videoStoragePath, { recursive: true });
}
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/videos", videoRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server is running on port ${port}`));
