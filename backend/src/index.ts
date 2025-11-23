import dotenv from "dotenv";
dotenv.config(); // Load biến môi trường trước khi khởi động server

// Thiết lập biến môi trường mặc định nếu không có file .env
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_PORT = process.env.DB_PORT || "5432";
process.env.DB_NAME = process.env.DB_NAME || "postgres";
process.env.DB_USER = process.env.DB_USER || "postgres"; 
process.env.DB_PASS = process.env.DB_PASS || "511404";
process.env.PORT = process.env.PORT || "5000";

import app from "./app"; // Import Express App từ `app.ts`
import sequelize from "./config/database"; // Import kết nối database

const PORT = Number(process.env.PORT) || 80;

const startServer = async () => {
  try {
    await sequelize.sync(); // Kết nối database
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
};

startServer();
