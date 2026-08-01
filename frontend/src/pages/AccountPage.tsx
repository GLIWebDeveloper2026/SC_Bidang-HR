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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  KeyboardArrowRight as ArrowRightIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIconSort,
  Block as BlockIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField, FormSelect } from '@/components/forms';

// Types
interface Account {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  plan: 'Starter' | 'Basic' | 'Enterprise';
  createdDate: string;
  pricing: number;
  billingStatus: 'Paid' | 'Scheduled';
  isBlocked?: boolean;
  details?: {
    email: string;
    phone: string;
    address: string;
  };
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'plan' | 'createdDate' | 'pricing' | 'billingStatus';

// Mock data based on specification
const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Eli Foster',
    username: 'elifoster_555',
    plan: 'Starter',
    createdDate: '2026-01-22',
    pricing: 267.0,
    billingStatus: 'Paid',
    details: {
      email: 'eli.foster@email.com',
      phone: '+1 234 567 890',
      address: '123 Main St, New York, NY',
    },
  },
  {
    id: '2',
    name: 'Grace Parker',
    username: 'graceparker777',
    plan: 'Basic',
    createdDate: '2026-01-08',
    pricing: 699.0,
    billingStatus: 'Scheduled',
    details: {
      email: 'grace.parker@email.com',
      phone: '+1 234 567 891',
      address: '456 Oak Ave, Los Angeles, CA',
    },
  },
  {
    id: '3',
    name: 'Caleb Turner',
    username: 'calebturner321',
    plan: 'Enterprise',
    createdDate: '2026-01-25',
    pricing: 389.0,
    billingStatus: 'Paid',
    details: {
      email: 'caleb.turner@email.com',
      phone: '+1 234 567 892',
      address: '789 Pine Rd, Chicago, IL',
    },
  },
  {
    id: '4',
    name: 'Ella Evans',
    username: 'ellaevans_007',
    plan: 'Starter',
    createdDate: '2025-12-31',
    pricing: 899.0,
    billingStatus: 'Paid',
    details: {
      email: 'ella.evans@email.com',
      phone: '+1 234 567 893',
      address: '321 Elm St, Houston, TX',
    },
  },
  {
    id: '5',
    name: 'Lucas Young',
    username: 'lucasyoung_123',
    plan: 'Basic',
    createdDate: '2026-01-20',
    pricing: 199.0,
    billingStatus: 'Scheduled',
    details: {
      email: 'lucas.young@email.com',
      phone: '+1 234 567 894',
      address: '654 Maple Dr, Phoenix, AZ',
    },
  },
  {
    id: '6',
    name: 'Mia Scott',
    username: 'miascott_xyz99',
    plan: 'Enterprise',
    createdDate: '2026-01-12',
    pricing: 999.0,
    billingStatus: 'Paid',
    details: {
      email: 'mia.scott@email.com',
      phone: '+1 234 567 895',
      address: '987 Cedar Ln, Philadelphia, PA',
    },
  },
  {
    id: '7',
    name: 'Noah Reed',
    username: 'noahreed_abc12',
    plan: 'Starter',
    createdDate: '2026-01-18',
    pricing: 267.0,
    billingStatus: 'Scheduled',
    details: {
      email: 'noah.reed@email.com',
      phone: '+1 234 567 896',
      address: '147 Birch Blvd, San Antonio, TX',
    },
  },
  {
    id: '8',
    name: 'Ava Morgan',
    username: 'avamorgan_off',
    plan: 'Basic',
    createdDate: '2026-01-03',
    pricing: 699.0,
    billingStatus: 'Paid',
    isBlocked: true,
    details: {
      email: 'ava.morgan@email.com',
      phone: '+1 234 567 897',
      address: '258 Willow Way, San Diego, CA',
    },
  },
  {
    id: '9',
    name: 'Jason Cruz',
    username: 'jasoncruz_2025',
    plan: 'Enterprise',
    createdDate: '2026-01-23',
    pricing: 389.0,
    billingStatus: 'Paid',
    details: {
      email: 'jason.cruz@email.com',
      phone: '+1 234 567 898',
      address: '369 Palm Ct, Dallas, TX',
    },
  },
  {
    id: '10',
    name: 'Chloe Murphy',
    username: 'chloemurphy444',
    plan: 'Starter',
    createdDate: '2026-01-06',
    pricing: 899.0,
    billingStatus: 'Scheduled',
    details: {
      email: 'chloe.murphy@email.com',
      phone: '+1 234 567 899',
      address: '741 Spruce St, San Jose, CA',
    },
  },
];

// Form schema for Add New Account
const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  plan: z.enum(['Starter', 'Basic', 'Enterprise']),
  pricing: z.number().min(0, 'Pricing must be positive'),
});

type AccountFormData = z.infer<typeof accountSchema>;

// Helper functions
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export function AccountPage() {
  // State
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
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
  const [actionMenuAccountId, setActionMenuAccountId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter states
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form
  const methods = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      plan: 'Starter',
      pricing: 267,
    },
  });

  // Filtering logic
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (account) =>
          account.name.toLowerCase().includes(query) ||
          account.username.toLowerCase().includes(query)
      );
    }

    // Apply plan filter
    if (filterPlan !== 'all') {
      result = result.filter((account) => account.plan === filterPlan);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((account) => account.billingStatus === filterStatus);
    }

    // Apply sorting
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'plan':
            comparison = a.plan.localeCompare(b.plan);
            break;
          case 'createdDate':
            comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
            break;
          case 'pricing':
            comparison = a.pricing - b.pricing;
            break;
          case 'billingStatus':
            comparison = a.billingStatus.localeCompare(b.billingStatus);
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [accounts, searchQuery, filterPlan, filterStatus, sortField, sortDirection]);

  // Pagination
  const paginatedAccounts = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAccounts, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedAccounts.map((a) => a.id));
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
    setActionMenuAccountId(id);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setActionMenuAccountId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    setAccounts((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    setDeleteDialogOpen(false);
  };

  const handleAddAccount = (data: AccountFormData) => {
    const newAccount: Account = {
      id: String(Date.now()),
      name: data.name,
      username: data.username,
      plan: data.plan,
      createdDate: new Date().toISOString().split('T')[0],
      pricing: data.pricing,
      billingStatus: 'Scheduled',
      details: {
        email: data.email,
        phone: '',
        address: '',
      },
    };
    setAccounts((prev) => [newAccount, ...prev]);
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
    setFilterPlan('all');
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
    paginatedAccounts.length > 0 &&
    paginatedAccounts.every((a) => selectedIds.includes(a.id));
  const isSomeSelected =
    selectedIds.length > 0 && !isAllSelected;

  return (
    <Box>
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
          Account
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 2.5,
            py: 1,
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
        {(filterPlan !== 'all' || filterStatus !== 'all') && (
          <Chip
            label={`Filters active`}
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
                onClick={() => handleSort('plan')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Plan
                  {getSortIcon('plan')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('createdDate')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Created Date
                  {getSortIcon('createdDate')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('pricing')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Pricing (in USD)
                  {getSortIcon('pricing')}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort('billingStatus')}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  userSelect: 'none',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Billing Status
                  {getSortIcon('billingStatus')}
                </Box>
              </TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAccounts.map((account) => (
              <>
                <TableRow
                  key={account.id}
                  hover
                  selected={selectedIds.includes(account.id)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(account.id)}
                      onChange={() => handleSelectOne(account.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 48 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandRow(account.id)}
                      sx={{
                        transition: 'transform 0.2s',
                        transform: expandedRows.includes(account.id)
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
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {account.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: 'text.primary' }}
                          >
                            {account.name}
                          </Typography>
                          {account.isBlocked && (
                            <Tooltip title="This account is blocked">
                              <BlockIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'error.main',
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {account.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{account.plan}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(account.createdDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPrice(account.pricing)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        account.billingStatus === 'Paid' ? (
                          <CheckCircleIcon sx={{ fontSize: '16px !important' }} />
                        ) : (
                          <ScheduleIcon sx={{ fontSize: '16px !important' }} />
                        )
                      }
                      label={account.billingStatus}
                      size="small"
                      color={account.billingStatus === 'Paid' ? 'success' : 'warning'}
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          ml: 0.5,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, account.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {/* Expanded row content */}
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 0, borderBottom: expandedRows.includes(account.id) ? undefined : 'none' }}>
                    <Collapse in={expandedRows.includes(account.id)} timeout="auto" unmountOnExit>
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
                          Account Details
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">
                              {account.details?.email || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body2">
                              {account.details?.phone || 'N/A'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body2">
                              {account.details?.address || 'N/A'}
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

      {/* Footer note about blocked icon */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BlockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          This icon represents accounts who are currently blocked.
        </Typography>
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
            if (actionMenuAccountId) {
              handleExpandRow(actionMenuAccountId);
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
            if (actionMenuAccountId) {
              setSelectedIds([actionMenuAccountId]);
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
          <InputLabel>Plan</InputLabel>
          <Select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            label="Plan"
          >
            <MenuItem value="all">All Plans</MenuItem>
            <MenuItem value="Starter">Starter</MenuItem>
            <MenuItem value="Basic">Basic</MenuItem>
            <MenuItem value="Enterprise">Enterprise</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Billing Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Billing Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
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

      {/* Add New Account Dialog */}
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
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Account</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleAddAccount)}>
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
                  name="plan"
                  label="Plan"
                  options={[
                    { value: 'Starter', label: 'Starter' },
                    { value: 'Basic', label: 'Basic' },
                    { value: 'Enterprise', label: 'Enterprise' },
                  ]}
                />
                <FormTextField
                  name="pricing"
                  label="Pricing (USD)"
                  type="number"
                  placeholder="Enter pricing"
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
                Add Account
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
            Are you sure you want to delete {selectedIds.length} account
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
