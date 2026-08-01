import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
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
  Description as DocumentIcon,
  FilterList as FilterIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  getApplications,
  type Application,
  type ApplicationStatus,
} from '@/api/api';

export type LowonganStatus = 'Aktif' | 'Ditutup' | 'Draft';

export interface Lowongan {
  id: string;
  posisi: string;
  kategori_bidang: string;
  kuota_posisi: number;
  perusahaan: string;
  lokasi_kerja: string;
  status?: LowonganStatus;
  deskripsi?: string;
  tanggal?: string;
}

export interface LamaranFormData {
  surat_lamaran: string;
  cv: File | null;
  nomor_hp: string;
  pendidikan: string;
  harapan_salary: number;
  setuju_syarat: boolean;
}

interface LamaranRow {
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

type SortDirection = 'asc' | 'desc' | null;
type SortField =
  | 'pelamar'
  | 'nim'
  | 'jurusan'
  | 'posisi'
  | 'perusahaan'
  | 'status'
  | 'tanggal';

const statusOptions: ApplicationStatus[] = ['IN_PROGRESS', 'HIRED', 'REJECTED'];

const statusLabels: Record<ApplicationStatus, string> = {
  IN_PROGRESS: 'Dalam Proses',
  HIRED: 'Diterima',
  REJECTED: 'Ditolak',
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

const getStatusColor = (status: ApplicationStatus) => {
  if (status === 'HIRED') return 'success';
  if (status === 'REJECTED') return 'error';
  return 'warning';
};

const mapApplicationToLamaran = (application: Application): LamaranRow => ({
  id: application.uid,
  pelamar: application.mahasiswa?.profiles?.nama || '-',
  email: application.mahasiswa?.profiles?.email || '-',
  nim: application.mahasiswa?.nim || '-',
  jurusan: application.mahasiswa?.jurusan || '-',
  tahunLulus: application.mahasiswa?.tahun_lulus ? String(application.mahasiswa.tahun_lulus) : '-',
  posisi: application.position?.posisi || '-',
  bidangIndustri: application.position?.bidang_industri || '-',
  judulPengumuman: application.position?.recruitment?.judul_pengumuman || '-',
  perusahaan: application.position?.recruitment?.perusahaan?.nama_perusahaan || '-',
  status: application.status,
  cvUrl: application.snapshot_cv_url || '',
  tanggal: application.created_at || '',
  hiredAt: application.hired_at || '',
});

export function LamaranPage() {
  const [lamaran, setLamaran] = useState<LamaranRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>('tanggal');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [filterJurusan, setFilterJurusan] = useState('all');

  const jurusanOptions = useMemo(
    () =>
      Array.from(
        new Set(lamaran.map((item) => item.jurusan).filter((jurusan) => jurusan && jurusan !== '-'))
      ),
    [lamaran]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        const applications = await getApplications();

        if (isMounted) {
          setLamaran(applications.map(mapApplicationToLamaran));
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error, 'Gagal memuat data lamaran'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filterJurusan, filterStatus, searchQuery]);

  const filteredLamaran = useMemo(() => {
    let result = [...lamaran];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.pelamar.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.nim.toLowerCase().includes(query) ||
          item.jurusan.toLowerCase().includes(query) ||
          item.posisi.toLowerCase().includes(query) ||
          item.perusahaan.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (filterJurusan !== 'all') {
      result = result.filter((item) => item.jurusan === filterJurusan);
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const comparison = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''));
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [filterJurusan, filterStatus, lamaran, searchQuery, sortDirection, sortField]);

  const paginatedLamaran = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredLamaran.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLamaran, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLamaran.length / rowsPerPage));

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

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterJurusan('all');
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

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Cari pelamar, NIM, posisi, perusahaan..."
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
            minWidth: { xs: '100%', sm: 340 },
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />

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

        {(filterStatus !== 'all' || filterJurusan !== 'all') && (
          <Chip label="Filter aktif" size="small" onDelete={clearFilters} color="primary" variant="outlined" />
        )}
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48 }} />
              {renderSortableHeader('Pelamar', 'pelamar')}
              {renderSortableHeader('NIM', 'nim')}
              {renderSortableHeader('Jurusan', 'jurusan')}
              {renderSortableHeader('Posisi', 'posisi')}
              {renderSortableHeader('Perusahaan', 'perusahaan')}
              {renderSortableHeader('Status', 'status')}
              {renderSortableHeader('Tanggal', 'tanggal')}
              <TableCell sx={{ width: 64, fontWeight: 600 }}>CV</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedLamaran.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  Belum ada data lamaran.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              paginatedLamaran.map((item) => (
                <Fragment key={item.id}>
                  <TableRow hover>
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
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
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
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.pelamar}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{item.nim}</TableCell>
                    <TableCell>{item.jurusan}</TableCell>
                    <TableCell>{item.posisi}</TableCell>
                    <TableCell>{item.perusahaan}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[item.status] || item.status}
                        size="small"
                        color={getStatusColor(item.status)}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell>
                      <Tooltip title={item.cvUrl ? 'Buka CV' : 'CV belum tersedia'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!item.cvUrl}
                            onClick={() => window.open(item.cvUrl, '_blank', 'noopener,noreferrer')}
                          >
                            <DocumentIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={9} sx={{ py: 0, borderBottom: expandedRows.includes(item.id) ? undefined : 'none' }}>
                      <Collapse in={expandedRows.includes(item.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ py: 2, px: 3, bgcolor: 'action.hover', borderRadius: 1, my: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Detail Lamaran
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
                                Judul Pengumuman
                              </Typography>
                              <Typography variant="body2">{item.judulPengumuman}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Bidang Industri
                              </Typography>
                              <Typography variant="body2">{item.bidangIndustri}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Tahun Lulus
                              </Typography>
                              <Typography variant="body2">{item.tahunLulus}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Lamaran Dibuat
                              </Typography>
                              <Typography variant="body2">{formatDate(item.tanggal)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Tanggal Diterima
                              </Typography>
                              <Typography variant="body2">{formatDate(item.hiredAt)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Application ID
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {item.id}
                              </Typography>
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

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: 260, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Filter Lamaran
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value as ApplicationStatus | 'all')}
            label="Status"
          >
            <MenuItem value="all">Semua Status</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Jurusan</InputLabel>
          <Select
            value={filterJurusan}
            onChange={(event) => setFilterJurusan(event.target.value)}
            label="Jurusan"
          >
            <MenuItem value="all">Semua Jurusan</MenuItem>
            {jurusanOptions.map((jurusan) => (
              <MenuItem key={jurusan} value={jurusan}>
                {jurusan}
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
    </Box>
  );
}
