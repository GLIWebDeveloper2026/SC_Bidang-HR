const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hr.controller');

// Opsional: Anda bisa tambahkan middleware otentikasi jika dibutuhkan
// const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', hrController.getAllHr);
router.get('/:id', hrController.getHrById);
router.get('/company/:perusahaanId', hrController.getHrByCompany); // Mendapatkan seluruh list HR dalam 1 perusahaan spesifik
router.post('/', hrController.addHr); // Mendaftarkan HR (perwakilan) ke sebuah perusahaan
router.put('/:id', hrController.updateHr);
router.delete('/:id', hrController.deleteHr);

module.exports = router;
