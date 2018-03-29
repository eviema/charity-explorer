const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    suburb: String,
    postcode: Number
});

module.exports = mongoose.model('locations', locationSchema);
