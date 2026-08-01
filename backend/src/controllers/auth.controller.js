const authService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, nama, level_id } = req.body;

      if (!email || !password || !nama || !level_id) {
        return res.status(400).json({ success: false, message: 'Semua field (email, password, nama, level_id) wajib diisi' });
      }

      const result = await authService.register({ email, password, nama, level_id });

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: result
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
