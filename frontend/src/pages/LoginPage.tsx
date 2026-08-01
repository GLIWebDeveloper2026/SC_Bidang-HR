import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { buildSupabaseOAuthUrl } from '@/api/supabaseAuth';
import { useAuth } from '@/hooks';

const AUTH_REDIRECT_ORIGIN =
  (import.meta.env.VITE_AUTH_REDIRECT_ORIGIN as string | undefined) || window.location.origin;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, login } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    try {
      await login(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch {
      setError('Login gagal. Periksa email dan password Anda.');
    }
  };

  const handleSignInWithGoogle = () => {
    setError('');
    setIsSigningIn(true);

    try {
      const redirectTo = new URL(from, AUTH_REDIRECT_ORIGIN).toString();
      window.location.href = buildSupabaseOAuthUrl('google', redirectTo);
    } catch {
      setError('Gagal membuka login Google. Cek konfigurasi Supabase dan Google provider.');
      setIsSigningIn(false);
    }
  };

  const buttonLoading = isLoading || isSigningIn;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                S
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Welcome to KerjaKink
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Login dengan email dan password untuk masuk ke dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                autoComplete="email"
                autoFocus
                disabled={buttonLoading}
                fullWidth
                label="Email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
                type="email"
                value={email}
              />

              <TextField
                autoComplete="current-password"
                disabled={buttonLoading}
                fullWidth
                label="Password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                          edge="end"
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={buttonLoading}
                type="submit"
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {buttonLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Login'
                )}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>atau</Divider>

          <Box>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={buttonLoading}
              startIcon={!buttonLoading ? <GoogleIcon /> : undefined}
              onClick={handleSignInWithGoogle}
              sx={{
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {buttonLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign in with Google'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
