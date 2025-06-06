const express = require('express');
const { 
    addMovie, 
    getAllMovies, 
    getMovieById, 
    updateMovie, 
    deleteMovie, 
    getMovieRatings 
} = require('../controllers/movieController');

const { getReviewsByMovieId } = require('../controllers/reviewController');

const { authenticateJWT } = require('../middleware/auth');
const { isAdmin, isUser } = require('../middleware/roles');

const router = express.Router();

// Lägg till en ny film
router.post('/', authenticateJWT, isAdmin, addMovie);

// Hämta alla filmer
router.get('/', getAllMovies);

// Hämta betyg för alla filmer
router.get('/ratings', getMovieRatings);

// Hämta en specifik film med ID
router.get('/:id', getMovieById);

// Uppdatera en specifik film med ID
router.put('/:id', authenticateJWT, isAdmin, updateMovie);

// Radera en specifik film med ID
router.delete('/:id', authenticateJWT, isAdmin, deleteMovie);

// Hämta recensioner för en specifik film med ID
router.get('/:id/reviews', isUser, getReviewsByMovieId);

module.exports = router;