const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Review = require("../models/review");
const User = require("../models/user");
const sequelize = require("../database");

const { Op } = require("sequelize");

// Busca todas as avaliações
router.get("/", async (req, res) => {
    try {
        const { movie_id, user_id, min_rating, max_rating } = req.query;

        const where = {};

        if (movie_id) where.movie_id = movie_id;
        if (user_id) where.user_id = user_id;

        if (min_rating) where.rating = { ...where.rating, [Op.gte]: min_rating };
        if (max_rating) where.rating = { ...where.rating, [Op.lte]: max_rating };

        const reviews = await Review.findAll({ where });

        return res.json(reviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar reviews" });
    }
});

// Busca avaliação por id
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review)
      return res.status(404).json({ error: "Avaliação não encontrada" });

    return res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar avaliação" });
  }
});

router.get("/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const reviews = await Review.findAll({
      where: { movie_id: movieId },
      include: { model: User, attributes: ["id", "nickname"] }
    });

    // Caso não exista nenhuma review
    if (reviews.length === 0) {
      return res.status(404).json({ 
        error: "Nenhuma avaliação encontrada para este filme" 
      });
    }

    return res.json(reviews);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// Registrar avaliação
router.post("/:movieId", async (req, res) => {
  const { rating, comment, userId } = req.body;
  const movieId = req.params.movieId;

  const transaction = await sequelize.transaction();

  try {
    await Review.create(
      { rating, comment, movie_id: movieId, user_id: userId },
      { transaction }
    );

    const movie = await Movie.findByPk(movieId, { transaction });

    if (!movie) {
      await transaction.rollback();
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    const novaMedia = (movie.rating * movie.rating_count + rating) / (movie.rating_count + 1);

    await movie.update(
      {
        rating: novaMedia,
        rating_count: movie.rating_count + 1
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      message: "Avaliação registrada com sucesso!",
      newRating: novaMedia
    });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;