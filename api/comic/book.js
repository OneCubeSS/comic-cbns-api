const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true
  },
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
  collection_links: [],
  characters: [],
  artist: String,
  year: {
    type: String,
    required: true
  },
  variants: [],
});

module.exports = mongoose.model("Book", BookSchema);
