/** import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: "postgres",
  username: "postgres",
  password: "duyhung09",
  host: "movie-db.co1u04gkcopk.us-east-1.rds.amazonaws.com",
  port: 5432,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối database RDS thành công!");
  } catch (error) {
    console.error("❌ Kết nối database RDS thất bại:", error);
  } finally {
    await sequelize.close();
  }
};

testConnection(); **/