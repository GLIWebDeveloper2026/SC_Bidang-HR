const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
// const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Company CRUD
router.post('/register', companyController.registerCompany); // Register Company
router.get('/', companyController.getAllCompanies); // Get Semua Perusahaan
router.get('/:id', companyController.getCompanyById); // Get Detail Perusahaan
router.put('/:id', companyController.updateCompany); // Update Perusahaan
router.delete('/:id', companyController.deleteCompany); // Delete Perusahaan

router.post('/jobs', companyController.createJob);
router.get('/applicants', companyController.getApplicants);
router.patch('/applicants/:id/status', companyController.updateApplicantStatus);

module.exports = router;