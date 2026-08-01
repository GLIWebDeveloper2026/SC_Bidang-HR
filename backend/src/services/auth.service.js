const authRepository = require('../repository/auth.repository');
const oauth2Client = require('../config/google');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { google } = require('googleapis');
require('dotenv').config();

class AuthService {
  // Method untuk mendapatkan URL Login Google
  getGoogleAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true
    });

    return authorizationUrl;
  }

  // Method untuk handle callback dari Google
  async handleGoogleCallback(code) {
    // 1. Tukar code dengan token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Ambil data user dari Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    const { data: userInfo } = await oauth2.userinfo.get();
    
    if (!userInfo.email) {
      throw new Error("Gagal mendapatkan email dari Google");
    }

    // 3. Cek apakah user sudah ada di database MySQL kita
    let user = await authRepository.getUserByEmail(userInfo.email);

    // 4. Jika user belum ada, kita otomatis register
    if (!user) {
      // Kita buat role default misalnya "guest" atau "mahasiswa" agar user bisa diedit rolenya nanti
      let defaultRoleName = 'guest'; 
      let defaultLevel = await authRepository.getLevelByName(defaultRoleName);
      
      // Jika di tabel level benar-benar kosong, kita otomatis INSERT level baru 
      // agar tidak terjadi Error Foreign Key constraint
      if (!defaultLevel) {
        const newLevelUid = crypto.randomUUID();
        await authRepository.createLevel({
          uid: newLevelUid,
          role: defaultRoleName,
          level: 0
        });
        defaultLevel = { uid: newLevelUid };
      }

      const newUserUid = crypto.randomUUID();
      
      const payloadUser = {
        uid: newUserUid,
        nama: userInfo.name,
        email: userInfo.email,
        level_id: defaultLevel.uid, // Sekarang pasti berisi UUID yang valid
        status: true
      };

      await authRepository.createUser(payloadUser);
      
      // Ambil kembali user yang baru di-insert agar kita dapat data join tabel level
      user = await authRepository.getUserByEmail(userInfo.email);
    }

    // 5. Buat JWT Token
    const jwtSecret = process.env.JWT_SECRET_KEY
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        role: user.role, // role dari tabel level
        level: user.level
      },
      jwtSecret,
      { expiresIn: '1d' } // Berlaku 1 hari
    );

    return {
      token: token,
      user: {
        uid: user.uid,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    };
  }

  // Method untuk register manual
  async registerManual(data) {
    const bcrypt = require('bcryptjs');
    
    // Cek apakah user sudah terdaftar
    // const existingUser = await authRepository.getUserByEmail(data.email);
    // if (existingUser) {
    //   throw new Error('Email sudah terdaftar');
    // }

    // // Ambil level id berdasarkan role
    // let level = await authRepository.getLevelByName(data.role);
    // if (!level) {
    //   const newLevelUid = crypto.randomUUID();
    //   await authRepository.createLevel({
    //     uid: newLevelUid,
    //     role: data.role,
    //     level: 0
    //   });
    //   level = { uid: newLevelUid };
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUserUid = crypto.randomUUID();
    
    const payloadUser = {
      uid: newUserUid,
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      level_id: data.level_uid,
      status: true
    };

    await authRepository.createUser(payloadUser);
    
    const user = await authRepository.getUserByEmail(data.email);
    return {
      uid: user.uid,
      nama: user.nama,
      email: user.email,
    };
  }

  // Method untuk login manual
  async loginManual(data) {
    const bcrypt = require('bcryptjs');
    
    const user = await authRepository.getUserByEmail(data.email);
    if (!user) {
      throw new Error('Email atau password salah');
    }

    if (!user.password) {
      throw new Error('Akun ini menggunakan login Google. Silakan login dengan Google.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error('Email atau password salah');
    }

    const jwtSecret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        role: user.role,
        level: user.level
      },
      jwtSecret,
      { expiresIn: '1d' }
    );

    return {
      token: token,
      user: {
        uid: user.uid,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
