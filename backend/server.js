import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import loginRoutes from "./routes/loginRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
const port = process.env.PORT || 5000;

dotenv.config();
const allowedOrigin = "https://nodejs-web-server-five.vercel.app";

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    app.use(
      cors({
        origin: allowedOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "filename", "user`"],
      })
    );
    app.options(
      /(.*)/,
      cors({
        origin: allowedOrigin,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "filename", "user`"],
      })
    );
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/", (req, res) => {
      res.send("API is running");
    });

    app.use("/api/videos", videoRoutes);
    app.use("/api/logout", logoutRoutes);
    app.use("/api/login", loginRoutes);
    app.use("/api/user", userRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
