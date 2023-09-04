const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  title: { type: "string" },
  category: { type: "string" },
});

module.exports = mongoose.model("Recipe", recipeSchema);
