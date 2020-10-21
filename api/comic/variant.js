const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Variant", VariantSchema);
