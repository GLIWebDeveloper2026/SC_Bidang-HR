import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTextField } from '@/components/forms';
import { getMyProfile, updateMyProfile, type Profile } from '@/api/api';
import { useAuth } from '@/hooks';
import type { User } from '@/types';

interface DialogUserProfileProps {
  open: boolean;
  onClose: () => void;
}

interface UserProfileFormData {
  nama: string;
  avatar: string;
  bio: string;
}

function getProfileName(profile?: Profile | null) {
  return profile?.nama || profile?.name || '';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    return response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function DialogUserProfile({ open, onClose }: DialogUserProfileProps) {
  const { user, updateUser } = useAuth();
  const currentUserRef = useRef<User | null>(user);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const methods = useForm<UserProfileFormData>({
    defaultValues: {
      nama: '',
      avatar: '',
      bio: '',
    },
  });

  const watchedNama = methods.watch('nama');
  const watchedAvatar = methods.watch('avatar');
  const isSubmitting = methods.formState.isSubmitting;
  const displayName = watchedNama || user?.displayName || user?.name || user?.email || 'User';

  useEffect(() => {
    currentUserRef.current = user;
  }, [user]);

  const resetFromCurrentUser = useCallback(() => {
    const currentUser = currentUserRef.current;

    methods.reset({
      nama: currentUser?.displayName || currentUser?.name || '',
      avatar: currentUser?.avatar || '',
      bio: '',
    });
  }, [methods]);

  const syncAuthUser = useCallback(
    (profile: Profile) => {
      const profileName = getProfileName(profile);
      const updates: Partial<User> = {};

      if (profile.id || profile.uid) {
        updates.id = profile.id || profile.uid;
      }

      if (profile.email) {
        updates.email = profile.email;
      }

      if (profileName) {
        updates.name = profileName;
        updates.displayName = profileName;
      }

      if ('avatar' in profile) {
        updates.avatar = profile.avatar || '';
      }

      if (profile.role) {
        updates.role = profile.role;
      }

      updateUser(updates);
    },
    [updateUser]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let isActive = true;

    setErrorMessage('');
    setSuccessMessage('');
    resetFromCurrentUser();
    setIsLoadingProfile(true);

    getMyProfile()
      .then((profile) => {
        if (!isActive) {
          return;
        }

        const currentUser = currentUserRef.current;

        methods.reset({
          nama: getProfileName(profile) || currentUser?.displayName || currentUser?.name || '',
          avatar: profile.avatar || currentUser?.avatar || '',
          bio: profile.bio || '',
        });
      })
      .catch((error) => {
        if (isActive) {
          setErrorMessage(getErrorMessage(error, 'Gagal memuat profil'));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [methods, open, resetFromCurrentUser]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (data: UserProfileFormData) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedProfile = await updateMyProfile({
        nama: data.nama.trim(),
        avatar: data.avatar.trim(),
        bio: data.bio.trim(),
      });

      methods.reset({
        nama: getProfileName(updatedProfile) || data.nama.trim(),
        avatar: updatedProfile.avatar || data.avatar.trim(),
        bio: updatedProfile.bio || data.bio.trim(),
      });
      syncAuthUser(updatedProfile);
      setSuccessMessage('Profil berhasil diperbarui');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Gagal memperbarui profil'));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Profile</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={watchedAvatar || undefined}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || '-'}
                  </Typography>
                </Box>
              </Box>

              {isLoadingProfile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Memuat profil...
                  </Typography>
                </Box>
              )}

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}

              <FormTextField
                name="nama"
                label="Nama"
                placeholder="Masukkan nama lengkap"
                disabled={isLoadingProfile || isSubmitting}
                required
              />
              <FormTextField
                name="avatar"
                label="Avatar URL"
                placeholder="https://contoh.com/foto.jpg"
                disabled={isLoadingProfile || isSubmitting}
              />
              <FormTextField
                name="bio"
                label="Bio"
                placeholder="Tulis bio singkat"
                multiline
                minRows={3}
                disabled={isLoadingProfile || isSubmitting}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoadingProfile || isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
