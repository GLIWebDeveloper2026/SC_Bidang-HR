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

export const API_ENDPOINTS = {
  companies: '/v1/companies',
  companyRegister: '/v1/companies/register',
  companyJobs: '/v1/companies/jobs',
  profileMe: '/v1/profiles/me',
  profileUpdate: '/v1/profiles/update',
  recruitments: '/v1/recruitments',
  applications: '/v1/applications',
} as const;

export async function getCompanies() {
  const { data } = await apiClient.get<ApiResponse<Company[]>>(API_ENDPOINTS.companies);
  return data.data;
}

export async function createCompany(payload: CreateCompanyPayload) {
  if (!localStorage.getItem('auth_token')) {
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
  if (!localStorage.getItem('auth_token')) {
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
