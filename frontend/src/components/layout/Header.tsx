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
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode, useAuth } from '@/hooks';
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

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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
          sx={{
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            mr: 1,
          }}
        >
          <Badge badgeContent={4} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <IconButton
          onClick={handleUserMenuOpen}
          sx={{
            p: 0.5,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0) || 'J'}
          </Avatar>
        </IconButton>

        {/* User Menu */}
        <Menu
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
              {user?.name || 'John Charly'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'john@example.com'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => navigate('/account')}>
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
  );
}
