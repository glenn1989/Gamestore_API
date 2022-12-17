const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre',genreSchema);

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(2).required()
    });
    return schema.validate(genre);
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;