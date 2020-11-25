const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  covermedia: { 
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Publisher", publisherSchema);
