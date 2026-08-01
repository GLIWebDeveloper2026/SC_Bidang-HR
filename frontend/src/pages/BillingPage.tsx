import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Link,
  Breadcrumbs,
  Radio,
  RadioGroup,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  NavigateNext as NavigateNextIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Types
interface Invoice {
  id: string;
  invoiceNumber: string;
  plan: 'Starter' | 'Basic' | 'Enterprise';
  customerName: string;
  customerUsername: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Scheduled';
  isSpecial?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: '#HD20392WL5D',
    plan: 'Starter',
    customerName: 'Henry Ward',
    customerUsername: 'henryward_123',
    amount: 267.0,
    date: '2025-12-19',
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: '#HD20393WL6E',
    plan: 'Basic',
    customerName: 'Ella Bell',
    customerUsername: 'ellabell_456',
    amount: 699.0,
    date: '2025-12-19',
    status: 'Scheduled',
  },
  {
    id: '3',
    invoiceNumber: '#HD20394WL7F',
    plan: 'Enterprise',
    customerName: 'Benjamin Cooper',
    customerUsername: 'benjamincooper',
    amount: 389.0,
    date: '2025-12-19',
    status: 'Paid',
    isSpecial: true,
  },
  {
    id: '4',
    invoiceNumber: '#HD20395WL8G',
    plan: 'Starter',
    customerName: 'Harper Rogers',
    customerUsername: 'harperrogers_99',
    amount: 267.0,
    date: '2025-12-19',
    status: 'Paid',
  },
  {
    id: '5',
    invoiceNumber: '#HD20396WL9H',
    plan: 'Basic',
    customerName: 'Lucas Murphy',
    customerUsername: 'lucasmurphy_xyz',
    amount: 699.0,
    date: '2025-12-19',
    status: 'Scheduled',
  },
  {
    id: '6',
    invoiceNumber: '#HD20397WL0I',
    plan: 'Enterprise',
    customerName: 'Amelia Rivera',
    customerUsername: 'ameliarivera_00',
    amount: 389.0,
    date: '2025-12-19',
    status: 'Paid',
  },
  {
    id: '7',
    invoiceNumber: '#HD20398WL1J',
    plan: 'Starter',
    customerName: 'Logan Perez',
    customerUsername: 'loganperez_abc',
    amount: 267.0,
    date: '2025-12-19',
    status: 'Scheduled',
  },
];

// Available plans
const availablePlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Basic features for individuals',
    price: 267,
    features: ['Dashboard Access', 'Basic Reports'],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Dashboard Access, Notifications',
    price: 699,
    features: ['Dashboard Access', 'Notifications', 'Priority Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full features for large teams',
    price: 389,
    features: ['Dashboard Access', 'Notifications', 'Priority Support', 'Custom Integrations'],
  },
];

// Current plan (initially Basic)
const currentPlanData = {
  name: 'Basic',
  description: 'Dashboard Access, Notifications',
  price: 699,
};

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

export function BillingPage() {
  const theme = useTheme();

  // State
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlan, setCurrentPlan] = useState(currentPlanData);

  // Filter states
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Dialog states
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan.name.toLowerCase());

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('success');

  // Filtering logic
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.customerName.toLowerCase().includes(query) ||
          invoice.customerUsername.toLowerCase().includes(query)
      );
    }

    // Apply plan filter
    if (filterPlan !== 'all') {
      result = result.filter((invoice) => invoice.plan === filterPlan);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((invoice) => invoice.status === filterStatus);
    }

    return result;
  }, [invoices, searchQuery, filterPlan, filterStatus]);

  // Handlers
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

  const handleChangePlanOpen = () => {
    setSelectedPlan(currentPlan.name.toLowerCase());
    setChangePlanDialogOpen(true);
  };

  const handleChangePlanClose = () => {
    setChangePlanDialogOpen(false);
  };

  const handlePlanChange = () => {
    const newPlan = availablePlans.find((p) => p.id === selectedPlan);
    if (newPlan) {
      setCurrentPlan({
        name: newPlan.name,
        description: newPlan.description,
        price: newPlan.price,
      });
      setSnackbarMessage(`Successfully changed to ${newPlan.name} plan!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    setChangePlanDialogOpen(false);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    setSnackbarMessage(`Downloading invoice ${invoice.invoiceNumber}...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleInvoiceClick = (invoiceNumber: string) => {
    setSnackbarMessage(`Viewing invoice ${invoiceNumber}`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: '0.875rem' }}
        >
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          Billing
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 3,
        }}
      >
        Billing
      </Typography>

      {/* Current Plan Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            p: 3,
            '&:last-child': { pb: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Settings Icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon sx={{ color: theme.palette.primary.main }} />
            </Box>
            {/* Plan Details */}
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {currentPlan.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentPlan.description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Price */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              ${currentPlan.price} USD
            </Typography>
            {/* Change Plan Button */}
            <Button
              variant="contained"
              onClick={handleChangePlanOpen}
              sx={{
                bgcolor: theme.palette.primary.main,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
              }}
            >
              Change Plan
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Invoice Table Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        {/* Search input */}
        <TextField
          placeholder="Search invoices..."
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
            minWidth: 250,
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
            label="Filters active"
            size="small"
            onDelete={clearFilters}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Invoice Table */}
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
              <TableCell sx={{ fontWeight: 600 }}>Invoice</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Due/Paid Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Billing Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 60 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => handleInvoiceClick(invoice.invoiceNumber)}
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{invoice.plan}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {invoice.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: 'text.primary' }}
                        >
                          {invoice.customerName}
                        </Typography>
                        {invoice.isSpecial && (
                          <StarIcon
                            sx={{
                              fontSize: 16,
                              color: '#F5A623',
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {invoice.customerUsername}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPrice(invoice.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(invoice.date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={
                      invoice.status === 'Paid' ? (
                        <CheckCircleIcon sx={{ fontSize: '16px !important' }} />
                      ) : (
                        <ScheduleIcon sx={{ fontSize: '16px !important' }} />
                      )
                    }
                    label={invoice.status}
                    size="small"
                    color={invoice.status === 'Paid' ? 'success' : 'warning'}
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
                    onClick={() => handleDownloadInvoice(invoice)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No results message */}
      {filteredInvoices.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            color: 'text.secondary',
          }}
        >
          <Typography>No invoices found matching your criteria.</Typography>
        </Box>
      )}

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

      {/* Change Plan Dialog */}
      <Dialog
        open={changePlanDialogOpen}
        onClose={handleChangePlanClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Change Your Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a plan that best fits your needs. Changes will take effect immediately.
          </Typography>
          <RadioGroup
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            {availablePlans.map((plan) => (
              <Card
                key={plan.id}
                sx={{
                  mb: 2,
                  border: '2px solid',
                  borderColor:
                    selectedPlan === plan.id
                      ? 'primary.main'
                      : 'divider',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor:
                      selectedPlan === plan.id
                        ? 'primary.main'
                        : alpha(theme.palette.primary.main, 0.3),
                  },
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <FormControlLabel
                        value={plan.id}
                        control={<Radio />}
                        label=""
                        sx={{ m: 0, mr: -1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.description}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {plan.features.map((feature) => (
                            <Chip
                              key={feature}
                              label={feature}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      ${plan.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleChangePlanClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePlanChange}
            disabled={selectedPlan === currentPlan.name.toLowerCase()}
          >
            Change Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
