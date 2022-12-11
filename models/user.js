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
        type: Boolean,
        required:true
    },
});

// function isOldEnough(){
//     var age = Date.now() - userSchema.birthdate;
//     var ageDate = new Date(age);
//     var ageYears = Math.abs(ageDate.getUTCFullYear() - 1970);
    

//     if(ageYears < 16){
//         return false;
        
//     } else {
//         return true;
        
//     }; 
// };

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token
}

const User = mongoose.model('User',userSchema);
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        birthdate: Joi.date().max(Date.now() - 504911232000),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()
    })
    return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;