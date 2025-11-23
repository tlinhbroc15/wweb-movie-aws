import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Movies", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      genre: { type: DataTypes.STRING, allowNull: false },
      rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
      summary: { type: DataTypes.TEXT },
      duration: { type: DataTypes.INTEGER },
      total_episodes: { type: DataTypes.INTEGER, defaultValue: 1 },
      release_year: { type: DataTypes.INTEGER },
      poster_url: { type: DataTypes.STRING },
      trailer_url: { type: DataTypes.STRING },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Movies");
  },
};
