import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  KeyboardArrowRight as ArrowRightIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCompanyJob, getRecruitments, type Recruitment } from '@/api/api';
import { ButtonCreateLowongan } from '@/components/button/button-lowongan/ButtonCreateLowongan';
import { DialogCreateLowongan } from '@/components/dialog/dialog-lowongan/DialogCreateLowongan';
import { DialogEditLowongan } from '@/components/dialog/dialog-lowongan/DialogEditLowongan';
import {
  MobileCardLowongan,
  getLowonganStatusColor,
  type MobileLowonganCardItem,
  type MobileLowonganStatus,
} from './MobileCardLowongan';

export type LowonganStatus = MobileLowonganStatus;

export interface Lowongan extends MobileLowonganCardItem {}

type SortDirection = 'asc' | 'desc' | null;
type SortField =
  | 'posisi'
  | 'kuota_posisi'
  | 'perusahaan'
  | 'email'
  | 'no_telp'
  | 'status'
  | 'tanggal_buka'
  | 'tanggal_tutup';

const LOWONGAN_TABLE_COL_SPAN = 11;

const sortableColumnSx: Partial<Record<SortField, { width: number; minWidth: number }>> = {
  posisi: { width: 220, minWidth: 220 },
  kuota_posisi: { width: 90, minWidth: 90 },
  perusahaan: { width: 180, minWidth: 180 },
  email: { width: 220, minWidth: 220 },
  no_telp: { width: 140, minWidth: 140 },
  status: { width: 120, minWidth: 120 },
  tanggal_buka: { width: 140, minWidth: 140 },
  tanggal_tutup: { width: 140, minWidth: 140 },
};

export const statusOptions: LowonganStatus[] = ['Aktif', 'Ditutup', 'Draft'];
export const kategoriOptions = [
  'Teknologi Informasi',
  'Sumber Daya Manusia',
  'Keuangan',
  'Pemasaran',
  'Operasional',
];

const lowonganSchema = z.object({
  posisi: z.string().min(1, 'Posisi wajib diisi'),
  kategori_bidang: z.string().min(1, 'Kategori bidang wajib diisi'),
  kuota_posisi: z.coerce.number().int('Kuota harus berupa angka bulat').min(1, 'Kuota minimal 1'),
  perusahaan: z.string().min(1, 'Perusahaan wajib diisi'),
  lokasi_kerja: z.string().min(1, 'Lokasi kerja wajib diisi'),
  status: z.enum(['Aktif', 'Ditutup', 'Draft']).optional(),
  deskripsi: z.string().optional(),
  tanggal: z.string().optional(),
});

export type LowonganFormData = z.infer<typeof lowonganSchema>;

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';

  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getLowonganStatus = (tanggalBuka?: string | null, tanggalTutup?: string | null): LowonganStatus => {
  const today = new Date();
  const startDate = tanggalBuka ? new Date(tanggalBuka) : null;
  const endDate = tanggalTutup ? new Date(tanggalTutup) : null;

  if (startDate && today < startDate) return 'Draft';
  if (endDate && today > endDate) return 'Ditutup';
  return 'Aktif';
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

const mapRecruitmentToLowongan = (recruitment: Recruitment): Lowongan => {
  const primaryPosition = recruitment.positions?.[0];
  const positionNames = recruitment.positions?.map((position) => position.posisi).filter(Boolean) || [];
  const totalKuota =
    recruitment.positions?.reduce((total, position) => total + (Number(position.kuota_posisi) || 0), 0) || 0;

  return {
    id: recruitment.uid,
    posisi: positionNames.length > 0 ? positionNames.join(', ') : recruitment.judul_pengumuman,
    kategori_bidang: primaryPosition?.bidang_industri || '-',
    kuota_posisi: totalKuota,
    perusahaan: recruitment.perusahaan?.nama_perusahaan || '-',
    email: recruitment.perusahaan?.email || '-',
    no_telp: recruitment.perusahaan?.telepon || '-',
    lokasi_kerja: recruitment.lokasi_kerja || '-',
    status: getLowonganStatus(recruitment.tanggal_buka, recruitment.tanggal_tutup),
    deskripsi: recruitment.deskripsi || primaryPosition?.persyaratan || '-',
    tanggal_buka: recruitment.tanggal_buka || undefined,
    tanggal_tutup: recruitment.tanggal_tutup || undefined,
  };
};

export function LowonganPage() {
  const [lowongan, setLowongan] = useState<Lowongan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLowongan, setEditingLowongan] = useState<Lowongan | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [actionMenuLowonganId, setActionMenuLowonganId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [filterKategori, setFilterKategori] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const methods = useForm<LowonganFormData>({
    resolver: zodResolver(lowonganSchema),
    defaultValues: {
      posisi: '',
      kategori_bidang: '',
      kuota_posisi: 1,
      perusahaan: '',
      lokasi_kerja: '',
      status: 'Draft',
      deskripsi: '',
      tanggal: new Date().toISOString().split('T')[0],
    },
  });

  const editMethods = useForm<LowonganFormData>({
    resolver: zodResolver(lowonganSchema),
    defaultValues: {
      posisi: '',
      kategori_bidang: '',
      kuota_posisi: 1,
      perusahaan: '',
      lokasi_kerja: '',
      status: 'Draft',
      deskripsi: '',
      tanggal: '',
    },
  });

  const allKategoriOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...kategoriOptions,
          ...lowongan.map((item) => item.kategori_bidang).filter((kategori) => kategori && kategori !== '-'),
        ])
      ),
    [lowongan]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchRecruitments = async () => {
      try {
        const recruitments = await getRecruitments();

        if (isMounted) {
          setLowongan(recruitments.map(mapRecruitmentToLowongan));
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error, 'Gagal memuat data lowongan'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecruitments();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLowongan = useMemo(() => {
    let result = [...lowongan];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.posisi.toLowerCase().includes(query) ||
          item.perusahaan.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.no_telp.toLowerCase().includes(query) ||
          item.lokasi_kerja.toLowerCase().includes(query) ||
          (item.deskripsi || '').toLowerCase().includes(query)
      );
    }

    if (filterKategori !== 'all') {
      result = result.filter((item) => item.kategori_bidang === filterKategori);
    }

    if (filterStatus !== 'all') {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        const comparison =
          typeof aValue === 'number' && typeof bValue === 'number'
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue));

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [filterKategori, filterStatus, lowongan, searchQuery, sortDirection, sortField]);

  const paginatedLowongan = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredLowongan.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLowongan, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLowongan.length / rowsPerPage));
  const isAllSelected =
    paginatedLowongan.length > 0 &&
    paginatedLowongan.every((item) => selectedIds.includes(item.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(event.target.checked ? paginatedLowongan.map((item) => item.id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection(null);
      }
      return;
    }

    setSortField(field);
    setSortDirection('asc');
  };

  const handleAddLowongan = async (data: LowonganFormData) => {
    setErrorMessage('');

    try {
      const tanggalTutup = data.tanggal || undefined;
      const createdJob = await createCompanyJob({
        judul_pengumuman: data.posisi,
        deskripsi: data.deskripsi || undefined,
        lokasi_kerja: data.lokasi_kerja,
        tanggal_tutup: tanggalTutup,
        positions: [
          {
            posisi: data.posisi,
            kuota_posisi: data.kuota_posisi,
            bidang_industri: data.kategori_bidang,
            persyaratan: data.deskripsi || undefined,
          },
        ],
        stages: [
          { nama_tahapan: 'Seleksi Berkas', urutan_tahapan: 1 },
          { nama_tahapan: 'Interview HR', urutan_tahapan: 2 },
        ],
      });

      const newLowongan: Lowongan = {
        id: createdJob.uid,
        posisi: data.posisi,
        kategori_bidang: data.kategori_bidang,
        kuota_posisi: data.kuota_posisi,
        perusahaan: createdJob.perusahaan?.nama_perusahaan || data.perusahaan,
        email: createdJob.perusahaan?.email || '-',
        no_telp: createdJob.perusahaan?.telepon || '-',
        lokasi_kerja: createdJob.lokasi_kerja || data.lokasi_kerja,
        status: getLowonganStatus(createdJob.tanggal_buka, createdJob.tanggal_tutup || tanggalTutup),
        deskripsi: createdJob.deskripsi || data.deskripsi || '-',
        tanggal_buka: createdJob.tanggal_buka || undefined,
        tanggal_tutup: createdJob.tanggal_tutup || tanggalTutup,
      };

      setLowongan((prev) => [newLowongan, ...prev]);
      setPage(1);
      setAddDialogOpen(false);
      methods.reset();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Gagal membuat lowongan'));
    }
  };

  const handleOpenEditDialog = (id: string) => {
    const selectedLowongan = lowongan.find((item) => item.id === id);

    if (!selectedLowongan) return;

    setEditingLowongan(selectedLowongan);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingLowongan(null);
    editMethods.reset();
  };

  const handleEditLowongan = (data: LowonganFormData) => {
    if (!editingLowongan) return;

    setLowongan((prev) =>
      prev.map((item) =>
        item.id === editingLowongan.id
          ? {
              ...item,
              posisi: data.posisi,
              kategori_bidang: data.kategori_bidang,
              kuota_posisi: data.kuota_posisi,
              perusahaan: data.perusahaan,
              lokasi_kerja: data.lokasi_kerja,
              status: data.status || item.status,
              deskripsi: data.deskripsi || '-',
              tanggal_tutup: data.tanggal || undefined,
            }
          : item
      )
    );
    handleCloseEditDialog();
  };

  const confirmDelete = () => {
    setLowongan((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setDeleteDialogOpen(false);
  };

  const clearFilters = () => {
    setFilterKategori('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpIcon sx={{ fontSize: 16, opacity: 0.3, ml: 0.5 }} />;
    }

    return sortDirection === 'asc' ? (
      <ArrowUpIcon sx={{ fontSize: 16, ml: 0.5 }} />
    ) : (
      <ArrowDownIcon sx={{ fontSize: 16, ml: 0.5 }} />
    );
  };

  const renderSortableHeader = (label: string, field: SortField) => (
    <TableCell
      onClick={() => handleSort(field)}
      sx={{
        ...sortableColumnSx[field],
        cursor: 'pointer',
        fontWeight: 600,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
        {getSortIcon(field)}
      </Box>
    </TableCell>
  );

  const renderCellText = (value?: string | number | null, fontWeight?: number) => {
    const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);

    return (
      <Tooltip title={displayValue === '-' ? '' : displayValue}>
        <Typography variant="body2" noWrap sx={{ fontWeight }}>
          {displayValue}
        </Typography>
      </Tooltip>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <Tooltip title={selectedIds.length > 0 ? 'Hapus pilihan' : 'Pilih data untuk menghapus'}>
            <span>
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                disabled={selectedIds.length === 0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  color: selectedIds.length > 0 ? 'error.main' : 'text.secondary',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <TextField
            placeholder="Cari posisi, perusahaan, email, no telp..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              minWidth: { xs: 0, sm: 280 },
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          />
        </Box>

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={(event) => setFilterAnchorEl(event.currentTarget)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            color: 'text.secondary',
            borderColor: 'divider',
          }}
        >
          Filter
        </Button>

        {(filterKategori !== 'all' || filterStatus !== 'all') && (
          <Chip label="Filter aktif" size="small" onDelete={clearFilters} color="primary" variant="outlined" />
        )}

        <Box sx={{ ml: { sm: 'auto' }, mt: { xs: 0, sm: 0.5 } }}>
          <ButtonCreateLowongan onClick={() => setAddDialogOpen(true)} />
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
        {isLoading && (
          <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'center', boxShadow: 'none' }}
          >
            <CircularProgress size={24} />
          </Paper>
        )}

        {!isLoading && paginatedLowongan.length === 0 && (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', boxShadow: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              Belum ada data lowongan.
            </Typography>
          </Paper>
        )}

        {!isLoading &&
          paginatedLowongan.map((item) => (
            <MobileCardLowongan
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              expanded={expandedRows.includes(item.id)}
              onSelect={handleSelectOne}
              onToggleExpand={handleExpandRow}
              onOpenActions={(event, id) => {
                setActionMenuAnchorEl(event.currentTarget);
                setActionMenuLowonganId(id);
              }}
            />
          ))}
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          display: { xs: 'none', md: 'block' },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Table size="small" sx={{ minWidth: 1400, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox checked={isAllSelected} indeterminate={isSomeSelected} onChange={handleSelectAll} />
              </TableCell>
              <TableCell sx={{ width: 48 }} />
              {renderSortableHeader('Posisi', 'posisi')}
              {renderSortableHeader('Kuota', 'kuota_posisi')}
              {renderSortableHeader('Perusahaan', 'perusahaan')}
              {renderSortableHeader('Email', 'email')}
              {renderSortableHeader('No Telp', 'no_telp')}
              {renderSortableHeader('Tanggal Buka', 'tanggal_buka')}
              {renderSortableHeader('Tanggal Tutup', 'tanggal_tutup')}
              {renderSortableHeader('Status', 'status')}
              <TableCell sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={LOWONGAN_TABLE_COL_SPAN} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedLowongan.length === 0 && (
              <TableRow>
                <TableCell colSpan={LOWONGAN_TABLE_COL_SPAN} align="center">
                  Belum ada data lowongan.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedLowongan.map((item) => (
              <Fragment key={item.id}>
                <TableRow hover selected={selectedIds.includes(item.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandRow(item.id)}
                      sx={{
                        transition: 'transform 0.2s',
                        transform: expandedRows.includes(item.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <ArrowRightIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={sortableColumnSx.posisi}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          flexShrink: 0,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WorkIcon sx={{ fontSize: 18 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>{renderCellText(item.posisi, 500)}</Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={sortableColumnSx.kuota_posisi}>{renderCellText(item.kuota_posisi)}</TableCell>
                  <TableCell sx={sortableColumnSx.perusahaan}>{renderCellText(item.perusahaan)}</TableCell>
                  <TableCell sx={sortableColumnSx.email}>{renderCellText(item.email)}</TableCell>
                  <TableCell sx={sortableColumnSx.no_telp}>{renderCellText(item.no_telp)}</TableCell>
                  <TableCell sx={sortableColumnSx.tanggal_buka}>{renderCellText(formatDate(item.tanggal_buka))}</TableCell>
                  <TableCell sx={sortableColumnSx.tanggal_tutup}>{renderCellText(formatDate(item.tanggal_tutup))}</TableCell>
                  <TableCell sx={sortableColumnSx.status}>
                    <Chip
                      label={item.status || '-'}
                      size="small"
                      color={getLowonganStatusColor(item.status)}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 56 }}>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActionMenuAnchorEl(event.currentTarget);
                        setActionMenuLowonganId(item.id);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={LOWONGAN_TABLE_COL_SPAN}
                    sx={{ py: 0, borderBottom: expandedRows.includes(item.id) ? undefined : 'none' }}
                  >
                    <Collapse in={expandedRows.includes(item.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ py: 2, px: 3, bgcolor: 'action.hover', borderRadius: 1, my: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Detail Lowongan
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Perusahaan
                            </Typography>
                            <Typography variant="body2">{item.perusahaan}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">{item.email}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              No Telp
                            </Typography>
                            <Typography variant="body2">{item.no_telp}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Kategori Bidang
                            </Typography>
                            <Typography variant="body2">{item.kategori_bidang}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Lokasi Kerja
                            </Typography>
                            <Typography variant="body2">{item.lokasi_kerja}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Tanggal Buka
                            </Typography>
                            <Typography variant="body2">{formatDate(item.tanggal_buka)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Tanggal Tutup
                            </Typography>
                            <Typography variant="body2">{formatDate(item.tanggal_tutup)}</Typography>
                          </Box>
                          <Box sx={{ gridColumn: { md: '1 / -1' } }}>
                            <Typography variant="caption" color="text.secondary">
                              Deskripsi
                            </Typography>
                            <Typography variant="body2">{item.deskripsi || '-'}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Previous
          </Button>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, nextPage) => setPage(nextPage)}
            siblingCount={1}
            boundaryCount={1}
            hidePrevButton
            hideNextButton
            shape="rounded"
            color="primary"
          />
          <Button
            variant="text"
            disabled={page === totalPages}
            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={() => {
          setActionMenuAnchorEl(null);
          setActionMenuLowonganId(null);
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { minWidth: 160, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem
          onClick={() => {
            if (actionMenuLowonganId) handleExpandRow(actionMenuLowonganId);
            setActionMenuAnchorEl(null);
            setActionMenuLowonganId(null);
          }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          Lihat Detail
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (actionMenuLowonganId) handleOpenEditDialog(actionMenuLowonganId);
            setActionMenuAnchorEl(null);
            setActionMenuLowonganId(null);
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (actionMenuLowonganId) {
              setSelectedIds([actionMenuLowonganId]);
              setDeleteDialogOpen(true);
            }
            setActionMenuAnchorEl(null);
            setActionMenuLowonganId(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Hapus
        </MenuItem>
      </Menu>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: 260, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Filter Lowongan
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Kategori Bidang</InputLabel>
          <Select
            value={filterKategori}
            onChange={(event) => setFilterKategori(event.target.value)}
            label="Kategori Bidang"
          >
            <MenuItem value="all">Semua Kategori</MenuItem>
            {allKategoriOptions.map((kategori) => (
              <MenuItem key={kategori} value={kategori}>
                {kategori}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} label="Status">
            <MenuItem value="all">Semua Status</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={clearFilters} sx={{ flex: 1, textTransform: 'none' }}>
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setFilterAnchorEl(null)}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            Apply
          </Button>
        </Box>
      </Popover>

      <DialogCreateLowongan
        open={addDialogOpen}
        methods={methods}
        kategoriOptions={allKategoriOptions}
        statusOptions={statusOptions}
        onClose={() => {
          setAddDialogOpen(false);
          methods.reset();
        }}
        onSubmit={handleAddLowongan}
      />

      <DialogEditLowongan
        open={editDialogOpen}
        lowongan={editingLowongan}
        methods={editMethods}
        kategoriOptions={allKategoriOptions}
        statusOptions={statusOptions}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditLowongan}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Yakin ingin menghapus {selectedIds.length} lowongan yang dipilih?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
