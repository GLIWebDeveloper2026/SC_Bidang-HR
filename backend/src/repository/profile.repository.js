const supabase = require('../config/supabase');

class ProfileRepository {
  async getProfileById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('uid', userId) 
      .single();

    return { data, error };
  }

  async updateProfile(userId, payload) {
    payload.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('uid', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new ProfileRepository();
