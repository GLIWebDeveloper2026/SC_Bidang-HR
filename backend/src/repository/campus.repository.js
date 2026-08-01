const supabase = require('../config/supabase');

class CampusRepository {
  async findAllCampus() {
    const { data, error } = await supabase
      .from('campus')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findCampusById(id) {
    const { data, error } = await supabase
      .from('campus')
      .select('*')
      .eq('uid', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async createCampus(payload) {
    const { data, error } = await supabase
      .from('campus')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateCampus(id, payload) {
    payload.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('campus')
      .update(payload)
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteCampus(id) {
    const { data, error } = await supabase
      .from('campus')
      .delete()
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new CampusRepository();
