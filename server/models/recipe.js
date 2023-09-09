const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  title: { type: String },
  category: { type: String },
  imageUrl: { type: String },
});

module.exports = mongoose.model("Recipe", recipeSchema);
