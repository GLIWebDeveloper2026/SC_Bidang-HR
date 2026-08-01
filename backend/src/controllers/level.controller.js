const levelService = require('../services/level.service');

class LevelController {
  // GET /api/v1/levels
  async getAllLevels(req, res) {
    try {
      const levels = await levelService.getAllLevels();
      return res.status(200).json({ success: true, data: levels });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/levels/:id
  async getLevelById(req, res) {
    try {
      const level = await levelService.getLevelById(req.params.id);
      return res.status(200).json({ success: true, data: level });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Role Level tidak ditemukan' });
    }
  }

  // POST /api/v1/levels
  async createLevel(req, res) {
    try {
      const level = await levelService.createLevel(req.body);
      return res.status(201).json({ success: true, message: 'Role Level berhasil ditambahkan', data: level });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /api/v1/levels/:id
  async updateLevel(req, res) {
    try {
      const updated = await levelService.updateLevel(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Role Level berhasil diperbarui', data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/v1/levels/:id
  async deleteLevel(req, res) {
    try {
      const deleted = await levelService.deleteLevel(req.params.id);
      return res.status(200).json({ success: true, message: 'Role Level berhasil dihapus', data: deleted });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LevelController();
