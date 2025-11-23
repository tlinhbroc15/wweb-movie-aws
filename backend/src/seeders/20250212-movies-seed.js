"use strict";

const fs = require("fs");
const movies = JSON.parse(fs.readFileSync("movies.json", "utf-8"));
const episodes = JSON.parse(fs.readFileSync("episodes.json", "utf-8"));

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Movies", movies);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Movies", null, {});
  },

  async up(queryInterface) {
    await queryInterface.bulkInsert("Episodes", episodes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Episodes", null, {});
  },
};
