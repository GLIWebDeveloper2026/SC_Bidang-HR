import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { isAxiosError } from 'axios';
import { getLevels, registerUser, type Level } from '@/api/api';

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Registrasi gagal. Silakan coba lagi.';
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [levelId, setLevelId] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadLevels = async () => {
      try {
        const levelData = await getLevels();

        if (!isMounted) {
          return;
        }

        const sortedLevels = [...levelData].sort((first, second) => first.level - second.level);
        setLevels(sortedLevels);
        setLevelId((currentLevelId) => currentLevelId || sortedLevels[0]?.uid || '');
      } catch (levelError) {
        if (isMounted) {
          setError(getErrorMessage(levelError));
        }
      } finally {
        if (isMounted) {
          setIsLoadingLevels(false);
        }
      }
    };

    void loadLevels();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedLevel = useMemo(
    () => levels.find((level) => level.uid === levelId),
    [levelId, levels]
  );

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedNama = nama.trim();
    const trimmedEmail = email.trim();

    if (!trimmedNama || !trimmedEmail || !password || !levelId) {
      setError('Nama, email, password, dan level user wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password belum sama.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        nama: trimmedNama,
        email: trimmedEmail,
        password,
        level_id: levelId,
      });

      if (!response.success) {
        throw new Error(response.message || 'Registrasi gagal. Silakan coba lagi.');
      }

      setSuccess('Registrasi berhasil. Silakan login dengan akun baru Anda.');
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (registerError) {
      setError(getErrorMessage(registerError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isLoadingLevels;

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
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
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
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                S
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Register User
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Buat akun baru dengan role yang tersedia di sistem.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>
            <Stack spacing={2.5}>
              <TextField
                autoComplete="name"
                autoFocus
                disabled={isBusy}
                fullWidth
                label="Nama Lengkap"
                name="nama"
                onChange={(event) => setNama(event.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                value={nama}
              />

              <TextField
                autoComplete="email"
                disabled={isBusy}
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
                disabled={isBusy || levels.length === 0}
                fullWidth
                label="Level User"
                name="level_id"
                onChange={(event) => setLevelId(event.target.value)}
                required
                select
                value={levelId}
              >
                {levels.map((level) => (
                  <MenuItem key={level.uid} value={level.uid}>
                    {level.role} - Level {level.level}
                  </MenuItem>
                ))}
              </TextField>

              {selectedLevel && (
                <Typography variant="caption" color="text.secondary">
                  Akun akan dibuat sebagai {selectedLevel.role}.
                </Typography>
              )}

              <TextField
                autoComplete="new-password"
                disabled={isBusy}
                fullWidth
                label="Password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
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

              <TextField
                autoComplete="new-password"
                disabled={isBusy}
                fullWidth
                label="Konfirmasi Password"
                name="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ulangi password"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? 'Sembunyikan konfirmasi password'
                              : 'Tampilkan konfirmasi password'
                          }
                          edge="end"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                disabled={isBusy || levels.length === 0}
                fullWidth
                size="large"
                sx={{ py: 1.5, fontWeight: 600 }}
                type="submit"
                variant="contained"
              >
                {isSubmitting ? <CircularProgress color="inherit" size={24} /> : 'Register'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Sudah punya akun?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
