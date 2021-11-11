const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');


// GET Request -> all genres
router.get('/', asyncMiddleware(async (req, res, next) => {
  const genres = await Genre.find().sort('name').lean();
  res.send(genres);
}));


// GET Request -> by name
router.get('/:genre', asyncMiddleware(async (req, res) => {
  const genre = await Genre.find({ name: req.params.genre }).sort().lean();
  if (!genre) return res.status(404).send('404: Genre not found.') // 404

  res.send(genre);
}));

// GET request -> by id
router.get('/:id', asyncMiddleware(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('404: Genre not found.') // 404

  res.send(genre);
}));


// POST Request -> add genre
router.post('/add_genre', auth, asyncMiddleware(async (req, res) => {  
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message) // 400
  let genre = new Genre({
    name: req.body.name
  });

  try {
    await genre.save();
    res.send(genre);
  }
  catch (err) {
    console.log("ERROR:", err.message);
  }
}));


// PUT Request - update genre
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message); // 400

  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!genre) return res.status(404).send('404: Genre not found.') // 404

  res.send(genre);
}));


// DELETE Request - delete genre
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('404: Genre not found.') // 404
  
  res.send(genre);
}));



module.exports = router;