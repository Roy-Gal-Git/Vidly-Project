const mongoose = require('mongoose');
const Joi = require('Joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength:20
  },

  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  },

  isGold: {
    type: Boolean,
    default: false,
    required: true
  }
}));


function validateCustomer(customer) {
  const schema = { 
    name: Joi.string().min(5).max(20).required(),
    phone: Joi.string().min(5).max(20).required(),
    isGold: Joi.boolean().required()
   };

  return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;