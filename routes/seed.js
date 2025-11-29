const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Movie = require("../models/movie");
const sequelize = require("../database");

// lista das 40 avaliações
const seedReviews = [
  { "rating": 8, "comment": "Great atmosphere and pacing.", "user_id": 2, "movie_id": 1 },
  { "rating": 9, "comment": "Amazing visuals and storytelling.", "user_id": 4, "movie_id": 3 },
  { "rating": 7, "comment": "Good movie, but expected more from the finale.", "user_id": 1, "movie_id": 2 },
  { "rating": 10, "comment": "Absolutely phenomenal from start to finish!", "user_id": 5, "movie_id": 7 },
  { "rating": 8, "comment": "Solid acting and great direction.", "user_id": 3, "movie_id": 6 },
  { "rating": 9, "comment": "One of the best films released this year.", "user_id": 2, "movie_id": 4 },
  { "rating": 6, "comment": "Had potential but dragged in the middle.", "user_id": 1, "movie_id": 5 },
  { "rating": 9, "comment": "Emotional, powerful and beautifully executed.", "user_id": 4, "movie_id": 9 },
  { "rating": 8, "comment": "A charming surprise, loved the characters.", "user_id": 5, "movie_id": 2 },
  { "rating": 10, "comment": "Instant classic. Will rewatch for sure.", "user_id": 3, "movie_id": 11 },

  { "rating": 7, "comment": "Fun adventure, but predictable.", "user_id": 2, "movie_id": 13 },
  { "rating": 9, "comment": "Brilliant performances across the board.", "user_id": 1, "movie_id": 8 },
  { "rating": 8, "comment": "Great soundtrack and solid cinematography.", "user_id": 4, "movie_id": 10 },
  { "rating": 6, "comment": "Not bad, but pacing issues hurt the experience.", "user_id": 3, "movie_id": 12 },
  { "rating": 9, "comment": "Exceeded all expectations!", "user_id": 5, "movie_id": 14 },
  { "rating": 7, "comment": "Entertaining, though not memorable.", "user_id": 2, "movie_id": 15 },
  { "rating": 10, "comment": "Masterfully crafted in every aspect.", "user_id": 1, "movie_id": 19 },
  { "rating": 8, "comment": "Really enjoyable and well-made.", "user_id": 4, "movie_id": 17 },
  { "rating": 9, "comment": "Captivating story and a satisfying ending.", "user_id": 3, "movie_id": 16 },
  { "rating": 8, "comment": "Solid film with great emotional weight.", "user_id": 5, "movie_id": 18 },

  { "rating": 10, "comment": "Couldn't look away for a second!", "user_id": 1, "movie_id": 7 },
  { "rating": 9, "comment": "A visually stunning achievement.", "user_id": 2, "movie_id": 3 },
  { "rating": 8, "comment": "Good mix of action and drama.", "user_id": 5, "movie_id": 1 },
  { "rating": 6, "comment": "Average story but excellent acting.", "user_id": 4, "movie_id": 6 },
  { "rating": 7, "comment": "Enjoyable, though a bit too long.", "user_id": 3, "movie_id": 2 },
  { "rating": 9, "comment": "Fantastic cast and gripping plot.", "user_id": 1, "movie_id": 9 },
  { "rating": 8, "comment": "I liked the tone and atmosphere.", "user_id": 4, "movie_id": 11 },
  { "rating": 10, "comment": "Award-worthy performance by the lead.", "user_id": 5, "movie_id": 14 },
  { "rating": 9, "comment": "One of the most engaging films this decade.", "user_id": 3, "movie_id": 8 },
  { "rating": 7, "comment": "Not perfect, but very entertaining.", "user_id": 2, "movie_id": 15 },

  { "rating": 8, "comment": "Charming story with heartwarming moments.", "user_id": 5, "movie_id": 17 },
  { "rating": 9, "comment": "The climax gave me chills.", "user_id": 1, "movie_id": 10 },
  { "rating": 6, "comment": "Decent but lacked emotional depth.", "user_id": 4, "movie_id": 5 },
  { "rating": 7, "comment": "Some great moments sprinkled throughout.", "user_id": 3, "movie_id": 4 },
  { "rating": 10, "comment": "Absolutely unforgettable!", "user_id": 2, "movie_id": 19 },
  { "rating": 9, "comment": "A moving and impressive experience.", "user_id": 5, "movie_id": 12 },
  { "rating": 8, "comment": "Very solid execution overall.", "user_id": 1, "movie_id": 13 },
  { "rating": 7, "comment": "Pretty good, though not my style.", "user_id": 4, "movie_id": 18 },
  { "rating": 9, "comment": "Almost perfect. Loved the direction.", "user_id": 2, "movie_id": 16 },
  { "rating": 8, "comment": "Good movie to relax and enjoy.", "user_id": 3, "movie_id": 7 }
];


// ROTA TEMPORÁRIA: /seed
router.post("/", async (req, res) => {
    try {
        await Review.bulkCreate(seedReviews);
        return res.json({ message: "Seed inserido com sucesso!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao inserir seed." });
    }
});

router.get("/updatemovies", async (req, res) => {
    try {
        // 1. Agrupa todas as avaliações por movieId
        const reviewStats = await Review.findAll({
            attributes: [
                "movie_id",
                [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
                [sequelize.fn("COUNT", sequelize.col("rating")), "countRating"]
            ],
            group: ["movie_id"],
            raw: true
        });

        // 2. Atualiza cada filme individualmente
        for (const stat of reviewStats) {
            await Movie.update(
                {
                    rating: Number(Number(stat.avgRating).toFixed(2)),
                    rating_count: stat.countRating
                },
                { where: { id: stat.movie_id } }
            );
        }

        return res.json({
            message: "Filmes atualizados com sucesso!",
            updated: reviewStats.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar filmes" });
    }
});

module.exports = router;