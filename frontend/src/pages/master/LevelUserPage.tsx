import React, { useState, useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
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

interface LevelUser {
  uid: string;
  level: number;
  role: string;
}

export function LevelUserPage() {
  const [levelUserData, setLevelUserData] = useState<LevelUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLevelUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/levels');
        const json = await response.json();
        
        if (json.success) {
          setLevelUserData(json.data);
        } else {
          setError(json.message || 'Gagal memuat data');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan');
      } finally {
        setLoading(false);
      }
    };

    fetchLevelUser();
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
          Level User
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Level User
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
              <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell align="right" sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Memuat data...</TableCell>
              </TableRow>
            ) : levelUserData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Tidak ada data level</TableCell>
              </TableRow>
            ) : (
              levelUserData.map((item) => (
                <TableRow key={item.uid} hover>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="edit level user">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label="aksi level user">
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
