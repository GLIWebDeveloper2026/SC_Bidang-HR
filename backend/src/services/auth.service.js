const supabase = require('../config/supabase');
const authRepository = require('../repository/auth.repository');

class AuthService {
 async register(data) {
    const { email, password, nama, level_id } = data;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nama: nama,
          level_id: level_id
        }
      }
    });

    if (authError) {
      console.error("Supabase Auth Error Detail:", JSON.stringify(authError, null, 2));
      throw authError;
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error("Gagal mendapatkan UID dari Supabase Auth. Kemungkinan email ini sudah terdaftar atau perlu verifikasi.");
    }

    // Insert ke tabel profiles secara manual karena trigger handle_new_user tidak ada
    const payloadProfile = {
      uid: userId,
      nama: nama,
      email: email,
      level_id: level_id,
      status: true,
      password: password, // Menyimpan password secara plain text
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const profile = await authRepository.createProfile(payloadProfile);

    return {
      user: authData.user,
      session: authData.session
    };
  }
  async login(data) {
    const { email, password } = data;

     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    // 2. Ambil data dari tabel profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, level:level_id(role, level)')
      .eq('uid', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Data profil tidak ditemukan');
    }

    return {
      session: authData.session,
      profile: profile
    };
  }
}

module.exports = new AuthService();