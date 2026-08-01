import apiClient from './client';
import type { ApiResponse } from './types';

export interface Company {
  uid: string;
  nama_perusahaan: string;
  alamat: string | null;
  email: string | null;
  telepon: string | null;
  status_verifikasi: string;
  legal_doc_url?: string | null;
  nib_npwp?: string | null;
  created_at: string;
}

export interface CreateCompanyPayload {
  nama_perusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  nib_npwp: string;
  legal_doc_url: string;
  jabatan?: string;
}

export interface UpdateCompanyPayload {
  nama_perusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  status_verifikasi: string;
}

export interface RecruitmentCompany {
  uid: string;
  nama_perusahaan: string;
  alamat: string | null;
  email: string | null;
  telepon: string | null;
}

export interface RecruitmentPosition {
  uid: string;
  posisi: string;
  kuota_posisi: number;
  bidang_industri: string;
  persyaratan: string | null;
}

export interface Recruitment {
  uid: string;
  judul_pengumuman: string;
  deskripsi: string | null;
  lokasi_kerja: string | null;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
  perusahaan: RecruitmentCompany | null;
  positions: RecruitmentPosition[];
}

export type ApplicationStatus = 'IN_PROGRESS' | 'HIRED' | 'REJECTED';

export interface ApplicationProfile {
  nama: string | null;
  email: string | null;
}

export interface ApplicationMahasiswa {
  uid: string;
  nim: string | null;
  jurusan: string | null;
  tahun_lulus?: number | string | null;
  profiles: ApplicationProfile | null;
}

export interface ApplicationPosition {
  uid: string;
  posisi: string | null;
  bidang_industri?: string | null;
  recruitment: {
    judul_pengumuman: string | null;
    perusahaan: {
      nama_perusahaan: string | null;
    } | null;
  } | null;
}

export interface Application {
  uid: string;
  position_id?: string | null;
  mahasiswa_id?: string | null;
  snapshot_cv_url: string | null;
  status: ApplicationStatus;
  hired_at: string | null;
  created_at?: string | null;
  mahasiswa: ApplicationMahasiswa | null;
  position: ApplicationPosition | null;
}

export interface CreateCompanyJobPayload {
  judul_pengumuman: string;
  deskripsi?: string;
  lokasi_kerja: string;
  tanggal_tutup?: string;
  positions: {
    posisi: string;
    kuota_posisi: number;
    bidang_industri: string;
    persyaratan?: string;
  }[];
  stages: {
    nama_tahapan: string;
    urutan_tahapan: number;
  }[];
}

export interface Profile {
  id?: string;
  uid?: string;
  email: string;
  name?: string;
  nama?: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface UpdateProfilePayload {
  nama: string;
  avatar?: string;
  bio?: string;
}

export interface Level {
  uid: string;
  role: string;
  level: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  nama: string;
  level_id: string;
}

export interface RegisteredAuthUser {
  id: string;
  aud?: string;
  role?: string;
  email: string;
  created_at?: string;
}

export interface RegisteredProfile {
  uid: string;
  nama: string;
  email: string;
  level_id: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string | null;
}

export interface RegisterUserResult {
  user: RegisteredAuthUser;
  profile: RegisteredProfile;
}

export const API_ENDPOINTS = {
  authRegister: '/v1/auth/register',
  authLogin: '/v1/auth/login',
  companies: '/v1/companies',
  companyRegister: '/v1/companies/register',
  companyJobs: '/v1/companies/jobs',
  levels: '/v1/levels',
  profileMe: '/v1/profiles/me',
  profileUpdate: '/v1/profiles/update',
  recruitments: '/v1/recruitments',
  applications: '/v1/applications',
} as const;

export async function registerUser(payload: RegisterUserPayload) {
  const { data } = await apiClient.post<ApiResponse<RegisterUserResult>>(
    API_ENDPOINTS.authRegister,
    payload
  );
  return data;
}

export async function loginUser(payload: Pick<RegisterUserPayload, 'email' | 'password'>) {
  const { data } = await apiClient.post<ApiResponse<{ token: string; user: RegisteredProfile }>>(
    API_ENDPOINTS.authLogin,
    payload
  );
  return data;
}

export async function getLevels() {
  const { data } = await apiClient.get<ApiResponse<Level[]>>(API_ENDPOINTS.levels);

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error(data.message || 'Daftar level user tidak dapat dimuat.');
  }

  return data.data;
}

export async function getCompanies() {
  const { data } = await apiClient.get<ApiResponse<Company[]>>(API_ENDPOINTS.companies);
  return data.data;
}

export async function createCompany(payload: CreateCompanyPayload) {
  if (!document.cookie.includes('auth_token=')) {
    throw new Error('Belum login atau session telah berakhir');
  }

  const { data } = await apiClient.post<ApiResponse<Company>>(API_ENDPOINTS.companyRegister, payload);
  return data.data;
}

export async function updateCompany(id: string, payload: UpdateCompanyPayload) {
  const { data } = await apiClient.put<ApiResponse<Company>>(
    `${API_ENDPOINTS.companies}/${id}`,
    payload
  );
  return data.data;
}

export async function getRecruitments() {
  const { data } = await apiClient.get<ApiResponse<Recruitment[]>>(API_ENDPOINTS.recruitments);
  return data.data;
}

export async function getApplications() {
  const { data } = await apiClient.get<ApiResponse<Application[]>>(API_ENDPOINTS.applications);
  return data.data;
}

export async function createCompanyJob(payload: CreateCompanyJobPayload) {
  if (!document.cookie.includes('auth_token=')) {
    throw new Error('Belum login atau session telah berakhir');
  }

  const { data } = await apiClient.post<ApiResponse<Recruitment>>(API_ENDPOINTS.companyJobs, payload);
  return data.data;
}

export async function getMyProfile() {
  const { data } = await apiClient.get<{ success: boolean; user: Profile }>(
    API_ENDPOINTS.profileMe
  );
  return data.user;
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const { data } = await apiClient.put<{ success: boolean; message: string; data: Profile }>(
    API_ENDPOINTS.profileUpdate,
    payload
  );
  return data.data;
}
