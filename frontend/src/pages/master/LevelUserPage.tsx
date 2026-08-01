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
  id: string;
  level: string;
  role: string;
}

const levelUserData: LevelUser[] = [
  { id: '1', level: 'Level 1', role: 'Super Admin' },
  { id: '2', level: 'Level 2', role: 'Admin HR' },
  { id: '3', level: 'Level 3', role: 'Perusahaan' },
  { id: '4', level: 'Level 4', role: 'Kampus' },
  { id: '5', level: 'Level 5', role: 'Applicant' },
];

export function LevelUserPage() {
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
            {levelUserData.map((item) => (
              <TableRow key={item.id} hover>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
