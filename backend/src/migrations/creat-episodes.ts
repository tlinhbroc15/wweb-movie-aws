import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Episodes", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      movie_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Movies", key: "id" },
        onDelete: "CASCADE"
      },
      episode_number: { type: DataTypes.INTEGER, allowNull: false },
      video_url: { type: DataTypes.STRING, allowNull: false },
      // episode_views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Episodes");
  },
};
