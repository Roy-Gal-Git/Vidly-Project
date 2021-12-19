const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Customer, validate} = require('../models/customer')
const auth = require('../middleware/auth');


router.post('/',auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  try {
    await customer.save();
    res.send(customer);
  }
  catch (err) {
    console.log("ERROR:", err.message);
  }
});


router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) return res.status(404).send("404: User not found.")

  res.send(customer);
});


router.delete('/:id', auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id, { new: true});
  if (!customer) return res.status(404).send("404: User not found.");

  res.send(customer);
})


module.exports = router;