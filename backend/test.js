require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {createClient} = require( '@supabase/supabase-js')
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: 'http://localhost:5173', 
  credentials: true
}));

app.get('/', (req, res) => {
  res.send("hey fellas");
});

app.get('/api/get-user')
app.put('/api/user/update',async(req,res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Header Authorization tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  const {bio} = req.body;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Belum login atau session telah berakhir' 
    });
  }

  const { data, error: updateError } = await supabase
    .from('profiles')
    .update({
      bio,
    })
    .eq('id', user.id)        
    .select();

  if (updateError) {
    return res.status(400).json({ 
      success: false, 
      message: 'Gagal memperbarui profil: ' + updateError.message 
    });
  }

  return res.json({
    success: true,
    message: 'Profil berhasil diperbarui!',
    data: data[0]
  });
})
// app.get('/api/')
// app.get('/api/logout')



app.get('/api/me', async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
    return res.status(401).json({ error: 'Header Authorization tidak ditemukan' });
  }
  const token = authHeader.split(' ')[1];  
  const supabase = createClient(
   process.env.SUPABASE_URL,
   process.env.SUPABASE_SERVICE_ROLE_KEY

  );

 const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Belum login atau session telah berakhir' 
    });
  }
  const metadata = user.user_metadata;
const { error: upsertError } = await supabase
    .from('profiles') 
    .upsert({
      id: user.id,
      updated_at: new Date()
    }, { onConflict: 'id' });

  if (upsertError) {
    console.error("Gagal melakukan upsert ke tabel profiles:", upsertError.message);
  }
  const { data: profile } = await supabase
  .from('profiles')
  .select('bio')
  .eq('id', user.id)
  .single();
  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: metadata?.full_name || metadata?.name,
      avatar: metadata?.avatar_url || metadata?.picture,
      bio:profile?.bio || ''
    }
  });
});


app.listen(port, () => {
  console.log(`Server Express berjalan di http://localhost:${port}`);
});