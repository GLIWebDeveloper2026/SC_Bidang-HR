const profileService = require('../services/profile.service');

class ProfileController {
  // GET /api/v1/profiles/me
  async getMe(req, res) {
    try {
      // req.user didapatkan dari auth.middleware
      const userProfile = await profileService.getMyProfile(req.user);
      return res.status(200).json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUT /api/v1/profiles/update
  async updateProfile(req, res) {
    try {
      // payload diambil dari req.body (contoh: { "bio": "...", "nama": "..." })
      const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui!',
        data: updatedProfile
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
    }
  }
}

module.exports = new ProfileController();
