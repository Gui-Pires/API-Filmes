const Movie = require("./movie");
const User = require("./user");
const Review = require("./review");

// Um filme tem várias avaliações
Movie.hasMany(Review, { foreignKey: "movie_id" });
Review.belongsTo(Movie, { foreignKey: "movie_id" });

// Um usuário pode fazer várias avaliações
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

module.exports = { Movie, User, Review };