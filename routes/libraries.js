const {Library, validate} = require('../models/library');
const {User, validate} = require('../models/user')
const {Game, validate} = require('../models/game');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Fawn = require('fawn');

Fawn.init('mongodb://localhost/gamestore');

router.get('/', async (req,res) => {
    const libraries = await Library.find().sort();
    res.send(libraries);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user.');
  
    const game = await Game.findById(req.body.gameId);
    if (!game) return res.status(400).send('Invalid game.');

    
  
    let library = new Library({ 
      user: {
        _id: user._id,
        name: user.name, 
        email: user.phone
      },
      game: {
        _id: game._id,
        title: game.title,
        genre: game.genre
      }
    });
  
    try {
      new Fawn.Task()
        .save('Library', library )
        .run();
    
      res.send(library);
    }
    catch(ex) {
      res.status(500).send('Something failed.');
    }
  });

  router.put('/:id', async(req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const game = await Game.findById(req.body.gameId);
    if (!game) return res.status(400).send('Invalid game.');

    const library = await Library.findByIdAndUpdate(req.params.id);
    library.games.push(game);

  })

  module.exports = router;