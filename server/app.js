const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

// DB
const Recipe = require("./models/recipe");

mongoose
  .connect(
    "mongodb+srv://admin:cAvAd1Pr4FtoRZLd@fullstack.0tpxt5b.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const multer = require("./middlewares/config-multer");
const path = require("path");
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

// get all recipes
app.get("/api/recipes", (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

// get one recipe
app.get("/api/recipes/:id", (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.status(400).json({ error }));
});

// create recipe
app.post("/api/recipes", multer, (req, res, next) => {
  const recipeObject = req.body;
  // const recipeObject = JSON.parse(req.body.recipe);
  delete recipeObject._id;

  const recipe = new Recipe({
    ...recipeObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  recipe
    .save()
    .then(() => {
      res.status(201).json({ message: "Recipe added !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});

// update recipe
app.put("/api/recipes/:id", (req, res, next) => {
  Recipe.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Recipe updated !" }))
    .catch((error) => res.status(400).json({ error }));
});

// delete recipe
app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Recipe removed from DB" }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
