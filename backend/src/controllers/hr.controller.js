const hrService = require('../services/hr.service');

class HrController {
  // GET /api/v1/hr
  async getAllHr(req, res) {
    try {
      const hrList = await hrService.getAllHr();
      return res.status(200).json({ success: true, data: hrList });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/hr/:id
  async getHrById(req, res) {
    try {
      const hr = await hrService.getHrById(req.params.id);
      return res.status(200).json({ success: true, data: hr });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Data HR tidak ditemukan: ' + error.message });
    }
  }

  // GET /api/v1/hr/company/:perusahaanId
  async getHrByCompany(req, res) {
    try {
      const hr = await hrService.getHrByCompany(req.params.perusahaanId);
      return res.status(200).json({ success: true, data: hr });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/v1/hr
  async addHr(req, res) {
    try {
      const hr = await hrService.addHr(req.body);
      return res.status(201).json({ 
        success: true, 
        message: 'HR berhasil ditambahkan ke perusahaan', 
        data: hr 
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /api/v1/hr/:id
  async updateHr(req, res) {
    try {
      const updated = await hrService.updateHr(req.params.id, req.body);
      return res.status(200).json({ 
        success: true, 
        message: 'Data HR berhasil diperbarui', 
        data: updated 
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/v1/hr/:id
  async deleteHr(req, res) {
    try {
      const deleted = await hrService.deleteHr(req.params.id);
      return res.status(200).json({ 
        success: true, 
        message: 'HR berhasil dihapus', 
        data: deleted 
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new HrController();
