export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
}
