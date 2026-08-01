import { useMutation } from '@tanstack/react-query';
import apiClient from '../client';
import type { User, LoginCredentials, AuthResponse } from '@/types';

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
  });
}

export function useCurrentUser() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    },
  });
}
