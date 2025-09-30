const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");

// Criar um novo filme
router.post("/", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todos os filmes
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar filme por ID
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) return res.status(404).json({ error: "Filme não encontrado" });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
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