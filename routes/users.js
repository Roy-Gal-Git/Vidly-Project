const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');

// GET Request -> all rentals
router.get('/', async (req, res) => {
  const users = await User
    .find()
    .sort('name')
    .lean();

  res.send(users);
});

// GET request -> by id
router.get('/:id', async (req, res) => {
  const user = await User
    .findById(req.params.id)
    .lean();

  if (!user) return res.status(404).send('404: Rental not found.') // 404

  res.send(user);
});


// POST Request -> add rental
router.post('/register', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message) // 400

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    user = await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']));
  }
  catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});


// DELETE Request - delete rental
router.delete('/:id', auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('404: User not found.') // 404
  
  res.send(user);
});


module.exports = router;
