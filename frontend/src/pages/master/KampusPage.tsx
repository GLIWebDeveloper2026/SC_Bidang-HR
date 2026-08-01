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

type Akreditasi = 'Unggul' | 'A' | 'B';

interface Kampus {
  id: string;
  namaKampus: string;
  akreditasi: Akreditasi;
}

const kampusData: Kampus[] = [
  { id: '1', namaKampus: 'Universitas Indonesia', akreditasi: 'Unggul' },
  { id: '2', namaKampus: 'Institut Teknologi Bandung', akreditasi: 'Unggul' },
  { id: '3', namaKampus: 'Universitas Gadjah Mada', akreditasi: 'A' },
  { id: '4', namaKampus: 'Universitas Airlangga', akreditasi: 'A' },
];

const accreditationColor: Record<Akreditasi, 'success' | 'primary' | 'default'> = {
  Unggul: 'success',
  A: 'primary',
  B: 'default',
};

export function KampusPage() {
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
          Kampus
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Kampus
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
              <TableCell sx={{ fontWeight: 600 }}>Nama Kampus</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Akreditasi</TableCell>
              <TableCell align="right" sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {kampusData.map((kampus) => (
              <TableRow key={kampus.id} hover>
                <TableCell>{kampus.namaKampus}</TableCell>
                <TableCell>
                  <Chip
                    label={kampus.akreditasi}
                    color={accreditationColor[kampus.akreditasi]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="edit kampus">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" aria-label="aksi kampus">
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
