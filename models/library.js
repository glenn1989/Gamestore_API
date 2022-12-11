const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');
const {gameSchema} = require('./game');

const Library = mongoose.model('Libraries', new mongoose.Schema({
    user: {
        type: userSchema
    },
    games: [gameSchema]

}))

function validateLibrary(library){
    const schema = Joi.object({
        user: Joi.objectid().required(),
        games: Joi.objectid().required()
    })

    return schema.validate(library);
}

exports.Library = Library; 
exports.validate = validateLibrary;