
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongoURI);

// Create charity schema
let charitySchema = mongoose.Schema({
  id: Number,
  name: String
});

// Store song documents in a collection called "songs" if it doesn't exist
module.exports = mongoose.model("charities", charitySchema);
