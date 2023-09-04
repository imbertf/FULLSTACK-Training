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

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.post("/api/recipes", (req, res, next) => {
  try {
    const recipeObject = {
      title: req.body.title,
      category: req.body.category,
    };
    delete recipeObject._id;
    const recipe = new Recipe({
      ...recipeObject,
    });

    recipe
      .save()
      .then(() => {
        res.status(201).json({ message: "Recipe added !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(400).json({ error: "Invalid JSON data" });
  }
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
