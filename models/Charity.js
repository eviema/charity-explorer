const mongoose = require('mongoose');
const { Schema } = mongoose;

const charitySchema = new Schema({
    ABN: Number,
    name: String
});

module.exports = mongoose.model('Charities', charitySchema);


