const {Library, validate} = require('../models/library');
const {User} = require('../models/user')
const {Game} = require('../models/game');
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


router.post('/', auth ,async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
   
    const user = await User.findById(req.body.user);
    if (!user) return res.status(400).send('Invalid user.');

    
    if(req.body.game){
      const game = await Game.findById(req.body.gameId);
      if (!game) return res.status(400).send('Invalid game.');
    } 

    let library = new Library({
      user: {
        _id: user._id,
        name: user.name, 
        email: user.email
      }
    });
  
    try {
      new Fawn.Task()
        .save('libraries', library )
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

    const game = await Game.findById(req.body.game);
    if (!game) return res.status(400).send('Invalid game.');

    const userFound = await User.findById(req.body.user);
    if(!userFound) return res.status(400).send('No user found.')

    const library = await Library.findById(req.params.id);
    const libraryList = library.games;

    for(let i = 0; i < libraryList.length; i++){
      if(libraryList[i]._id === game._id){
        return res.status(400).send('Game already bought.')
      } else{
        libraryList.push(game);
      }
    }
    const libraryUpdate = await Library.findByIdAndUpdate(req.params.id,{
      user: userFound,
      games: libraryList
    },
    {new: true}
   );
    
    res.send(libraryUpdate);
  })



  // async function FindGame(gameId){

  //   const game = await Game.findById(gameId);
  //   if (!game) return res.status(400).send('Invalid game.');

  //   return game;
  // } 


  module.exports = router;