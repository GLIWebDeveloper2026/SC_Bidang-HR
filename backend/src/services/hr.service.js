const hrRepository = require('../repository/hr.repository');

class HrService {
  async getAllHr() {
    return await hrRepository.findAllHr();
  }

  async getHrById(hrId) {
    return await hrRepository.findHrById(hrId);
  }

  async getHrByCompany(perusahaanId) {
    return await hrRepository.findHrByCompany(perusahaanId);
  }

  async addHr(payload) {
    if (!payload.profile_id || !payload.perusahaan_id) {
      throw new Error('Profile ID dan Perusahaan ID wajib disertakan');
    }
    return await hrRepository.createHr(payload);
  }

  async updateHr(hrId, payload) {
    return await hrRepository.updateHr(hrId, payload);
  }

  async deleteHr(hrId) {
    return await hrRepository.deleteHr(hrId);
  }
}

module.exports = new HrService();
