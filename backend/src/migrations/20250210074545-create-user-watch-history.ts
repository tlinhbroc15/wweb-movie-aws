import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("UserWatchHistories", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE"
      },
      movie_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Movies", key: "id" },
        onDelete: "CASCADE"
      },
      watched_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("UserWatchHistories");
  },
};
