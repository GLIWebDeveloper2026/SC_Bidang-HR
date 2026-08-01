import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode, useAuth } from '@/hooks';
import { DialogUserProfile } from '@/components/dialog/dialog-auth/DialogUserProfile';
import { DialogNotification } from '@/components/dialog/dialog-shared/DialogNotification';
import { DRAWER_WIDTH } from './Sidebar';

interface HeaderProps {
  onMenuClick: () => void;
  isDesktop: boolean;
}

export function Header({ onMenuClick, isDesktop }: HeaderProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const displayName = user?.displayName || user?.name || user?.email || 'User';

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(null);
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    setIsProfileDialogOpen(true);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    setNotificationAnchorEl((currentAnchorEl) =>
      currentAnchorEl ? null : event.currentTarget
    );
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) return [];

    // Map paths to display names
    const pathNames: Record<string, string> = {
      dashboard: 'Analytics',
      users: 'Users',
      account: 'Account',
      settings: 'Settings',
      billing: 'Billing',
      blog: 'Blog',
    };

    return pathParts.map((part, index) => ({
      label: pathNames[part] || part.charAt(0).toUpperCase() + part.slice(1),
      path: '/' + pathParts.slice(0, index + 1).join('/'),
      isLast: index === pathParts.length - 1,
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: isDesktop ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: isDesktop ? `${DRAWER_WIDTH}px` : 0,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 68, lg: 76 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Mobile Menu Button */}
          {!isDesktop && (
            <IconButton
              onClick={onMenuClick}
              edge="start"
              sx={{
                mr: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Breadcrumbs */}
          <Box sx={{ flex: 1 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  mx: 1,
                },
              }}
            >
              <Link
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                onClick={() => navigate('/')}
              >
                Home
              </Link>
              {breadcrumbs.map((crumb) =>
                crumb.isLast ? (
                  <Typography
                    key={crumb.path}
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    underline="hover"
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                    onClick={() => navigate(crumb.path)}
                  >
                    {crumb.label}
                  </Link>
                )
              )}
              {location.pathname === '/dashboard' && (
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Overview
                </Typography>
              )}
            </Breadcrumbs>
          </Box>

          {/* Search */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.04)',
              borderRadius: 2,
              px: 2,
              py: 0.75,
              mr: 2,
              minWidth: 200,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1.25rem' }} />
            <InputBase
              placeholder="Search..."
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                '& input': {
                  padding: 0,
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.disabled',
                fontSize: '0.75rem',
                ml: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  px: 0.75,
                  py: 0.25,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  fontSize: '0.7rem',
                }}
              >
                + K
              </Box>
            </Box>
          </Box>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mr: 1,
            }}
          >
            {mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={handleNotificationClick}
            aria-controls={notificationAnchorEl ? 'notification-popover' : undefined}
            aria-haspopup="dialog"
            aria-expanded={notificationAnchorEl ? 'true' : undefined}
            aria-label="Buka notifikasi"
            sx={{
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              mr: 1,
            }}
          >
            <Badge badgeContent={notificationCount} color="error" max={99}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            aria-controls={anchorEl ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
            sx={{
              p: 0.5,
              pl: 0.5,
              pr: 0.75,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              gap: 0.5,
            }}
          >
            <Avatar
              src={user?.avatar || undefined}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            {anchorEl ? (
              <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
          </IconButton>

          {/* User Menu */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || '-'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClick}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <DialogNotification
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        onNotificationCountChange={setNotificationCount}
      />
      <DialogUserProfile
        open={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </>
  );
}
