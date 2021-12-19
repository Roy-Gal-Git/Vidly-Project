const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre')


const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  },
  genre: {
    type: genreSchema,
    reqired: true
  }
});


const Movie = mongoose.model('Movie', movieSchema);


function validateMovie(movie) {
  const schema = { 
    title: Joi.string().min(3).max(20).required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
    genreId: Joi.objectId().required()
   };

  return Joi.validate(movie, schema);
}


exports.Movie = Movie;
exports.validate = validateMovie;