const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

const { Op } = require("sequelize");

// router.get("/", async (req, res) => {
//     try {
//         const users = await User.findAll();
//         return res.json(users);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Erro ao buscar usuários" });
//     }
// });

router.get("/", async (req, res) => {
    try {
        const { nickname, email } = req.query;

        const where = {};

        if (nickname) where.nickname = { [Op.like]: `%${nickname}%` }
        else if (email) where.email = { [Op.like]: `%${email}%` }

        const users = await User.findAll({ where });
        return res.json(users);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });

        return res.json({ id: user.id, email: user.email, nickname: user.nickname });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const { nickname, email, oldpassword, newpassword } = req.body

        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });

        if (!email)
            return res.status(400).json({ error: "E-mail inválido" });

        if (!oldpassword)
            return res.status(400).json({ error: "Senha antiga inválida" });

        if (!newpassword)
            return res.status(400).json({ error: "Senha nova inválida" });

        if (!nickname)
            return res.status(400).json({ error: "Nickname inválido" });

        // Verifica se nickname já existe
        const nickExists = await User.findOne({ where: { nickname } });
        if (nickExists)
            return res.status(400).json({ error: "Nickname já está em uso" });
        
        // Verifica se a senha antiga é válida
        const valid = await bcrypt.compare(oldpassword, user.password);
        if (!valid)
            return res.status(401).json({ error: "Senha antiga está errada" });

        // Criptografando senha nova
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const updateUser = {
            email,
            password: hashedPassword,
            nickname
        }

        await user.update(updateUser);
        return res.json({
            message: "Usuário atualizado com sucesso!",
            user: { id: user.id, nickname: user.nickname, email: user.email }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

// Criar usuário
router.post("/register", async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        if (!email)
            return res.status(400).json({ error: "E-mail inválido" });

        if (!password)
            return res.status(400).json({ error: "Senha inválida" });

        if (!nickname)
            return res.status(400).json({ error: "Nickname inválido" });

        // Verifica se email já existe
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists)
            return res.status(400).json({ error: "E-mail já cadastrado" });

        // Verifica se nickname já existe
        const nickExists = await User.findOne({ where: { nickname } });
        if (nickExists)
            return res.status(400).json({ error: "Nickname já está em uso" });

        // Criptografando senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            nickname
        });

        return res.json({
            message: "Usuário registrado com sucesso!",
            user: { id: user.id, nickname: user.nickname, email: user.email }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email)
            return res.status(400).json({ error: "E-mail inválido" });

        if (!password)
            return res.status(400).json({ error: "Senha inválida" });

        const user = await User.findOne({ where: { email } });

        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            return res.status(401).json({ error: "Senha inválida" });

        return res.json({ message: "Login realizado com sucesso", user: { id: user.id, nickname: user.nickname, email: user.email } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;