import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Button,
  useTheme,
  alpha,
  Grid,
  TextField,
  InputAdornment,
  Link,
  Chip,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  RemoveRedEye as PageViewIcon,
  TouchApp as EventsIcon,
  PersonOutline as LiveVisitorIcon,
  KeyboardArrowDown as ArrowDownIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  GroupWork as GroupWorkIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { StatCard } from '@/components/common';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Chart data
const dailyChartData = [
  { name: 'Mon', pageView: 4000, uniqueVisitor: 2400 },
  { name: 'Tue', pageView: 3000, uniqueVisitor: 1398 },
  { name: 'Wed', pageView: 2000, uniqueVisitor: 9800 },
  { name: 'Thu', pageView: 2780, uniqueVisitor: 3908 },
  { name: 'Fri', pageView: 1890, uniqueVisitor: 4800 },
  { name: 'Sat', pageView: 2390, uniqueVisitor: 3800 },
  { name: 'Sun', pageView: 3490, uniqueVisitor: 4300 },
];

const monthlyChartData = [
  { name: 'Jan', pageView: 12000, uniqueVisitor: 8400 },
  { name: 'Feb', pageView: 15000, uniqueVisitor: 9398 },
  { name: 'Mar', pageView: 18000, uniqueVisitor: 12800 },
  { name: 'Apr', pageView: 16780, uniqueVisitor: 10908 },
  { name: 'May', pageView: 21890, uniqueVisitor: 14800 },
  { name: 'Jun', pageView: 23390, uniqueVisitor: 16800 },
  { name: 'Jul', pageView: 25490, uniqueVisitor: 18300 },
  { name: 'Aug', pageView: 28000, uniqueVisitor: 20000 },
  { name: 'Sep', pageView: 26500, uniqueVisitor: 19200 },
  { name: 'Oct', pageView: 29000, uniqueVisitor: 21500 },
  { name: 'Nov', pageView: 31000, uniqueVisitor: 23000 },
  { name: 'Dec', pageView: 34000, uniqueVisitor: 25000 },
];

const yearlyChartData = [
  { name: '2019', pageView: 120000, uniqueVisitor: 84000 },
  { name: '2020', pageView: 150000, uniqueVisitor: 93980 },
  { name: '2021', pageView: 180000, uniqueVisitor: 128000 },
  { name: '2022', pageView: 220000, uniqueVisitor: 159080 },
  { name: '2023', pageView: 280000, uniqueVisitor: 198000 },
  { name: '2024', pageView: 340000, uniqueVisitor: 250000 },
];

// HTTP Referrers data
const httpReferrersData = [
  { source: 'Direct', visitors: 16890 },
  { source: 'Google.com', visitors: 4909 },
  { source: 'Youtube.com', visitors: 3890 },
  { source: 'Twitter.com', visitors: 2789 },
  { source: 'Facebook.com', visitors: 1567 },
];

// User Overview chart data (stacked bar chart)
const userOverviewData = [
  { name: 'Jan', activeUser: 65, inactiveUser: 35 },
  { name: 'Feb', activeUser: 70, inactiveUser: 30 },
  { name: 'Mar', activeUser: 55, inactiveUser: 45 },
  { name: 'Apr', activeUser: 80, inactiveUser: 20 },
  { name: 'May', activeUser: 60, inactiveUser: 40 },
  { name: 'Jun', activeUser: 75, inactiveUser: 25 },
  { name: 'Jul', activeUser: 85, inactiveUser: 15 },
  { name: 'Aug', activeUser: 70, inactiveUser: 30 },
  { name: 'Sep', activeUser: 65, inactiveUser: 35 },
  { name: 'Oct', activeUser: 90, inactiveUser: 10 },
  { name: 'Nov', activeUser: 78, inactiveUser: 22 },
  { name: 'Dec', activeUser: 82, inactiveUser: 18 },
];

// Traffic in Device data
const trafficDeviceData = [
  { name: 'Desktop', value: 85 },
  { name: 'Tablet', value: 45 },
  { name: 'Mobile', value: 70 },
];

// Performance tab - Sales Growth chart data
const performanceDailyData = [
  { name: 'Mon', salesGrowth: 40, target: 35 },
  { name: 'Tue', salesGrowth: 55, target: 45 },
  { name: 'Wed', salesGrowth: 35, target: 50 },
  { name: 'Thu', salesGrowth: 70, target: 55 },
  { name: 'Fri', salesGrowth: 50, target: 60 },
  { name: 'Sat', salesGrowth: 80, target: 65 },
  { name: 'Sun', salesGrowth: 60, target: 70 },
];

const performanceMonthlyData = [
  { name: 'Jan', salesGrowth: 45, target: 40 },
  { name: 'Feb', salesGrowth: 55, target: 50 },
  { name: 'Mar', salesGrowth: 65, target: 55 },
  { name: 'Apr', salesGrowth: 50, target: 60 },
  { name: 'May', salesGrowth: 75, target: 65 },
  { name: 'Jun', salesGrowth: 85, target: 70 },
  { name: 'Jul', salesGrowth: 70, target: 72 },
  { name: 'Aug', salesGrowth: 90, target: 75 },
  { name: 'Sep', salesGrowth: 80, target: 78 },
  { name: 'Oct', salesGrowth: 95, target: 80 },
  { name: 'Nov', salesGrowth: 85, target: 82 },
  { name: 'Dec', salesGrowth: 100, target: 85 },
];

const performanceYearlyData = [
  { name: '2019', salesGrowth: 250, target: 220 },
  { name: '2020', salesGrowth: 380, target: 340 },
  { name: '2021', salesGrowth: 520, target: 480 },
  { name: '2022', salesGrowth: 650, target: 600 },
  { name: '2023', salesGrowth: 780, target: 720 },
  { name: '2024', salesGrowth: 920, target: 850 },
];

// Bounce Rate data
const bounceRateData = [
  { name: 'Direct', value: 16890, color: '#606BDF' },
  { name: 'Search', value: 4909, color: '#606BDF' },
  { name: 'Social', value: 550, color: '#606BDF' },
  { name: 'Ads', value: 140, color: '#606BDF' },
  { name: 'Mail', value: 8675, color: '#606BDF' },
  { name: 'Links', value: 4900, color: '#606BDF' },
];

// Performance metric cards data
const performanceMetrics = [
  {
    title: 'Sales',
    value: '$9140.20',
    target: '$8295.50',
    progress: 110, // percentage above target (above 100 means exceeded)
    isAboveTarget: true,
  },
  {
    title: 'Profit',
    value: '$4593.35',
    target: '$4492.25',
    progress: 102,
    isAboveTarget: true,
  },
  {
    title: 'Order',
    value: '23,876k',
    target: '24,926k',
    progress: 96,
    isAboveTarget: false,
  },
];

// User transaction data
const userTransactionData = [
  {
    id: 1,
    name: 'Stacy Reichel',
    avatar: 'SR',
    amount: '$199.00',
    status: 'Success',
    date: '14 May 2024',
    time: '5:00 PM',
  },
  {
    id: 2,
    name: 'Roderi Rohan',
    avatar: 'RR',
    amount: '$267.00',
    status: 'Success',
    date: '12 Jan 2024',
    time: '3:45 PM',
  },
  {
    id: 3,
    name: 'Audrey Leffler',
    avatar: 'AL',
    amount: '$389.00',
    status: 'Cancel',
    date: '04 Apr 2024',
    time: '10:30 AM',
  },
  {
    id: 4,
    name: 'Allison Mose',
    avatar: 'AM',
    amount: '$199.00',
    status: 'Success',
    date: '14 May 2024',
    time: '11:40 AM',
  },
];

export function DashboardPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [referrersAnchorEl, setReferrersAnchorEl] = useState<null | HTMLElement>(null);
  const [referrersTimeRange, setReferrersTimeRange] = useState('Last 7 days');

  // User Behavior tab state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 15)); // 15-Jan-2026
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Performance tab state
  const [performanceTimeRange, setPerformanceTimeRange] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [bounceRateTimeRange, setBounceRateTimeRange] = useState('Last 7 day');
  const [bounceRateAnchorEl, setBounceRateAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'daily' | 'monthly' | 'yearly' | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleReferrersMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setReferrersAnchorEl(event.currentTarget);
  };

  const handleReferrersMenuClose = (option?: string) => {
    if (option) {
      setReferrersTimeRange(option);
    }
    setReferrersAnchorEl(null);
  };

  // Performance tab handlers
  const handlePerformanceTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'daily' | 'monthly' | 'yearly' | null
  ) => {
    if (newTimeRange !== null) {
      setPerformanceTimeRange(newTimeRange);
    }
  };

  const handleBounceRateMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setBounceRateAnchorEl(event.currentTarget);
  };

  const handleBounceRateMenuClose = (option?: string) => {
    if (option) {
      setBounceRateTimeRange(option);
    }
    setBounceRateAnchorEl(null);
  };

  const getPerformanceChartData = () => {
    switch (performanceTimeRange) {
      case 'daily':
        return performanceDailyData;
      case 'yearly':
        return performanceYearlyData;
      default:
        return performanceMonthlyData;
    }
  };

  // User Behavior handlers
  const handleDownload = () => {
    setSnackbarMessage('User data report downloaded successfully!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDateChange = (field: 'day' | 'month' | 'year', value: number) => {
    const newDate = new Date(selectedDate);
    if (field === 'day') {
      newDate.setDate(value);
    } else if (field === 'month') {
      newDate.setMonth(value);
    } else {
      newDate.setFullYear(value);
    }
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
    };
  };

  const filteredTransactions = userTransactionData.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChartData = () => {
    switch (timeRange) {
      case 'monthly':
        return monthlyChartData;
      case 'yearly':
        return yearlyChartData;
      default:
        return dailyChartData;
    }
  };

  const statCards = [
    {
      title: 'Unique Visitors',
      value: '23,876',
      icon: <VisibilityIcon />,
      trend: { value: 24.5, isPositive: true },
      iconBgColor: alpha(theme.palette.primary.main, 0.1),
      iconColor: theme.palette.primary.main,
    },
    {
      title: 'Page View',
      value: '30,450',
      icon: <PageViewIcon />,
      trend: { value: 20.5, isPositive: true },
      iconBgColor: alpha('#4CAF50', 0.1),
      iconColor: '#4CAF50',
    },
    {
      title: 'Events',
      value: '34,789',
      icon: <EventsIcon />,
      trend: { value: 20.5, isPositive: false },
      iconBgColor: alpha('#F5A623', 0.1),
      iconColor: '#F5A623',
    },
    {
      title: 'Live Visitor',
      value: '45,687',
      icon: <LiveVisitorIcon />,
      trend: { value: 24.5, isPositive: true },
      iconBgColor: alpha('#DE3730', 0.1),
      iconColor: '#DE3730',
    },
  ];

  // User Behavior stat cards
  const userBehaviorStatCards = [
    {
      title: 'Total Users',
      value: '23,876',
      icon: <PeopleIcon />,
      trend: { value: 24.5, isPositive: true },
      iconBgColor: alpha(theme.palette.primary.main, 0.1),
      iconColor: theme.palette.primary.main,
    },
    {
      title: 'New Users',
      value: '30,450',
      icon: <PersonAddIcon />,
      trend: { value: 20.5, isPositive: true },
      iconBgColor: alpha('#4CAF50', 0.1),
      iconColor: '#4CAF50',
    },
    {
      title: 'Current Users',
      value: '34,789',
      icon: <GroupWorkIcon />,
      trend: { value: 20.5, isPositive: true },
      iconBgColor: alpha('#F5A623', 0.1),
      iconColor: '#F5A623',
    },
  ];

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Company" />
          <Tab label="Applicant" />
        </Tabs>
      </Box>

      {/* Overview Tab Panel */}
      <TabPanel value={tabValue} index={0}>
        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <StatCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                trend={card.trend}
                iconBgColor={card.iconBgColor}
                iconColor={card.iconColor}
              />
            </Grid>
          ))}
        </Grid>

        {/* Analysis Section */}
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Analyze user engagement and improve your product with real-time analytics.
                    </Typography>
                  </Box>
                  <ToggleButtonGroup
                    value={timeRange}
                    exclusive
                    onChange={handleTimeRangeChange}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="daily">Daily</ToggleButton>
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Chart */}
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        tickFormatter={(value) =>
                          value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                            {value === 'pageView' ? 'Page View' : 'Unique Visitor'}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="pageView"
                        name="pageView"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="uniqueVisitor"
                        name="uniqueVisitor"
                        stroke="#4CAF50"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top HTTP Referrers */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Top HTTP Referrers
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowDownIcon />}
                    onClick={handleReferrersMenuClick}
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    {referrersTimeRange}
                  </Button>
                  <Menu
                    anchorEl={referrersAnchorEl}
                    open={Boolean(referrersAnchorEl)}
                    onClose={() => handleReferrersMenuClose()}
                  >
                    <MenuItem onClick={() => handleReferrersMenuClose('Last 7 days')}>
                      Last 7 days
                    </MenuItem>
                    <MenuItem onClick={() => handleReferrersMenuClose('Last Month')}>
                      Last Month
                    </MenuItem>
                    <MenuItem onClick={() => handleReferrersMenuClose('Last Year')}>
                      Last Year
                    </MenuItem>
                  </Menu>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 1.5,
                          }}
                        >
                          SOURCE
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            py: 1.5,
                          }}
                        >
                          VISITORS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {httpReferrersData.map((row) => (
                        <TableRow key={row.source}>
                          <TableCell
                            sx={{
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              py: 1.5,
                            }}
                          >
                            {row.source}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              py: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            {row.visitors.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* User Behavior Tab Panel */}
      <TabPanel value={tabValue} index={1}>
        {/* Stat Cards Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {userBehaviorStatCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <StatCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                trend={card.trend}
                compareText="vs last month"
                iconBgColor={card.iconBgColor}
                iconColor={card.iconColor}
              />
            </Grid>
          ))}
          {/* Info Card */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  You have increased your net income by{' '}
                  <Typography
                    component="span"
                    sx={{ fontWeight: 700, color: 'success.main' }}
                  >
                    6.2%
                  </Typography>{' '}
                  this month and decreased your expensed by{' '}
                  <Typography
                    component="span"
                    sx={{ fontWeight: 700, color: 'error.main' }}
                  >
                    3.2%
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Overview Section */}
        <Grid container spacing={3}>
          {/* User Overview Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      User Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor visitor behavior to enhance user experience and retention.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Date Picker */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <TextField
                        variant="standard"
                        value={formatDate(selectedDate).day}
                        onChange={(e) => handleDateChange('day', parseInt(e.target.value) || 1)}
                        InputProps={{
                          disableUnderline: true,
                          sx: { width: 24, '& input': { textAlign: 'center', p: 0 } },
                        }}
                        inputProps={{ min: 1, max: 31 }}
                        type="number"
                      />
                      <Typography sx={{ color: 'text.secondary' }}>-</Typography>
                      <TextField
                        variant="standard"
                        value={formatDate(selectedDate).month}
                        InputProps={{
                          disableUnderline: true,
                          readOnly: true,
                          sx: { width: 32, '& input': { textAlign: 'center', p: 0 } },
                        }}
                      />
                      <Typography sx={{ color: 'text.secondary' }}>-</Typography>
                      <TextField
                        variant="standard"
                        value={formatDate(selectedDate).year}
                        onChange={(e) => handleDateChange('year', parseInt(e.target.value) || 2026)}
                        InputProps={{
                          disableUnderline: true,
                          sx: { width: 48, '& input': { textAlign: 'center', p: 0 } },
                        }}
                        type="number"
                      />
                    </Box>
                    {/* Download Button */}
                    <IconButton
                      onClick={handleDownload}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      <DownloadIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Active User
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Inactive User
                    </Typography>
                  </Box>
                </Box>

                {/* Stacked Bar Chart */}
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userOverviewData} barCategoryGap="20%">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      />
                      <Bar
                        dataKey="activeUser"
                        name="Active User"
                        stackId="users"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="inactiveUser"
                        name="Inactive User"
                        stackId="users"
                        fill={alpha(theme.palette.primary.main, 0.3)}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Traffic in Device */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Traffic in Device
                </Typography>
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trafficDeviceData}
                      layout="vertical"
                      barCategoryGap="30%"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        domain={[0, 100]}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value: number) => [`${value}%`, 'Usage']}
                      />
                      <Bar
                        dataKey="value"
                        fill={theme.palette.primary.main}
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Transactions Section */}
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <TextField
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              <Link
                href="#"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                View All
              </Link>
            </Box>

            {/* Transaction Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1.5,
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1.5,
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1.5,
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1.5,
                      }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          py: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              fontSize: '0.875rem',
                            }}
                          >
                            {row.avatar}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          py: 2,
                          fontWeight: 500,
                        }}
                      >
                        {row.amount}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          py: 2,
                        }}
                      >
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            bgcolor:
                              row.status === 'Success'
                                ? alpha('#4CAF50', 0.1)
                                : alpha('#DE3730', 0.1),
                            color: row.status === 'Success' ? '#4CAF50' : '#DE3730',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          py: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.time}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Snackbar for download notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </TabPanel>

      {/* Performance Tab Panel */}
      <TabPanel value={tabValue} index={2}>
        {/* Performance Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {performanceMetrics.map((metric, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    {metric.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {metric.value}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(metric.progress, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(metric.isAboveTarget ? '#22892F' : '#DE3730', 0.15),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: metric.isAboveTarget ? '#22892F' : '#DE3730',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Target: {metric.target}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Stats and Chart Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {/* Stats Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      2680.50k
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#22892F', fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: '#22892F', fontWeight: 600 }}
                      >
                        +60.5%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total sales growth and target
                    </Typography>
                  </Box>
                  <ToggleButtonGroup
                    value={performanceTimeRange}
                    exclusive
                    onChange={handlePerformanceTimeRangeChange}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="daily">Daily</ToggleButton>
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#606BDF',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Sales Growth
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: alpha('#606BDF', 0.3),
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Target
                    </Typography>
                  </Box>
                </Box>

                {/* Sales Growth Line Chart */}
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getPerformanceChartData()}>
                      <defs>
                        <linearGradient id="salesGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#606BDF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#606BDF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                        labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="salesGrowth"
                        name="Sales Growth"
                        stroke="#606BDF"
                        strokeWidth={2}
                        fill="url(#salesGrowthGradient)"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke={alpha('#606BDF', 0.4)}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Bounce Rate Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Bounce Rate
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowDownIcon />}
                    onClick={handleBounceRateMenuClick}
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    {bounceRateTimeRange}
                  </Button>
                  <Menu
                    anchorEl={bounceRateAnchorEl}
                    open={Boolean(bounceRateAnchorEl)}
                    onClose={() => handleBounceRateMenuClose()}
                  >
                    <MenuItem onClick={() => handleBounceRateMenuClose('Last 7 day')}>
                      Last 7 day
                    </MenuItem>
                    <MenuItem onClick={() => handleBounceRateMenuClose('Last Month')}>
                      Last Month
                    </MenuItem>
                    <MenuItem onClick={() => handleBounceRateMenuClose('Last Year')}>
                      Last Year
                    </MenuItem>
                  </Menu>
                </Box>

                {/* Bounce Rate Horizontal Bars */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {bounceRateData.map((item) => {
                    const maxValue = Math.max(...bounceRateData.map((d) => d.value));
                    const percentage = (item.value / maxValue) * 100;
                    return (
                      <Box key={item.name}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.value.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha('#606BDF', 0.15),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: '#606BDF',
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sale Mapping by Country Section */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Sale Mapping by Country
                </Typography>

                {/* World Map Placeholder - Using a stylized representation */}
                <Box
                  sx={{
                    height: 300,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    mb: 2,
                  }}
                >
                  {/* Simple world map representation using SVG */}
                  <svg
                    viewBox="0 0 1000 500"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: 800,
                    }}
                  >
                    {/* North America */}
                    <path
                      d="M150 100 L280 80 L320 150 L280 200 L200 220 L150 180 Z"
                      fill={alpha('#606BDF', 0.7)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* South America */}
                    <path
                      d="M220 250 L280 260 L290 350 L250 420 L200 380 L210 300 Z"
                      fill={alpha('#606BDF', 0.4)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* Europe */}
                    <path
                      d="M450 80 L520 70 L540 120 L500 150 L450 130 Z"
                      fill={alpha('#606BDF', 0.8)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* Africa */}
                    <path
                      d="M460 180 L530 170 L560 280 L520 360 L460 320 L450 240 Z"
                      fill={alpha('#606BDF', 0.3)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* Asia */}
                    <path
                      d="M550 60 L750 50 L800 150 L700 200 L600 180 L560 120 Z"
                      fill={alpha('#606BDF', 0.6)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* Australia */}
                    <path
                      d="M750 320 L830 310 L850 370 L800 400 L750 380 Z"
                      fill={alpha('#606BDF', 0.5)}
                      stroke={alpha('#606BDF', 0.3)}
                      strokeWidth="1"
                    />
                    {/* Hot spots / markers */}
                    <circle cx="200" cy="150" r="8" fill="#22892F" />
                    <circle cx="490" cy="110" r="10" fill="#22892F" />
                    <circle cx="650" cy="120" r="8" fill="#606BDF" />
                    <circle cx="500" cy="270" r="6" fill={alpha('#606BDF', 0.5)} />
                    <circle cx="790" cy="350" r="6" fill={alpha('#606BDF', 0.5)} />
                  </svg>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#22892F',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Very high level of orders
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#606BDF',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      High level of orders
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: alpha('#606BDF', 0.4),
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Average level of orders
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Revenue Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  Total Revenue
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  $4593.35
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: '#22892F', fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#22892F', fontWeight: 600 }}
                  >
                    +24.5%
                  </Typography>
                </Box>

                {/* Mini Revenue Chart */}
                <Box sx={{ height: 150, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: 'Jan', value: 30 },
                        { name: 'Feb', value: 45 },
                        { name: 'Mar', value: 35 },
                        { name: 'Apr', value: 60 },
                        { name: 'May', value: 50 },
                        { name: 'Jun', value: 75 },
                        { name: 'Jul', value: 65 },
                        { name: 'Aug', value: 85 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#606BDF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#606BDF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#606BDF"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
