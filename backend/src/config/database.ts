import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { Episode } from "../models/Episode";
import { MovieComment } from "../models/MovieComment";
import { UserWatchHistory } from "../models/UserWatchHistory";
import { UserFavorite } from "../models/UserFavorite";

dotenv.config();

const sequelize = new Sequelize({
  // database: process.env.DB_NAME,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // dialect: "postgres",
  database: "postgres",
  username: "postgres",
  password: "511404",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  models: [User, Movie, Episode, MovieComment, UserWatchHistory, UserFavorite], // Import toàn bộ models
  logging: false,
  dialectOptions: undefined,
    // ["localhost", "127.0.0.1"].includes(process.env.DB_HOST!)
    //   ? {} // Nếu là localhost: KHÔNG dùng SSL (trả về undefined)
    //   : {         // Nếu không phải localhost (AWS): BẬT SSL
    //       ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //       },
    //     },
});

export default sequelize;
