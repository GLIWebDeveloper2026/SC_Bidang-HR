import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  type ChipProps,
} from '@mui/material';
import {
  Description as DocumentIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { ApplicationStatus } from '@/api/api';

export interface MobileLamaranCardItem {
  id: string;
  pelamar: string;
  email: string;
  nim: string;
  jurusan: string;
  tahunLulus: string;
  posisi: string;
  bidangIndustri: string;
  judulPengumuman: string;
  perusahaan: string;
  status: ApplicationStatus;
  cvUrl: string;
  tanggal: string;
  hiredAt: string;
}

interface MobileCardLamaranProps {
  item: MobileLamaranCardItem;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onOpenCv?: (cvUrl: string) => void;
}

export const lamaranStatusLabels: Record<ApplicationStatus, string> = {
  IN_PROGRESS: 'Dalam Proses',
  HIRED: 'Diterima',
  REJECTED: 'Ditolak',
};

export const getLamaranStatusColor = (status: ApplicationStatus): ChipProps['color'] => {
  if (status === 'HIRED') return 'success';
  if (status === 'REJECTED') return 'error';
  return 'warning';
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  );
}

export function MobileCardLamaran({
  item,
  expanded,
  onToggleExpand,
  onOpenCv,
}: MobileCardLamaranProps) {
  const handleOpenCv = () => {
    if (item.cvUrl) {
      onOpenCv?.(item.cvUrl);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        boxShadow: 'none',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PersonIcon fontSize="small" />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.25, wordBreak: 'break-word' }}>
            {item.pelamar}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-word' }}>
            {item.email}
          </Typography>
        </Box>

        <Chip
          label={lamaranStatusLabels[item.status] || item.status}
          size="small"
          color={getLamaranStatusColor(item.status)}
          sx={{ fontWeight: 600, maxWidth: 128 }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.25,
          mt: 1.5,
        }}
      >
        <DetailItem label="NIM" value={item.nim} />
        <DetailItem label="Tanggal" value={formatDate(item.tanggal)} />
        <DetailItem label="Jurusan" value={item.jurusan} />
        <DetailItem label="Posisi" value={item.posisi} />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <DetailItem label="Perusahaan" value={item.perusahaan} />
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size="small"
          variant="text"
          onClick={() => onToggleExpand(item.id)}
          endIcon={
            <ArrowRightIcon
              fontSize="small"
              sx={{
                transition: 'transform 0.2s',
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            />
          }
          sx={{ px: 0.5, textTransform: 'none', color: 'text.secondary' }}
        >
          Detail
        </Button>

        <Box sx={{ ml: 'auto' }}>
          <Tooltip title={item.cvUrl ? 'Buka CV' : 'CV belum tersedia'}>
            <span>
              <IconButton size="small" disabled={!item.cvUrl} onClick={handleOpenCv}>
                <DocumentIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 1.25,
            mt: 1.5,
            p: 1.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <DetailItem label="Judul Pengumuman" value={item.judulPengumuman} />
          <DetailItem label="Bidang Industri" value={item.bidangIndustri} />
          <DetailItem label="Tahun Lulus" value={item.tahunLulus} />
          <DetailItem label="Tanggal Diterima" value={formatDate(item.hiredAt)} />
          <DetailItem label="Application ID" value={item.id} />
        </Box>
      </Collapse>
    </Paper>
  );
}
