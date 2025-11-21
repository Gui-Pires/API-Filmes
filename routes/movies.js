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
        const { title, genre, year } = req.query;

        const where = {};

        if (title) where.title = { [Op.like]: `%${title}%` };
        if (genre) where.genre = genre;
        if (year) where.year = year;

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