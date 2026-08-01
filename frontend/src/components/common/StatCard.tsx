import { Box, Card, CardContent, Typography, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  compareText?: string;
  onClick?: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  compareText = 'Compare to last week',
  onClick,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
          : {},
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: iconBgColor || alpha(theme.palette.primary.main, 0.1),
            color: iconColor || theme.palette.primary.main,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 0.5,
            fontSize: { xs: '1.75rem', sm: '2rem' },
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 1.5,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        {/* Trend */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                color: trend.isPositive ? 'success.main' : 'error.main',
              }}
            >
              {trend.isPositive ? (
                <TrendingUp sx={{ fontSize: '1rem' }} />
              ) : (
                <TrendingDown sx={{ fontSize: '1rem' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'inherit',
                }}
              >
                {trend.value}%
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {compareText}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
