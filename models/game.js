const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const {studioSchema} = require('./studio');

const Game = mongoose.model('games', new mongoose.Schema({
    title: {
        type: String,
        required:true,
        minlength:5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required:true
    },
    studio: {
        type: studioSchema,
        required:true
    }
}))

function validateGame(game) {
    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      genreId: Joi.objectId().required(),
      studioId: Joi.objectId().required()
    });
  
    return schema.validate(game);
  }
  
  exports.Game = Game; 
  exports.validate = validateGame;