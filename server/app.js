const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

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
app.put("/api/recipes/:id", multer, (req, res, next) => {
  const recipeId = req.params.id;
  const recipeObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Recipe.findOne({ _id: recipeId })
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      Recipe.updateOne({ _id: recipeId }, { ...recipeObject, _id: recipeId })
        .then(() => {
          if (req.file) {
            const filename = recipe.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "Error deleting image file" });
              }
            });
          }
          res.status(200).json({ message: "Recipe modified!" });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Error modifying recipe" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Error finding recipe" });
    });
});

// delete recipe
app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Recipe removed from DB" }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
