const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  photo: { type: String },
  price: { type: Number },
  category: { type: String },
  siperfaqja: { type: Number },
  vendndodhja: { type: String },

  ownerItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
