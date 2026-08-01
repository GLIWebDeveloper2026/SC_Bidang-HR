const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Gunakan auth middleware (authenticate) di rute profile
router.get('/me', authenticate, profileController.getMe);
router.put('/update', authenticate, profileController.updateProfile);

module.exports = router;
