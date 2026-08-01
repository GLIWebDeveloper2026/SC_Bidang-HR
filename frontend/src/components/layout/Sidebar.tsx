import {
  Box,
  Drawer,
  List,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  MoreHoriz as MoreHorizIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import { NavItem } from './NavItem';
import { useAuth } from '@/hooks';

export const DRAWER_WIDTH = 254;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

export function Sidebar({ open, onClose, variant }: SidebarProps) {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.name || user?.email || 'User';

  const mainNavItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      label: 'Lowongan',
      path: '/lowongan',
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: 'Lamaran',
      path: '/lamaran',
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: 'User',
      path: '/user',
      icon: <GroupIcon fontSize="small" />,
    },
    // {
    //   label: 'Billing',
    //   path: '/billing',
    //   icon: <ReceiptIcon fontSize="small" />,
    // },
    // {
    //   label: 'Blog',
    //   path: '/blog',
    //   icon: <ArticleIcon fontSize="small" />,
    // },
    {
      label: 'Setting',
      path: '/settings',
      icon: <SettingsIcon fontSize="small" />,
    },
  ];

  const masterChildren = [
    { label: 'Perusahaan', path: '/master/perusahaan' },
    { label: 'Kampus', path: '/master/kampus' },
    { label: 'Level User', path: '/master/level-user' },
  ];

  const pageChildren = [
    { label: 'Authentication', path: '/pages/auth' },
    { label: 'Onboarding', path: '/pages/onboarding' },
    { label: 'Sample Page', path: '/pages/sample' },
  ];

  const otherChildren = [
    { label: 'Changelog', path: '/changelog' },
    { label: 'Documentation', path: '/documentation' },
    { label: 'Support', path: '/support' },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 2,
          minHeight: 76,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5,
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            S
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.5px',
          }}
        >
          KerjaKink
        </Typography>
      </Box>

      {/* User Profile Card */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.02)'
                : 'rgba(255, 255, 255, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 1.5, flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
              }}
            >
              {user?.role || 'Super Admin'}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Manage Section */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            px: 1.5,
          }}
        >
          Manage
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
        <List component="nav" disablePadding>
          {mainNavItems.map((item) => (
            <NavItem
              key={item.path}
              label={item.label}
              path={item.path}
              icon={item.icon}
            />
          ))}
        </List>

        <List component="nav" disablePadding sx={{ mt: 1 }}>
          <NavItem
            label="Master"
            icon={<FolderIcon fontSize="small" />}
            children={masterChildren}
          />
        </List>

        <List component="nav" disablePadding sx={{ mt: 1 }}>
          <NavItem
            label="Page"
            icon={<DescriptionIcon fontSize="small" />}
            children={pageChildren}
          />
          <NavItem
            label="Other"
            icon={<MoreHorizIcon fontSize="small" />}
            children={otherChildren}
          />
        </List>

        <List component="nav" disablePadding sx={{ mt: 1 }}>
          <NavItem
            label="Menu Levels"
            icon={<ArrowRightIcon fontSize="small" />}
            children={[
              { label: 'Level 1', path: '/menu/level1' },
              { label: 'Level 2', path: '/menu/level2' },
            ]}
          />
        </List>
      </Box>

      {/* Version Badge */}
      <Box sx={{ px: 3, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          v2.0.0
        </Typography>
      </Box>

    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
