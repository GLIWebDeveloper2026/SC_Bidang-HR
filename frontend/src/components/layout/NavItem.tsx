import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
  alpha,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export interface NavItemChild {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface NavItemProps {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItemChild[];
  external?: boolean;
  badge?: string;
  onClick?: () => void;
}

export function NavItem({
  label,
  path,
  icon,
  children,
  external,
  badge,
  onClick,
}: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = path ? location.pathname === path || location.pathname.startsWith(path + '/') : false;
  const hasChildren = children && children.length > 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (hasChildren) {
      setOpen(!open);
    } else if (path) {
      if (external) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          minHeight: 44,
          borderRadius: 2,
          mb: 0.5,
          px: 1.5,
          '&.Mui-selected': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
            '& .MuiListItemText-primary': {
              color: 'primary.main',
              fontWeight: 600,
            },
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          },
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.04),
          },
        }}
      >
        {icon && (
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isActive ? 'primary.main' : 'text.secondary',
            }}
          >
            {icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        />
        {badge && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {badge}
          </Box>
        )}
        {hasChildren && (
          <Box sx={{ color: 'text.secondary', ml: 1 }}>
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </Box>
        )}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {children.map((child) => (
              <NavItem
                key={child.path}
                label={child.label}
                path={child.path}
                icon={child.icon}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
