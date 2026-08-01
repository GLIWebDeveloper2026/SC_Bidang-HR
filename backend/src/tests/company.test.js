require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const supabase = require('../config/supabase');
const companyService = require('../services/company.service');

async function runTest() {
  console.log('🚀 Memulai Testing CRUD Company...');
  let testCompanyId = null;

  try {
    // 1. GET ALL COMPANIES
    console.log('\n[1] Mengambil semua data perusahaan...');
    const companies = await companyService.getAllCompanies();
    console.log(`✅ Berhasil! Ditemukan ${companies.length} perusahaan.`);

    // 2. CREATE COMPANY (Bypass Service if it requires real profile_id, we inject direct to Supabase for test)
    console.log('\n[2] Membuat perusahaan dummy untuk testing...');
    const { data: newCompany, error: createErr } = await supabase
      .from('perusahaan')
      .insert([{
        nama_perusahaan: 'PT Testing Otomatis',
        alamat: 'Jl. Testing No. 1',
        email: 'test@testing.com',
        telepon: '08123456789',
        nib_npwp: '123456789',
        status_verifikasi: 'PENDING'
      }])
      .select()
      .single();

    if (createErr) throw createErr;
    testCompanyId = newCompany.uid;
    console.log('✅ Berhasil membuat perusahaan:', newCompany.nama_perusahaan, '(UID:', testCompanyId, ')');

    // 3. GET COMPANY BY ID
    console.log('\n[3] Mengambil detail perusahaan by ID...');
    const detailCompany = await companyService.getCompanyById(testCompanyId);
    console.log('✅ Berhasil! Nama perusahaan:', detailCompany.nama_perusahaan);

    // 4. UPDATE COMPANY
    console.log('\n[4] Mengubah data (Update) perusahaan...');
    const updatedCompany = await companyService.updateCompany(testCompanyId, {
      nama_perusahaan: 'PT Testing Otomatis (Updated)'
    });
    console.log('✅ Berhasil diupdate menjadi:', updatedCompany.nama_perusahaan);

    // 5. DELETE COMPANY
    // console.log('\n[5] Menghapus (Delete) perusahaan test...');
    // const deletedCompany = await companyService.deleteCompany(testCompanyId);
    // console.log('✅ Berhasil dihapus!', deletedCompany.nama_perusahaan);

    // console.log('\n🎉 SEMUA TEST BERHASIL DIJALANKAN!');

  } catch (error) {
    console.error('\n❌ TEST GAGAL:', error.message || error);
    
    // Cleanup if failed midway
    if (testCompanyId) {
      console.log('Membersihkan data sisa test...');
      await supabase.from('perusahaan').delete().eq('uid', testCompanyId);
    }
  }
}

runTest();
