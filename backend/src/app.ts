import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import movieRoutes from "./routes/movieRoutes";
import episodeRoutes from "./routes/episodeRoutes";
import userFavoriteRoutes from "./routes/userFavoriteRoutes";
import userWatchHistoryRoutes from "./routes/userWatchHistoryRoutes";
import movieCommentRoutes from "./routes/movieCommentRoutes";
//import awsRouter from "./routes/awsRouter";
const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://www.alldrama.net", "https://www.alldrama.online", "https://www.alldramaz.com"],
    credentials: true
}));
  

app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/episodes", episodeRoutes);
app.use("/api/user-favorites", userFavoriteRoutes);
app.use("/api/user-watch-histories", userWatchHistoryRoutes);
app.use("/api/movie-comments", movieCommentRoutes);
//app.use("/api/aws", awsRouter);
export default app;
