const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin =require('../middleware/admin');
const auth = require('../middleware/auth');

router.post('/', async(req,res) => {
    const { error } = validate(req.body);
    const salt = await bcrypt.genSalt(10);

    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if(user) res.status(400).send('User already registered');
    user = new User(_.pick(req.body,['name','email','birthdate','password','isAdmin']));
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','birthdate','isAdmin']));
});

router.get('/me', auth, async(req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.delete('/:id', auth, async(req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send("user not found");

    res.send(user);
})
module.exports = router;