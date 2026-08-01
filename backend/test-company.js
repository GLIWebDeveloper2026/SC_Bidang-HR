require('dotenv').config();
const supabase = require('./src/config/supabase');

async function run() {
  console.log("URL:", process.env.SUPABASE_URL);
  console.log("Key starts with:", process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) : 'undefined');
  
  const { data, error } = await supabase.from('perusahaan').select('*').limit(1);
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success:", data);
  }
}
run();
