const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  //categories names
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  covermedia: {
    type: String,
    required: true
  },
  publisher: String,
  writer: String,
  artist: String,
  illustrated: String,
  characters: [String],
  year: {
    type: String,
    required: true
  },
  // id's from varient books
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant'}],
});

module.exports = mongoose.model("Book", BookSchema);
