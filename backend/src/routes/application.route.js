const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');

router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);
router.post('/', applicationController.createApplication); // Bisa dipakai mahasiswa untuk apply jobs
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
