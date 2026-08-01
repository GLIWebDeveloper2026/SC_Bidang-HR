const recruitmentService = require('../services/recruitment.service');
// Note: Create recruitment (add job) sudah ditangani di company.controller.js 
// karena relasinya butuh memvalidasi company yang sedang login.

class RecruitmentController {
  // GET /api/v1/recruitments
  async getAllRecruitments(req, res) {
    try {
      const recruitments = await recruitmentService.getAllRecruitments();
      return res.status(200).json({ success: true, data: recruitments });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRecruitmentById(req, res) {
    try {
      const recruitment = await recruitmentService.getRecruitmentById(req.params.id);
      return res.status(200).json({ success: true, data: recruitment });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Lowongan tidak ditemukan' });
    }
  }

  async updateRecruitment(req, res) {
    try {
      const updated = await recruitmentService.updateRecruitment(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Lowongan berhasil diubah', data: updated });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteRecruitment(req, res) {
    try {
      const deleted = await recruitmentService.deleteRecruitment(req.params.id);
      return res.status(200).json({ success: true, message: 'Lowongan berhasil dihapus', data: deleted });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RecruitmentController();
