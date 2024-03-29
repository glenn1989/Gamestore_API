const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');
const {gameSchema} = require('./game');

const Library = mongoose.model('Library', new mongoose.Schema({
    user: {
        type: userSchema,
        required:true,
        unique: true
    },
    games: [gameSchema]
}))

function validateLibrary(library){
    const schema = Joi.object({
        user: Joi.objectId(),
        game: Joi.objectId()
    })

    return schema.validate(library);
}

exports.Library = Library; 
exports.validate = validateLibrary;