const mongoose = require('mongoose');
const { Schema } = mongoose;

const causeSchema = new Schema({
    Main_Activity: String
});

module.exports = mongoose.model('causes', causeSchema);
