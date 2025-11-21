const express = require("express");
const cors = require("cors");

const sequelize = require("./database");
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const reviewsRoutes = require("./routes/reviews");
require("./models/associations");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/reviews", reviewsRoutes);

app.get("/", (req, res) => {
    res.send("🚀 API de Catálogo de Filmes está rodando! Acesse /movies para usar o CRUD.");
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("API rodando em http://localhost:3000");
    });
});