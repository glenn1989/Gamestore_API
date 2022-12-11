const {Studio, validate} = require('../models/studio');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  const studios = await studios.find().sort('name');
  res.send(studios);
});

router.post('/', [auth,admin] , async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let studios = new Studio({ 
    name: req.body.name,
    location: req.body.location 
  });
  studios = await studios.save();

  res.send(studios);
});

router.put('/:id',[auth,admin] , async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const studios = await Studio.findByIdAndUpdate(req.params.id, { 
    name: req.body.name,
    location: req.body.location }, 
    {
    new: true
  });

  if (!studios) return res.status(404).send('The studios with the given ID was not found.');
  
  res.send(studios);
});

router.delete('/:id', [auth, admin], async (req, res) => {

  const studios = await Studio.findByIdAndRemove(req.params.id);

  if (!studios) return res.status(404).send('The studios with the given ID was not found.');

  res.send(studios);
});

router.get('/:id', async (req, res) => {
  const studios = await Studio.findById(req.params.id);

  if (!studios) return res.status(404).send('The studios with the given ID was not found.');

  res.send(studios);
});

module.exports = router;