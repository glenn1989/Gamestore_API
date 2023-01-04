const Joi = require('joi');
const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    location: {
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    }
});

const Studio = mongoose.model('Studio',studioSchema);

function validateStudio(studio){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        location: Joi.string().min(5).max(255).required()
        
    })
    return schema.validate(studio);
};

exports.studioSchema = studioSchema;
exports.Studio = Studio;
exports.validate = validateStudio;