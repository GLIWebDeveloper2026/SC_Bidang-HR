const campusRepository = require('../repository/campus.repository');

class CampusService {
  async getAllCampus() {
    return await campusRepository.findAllCampus();
  }

  async getCampusById(id) {
    return await campusRepository.findCampusById(id);
  }

  async createCampus(payload) {
    if (!payload.nama_campus) {
      throw new Error('nama_campus wajib diisi');
    }
    return await campusRepository.createCampus(payload);
  }

  async updateCampus(id, payload) {
    return await campusRepository.updateCampus(id, payload);
  }

  async deleteCampus(id) {
    return await campusRepository.deleteCampus(id);
  }
}

module.exports = new CampusService();
