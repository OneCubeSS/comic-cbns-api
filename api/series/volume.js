const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  //categories names
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher'},
  title: { // with volume name or just title
    type: String,
    required: true,
    unique: true
  },
  covermedia: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Series", seriesSchema);
