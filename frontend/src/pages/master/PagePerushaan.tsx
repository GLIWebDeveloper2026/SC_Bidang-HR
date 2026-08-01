import {
  Box,
  Breadcrumbs,
  Chip,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Home as HomeIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

type VerificationStatus = 'Terverifikasi' | 'Menunggu' | 'Ditolak';

interface Perusahaan {
  id: string;
  namaPerusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
}

const perusahaanData: Perusahaan[] = [
  {
    id: '1',
    namaPerusahaan: 'PT Sinar Kompetisi Indonesia',
    alamat: 'Jl. Sudirman No. 12, Jakarta',
    email: 'hr@sinar-kompetisi.co.id',
    telepon: '021-555-0181',
    statusVerifikasi: 'Terverifikasi',
    createdAt: '2026-07-01',
  },
  {
    id: '2',
    namaPerusahaan: 'PT Aksara Talenta Nusantara',
    alamat: 'Jl. Diponegoro No. 45, Bandung',
    email: 'admin@aksaratalenta.id',
    telepon: '022-555-0147',
    statusVerifikasi: 'Menunggu',
    createdAt: '2026-07-12',
  },
  {
    id: '3',
    namaPerusahaan: 'CV Global Kreatif Mandiri',
    alamat: 'Jl. Pemuda No. 8, Surabaya',
    email: 'contact@gkm.co.id',
    telepon: '031-555-0199',
    statusVerifikasi: 'Ditolak',
    createdAt: '2026-07-20',
  },
];

const statusColor: Record<VerificationStatus, 'success' | 'warning' | 'error'> = {
  Terverifikasi: 'success',
  Menunggu: 'warning',
  Ditolak: 'error',
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export function PerusahaanPage() {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator=">">
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
          href="#"
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          Perusahaan
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Perusahaan
        </Typography>
      </Box>

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
              <TableCell sx={{ fontWeight: 600 }}>Nama Perusahaan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Alamat</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Telepon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status Verifikasi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
              <TableCell align="right" sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {perusahaanData.map((perusahaan) => (
              <TableRow key={perusahaan.id} hover>
                <TableCell>{perusahaan.namaPerusahaan}</TableCell>
                <TableCell>{perusahaan.alamat}</TableCell>
                <TableCell>{perusahaan.email}</TableCell>
                <TableCell>{perusahaan.telepon}</TableCell>
                <TableCell>
                  <Chip
                    label={perusahaan.statusVerifikasi}
                    color={statusColor[perusahaan.statusVerifikasi]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDate(perusahaan.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="edit perusahaan">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" aria-label="aksi perusahaan">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
