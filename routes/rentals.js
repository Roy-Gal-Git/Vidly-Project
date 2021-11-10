const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');
const auth = require('../middleware/auth');

// GET Request -> all rentals
router.get('/', async (req, res) => {
  const rentals = await Rental
    .find()
    .populate('customer', 'name -_id')
    .populate('movie', 'name -_id')
    .sort('name')
    .lean();

  res.send(rentals);
});

// GET request -> by id
router.get('/:id', async (req, res) => {
  const rental = await Rental
    .findById(req.params.id)
    .populate('customer', 'name -_id')
    .populate('movie', 'name -_id')
    .lean();

  if (!rental) return res.status(404).send('404: Rental not found.') // 404

  res.send(rental);
});


// POST Request -> add rental
router.post('/add_rental', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message) // 400

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie.');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid Customer.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  try {
    rental = await rental.save();

    movie.numberInStock--;
    movie.save();
    
    res.send(rental);
  }
  catch (err) {
    console.log("ERROR:", err.message);
  }
});


// DELETE Request - delete rental
router.delete('/:id', auth, async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (!rental) return res.status(404).send('404: Rental not found.') // 404
  
  res.send(rental);
});


module.exports = router;
