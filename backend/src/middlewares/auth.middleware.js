const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Header Authorization tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Format token tidak valid' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Belum login atau session telah berakhir' 
      });
    }

    // Simpan data user ke request object agar bisa dipakai di controller
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

module.exports = { authenticate };
