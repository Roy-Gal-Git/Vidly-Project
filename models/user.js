const Joi = require('Joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  }
}));

function validateUser(user) {
  const schema = {
    name: Joi.string().min(2).max(16).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
