import apiClient from './client';
import type { ApiResponse } from './types';

export interface Company {
  uid: string;
  nama_perusahaan: string;
  alamat: string | null;
  email: string | null;
  telepon: string | null;
  status_verifikasi: string;
  created_at: string;
}

export interface UpdateCompanyPayload {
  nama_perusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  status_verifikasi: string;
}

export const API_ENDPOINTS = {
  companies: '/v1/companies',
} as const;

export async function getCompanies() {
  const { data } = await apiClient.get<ApiResponse<Company[]>>(API_ENDPOINTS.companies);
  return data.data;
}

export async function updateCompany(id: string, payload: UpdateCompanyPayload) {
  const { data } = await apiClient.put<ApiResponse<Company>>(
    `${API_ENDPOINTS.companies}/${id}`,
    payload
  );
  return data.data;
}
