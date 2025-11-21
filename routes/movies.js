const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");

const { Op } = require("sequelize");

// Criar um novo filme
router.post("/", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { title, director, year, s_year, e_year, genre, cast, language, country, min_rating, max_rating } = req.query;

        const where = {};

        const addLike = (field, value) => {
            if (value) where[field] = { [Op.like]: `%${value}%` };
        }

        addLike("title", title);
        addLike("director", director);
        addLike("genre", genre);
        addLike("cast", cast);
        addLike("language", language);
        addLike("country", country);

        // Valores diferentes tratados a parte
        if (year) where.release_year = { [Op.between]: [`${year}-01-01`, `${year}-12-31`] }
        else if (s_year && e_year) where.release_year = { [Op.between]: [`${s_year}-01-01`, `${e_year}-12-31`] };

        if (min_rating) where.rating = { ...where.rating, [Op.gte]: Number(min_rating) };
        if (max_rating) where.rating = { ...where.rating, [Op.lte]: Number(max_rating) };

        const movies = await Movie.findAll({ where });
        return res.json(movies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar filmes" });
    }
});

// Buscar filme por ID
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);

        if (!movie)
            return res.status(404).json({ error: "Filme não encontrado" });

        return res.json(movie);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar filme" });
    }
});

// Atualizar filme
router.put("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) return res.status(404).json({ error: "Filme não encontrado" });

        await movie.update(req.body);
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar filme
router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) return res.status(404).json({ error: "Filme não encontrado" });

        await movie.destroy();
        res.json({ message: "Filme removido com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;