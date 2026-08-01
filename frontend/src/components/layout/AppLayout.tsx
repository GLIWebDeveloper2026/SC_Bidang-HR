import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        open={isDesktop ? true : mobileOpen}
        onClose={handleDrawerToggle}
        variant={isDesktop ? 'permanent' : 'temporary'}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Header */}
        <Header onMenuClick={handleDrawerToggle} isDesktop={isDesktop} />

        {/* Page Content */}
        <Box
          sx={{
            pt: { xs: '84px', lg: '92px' }, // Header height + padding
            px: { xs: 2, sm: 3 },
            pb: 3,
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
