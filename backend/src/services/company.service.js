const companyRepository = require('../repository/company.repository');

class CompanyService {
  async registerCompany(profileId, payload) {
    if (!payload.nama_perusahaan || !payload.legal_doc_url) {
      throw new Error('Nama perusahaan dan dokumen legalitas wajib diisi');
    }
    return await companyRepository.createCompanyWithHR(profileId, payload);
  }

  async createJobPosting(profileId, payload) {
    const company = await companyRepository.findCompanyByProfileId(profileId);
    if (!company) {
      throw new Error('Anda belum terdaftar sebagai perwakilan perusahaan');
    }
    if (company.status_verifikasi !== 'VERIFIED') {
      throw new Error('Perusahaan Anda belum diverifikasi oleh BKK. Belum dapat membuat lowongan');
    }

    if (!payload.positions || payload.positions.length === 0) {
      throw new Error('Minimal harus mencantumkan 1 posisi pekerjaan');
    }
    if (!payload.stages || payload.stages.length === 0) {
      throw new Error('Tahapan seleksi rekrutmen wajib ditentukan');
    }

    return await companyRepository.createRecruitment(company.uid, profileId, payload);
  }

  async getApplicants(profileId) {
    const company = await companyRepository.findCompanyByProfileId(profileId);
    if (!company) {
      throw new Error('Akses ditolak: Data perusahaan tidak ditemukan');
    }
    return await companyRepository.findApplicantsByCompany(company.uid);
  }

  async moveApplicantStage(applicationId, stageId, resultStatus) {
    return await companyRepository.updateApplicationStage(applicationId, stageId, resultStatus);
  }

  async getAllCompanies() {
    return await companyRepository.findAllCompanies();
  }

  async getCompanyById(companyId) {
    return await companyRepository.findCompanyById(companyId);
  }
  async updateCompany(companyId, payload) {
    return await companyRepository.updateCompany(companyId, payload);
  }

  async deleteCompany(companyId) {
    return await companyRepository.deleteCompany(companyId);
  }
}

module.exports = new CompanyService();