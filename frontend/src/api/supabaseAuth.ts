import type { User } from '@/types';

type SupabaseProvider = 'google';

interface SupabaseAuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: SupabaseAuthUser;
}

interface SupabaseErrorResponse {
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function getSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase auth belum dikonfigurasi di env.');
  }

  return {
    url: SUPABASE_URL.replace(/\/$/, ''),
    key: SUPABASE_PUBLISHABLE_KEY,
  };
}

async function parseSupabaseError(response: Response) {
  try {
    const data = (await response.json()) as SupabaseErrorResponse;
    return (
      data.error_description ||
      data.message ||
      data.msg ||
      data.error ||
      'Supabase request gagal.'
    );
  } catch {
    return 'Supabase request gagal.';
  }
}

async function supabaseRequest<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {}
) {
  const { url, key } = getSupabaseConfig();
  const { accessToken, headers, ...requestOptions } = options;

  const response = await fetch(`${url}${path}`, {
    ...requestOptions,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(await parseSupabaseError(response));
  }

  return (await response.json()) as T;
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function mapSupabaseUser(user: SupabaseAuthUser): User {
  const metadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};
  const email = user.email || readString(metadata.email) || '';
  const displayName =
    readString(metadata.display_name) ||
    readString(metadata.full_name) ||
    readString(metadata.name) ||
    email;

  return {
    id: user.id,
    email,
    name: displayName,
    displayName,
    avatar: readString(metadata.avatar_url) || readString(metadata.picture),
    role: readString(metadata.role) || readString(appMetadata.role) || 'User',
  };
}

export async function signInWithPassword(email: string, password: string) {
  return supabaseRequest<SupabaseSession>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshSupabaseSession(refreshToken: string) {
  return supabaseRequest<SupabaseSession>('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function getSupabaseUser(accessToken: string) {
  return supabaseRequest<SupabaseAuthUser>('/auth/v1/user', {
    method: 'GET',
    accessToken,
  });
}

export async function signOutSupabase(accessToken: string) {
  await supabaseRequest<Record<string, never>>('/auth/v1/logout', {
    method: 'POST',
    accessToken,
  });
}

export function buildSupabaseOAuthUrl(provider: SupabaseProvider, redirectTo: string) {
  const { url } = getSupabaseConfig();
  const authUrl = new URL('/auth/v1/authorize', url);

  authUrl.searchParams.set('provider', provider);
  authUrl.searchParams.set('redirect_to', redirectTo);

  return authUrl.toString();
}
