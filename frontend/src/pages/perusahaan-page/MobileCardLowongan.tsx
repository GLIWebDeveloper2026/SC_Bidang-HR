import type { MouseEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
  KeyboardArrowRight as ArrowRightIcon,
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

export type MobileLowonganStatus = 'Aktif' | 'Ditutup' | 'Draft';

export interface MobileLowonganCardItem {
  id: string;
  posisi: string;
  kategori_bidang: string;
  kuota_posisi: number;
  perusahaan: string;
  email: string;
  no_telp: string;
  lokasi_kerja: string;
  status?: MobileLowonganStatus;
  deskripsi?: string;
  tanggal_buka?: string;
  tanggal_tutup?: string;
}

interface MobileCardLowonganProps {
  item: MobileLowonganCardItem;
  selected?: boolean;
  expanded: boolean;
  onSelect?: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onOpenActions?: (event: MouseEvent<HTMLElement>, id: string) => void;
}

export const getLowonganStatusColor = (status?: MobileLowonganStatus): ChipProps['color'] => {
  if (status === 'Aktif') return 'success';
  if (status === 'Ditutup') return 'default';
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
  value?: string | number | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
        {displayValue}
      </Typography>
    </Box>
  );
}

export function MobileCardLowongan({
  item,
  selected = false,
  expanded,
  onSelect,
  onToggleExpand,
  onOpenActions,
}: MobileCardLowonganProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        boxShadow: 'none',
        bgcolor: selected ? 'action.selected' : 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {onSelect && (
          <Checkbox
            checked={selected}
            onChange={() => onSelect(item.id)}
            size="small"
            sx={{ p: 0.25, mt: 0.25 }}
          />
        )}

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
          <WorkIcon fontSize="small" />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.25, wordBreak: 'break-word' }}>
            {item.posisi}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-word' }}>
            {item.perusahaan}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip
            label={item.status || '-'}
            size="small"
            color={getLowonganStatusColor(item.status)}
            sx={{ fontWeight: 600 }}
          />
          {onOpenActions && (
            <Tooltip title="Aksi">
              <IconButton size="small" onClick={(event) => onOpenActions(event, item.id)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.25,
          mt: 1.5,
        }}
      >
        <DetailItem label="Kuota" value={item.kuota_posisi} />
        <DetailItem label="Tanggal Tutup" value={formatDate(item.tanggal_tutup)} />
        <DetailItem label="Kategori" value={item.kategori_bidang} />
        <DetailItem label="Lokasi" value={item.lokasi_kerja} />
      </Box>

      <Divider sx={{ my: 1.5 }} />

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

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 1.25,
            mt: 1.25,
            p: 1.25,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <DetailItem label="Email" value={item.email} />
          <DetailItem label="No Telp" value={item.no_telp} />
          <DetailItem label="Tanggal Buka" value={formatDate(item.tanggal_buka)} />
          <DetailItem label="Tanggal Tutup" value={formatDate(item.tanggal_tutup)} />
          <DetailItem label="Deskripsi" value={item.deskripsi} />
        </Box>
      </Collapse>
    </Paper>
  );
}
