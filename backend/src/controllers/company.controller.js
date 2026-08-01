const companyService = require('../services/company.service');

const getProfileId = (req, res) => {
  const profileId = req.user?.id;

  if (!profileId) {
    res.status(401).json({
      success: false,
      message: 'Belum login atau session telah berakhir'
    });
    return null;
  }

  return profileId;
};

class CompanyController {
  // POST /api/v1/companies/register
  async registerCompany(req, res) {
    try {
      const profileId = getProfileId(req, res);
      if (!profileId) return;

      const company = await companyService.registerCompany(profileId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Pendaftaran perusahaan berhasil, menunggu verifikasi Admin BKK',
        data: company
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // POST /api/v1/companies/jobs
  async createJob(req, res) {
    try {
      const profileId = getProfileId(req, res);
      if (!profileId) return;

      const job = await companyService.createJobPosting(profileId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Pengumuman lowongan berhasil dipublikasikan',
        data: job
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/companies/applicants
  async getApplicants(req, res) {
    try {
      const profileId = getProfileId(req, res);
      if (!profileId) return;

      const applicants = await companyService.getApplicants(profileId);
      return res.status(200).json({ success: true, data: applicants });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // PATCH /api/v1/companies/applicants/:id/status
  async updateApplicantStatus(req, res) {
    try {
      const { id: applicationId } = req.params;
      const { result_status } = req.body;

      if (!result_status) {
         return res.status(400).json({ success: false, message: 'result_status diperlukan' });
      }

      const updated = await companyService.updateApplicantStatus(applicationId, result_status);
      return res.status(200).json({
        success: true,
        message: 'Status pelamar berhasil diperbarui',
        data: updated
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  // GET /api/v1/companies
  async getAllCompanies(req, res) {
    try {
    //   const userRole = req.user ? req.user.role : 'GUEST';
      const companies = await companyService.getAllCompanies();

      return res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/v1/companies/:id
  async getCompanyById(req, res) {
    try {
      const { id } = req.params;
      const company = await companyService.getCompanyById(id);

      return res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Perusahaan tidak ditemukan' });
    }
  }


  async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const updatedCompany = await companyService.updateCompany(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Data perusahaan berhasil diperbarui',
        data: updatedCompany
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/v1/companies/:id
  async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      const deletedCompany = await companyService.deleteCompany(id);

      return res.status(200).json({
        success: true,
        message: 'Perusahaan berhasil dihapus',
        data: deletedCompany
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CompanyController();
