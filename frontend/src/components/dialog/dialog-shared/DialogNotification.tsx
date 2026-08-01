import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Popover,
  Typography,
} from '@mui/material';
import {
  BusinessCenter as BusinessCenterIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  EventNote as EventNoteIcon,
  WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { getRecruitments, type Recruitment } from '@/api/api';

interface DialogNotificationProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onNotificationCountChange?: (count: number) => void;
}

type NotificationKind = 'recruitment' | 'closed' | 'schedule' | 'company';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  kind: NotificationKind;
}

const formatNotificationDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Tanggal buka belum tersedia';

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal buka belum tersedia';
  }

  return `Dibuka ${date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
};

const getDateTime = (dateStr?: string | null) => {
  if (!dateStr) return 0;

  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const getRecruitmentNotificationKind = (recruitment: Recruitment): NotificationKind => {
  const now = Date.now();
  const openTime = getDateTime(recruitment.tanggal_buka);
  const closeTime = getDateTime(recruitment.tanggal_tutup);

  if (openTime && openTime > now) {
    return 'schedule';
  }

  if (closeTime && closeTime < now) {
    return 'closed';
  }

  if (!recruitment.perusahaan) {
    return 'company';
  }

  return 'recruitment';
};

const getRecruitmentPositionText = (recruitment: Recruitment) => {
  const positionNames =
    recruitment.positions?.map((position) => position.posisi).filter(Boolean) || [];

  if (positionNames.length > 0) {
    return positionNames.join(', ');
  }

  return recruitment.judul_pengumuman || 'posisi tersedia';
};

const mapRecruitmentToNotification = (recruitment: Recruitment): NotificationItem => {
  const positionText = getRecruitmentPositionText(recruitment);
  const companyName = recruitment.perusahaan?.nama_perusahaan || 'Perusahaan belum tersedia';
  const locationText = recruitment.lokasi_kerja ? ` di ${recruitment.lokasi_kerja}` : '';

  return {
    id: recruitment.uid,
    title: recruitment.judul_pengumuman || `Lowongan ${positionText}`,
    description: `${companyName} membuka ${positionText}${locationText}.`,
    time: formatNotificationDate(recruitment.tanggal_buka),
    kind: getRecruitmentNotificationKind(recruitment),
  };
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const responseData = (error as { response?: { data?: { message?: unknown } } }).response?.data;

    if (typeof responseData?.message === 'string') {
      return responseData.message;
    }
  }

  return error instanceof Error ? error.message : fallbackMessage;
};

function getNotificationIcon(kind: NotificationKind) {
  if (kind === 'closed') {
    return <CheckCircleOutlineIcon fontSize="small" />;
  }

  if (kind === 'schedule') {
    return <EventNoteIcon fontSize="small" />;
  }

  if (kind === 'company') {
    return <BusinessCenterIcon fontSize="small" />;
  }

  return <WorkOutlineIcon fontSize="small" />;
}

function getNotificationTone(kind: NotificationKind) {
  if (kind === 'closed') {
    return {
      bgcolor: 'rgba(76, 175, 80, 0.12)',
      color: 'success.main',
    };
  }

  if (kind === 'schedule') {
    return {
      bgcolor: 'rgba(245, 166, 35, 0.14)',
      color: 'warning.dark',
    };
  }

  if (kind === 'company') {
    return {
      bgcolor: 'rgba(222, 55, 48, 0.1)',
      color: 'error.main',
    };
  }

  return {
    bgcolor: 'rgba(96, 107, 223, 0.12)',
    color: 'primary.main',
  };
}

export function DialogNotification({
  anchorEl,
  onClose,
  onNotificationCountChange,
}: DialogNotificationProps) {
  const open = Boolean(anchorEl);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const hasFetchedNotifications = useRef(false);
  const notificationCount = notifications.length;

  useEffect(() => {
    let isMounted = true;

    const fetchRecruitmentNotifications = async () => {
      try {
        setIsLoading(true);
        const recruitments = await getRecruitments();
        const nextNotifications = [...recruitments]
          .sort((firstRecruitment, secondRecruitment) => {
            const firstTime = getDateTime(firstRecruitment.tanggal_buka);
            const secondTime = getDateTime(secondRecruitment.tanggal_buka);

            return secondTime - firstTime;
          })
          .map(mapRecruitmentToNotification);

        if (isMounted) {
          hasFetchedNotifications.current = true;
          setNotifications(nextNotifications);
          setErrorMessage('');
          onNotificationCountChange?.(nextNotifications.length);
        }
      } catch (error) {
        if (isMounted) {
          setNotifications([]);
          setErrorMessage(getErrorMessage(error, 'Gagal memuat notifikasi lowongan.'));
          onNotificationCountChange?.(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!open && hasFetchedNotifications.current) {
      return undefined;
    }

    fetchRecruitmentNotifications();

    return () => {
      isMounted = false;
    };
  }, [onNotificationCountChange, open]);

  return (
    <Popover
      id={open ? 'notification-popover' : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography id="notification-popover-title" variant="subtitle2" fontWeight={600}>
              Notifikasi
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isLoading ? 'Memuat data...' : `${notificationCount} notifikasi lowongan`}
            </Typography>
          </Box>
          <Button size="small" onClick={onClose}>
            Tutup
          </Button>
        </Box>

        <Divider />

        <List disablePadding sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {isLoading && (
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!isLoading && errorMessage && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" variant="outlined">
                {errorMessage}
              </Alert>
            </Box>
          )}

          {!isLoading && !errorMessage && notifications.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Belum ada notifikasi lowongan.
              </Typography>
            </Box>
          )}

          {!isLoading && !errorMessage && notifications.map((notification) => {
            const tone = getNotificationTone(notification.kind);

            return (
              <ListItemButton
                key={notification.id}
                alignItems="flex-start"
                onClick={onClose}
                sx={{
                  px: 2,
                  py: 1.5,
                  gap: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    ...tone,
                  }}
                >
                  {getNotificationIcon(notification.kind)}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ flex: 1 }}
                    >
                      {notification.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.25 }}
                  >
                    {notification.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: 'block', mt: 0.75 }}
                  >
                    {notification.time}
                  </Typography>
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Popover>
  );
}
