const supabase = require('../config/supabase');
const authRepository = require('../repository/auth.repository');

class AuthService {
  async register(data) {
    const { email, password, nama, level_id } = data;

    // 1. Register di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error("Gagal mendapatkan UID dari Supabase Auth");
    }

    // 2. Insert ke tabel profile (atau profiles)
    const payloadProfile = {
      uid: userId,
      nama: nama,
      email: email,
      level_id: level_id,
      status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const profile = await authRepository.createProfile(payloadProfile);

    return {
      user: authData.user,
      profile
    };
  }
}

module.exports = new AuthService();