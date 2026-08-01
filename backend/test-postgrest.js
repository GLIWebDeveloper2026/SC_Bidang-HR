const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jkuzvdhdeoanygnxoutw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdXp2ZGhkZW9hbnlnbnhvdXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE4NTQyNCwiZXhwIjoyMTAwNzYxNDI0fQ.n9k8Da7YEGd9C0yLPMk4THslGX256xGYR9cMwKqlpFM');

async function run() {
  const { data, error } = await supabase.from('profiles').insert([{
    uid: '00000000-0000-0000-0000-000000000000',
    nama: 'test',
    email: 'imammantapmen@gmail.com',
    level_id: '6d3819d9-f2ce-4e7e-bfe7-0e384290e96a'
  }]).select().single();
  
  console.log('POSTGREST ERROR:', error);
  if (error) {
    console.log('STRINGIFIED POSTGREST ERROR:', JSON.stringify(error));
    console.log('ERROR MESSAGE:', error.message);
  }
}
run();
