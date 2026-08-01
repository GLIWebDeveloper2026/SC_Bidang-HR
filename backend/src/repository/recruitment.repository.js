const supabase = require('../config/supabase');

class RecruitmentRepository {
  async findAllRecruitments() {
    const { data, error } = await supabase
      .from('recruitment')
      .select(`
        *,
        perusahaan:perusahaan_id (uid, nama_perusahaan, alamat, email, telepon),
        positions:recruitment_positions (*),
       
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findRecruitmentById(id) {
    const { data, error } = await supabase
      .from('recruitment')
      .select(`
        *,
        perusahaan:perusahaan_id (uid, nama_perusahaan, alamat, email, telepon),
        positions:recruitment_positions (*),
      `)
      .eq('uid', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateRecruitment(id, payload) {
    payload.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from('recruitment')
      .update(payload)
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteRecruitment(id) {
    const { data, error } = await supabase
      .from('recruitment')
      .delete()
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new RecruitmentRepository();
