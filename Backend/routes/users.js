const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');


router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user); 
  }
  catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
})

// POST Request -> add user
router.post('/', async (req, res) => {
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
router.delete('/:id', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('404: User not found.') // 404
  
  res.send(user);
});

// PUT Request - set user as admin
router.put('/setadmin/:id', [auth, admin], async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: req.body.isAdmin });

  if (!user) return res.status(404).send('404: User not found.') // 404
  
  res.send(user);
});


module.exports = router;
