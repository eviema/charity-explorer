const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    Town_City: String,
    State: String,
    Postcode: Number,
    Municipality: String,
});

module.exports = mongoose.model('locations', locationSchema);
