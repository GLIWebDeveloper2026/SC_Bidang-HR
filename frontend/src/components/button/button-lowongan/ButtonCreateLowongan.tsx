import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ButtonCreateLowonganProps {
  onClick: () => void;
}

export function ButtonCreateLowongan({ onClick }: ButtonCreateLowonganProps) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{ textTransform: 'none', fontWeight: 500, px: 2.5, py: 1 }}
    >
      Buat Lowongan
    </Button>
  );
}
