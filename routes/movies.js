const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre} = require('../models/genre');
const { Movie, validate } = require('../models/movie');

// GET Request -> all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().populate('genre', 'name -_id').sort('name').lean();
  res.send(movies);
});


// GET Request -> by name
router.get('/:movie', async (req, res) => {
  const movie = await Movie.find({ name: req.params.movie }).populate('genre', 'name -_id').sort().lean();
  if (!movie) return res.status(404).send('404: Movie not found.') // 404

  res.send(movie);
});

// GET request -> by id
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('genre', 'name -_id');

  if (!movie) return res.status(404).send('404: Movie not found.') // 404

  res.send(movie);
});


// POST Request -> add movie
router.post('/add_movie', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message) // 400

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid Genre.');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  try {
    await movie.save();
    res.send(movie);
  }
  catch (err) {
    console.log("ERROR:", err.message);
  }
});


// PUT Request - update movie
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message); // 400

  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!movie) return res.status(404).send('404: Movie not found.') // 404

  res.send(movie);
});


// DELETE Request - delete movie
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('404: Movie not found.') // 404
  
  res.send(movie);
});



module.exports = router;