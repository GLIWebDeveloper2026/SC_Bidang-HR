export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  display_name?: string;
  avatar?: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
