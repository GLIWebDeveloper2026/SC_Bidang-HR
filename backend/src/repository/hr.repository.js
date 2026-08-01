const supabase = require('../config/supabase');

class HrRepository {
  async findAllHr() {
    const { data, error } = await supabase
      .from('hr')
      .select(`
        uid,
        jabatan,
        created_at,
        profiles (
          uid,
          nama,
          email,
          status
        ),
        perusahaan (
          uid,
          nama_perusahaan,
          email,
          status_verifikasi
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findHrById(hrId) {
    const { data, error } = await supabase
      .from('hr')
      .select(`
        uid,
        jabatan,
        created_at,
        profiles (
          uid,
          nama,
          email,
          status
        ),
        perusahaan (
          uid,
          nama_perusahaan,
          email,
          status_verifikasi
        )
      `)
      .eq('uid', hrId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async findHrByCompany(perusahaanId) {
    const { data, error } = await supabase
      .from('hr')
      .select(`
        uid,
        jabatan,
        profiles (uid, nama, email)
      `)
      .eq('perusahaan_id', perusahaanId);
      
    if (error) throw error;
    return data;
  }

  async createHr(payload) {
    const { data, error } = await supabase
      .from('hr')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateHr(hrId, payload) {
    // Memperbarui atribut seperti 'jabatan'
    payload.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('hr')
      .update(payload)
      .eq('uid', hrId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteHr(hrId) {
    const { data, error } = await supabase
      .from('hr')
      .delete()
      .eq('uid', hrId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new HrRepository();
