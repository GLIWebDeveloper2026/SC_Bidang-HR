const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', authenticate, companyController.registerCompany);
router.post('/jobs', authenticate, companyController.createJob);
router.get('/applicants', authenticate, companyController.getApplicants);
router.patch('/applicants/:id/stage', authenticate, companyController.moveApplicantStage);

// Company CRUD
router.get('/', companyController.getAllCompanies); // Get Semua Perusahaan
router.get('/:id', companyController.getCompanyById); // Get Detail Perusahaan
router.put('/:id', companyController.updateCompany); // Update Perusahaan
router.delete('/:id', companyController.deleteCompany); // Delete Perusahaan

module.exports = router;
