const supabase = require('../config/supabase');

class ApplicationRepository {
  async findAllApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        mahasiswa:mahasiswa_id (uid, nim, jurusan, tahun_lulus, profiles(nama, email)),
        position:position_id (uid, posisi, bidang_industri, recruitment(judul_pengumuman, perusahaan(nama_perusahaan)))
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findApplicationById(id) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        mahasiswa:mahasiswa_id (uid, nim, jurusan, tahun_lulus, profiles(nama, email)),
        position:position_id (uid, posisi, bidang_industri, recruitment(judul_pengumuman, perusahaan(nama_perusahaan)))
      `)
      .eq('uid', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async createApplication(payload) {
    const { data, error } = await supabase
      .from('applications')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateApplication(id, payload) {
    payload.updated_at = new Date().toISOString();
    
    // Auto-set hired_at if status becomes HIRED
    if (payload.status === 'HIRED' && !payload.hired_at) {
      payload.hired_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('applications')
      .update(payload)
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteApplication(id) {
    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new ApplicationRepository();
