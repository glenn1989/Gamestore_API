const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');
const {gameSchema} = require('./game');

const Library = mongoose.model('Libraries', new mongoose.Schema({
    user: {
        type: userSchema,
        required:true
    },
    games:{
        type: [gameSchema]
    } 

}))

function validateLibrary(library){
    const schema = Joi.object({
        user: Joi.objectid().required(),
        games: Joi.objectid()
    })

    return schema.validate(library);
}

exports.Library = Library; 
exports.validate = validateLibrary;