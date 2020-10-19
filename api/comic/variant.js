const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Variant", VariantSchema);
