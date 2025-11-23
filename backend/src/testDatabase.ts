import sequelize from "./config/database";

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await sequelize.close();
  }
};

testConnection();
