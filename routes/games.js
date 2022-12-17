const {Game, validate} = require('../models/game');
const {Genre} = require('../models/genre');
const {Studio} = require('../models/studio');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  const games = await Game.find().sort('name');
  res.send(games);
});

router.post('/', [auth,admin] , async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send(error.details[0].message);

  const studio = await Studio.findById(req.body.studioId);
  if(!studio) return res.status(400).send(error.details[0].message);

  let games = new Game({ 
    title: req.body.title,
    genre: {
        _id: genre._id,
        name: genre.name
    },
    studio: {
        _id: studio._id,
        name: studio.name,
        location: studio.location
    } });
  await games.save();
  
  res.send(games);
});

router.put('/:id',[auth,admin] , async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const games = await Game.findByIdAndUpdate(req.params.id, { title: req.body.name }, {
    new: true
  });

  if (!games) return res.status(404).send('The games with the given ID was not found.');
  
  res.send(games);
});

router.delete('/:id', [auth, admin], async (req, res) => {

  const games = await Game.findByIdAndRemove(req.params.id);

  if (!games) return res.status(404).send('The games with the given ID was not found.');

  res.send(games);
});

router.get('/:id', async (req, res) => {
  const games = await Game.findById(req.params.id);

  if (!games) return res.status(404).send('The games with the given ID was not found.');

  res.send(games);
});

module.exports = router;