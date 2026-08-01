import { useMemo, useState, type ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  School as SchoolIcon,
  WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '@/components/common';

type TrendRange = '6months' | '12months';
type ApplicationStatus = 'IN_PROGRESS' | 'HIRED' | 'REJECTED';

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}

interface RecentApplication {
  id: string;
  applicant: string;
  initials: string;
  major: string;
  position: string;
  company: string;
  submittedAt: string;
  status: ApplicationStatus;
}

const applicationTrendData = [
  { month: 'Sep', lowongan: 14, applications: 154 },
  { month: 'Okt', lowongan: 18, applications: 188 },
  { month: 'Nov', lowongan: 16, applications: 216 },
  { month: 'Des', lowongan: 21, applications: 246 },
  { month: 'Jan', lowongan: 24, applications: 292 },
  { month: 'Feb', lowongan: 22, applications: 264 },
  { month: 'Mar', lowongan: 27, applications: 318 },
  { month: 'Apr', lowongan: 29, applications: 346 },
  { month: 'Mei', lowongan: 31, applications: 402 },
  { month: 'Jun', lowongan: 35, applications: 438 },
  { month: 'Jul', lowongan: 39, applications: 504 },
  { month: 'Agu', lowongan: 42, applications: 568 },
];

const applicationStatusData = [
  { name: 'Dalam proses', jumlah: 806, color: '#606BDF' },
  { name: 'Diterima', jumlah: 286, color: '#4CAF50' },
  { name: 'Ditolak', jumlah: 194, color: '#DE3730' },
];

const companyVerificationData = [
  { name: 'Terverifikasi', value: 38, color: '#4CAF50' },
  { name: 'Menunggu', value: 9, color: '#F5A623' },
  { name: 'Ditolak', value: 3, color: '#DE3730' },
];

const campusApplicationData = [
  { name: 'Universitas Indonesia', jumlah: 246 },
  { name: 'Institut Teknologi Bandung', jumlah: 198 },
  { name: 'Universitas Gadjah Mada', jumlah: 174 },
  { name: 'Universitas Airlangga', jumlah: 132 },
  { name: 'Universitas Brawijaya', jumlah: 96 },
];

const topRecruitments = [
  {
    title: 'Frontend Developer',
    company: 'PT Teknologi Maju',
    applications: 86,
    quota: 5,
    status: 'Aktif',
  },
  {
    title: 'Digital Marketing Specialist',
    company: 'PT Nusantara Kreatif',
    applications: 72,
    quota: 3,
    status: 'Aktif',
  },
  {
    title: 'Data Analyst',
    company: 'PT Satu Data Indonesia',
    applications: 64,
    quota: 4,
    status: 'Aktif',
  },
  {
    title: 'Human Resources Staff',
    company: 'PT Mitra Talenta',
    applications: 51,
    quota: 2,
    status: 'Aktif',
  },
];

const recentApplications: RecentApplication[] = [
  {
    id: 'APP-1028',
    applicant: 'Dimas Pratama',
    initials: 'DP',
    major: 'Teknik Informatika',
    position: 'Frontend Developer',
    company: 'PT Teknologi Maju',
    submittedAt: 'Hari ini, 09:42',
    status: 'IN_PROGRESS',
  },
  {
    id: 'APP-1027',
    applicant: 'Alya Maharani',
    initials: 'AM',
    major: 'Manajemen',
    position: 'Digital Marketing Specialist',
    company: 'PT Nusantara Kreatif',
    submittedAt: '31 Jul 2026, 16:20',
    status: 'HIRED',
  },
  {
    id: 'APP-1026',
    applicant: 'Rizky Ramadhan',
    initials: 'RR',
    major: 'Sistem Informasi',
    position: 'Data Analyst',
    company: 'PT Satu Data Indonesia',
    submittedAt: '31 Jul 2026, 14:05',
    status: 'IN_PROGRESS',
  },
  {
    id: 'APP-1025',
    applicant: 'Nabila Putri',
    initials: 'NP',
    major: 'Psikologi',
    position: 'Human Resources Staff',
    company: 'PT Mitra Talenta',
    submittedAt: '30 Jul 2026, 11:18',
    status: 'REJECTED',
  },
];

const pendingCompanies = [
  { name: 'PT Inovasi Bersama', email: 'hr@inovasibersama.id', submittedAt: '31 Jul 2026' },
  { name: 'CV Kreasi Digital', email: 'talent@kreasidigital.id', submittedAt: '30 Jul 2026' },
  { name: 'PT Solusi Edukasi', email: 'people@solusiedukasi.id', submittedAt: '29 Jul 2026' },
];

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; color: 'primary' | 'success' | 'error' }
> = {
  IN_PROGRESS: { label: 'Dalam proses', color: 'primary' },
  HIRED: { label: 'Diterima', color: 'success' },
  REJECTED: { label: 'Ditolak', color: 'error' },
};

function ChartCard({ title, subtitle, action, children }: ChartCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const theme = useTheme();
  const [trendRange, setTrendRange] = useState<TrendRange>('6months');

  const visibleTrendData = useMemo(
    () => (trendRange === '6months' ? applicationTrendData.slice(-6) : applicationTrendData),
    [trendRange]
  );

  const statCards = [
    {
      title: 'Total Lowongan',
      value: '42',
      icon: <WorkOutlineIcon />,
      trend: { value: 12.4, isPositive: true },
      iconBgColor: alpha(theme.palette.primary.main, 0.12),
      iconColor: theme.palette.primary.main,
    },
    {
      title: 'Lowongan Aktif',
      value: '27',
      icon: <AssignmentTurnedInIcon />,
      trend: { value: 8.2, isPositive: true },
      iconBgColor: alpha(theme.palette.success.main, 0.12),
      iconColor: theme.palette.success.main,
    },
    {
      title: 'Total Lamaran',
      value: '1.286',
      icon: <HourglassEmptyIcon />,
      trend: { value: 18.9, isPositive: true },
      iconBgColor: alpha(theme.palette.warning.main, 0.14),
      iconColor: theme.palette.warning.dark,
    },
    {
      title: 'Perusahaan Terverifikasi',
      value: '38',
      icon: <BusinessIcon />,
      trend: { value: 6.5, isPositive: true },
      iconBgColor: alpha(theme.palette.info.main, 0.12),
      iconColor: theme.palette.info.main,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pantau aktivitas recruitment, perusahaan, kampus, dan lamaran secara ringkas.
          </Typography>
        </Box>
        <Chip
          icon={<AssignmentTurnedInIcon />}
          label="Data dummy • 1 Agu 2026"
          color="info"
          variant="outlined"
          sx={{ flexShrink: 0 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={card.title}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              compareText="dibanding bulan lalu"
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
            />
          </Grid>
        ))}
      </Grid>

      <Alert
        severity="info"
        variant="outlined"
        sx={{ mb: 3, alignItems: 'center', '& .MuiAlert-message': { py: 0.25 } }}
      >
        Dashboard ini menggunakan data dummy. Saat API siap, data dapat dihubungkan ke endpoint recruitment, company, campus, dan applications.
      </Alert>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartCard
            title="Tren Recruitment"
            subtitle="Perbandingan lowongan yang dibuat dan lamaran yang masuk"
            action={
              <ToggleButtonGroup
                value={trendRange}
                exclusive
                size="small"
                onChange={(_, value: TrendRange | null) => value && setTrendRange(value)}
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                    fontSize: '0.75rem',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  },
                }}
              >
                <ToggleButton value="6months">6 Bulan</ToggleButton>
                <ToggleButton value="12months">12 Bulan</ToggleButton>
              </ToggleButtonGroup>
            }
          >
            <Box sx={{ height: { xs: 280, md: 330 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleTrendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="recruitmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : `${value}`)}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value, name) => [
                      formatNumber(Number(value)),
                      name === 'applications' ? 'Lamaran' : 'Lowongan',
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (value === 'applications' ? 'Lamaran' : 'Lowongan')}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke={theme.palette.primary.main}
                    fill="url(#applicationsGradient)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lowongan"
                    stroke={theme.palette.success.main}
                    fill="url(#recruitmentGradient)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ChartCard title="Status Lamaran" subtitle="Distribusi status seluruh lamaran">
            <Box sx={{ height: { xs: 280, md: 330 } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationStatusData}
                  layout="vertical"
                  margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                    tickFormatter={(value: number) => formatNumber(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={92}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value) => [formatNumber(Number(value)), 'Lamaran']}
                  />
                  <Bar dataKey="jumlah" radius={[0, 5, 5, 0]} barSize={28}>
                    {applicationStatusData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <ChartCard title="Verifikasi Perusahaan" subtitle="Status perusahaan yang terdaftar di sistem">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 3 },
                minHeight: 260,
              }}
            >
              <Box sx={{ width: '55%', height: 240, minWidth: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={companyVerificationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {companyVerificationData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                      formatter={(value) => [formatNumber(Number(value)), 'Perusahaan']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ flex: 1 }}>
                {companyVerificationData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: item.color, mr: 1 }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <ChartCard
            title="Pelamar Berdasarkan Kampus"
            subtitle="Lima kampus dengan jumlah pelamar terbanyak"
            action={
              <Button
                component={RouterLink}
                to="/master/kampus"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{ color: 'primary.main', flexShrink: 0 }}
              >
                Lihat kampus
              </Button>
            }
          >
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={campusApplicationData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 12, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={152}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(value) => [formatNumber(Number(value)), 'Pelamar']}
                  />
                  <Bar dataKey="jumlah" fill={theme.palette.info.main} radius={[0, 5, 5, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ChartCard
            title="Lowongan Paling Diminati"
            subtitle="Lowongan dengan jumlah lamaran terbanyak"
            action={
              <Button
                component={RouterLink}
                to="/lowongan"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{ color: 'primary.main', flexShrink: 0 }}
              >
                Semua lowongan
              </Button>
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {topRecruitments.map((recruitment, index) => (
                <Box
                  key={recruitment.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    borderBottom: index < topRecruitments.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      flexShrink: 0,
                    }}
                  >
                    <WorkOutlineIcon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {recruitment.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {recruitment.company} • Kuota {recruitment.quota}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {recruitment.applications}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      lamaran
                    </Typography>
                  </Box>
                  <Chip label={recruitment.status} color="success" size="small" variant="outlined" />
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <ChartCard
            title="Perusahaan Menunggu Verifikasi"
            subtitle="Pendaftaran perusahaan terbaru"
            action={
              <Button
                component={RouterLink}
                to="/master/perusahaan"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={{ color: 'primary.main', flexShrink: 0 }}
              >
                Kelola
              </Button>
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {pendingCompanies.map((company) => (
                <Box key={company.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(theme.palette.warning.main, 0.14),
                      color: 'warning.dark',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {company.name
                      .replace(/^(PT|CV)\s+/i, '')
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {company.email}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Chip label="Menunggu" color="warning" size="small" />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {company.submittedAt}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 2.5,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Lamaran Terbaru
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktivitas lamaran yang masuk ke sistem paling baru.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/lamaran"
              size="small"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{ color: 'primary.main' }}
            >
              Lihat semua lamaran
            </Button>
          </Box>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, pl: 0 }}>Pelamar</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Lowongan</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Perusahaan</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tanggal</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentApplications.map((application) => {
                  const status = applicationStatusConfig[application.status];

                  return (
                    <TableRow key={application.id} hover>
                      <TableCell sx={{ pl: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: alpha(theme.palette.primary.main, 0.12),
                              color: 'primary.main',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {application.initials}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {application.applicant}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {application.major}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{application.position}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {application.company}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {application.submittedAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={status.label} color={status.color} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="caption" color="text.secondary">
          Ringkasan ini disiapkan untuk kebutuhan monitoring Admin BKK dan dapat diganti dengan data API real-time.
        </Typography>
        <SchoolIcon sx={{ fontSize: 16, color: 'text.disabled', ml: 'auto' }} />
      </Box>
    </Box>
  );
}
