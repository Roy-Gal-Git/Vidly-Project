const _ = require('lodash');
const Joi = require('Joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');


// POST Request -> Authenticate user
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message) // 400

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");
  console.log(user);
  const token = user.generateAuthToken();

  res.send(token);
  
});

function validate(req) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
