// const adminService = require('../services/admin.service');

class AdminController {
  
  async getAlumni(req, res) {
    try {
    //   const companies = await adminService.getPendingCompanies();
      return res.status(200).json({ success: true, data: 'alumni' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  
}

module.exports = new AdminController();