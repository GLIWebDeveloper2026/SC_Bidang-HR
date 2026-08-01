const levelRepository = require('../repository/level.repository');

class LevelService {
  async getAllLevels() {
    return await levelRepository.findAllLevels();
  }

  async getLevelById(id) {
    return await levelRepository.findLevelById(id);
  }

  async createLevel(payload) {
    if (!payload.role) {
      throw new Error('Role (nama role) wajib diisi');
    }
    if (payload.level === undefined || payload.level === null) {
      throw new Error('Level (angka hierarki) wajib diisi');
    }
    return await levelRepository.createLevel(payload);
  }

  async updateLevel(id, payload) {
    return await levelRepository.updateLevel(id, payload);
  }

  async deleteLevel(id) {
    return await levelRepository.deleteLevel(id);
  }
}

module.exports = new LevelService();
