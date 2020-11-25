const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  //categories names
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher'},
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  covermedia: {
    type: String,
    required: true
  },
  writer: String,
  artist: String,
  illustrated: String,
  characters: [String],
  year: {
    type: String,
    required: true
  },
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series'},
});

module.exports = mongoose.model("Book", BookSchema);
