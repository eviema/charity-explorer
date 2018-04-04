const mongoose = require('mongoose');
const { Schema } = mongoose;

const causeSchema = new Schema({
    Main_Activity: String,
    Subtype_Name: String,
    Subtype_Desc: String,
    Example: String
});

module.exports = mongoose.model('causes', causeSchema);
