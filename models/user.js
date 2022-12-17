const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    birthdate: {
        type:Date,
        required:true

    },
    password: {
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token
}

const User = mongoose.model('User',userSchema);
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        birthdate: Joi.date().max(Date.now() - 504911232000),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;