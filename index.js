const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const users = require('./routes/users');
const games = require('./routes/games');
const genres = require('./routes/genres');
const libraries = require('./routes/libraries');
const studios = require('./routes/studios');
const auth = require('./routes/auth');

mongoose.connect('mongodb://localhost/gamestore')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('could not connect to MongoDB'));

app.use(express.json());
app.use('/api/users',users);
app.use('/api/genres',genres);
app.use('/api/games',games);
app.use('/api/libraries', libraries);
app.use('/api/studios',studios);
app.use('/api/auth',auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
