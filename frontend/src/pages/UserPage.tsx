import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  Pagination,
  Stack,
  Tooltip,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowRight as ArrowRightIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIconSort,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField, FormSelect } from '@/components/forms';

// Types
type UserRole = 'Admin' | 'Developer' | 'Engineer' | 'Super Admin';
type UserStatus = 'Active' | 'Pending' | 'Blocked' | 'Reported';
type ActivityType = 'Created' | 'Logout' | 'Subscribe';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: UserRole;
  lastActivity: {
    type: ActivityType;
    daysAgo: number;
  };
  date: string;
  status: UserStatus;
  details?: {
    email: string;
    phone: string;
    department: string;
    location: string;
  };
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'role' | 'lastActivity' | 'date' | 'status';

// Mock data based on 5.md specification
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ethan Ziemann',
    username: 'ethan_ziemann',
    avatar: 'https://i.pravatar.cc/150?u=ethan_ziemann',
    role: 'Admin',
    lastActivity: { type: 'Created', daysAgo: 2 },
    date: '2026-01-14',
    status: 'Reported',
    details: {
      email: 'ethan.ziemann@example.com',
      phone: '+1 234 567 8901',
      department: 'Administration',
      location: 'New York, NY',
    },
  },
  {
    id: '2',
    name: 'Tanya Maggio',
    username: 'tanya.maggio',
    avatar: 'https://i.pravatar.cc/150?u=tanya.maggio',
    role: 'Developer',
    lastActivity: { type: 'Logout', daysAgo: 8 },
    date: '2026-01-10',
    status: 'Blocked',
    details: {
      email: 'tanya.maggio@example.com',
      phone: '+1 234 567 8902',
      department: 'Engineering',
      location: 'San Francisco, CA',
    },
  },
  {
    id: '3',
    name: 'Bryan Towne',
    username: 'bryan_towne',
    avatar: 'https://i.pravatar.cc/150?u=bryan_towne',
    role: 'Engineer',
    lastActivity: { type: 'Subscribe', daysAgo: 6 },
    date: '2026-01-10',
    status: 'Pending',
    details: {
      email: 'bryan.towne@example.com',
      phone: '+1 234 567 8903',
      department: 'Engineering',
      location: 'Austin, TX',
    },
  },
  {
    id: '4',
    name: 'Irene Stokes',
    username: 'irene.stokes',
    avatar: 'https://i.pravatar.cc/150?u=irene.stokes',
    role: 'Super Admin',
    lastActivity: { type: 'Created', daysAgo: 17 },
    date: '2026-01-10',
    status: 'Active',
    details: {
      email: 'irene.stokes@example.com',
      phone: '+1 234 567 8904',
      department: 'Administration',
      location: 'Chicago, IL',
    },
  },
  {
    id: '5',
    name: 'Dean Connelly',
    username: 'dean.connelly',
    avatar: 'https://i.pravatar.cc/150?u=dean.connelly',
    role: 'Admin',
    lastActivity: { type: 'Subscribe', daysAgo: 10 },
    date: '2026-01-09',
    status: 'Reported',
    details: {
      email: 'dean.connelly@example.com',
      phone: '+1 234 567 8905',
      department: 'Administration',
      location: 'Miami, FL',
    },
  },
  {
    id: '6',
    name: 'Nora Runte',
    username: 'nora_runte',
    avatar: 'https://i.pravatar.cc/150?u=nora_runte',
    role: 'Developer',
    lastActivity: { type: 'Logout', daysAgo: 18 },
    date: '2026-01-08',
    status: 'Blocked',
    details: {
      email: 'nora.runte@example.com',
      phone: '+1 234 567 8906',
      department: 'Engineering',
      location: 'Seattle, WA',
    },
  },
  {
    id: '7',
    name: 'George Bartell',
    username: 'george.bartell',
    avatar: 'https://i.pravatar.cc/150?u=george.bartell',
    role: 'Engineer',
    lastActivity: { type: 'Created', daysAgo: 13 },
    date: '2026-01-07',
    status: 'Active',
    details: {
      email: 'george.bartell@example.com',
      phone: '+1 234 567 8907',
      department: 'Engineering',
      location: 'Denver, CO',
    },
  },
  {
    id: '8',
    name: 'Fiona Huels',
    username: 'fiona_huels',
    avatar: 'https://i.pravatar.cc/150?u=fiona_huels',
    role: 'Admin',
    lastActivity: { type: 'Subscribe', daysAgo: 1 },
    date: '2026-01-05',
    status: 'Pending',
    details: {
      email: 'fiona.huels@example.com',
      phone: '+1 234 567 8908',
      department: 'Administration',
      location: 'Boston, MA',
    },
  },
  {
    id: '9',
    name: 'Felix Smitham',
    username: 'felix_smitham',
    avatar: 'https://i.pravatar.cc/150?u=felix_smitham',
    role: 'Developer',
    lastActivity: { type: 'Logout', daysAgo: 15 },
    date: '2026-01-05',
    status: 'Reported',
    details: {
      email: 'felix.smitham@example.com',
      phone: '+1 234 567 8909',
      department: 'Engineering',
      location: 'Portland, OR',
    },
  },
  {
    id: '10',
    name: 'Katrina Will',
    username: 'katrina.will',
    avatar: 'https://i.pravatar.cc/150?u=katrina.will',
    role: 'Super Admin',
    lastActivity: { type: 'Created', daysAgo: 20 },
    date: '2026-01-05',
    status: 'Active',
    details: {
      email: 'katrina.will@example.com',
      phone: '+1 234 567 8910',
      department: 'Administration',
      location: 'Atlanta, GA',
    },
  },
];

// Form schema for Add New User
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Developer', 'Engineer', 'Super Admin']),
  status: z.enum(['Active', 'Pending', 'Blocked', 'Reported']),
});

type UserFormData = z.infer<typeof userSchema>;

// Helper functions
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDaysAgo = (days: number): string => {
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

// Status colors based on specification
const getStatusColor = (status: UserStatus): {
  bgcolor: string;
  color: string;
} => {
  switch (status) {
    case 'Active':
      return { bgcolor: 'rgb(200, 255, 192)', color: 'rgb(34, 139, 34)' }; // Green
    case 'Pending':
      return { bgcolor: 'rgb(255, 238, 225)', color: 'rgb(184, 134, 11)' }; // Yellow/Orange
    case 'Blocked':
      return { bgcolor: 'rgb(255, 237, 234)', color: 'rgb(222, 55, 48)' }; // Red
    case 'Reported':
      return { bgcolor: 'rgb(255, 238, 225)', color: 'rgb(255, 140, 0)' }; // Orange
    default:
      return { bgcolor: 'grey.100', color: 'grey.700' };
  }
};

export function UserPage() {
  // State
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);

  // Dialog/Menu states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [actionMenuUserId, setActionMenuUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter states
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form
  const methods = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'Developer',
      status: 'Active',
    },
  });

  // Filtering logic
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter((user) => user.role === filterRole);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((user) => user.status === filterStatus);
    }

    // Apply sorting
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'role':
            comparison = a.role.localeCompare(b.role);
            break;
          case 'lastActivity':
            comparison = a.lastActivity.daysAgo - b.lastActivity.daysAgo;
            break;
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [users, searchQuery, filterRole, filterStatus, sortField, sortDirection]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExpandRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setActionMenuAnchorEl(event.currentTarget);
    setActionMenuUserId(id);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setActionMenuUserId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    setDeleteDialogOpen(false);
  };

  const handleAddUser = (data: UserFormData) => {
    const newUser: User = {
      id: String(Date.now()),
      name: data.name,
      username: data.username,
      avatar: `https://i.pravatar.cc/150?u=${data.username}`,
      role: data.role as UserRole,
      lastActivity: { type: 'Created', daysAgo: 0 },
      date: new Date().toISOString().split('T')[0],
      status: data.status as UserStatus,
      details: {
        email: data.email,
        phone: '',
        department: '',
        location: '',
      },
    };
    setUsers((prev) => [newUser, ...prev]);
    setAddDialogOpen(false);
    methods.reset();
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const clearFilters = () => {
    setFilterRole('all');
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
      <ArrowDownIconSort sx={{ fontSize: 16, ml: 0.5 }} />
    );
  };

  const isAllSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.includes(u.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
        separator=">"
      >
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}
          href="#"
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          User
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          User
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            bgcolor: 'rgb(96, 107, 223)',
            textTransform: 'none',
            fontWeight: 500,
            px: 2.5,
            py: 1,
            '&:hover': {
              bgcolor: 'rgb(76, 87, 203)',
            },
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        {/* Delete button */}
        <Tooltip title={selectedIds.length > 0 ? 'Delete selected' : 'Select items to delete'}>
          <span>
            <IconButton
              onClick={handleDeleteSelected}
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

        {/* Search input */}
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Filter button */}
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleFilterOpen}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            color: 'text.secondary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        >
          Filter
        </Button>

        {/* Active filters indicator */}
        {(filterRole !== 'all' || filterStatus !== 'all') && (
          <Chip
            label="Filters active"
            size="small"
            onDelete={clearFilters}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Data Table */}
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
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ width: 48 }} />
              <TableCell
                onClick={() => handleSort('name')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Profile
                  {getSortIcon('name')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('role')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Role
                  {getSortIcon('role')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('lastActivity')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Last Activity
                  {getSortIcon('lastActivity')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('date')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Date
                  {getSortIcon('date')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('status')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status
                  {getSortIcon('status')}
                </Box>
              </TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <>
                <TableRow
                  key={user.id}
                  hover
                  selected={selectedIds.includes(user.id)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 48 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandRow(user.id)}
                      sx={{
                        transition: 'transform 0.2s',
                        transform: expandedRows.includes(user.id)
                          ? 'rotate(90deg)'
                          : 'rotate(0deg)',
                      }}
                    >
                      <ArrowRightIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{
                          width: 40,
                          height: 40,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: 'text.primary' }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.role}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.lastActivity.type}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatDaysAgo(user.lastActivity.daysAgo)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(user.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(user.status).bgcolor,
                        color: getStatusColor(user.status).color,
                        fontWeight: 500,
                        border: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, user.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {/* Expanded row content */}
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 0, borderBottom: expandedRows.includes(user.id) ? undefined : 'none' }}>
                    <Collapse in={expandedRows.includes(user.id)} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          py: 2,
                          px: 3,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          my: 1,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          User Details
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">
                              {user.details?.email || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body2">
                              {user.details?.phone || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Department
                            </Typography>
                            <Typography variant="body2">
                              {user.details?.department || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body2">
                              {user.details?.location || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Previous
          </Button>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 150,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleActionMenuClose();
            if (actionMenuUserId) {
              handleExpandRow(actionMenuUserId);
            }
          }}
        >
          <ViewIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleActionMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (actionMenuUserId) {
              setSelectedIds([actionMenuUserId]);
              setDeleteDialogOpen(true);
            }
            handleActionMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Filter Popover */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 250,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Filter Options
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Developer">Developer</MenuItem>
            <MenuItem value="Engineer">Engineer</MenuItem>
            <MenuItem value="Super Admin">Super Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Blocked">Blocked</MenuItem>
            <MenuItem value="Reported">Reported</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilters}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleFilterClose}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            Apply
          </Button>
        </Box>
      </Popover>

      {/* Add New User Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          methods.reset();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add New User</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleAddUser)}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormTextField
                  name="name"
                  label="Full Name"
                  placeholder="Enter full name"
                />
                <FormTextField
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                />
                <FormTextField
                  name="email"
                  label="Email"
                  placeholder="Enter email address"
                  type="email"
                />
                <FormSelect
                  name="role"
                  label="Role"
                  options={[
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Developer', label: 'Developer' },
                    { value: 'Engineer', label: 'Engineer' },
                    { value: 'Super Admin', label: 'Super Admin' },
                  ]}
                />
                <FormSelect
                  name="status"
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Blocked', label: 'Blocked' },
                    { value: 'Reported', label: 'Reported' },
                  ]}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => {
                  setAddDialogOpen(false);
                  methods.reset();
                }}
                color="inherit"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add User
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedIds.length} user
            {selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
