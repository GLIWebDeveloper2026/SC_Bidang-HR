const applicationService = require('../services/application.service');

class ApplicationController {
  // GET /api/v1/applications
  async getAllApplications(req, res) {
    try {
      const applications = await applicationService.getAllApplications();
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/applications/:id
  async getApplicationById(req, res) {
    try {
      const application = await applicationService.getApplicationById(req.params.id);
      return res.status(200).json({ success: true, data: application });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Aplikasi/Lamaran tidak ditemukan' });
    }
  }

  // POST /api/v1/applications
  async createApplication(req, res) {
    try {
      const application = await applicationService.createApplication(req.body);
      return res.status(201).json({ success: true, message: 'Berhasil melamar pekerjaan', data: application });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /api/v1/applications/:id
  async updateApplication(req, res) {
    try {
      const updated = await applicationService.updateApplication(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Data lamaran berhasil diperbarui', data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/v1/applications/:id
  async deleteApplication(req, res) {
    try {
      const deleted = await applicationService.deleteApplication(req.params.id);
      return res.status(200).json({ success: true, message: 'Data lamaran berhasil dihapus', data: deleted });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ApplicationController();
