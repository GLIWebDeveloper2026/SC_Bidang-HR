const campusService = require('../services/campus.service');

class CampusController {
  // GET /api/v1/campus
  async getAllCampus(req, res) {
    try {
      const campus = await campusService.getAllCampus();
      return res.status(200).json({ success: true, data: campus });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/campus/:id
  async getCampusById(req, res) {
    try {
      const campus = await campusService.getCampusById(req.params.id);
      return res.status(200).json({ success: true, data: campus });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Kampus tidak ditemukan' });
    }
  }

  // POST /api/v1/campus
  async createCampus(req, res) {
    try {
      const campus = await campusService.createCampus(req.body);
      return res.status(201).json({ success: true, message: 'Kampus berhasil ditambahkan', data: campus });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /api/v1/campus/:id
  async updateCampus(req, res) {
    try {
      const updated = await campusService.updateCampus(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Data kampus berhasil diperbarui', data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/v1/campus/:id
  async deleteCampus(req, res) {
    try {
      const deleted = await campusService.deleteCampus(req.params.id);
      return res.status(200).json({ success: true, message: 'Data kampus berhasil dihapus', data: deleted });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CampusController();
