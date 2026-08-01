const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Endpoint untuk frontend melakukan redirect
router.get('/google', authController.googleAuth);

// Endpoint ini yang akan didaftarkan di Google Cloud Console sebagai Redirect URI
router.get('/google/callback', authController.googleCallback);

// Endpoint untuk register manual
router.post('/register', authController.register);

// Endpoint untuk login manual
router.post('/login', authController.login);

module.exports = router;