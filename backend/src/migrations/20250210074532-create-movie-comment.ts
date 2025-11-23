import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("MovieComments", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      movie_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Movies", key: "id" },
        onDelete: "CASCADE"
      },
      user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE"
      },
      comment: { type: DataTypes.TEXT, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("MovieComments");
  },
};
