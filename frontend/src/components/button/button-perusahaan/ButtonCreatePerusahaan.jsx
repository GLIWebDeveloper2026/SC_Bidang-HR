import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export function ButtonCreatePerusahaan({ onClick }) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{ textTransform: 'none', fontWeight: 500, px: 2.5, py: 1 }}
    >
      Tambah Perusahaan
    </Button>
  );
}
