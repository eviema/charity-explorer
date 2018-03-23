const express = require('express');
const visualRoute = require('./routes/visualRoute');
const charityRoute = require('./routes/charityRoute');
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

const app = express();

visualRoute(app);
charityRoute(app);

app.get('/', (req, res) => {
    res.send({ hi: 'there' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);