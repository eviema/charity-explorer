const express = require('express');
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongoURI);

const app = express();

require('./models/Charity');
require('./models/Cause');
require('./models/Location');
require('./routes/charityRoute')(app);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets, 
    // e.g. main.js, main.css 
    app.use(express.static('client/build'));

    // Express will serve up index.html
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);