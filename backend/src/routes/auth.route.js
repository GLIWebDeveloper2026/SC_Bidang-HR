const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/google', authController.googleAuth);

router.get('/google/callback', authController.googleCallback);

router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router;