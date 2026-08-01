const supabase = require('../config/supabase');

class CompanyRepository {
   
  async findAllCompanies(filterStatus = null) {
    let query = supabase
      .from('perusahaan')
      .select(`
        uid,
        nama_perusahaan,
        alamat,
        email,
        telepon,
        status_verifikasi,
        legal_doc_url,
        nib_npwp,
        created_at,
        hr (
          profiles (nama, email)
        ),
        recruitment (
          uid,
          judul_pengumuman,
          tanggal_tutup
        )
      `)
      .order('created_at', { ascending: false });

    // Jika ada filter status (misal untuk Public hanya ambil VERIFIED)
    if (filterStatus) {
      query = query.eq('status_verifikasi', filterStatus);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findCompanyById(companyId) {
    const { data, error } = await supabase
      .from('perusahaan')
      .select(`
        uid,
        nama_perusahaan,
        alamat,
        email,
        telepon,
        status_verifikasi,
        recruitment (
          uid,
          judul_pengumuman,
          deskripsi,
          lokasi_kerja,
          tanggal_tutup,
          recruitment_positions (uid, posisi, kuota_posisi, bidang_industri)
        )
      `)
      .eq('uid', companyId)
      .single();

    if (error) throw error;
    return data;
  }
  async createCompanyWithHR(profileId, companyData) {
    const { nama_perusahaan, alamat, email, telepon, nib_npwp, legal_doc_url, jabatan } = companyData;

    const { data: company, error: companyErr } = await supabase
      .from('perusahaan')
      .insert([{
        nama_perusahaan,
        alamat,
        email,
        telepon,
        nib_npwp,
        legal_doc_url,
        status_verifikasi: 'PENDING'
      }])
      .select()
      .single();

    if (companyErr) throw companyErr;

    // Insert ke tabel HR (Menandakan profile_id ini mewakili perusahaan ini)
    const { error: hrErr } = await supabase
      .from('hr')
      .insert([{
        profile_id: profileId,
        perusahaan_id: company.uid,
        jabatan: jabatan || 'HRD'
      }]);

    if (hrErr) throw hrErr;

    return company;
  }

  async findCompanyByProfileId(profileId) {
    const { data, error } = await supabase
      .from('hr')
      .select(`
        perusahaan (
          uid,
          nama_perusahaan,
          alamat,
          email,
          telepon,
          status_verifikasi
        )
      `)
      .eq('profile_id', profileId)
      .single();

    if (error || !data) return null;
    return data.perusahaan;
  }

  async createRecruitment(perusahaanId, profileId, jobData) {
    const { judul_pengumuman, deskripsi, lokasi_kerja, tanggal_tutup, positions } = jobData;

    // A. Insert Recruitment Header
    const { data: recruitment, error: recErr } = await supabase
      .from('recruitment')
      .insert([{
        perusahaan_id: perusahaanId,
        posted_by_profile_id: profileId,
        judul_pengumuman,
        deskripsi,
        lokasi_kerja,
        tanggal_tutup
      }])
      .select()
      .single();

    if (recErr) throw recErr;

    const formattedPositions = positions.map(pos => ({
      recruitment_id: recruitment.uid,
      posisi: pos.posisi,
      kuota_posisi: pos.kuota_posisi,
      bidang_industri: pos.bidang_industri,
      persyaratan: pos.persyaratan || null
    }));

    const { error: posErr } = await supabase
      .from('recruitment_positions')
      .insert(formattedPositions);

    if (posErr) throw posErr;

    return recruitment;
  }

  // 4. Ambil Daftar Pelamar untuk Perusahaan (Termasuk yang lowongannya sudah lewat deadline)
  async findApplicantsByCompany(perusahaanId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        uid,
        snapshot_cv_url,
        status,
        created_at,
        mahasiswa (
          uid,
          nim,
          jurusan,
          tahun_lulus,
          profiles (nama, email)
        ),
        recruitment_positions!inner (
          posisi,
          bidang_industri,
          recruitment!inner (uid, judul_pengumuman, perusahaan_id)
        )
      `)
      .eq('recruitment_positions.recruitment.perusahaan_id', perusahaanId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // 5. Update Status Pelamar
  async updateApplicationStatus(applicationId, resultStatus) {
    const updatePayload = { status: resultStatus };
    
    if (resultStatus === 'HIRED') {
      updatePayload.hired_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('uid', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async updateCompany(companyId, payload) {
    const { data, error } = await supabase
      .from('perusahaan')
      .update(payload)
      .eq('uid', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCompany(companyId) {
    const { data, error } = await supabase
      .from('perusahaan')
      .delete()
      .eq('uid', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new CompanyRepository();