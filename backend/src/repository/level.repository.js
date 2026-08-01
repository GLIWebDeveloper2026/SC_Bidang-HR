const supabase = require('../config/supabase');

class LevelRepository {
  async findAllLevels() {
    const { data, error } = await supabase
      .from('level')
      .select('*')
      .order('level', { ascending: true }) // Atau urutkan berdasarkan created_at
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async findLevelById(id) {
    const { data, error } = await supabase
      .from('level')
      .select('*')
      .eq('uid', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async createLevel(payload) {
    const { data, error } = await supabase
      .from('level')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateLevel(id, payload) {
    payload.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('level')
      .update(payload)
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteLevel(id) {
    const { data, error } = await supabase
      .from('level')
      .delete()
      .eq('uid', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = new LevelRepository();
