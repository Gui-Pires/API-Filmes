const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Movie = sequelize.define("Movie", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  director: DataTypes.STRING,
  release_year: DataTypes.DATEONLY,
  genre: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  cast: DataTypes.TEXT,
  language: DataTypes.STRING,
  country: DataTypes.STRING,
  trailer_url: DataTypes.STRING,
  poster_url: DataTypes.STRING,
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
});

module.exports = Movie;