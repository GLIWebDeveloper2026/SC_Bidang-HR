const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jkuzvdhdeoanygnxoutw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdXp2ZGhkZW9hbnlnbnhvdXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE4NTQyNCwiZXhwIjoyMTAwNzYxNDI0fQ.n9k8Da7YEGd9C0yLPMk4THslGX256xGYR9cMwKqlpFM');

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'imammantapmen@gmail.com',
    password: '123678'
  });
  console.log('DATA:', data);
  console.log('ERROR:', error);
  if (error) {
    console.log('ERROR MESSAGE:', error.message);
  }
}
run();
