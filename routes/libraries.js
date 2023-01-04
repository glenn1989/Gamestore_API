const {Library, validate} = require('../models/library');
const {User} = require('../models/user')
const {Game} = require('../models/game');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');


router.get('/', async (req,res) => {
    const libraries = await Library.find();
    if(!libraries) return res.status(400).send('No library found');

    res.send(libraries);
})

// deze post functie maakt een nieuwe library aan, die gebonden is aan een user.
router.post('/', auth ,async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
   
    const user = await User.findById(req.body.user);
    if (!user) return res.status(400).send('Invalid user.');

    let libraries = new Library({
      user: {
        _id: user._id,
        name: user.name, 
        email: user.email,
        birthdate: user.birthdate,
        password: user.password
      }
    });
    libraries = await libraries.save();
    res.send(_.pick(libraries,['_id','user._id','user.name','user.email']));
});

  router.put('/:id', auth ,async(req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const game = await Game.findById(req.body.game);
    if (!game) return res.status(400).send('Invalid game.');

    const userFound = await User.findById(req.body.user);
    if(!userFound) return res.status(400).send('No user found.')

    const library = await Library.findById(req.params.id);
    if(!library) return res.status(400).send('no library found')
    const libraryList = library.games;

    for(let i = 0; i < libraryList.length; i++){
      console.log(libraryList[i]._id)
    }
    console.log(game._id)

    if(libraryList.length != 0){
      for(let i = 0; i < libraryList.length; i++){
        if(libraryList[i]._id != game._id){
          libraryList.push(game);
        }
      }
    } else {
      libraryList.push(game);
    }


    const libraryUpdate = await Library.findByIdAndUpdate(req.params.id,{
      user: userFound,
      games: libraryList

    },
    {new: true}
   );
    
    res.send(_.pick(libraryUpdate,['_id','user._id','user.name','user.email','games']));
  })

  // delete library

  router.delete('/:id', [auth,admin] , async(req,res) => {

    const library = await Library.findByIdAndDelete(req.params.id);
    if(!library) return res.status(404).send("The library is not found");

    res.send(library);
  });

  module.exports = router;