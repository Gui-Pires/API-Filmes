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
  rating: DataTypes.FLOAT,
  duration: DataTypes.INTEGER,
  cast: DataTypes.TEXT,
  language: DataTypes.STRING,
  country: DataTypes.STRING,
  trailer_url: DataTypes.STRING,
  poster_url: DataTypes.STRING
}, {
  timestamps: true,
});

sequelize.sync();
module.exports = Movie;