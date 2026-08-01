const applicationRepository = require('../repository/application.repository');

class ApplicationService {
  async getAllApplications() {
    return await applicationRepository.findAllApplications();
  }

  async getApplicationById(id) {
    return await applicationRepository.findApplicationById(id);
  }

  async createApplication(payload) {
    if (!payload.position_id || !payload.mahasiswa_id || !payload.snapshot_cv_url) {
      throw new Error('position_id, mahasiswa_id, dan snapshot_cv_url wajib diisi');
    }
    // Set default status if not provided
    payload.status = payload.status || 'IN_PROGRESS';
    return await applicationRepository.createApplication(payload);
  }

  async updateApplication(id, payload) {
    return await applicationRepository.updateApplication(id, payload);
  }

  async deleteApplication(id) {
    return await applicationRepository.deleteApplication(id);
  }
}

module.exports = new ApplicationService();
