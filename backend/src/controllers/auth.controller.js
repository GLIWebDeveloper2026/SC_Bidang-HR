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
      console.error('Register error:', error);
      let errorMessage = error.message;
      if (typeof errorMessage === 'object') errorMessage = JSON.stringify(errorMessage);
      else if (!errorMessage) errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
      
      return res.status(400).json({ success: false, message: errorMessage, error: error });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: result
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
