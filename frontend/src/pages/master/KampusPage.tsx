import React, { useState, useEffect } from 'react';
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

interface Kampus {
  uid: string;
  nama_campus: string;
  akreditasi: string;
}

const getAccreditationColor = (akreditasi: string) => {
  switch (akreditasi?.toUpperCase()) {
    case 'UNGGUL':
      return 'success';
    case 'A':
      return 'primary';
    case 'B':
    default:
      return 'default';
  }
};

export function KampusPage() {
  const [kampusData, setKampusData] = useState<Kampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKampus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/campus');
        const json = await response.json();
        
        if (json.success) {
          setKampusData(json.data);
        } else {
          setError(json.message || 'Gagal memuat data');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan');
      } finally {
        setLoading(false);
      }
    };

    fetchKampus();
  }, []);

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

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
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
              <TableCell sx={{ fontWeight: 600 }}>Nama Kampus</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Akreditasi</TableCell>
              <TableCell align="right" sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Memuat data...</TableCell>
              </TableRow>
            ) : kampusData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Tidak ada data kampus</TableCell>
              </TableRow>
            ) : (
              kampusData.map((kampus) => (
                <TableRow key={kampus.uid} hover>
                  <TableCell>{kampus.nama_campus}</TableCell>
                  <TableCell>
                    <Chip
                      label={kampus.akreditasi || '-'}
                      color={getAccreditationColor(kampus.akreditasi)}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
