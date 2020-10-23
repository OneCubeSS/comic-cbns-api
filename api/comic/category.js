const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  covermedia: { 
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Category", CategorySchema);
