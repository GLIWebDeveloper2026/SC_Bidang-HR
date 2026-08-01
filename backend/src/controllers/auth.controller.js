const authService = require('../services/auth.service');

class AuthController {
  
  // Endpoint untuk mengarahkan ke halaman Google Login
  googleAuth(req, res) {
    try {
      const url = authService.getGoogleAuthUrl();
      // Redirect langsung ke halaman login Google
      return res.redirect(url);
    } catch (error) {
      console.error('Google Auth Error:', error);
      return res.status(500).json({ success: false, message: 'Gagal mendapatkan URL Login Google' });
    }
  }

  // Endpoint untuk menerima callback dari Google
      // Endpoint untuk menerima callback dari Google
      async googleCallback(req, res) {
        try {
          const { code } = req.query;

          if (!code) {
            return res.status(400).json({ success: false, message: 'Authorization code tidak ditemukan' });
          }

          // authService.handleGoogleCallback() memproses code lalu menghasilkan token dan data user
          const result = await authService.handleGoogleCallback(code);

          // --- PERUBAHAN UNTUK REDIRECT KE FRONTEND ---
          // Tentukan URL Frontend Anda (bisa Anda simpan di file .env, misal: FRONTEND_URL=http://localhost:3000)
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      // Redirect ke halaman dashboard sambil membawa token
      return res.redirect(`${frontendUrl}/dashboard?token=${result.token}`);

    } catch (error) {
      console.error('Google Callback Error:', error);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      // Jika terjadi error, redirect ke halaman login dengan pesan error
      return res.redirect(`${frontendUrl}/login?error=Otentikasi Gagal`);
    }
  }
      // Endpoint untuk register manual
  async register(req, res) {
    try {
      const { nama, email, password, level_uid } = req.body;
      
      if (!nama || !email || !password || !level_uid) {
        return res.status(400).json({ success: false, message: 'Semua field (nama, email, password, role) wajib diisi' });
      }

      const result = await authService.registerManual({ nama, email, password, level_uid });

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: result
      });
    } catch (error) {
      console.error('Register Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Gagal registrasi' });
    }
  }

  // Endpoint untuk login manual
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
      }

      const result = await authService.loginManual({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: result
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(401).json({ success: false, message: error.message || 'Gagal login' });
    }
  }
}

module.exports = new AuthController();
