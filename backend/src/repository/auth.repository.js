const supabase = require('../config/supabase');

class AuthRepository {
  async createProfile(payload) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new AuthRepository();
