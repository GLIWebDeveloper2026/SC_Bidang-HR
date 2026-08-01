const profileRepository = require('../repository/profile.repository');

class ProfileService {
  async getMyProfile(authUser) {
    // Ambil detail profil dari database (misal: bio, nama lengkap yang sudah diupdate, dll)
    const { data: profile } = await profileRepository.getProfileById(authUser.id);
    
    const metadata = authUser.user_metadata;

    // Gabungkan data bawaan Auth dengan data dari tabel Profiles (persis seperti di test.js)
    return {
      id: authUser.id,
      email: authUser.email,
      name: profile?.nama || metadata?.full_name || metadata?.name || '',
      avatar: metadata?.avatar_url || metadata?.picture || '',
      bio: profile?.bio || ''
    };
  }

  async updateProfile(userId, payload) {
    // Validasi basic (bisa dikembangkan sesuai field tabel profiles)
    if (Object.keys(payload).length === 0) {
      throw new Error("Tidak ada data yang dikirim untuk diupdate");
    }

    return await profileRepository.updateProfile(userId, payload);
  }
}

module.exports = new ProfileService();
