const express = require('express');
const { 
    addReview, 
    getAllReviews, 
    getReviewById, 
    updateReview, 
    deleteReview,  
} = require('../controllers/reviewController');
const { authenticateJWT } = require('../middleware/auth');
const { isAdmin, isUser } = require('../middleware/roles');
const router = express.Router();

// Lägg till en ny recension
router.post('/', authenticateJWT, isUser, addReview);

// Hämta en lista med alla recensioner
router.get('/', getAllReviews);

// Hämta detaljer för en specifik recension
router.get('/:id', getReviewById);

// Uppdatera en specifik recension
router.put('/:id', authenticateJWT, isAdmin, updateReview);

// Ta bort en specifik recension
router.delete('/:id', authenticateJWT, isAdmin, deleteReview);



module.exports = router;