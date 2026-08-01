const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// router.use(authenticate, authorize('ADMIN_BKK'));

// Verification Routes
router.get('/companies/pending', adminController.getPendingCompanies);
router.patch('/companies/:id/verify', adminController.verifyCompany);

// Analytics & Accreditation Routes
router.get('/analytics/absorption', adminController.getAccreditationReport);

module.exports = router;