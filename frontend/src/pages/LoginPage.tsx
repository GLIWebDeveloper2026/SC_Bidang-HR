import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CheckCircleOutline,
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { buildSupabaseOAuthUrl } from '@/api/supabaseAuth';
import logoLockup from '@/assets/logo-lockup.svg';
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
  const highlights = [
    'Pantau lowongan dan lamaran dalam satu dashboard.',
    'Akses data kandidat, kampus, dan perusahaan lebih cepat.',
    'Masuk aman untuk tim HR dan administrator.',
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        p: { xs: 2, sm: 3, md: 4 },
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(circle at 8% 8%, rgba(96, 107, 223, 0.18), transparent 30%), radial-gradient(circle at 92% 18%, rgba(245, 166, 35, 0.14), transparent 26%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 980,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 80px rgba(27, 27, 31, 0.12)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 560,
            p: { md: 4.5, lg: 5 },
            color: 'primary.contrastText',
            background:
              'linear-gradient(145deg, #606BDF 0%, #4A54B3 58%, #1B1B1F 100%)',
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255, 255, 255, 0.72)',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              Portal HR
            </Typography>
            <Typography
              component="h1"
              sx={{
                maxWidth: 360,
                mt: 1.5,
                fontSize: { md: 32, lg: 36 },
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              Kelola rekrutmen kampus dengan alur yang lebih rapi.
            </Typography>
            <Typography
              sx={{
                maxWidth: 340,
                mt: 2,
                color: 'rgba(255, 255, 255, 0.76)',
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Masuk untuk melanjutkan pekerjaan, meninjau lamaran, dan menjaga data
              recruitment tetap tertata.
            </Typography>
          </Box>

          <Stack spacing={1.75}>
            {highlights.map((highlight) => (
              <Box
                key={highlight}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  p: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <CheckCircleOutline sx={{ mt: 0.15, fontSize: 20, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.84)', fontSize: 13.5 }}>
                  {highlight}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <CardContent
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ mb: { xs: 3.5, sm: 4 }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box
              component="img"
              src={logoLockup}
              alt="KerjaKink"
              sx={{
                display: 'block',
                width: { xs: 152, sm: 170 },
                height: 'auto',
                mx: { xs: 'auto', sm: 0 },
                mb: { xs: 3, sm: 3.5 },
              }}
            />
            <Typography
              component="h2"
              sx={{
                color: 'text.primary',
                fontSize: { xs: 24, sm: 28 },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Selamat datang kembali
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 360,
                mt: 1.25,
                mx: { xs: 'auto', sm: 0 },
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Gunakan akun KerjaKink Anda untuk masuk ke dashboard.
            </Typography>
          </Box>

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
                  minHeight: 48,
                  py: 1.25,
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

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              atau
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            disabled={buttonLoading}
            startIcon={!buttonLoading ? <GoogleIcon /> : undefined}
            onClick={handleSignInWithGoogle}
            sx={{
              minHeight: 48,
              py: 1.25,
              fontWeight: 600,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(96, 107, 223, 0.04)',
              },
            }}
          >
            {buttonLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Masuk dengan Google'
            )}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, textAlign: 'center' }}
          >
            Belum punya akun?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Daftar sekarang
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
