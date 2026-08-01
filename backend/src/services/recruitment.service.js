const recruitmentRepository = require('../repository/recruitment.repository');

class RecruitmentService {
  async getAllRecruitments() {
    return await recruitmentRepository.findAllRecruitments();
  }

  async getRecruitmentById(id) {
    return await recruitmentRepository.findRecruitmentById(id);
  }

  async updateRecruitment(id, payload) {
    return await recruitmentRepository.updateRecruitment(id, payload);
  }

  async deleteRecruitment(id) {
    return await recruitmentRepository.deleteRecruitment(id);
  }
}

module.exports = new RecruitmentService();
