const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// registrera en ny användare
router.post('/register', register);

// logga in en användare
router.post('/login', login);

module.exports = router;