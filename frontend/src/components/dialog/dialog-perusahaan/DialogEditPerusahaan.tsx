import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FormSelect, FormTextField } from '@/components/forms';
import type {
  PerusahaanFormData,
  VerificationStatusOption,
} from '@/pages/master/PerusahaanPage';

interface DialogEditPerusahaanProps {
  open: boolean;
  methods: UseFormReturn<PerusahaanFormData>;
  statusOptions: VerificationStatusOption[];
  onClose: () => void;
  onSubmit: (data: PerusahaanFormData) => void;
}

export function DialogEditPerusahaan({
  open,
  methods,
  statusOptions,
  onClose,
  onSubmit,
}: DialogEditPerusahaanProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Perusahaan</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormTextField
                name="namaPerusahaan"
                label="Nama Perusahaan"
                placeholder="Masukkan nama perusahaan"
              />
              <FormTextField
                name="alamat"
                label="Alamat"
                placeholder="Masukkan alamat perusahaan"
                multiline
                minRows={2}
              />
              <FormTextField
                name="email"
                label="Email"
                type="email"
                placeholder="Masukkan email perusahaan"
              />
              <FormTextField
                name="telepon"
                label="Telepon"
                placeholder="Masukkan nomor telepon"
              />
              <FormSelect
                name="statusVerifikasi"
                label="Status Verifikasi"
                options={statusOptions.map((status) => ({
                  value: status.value,
                  label: status.label,
                }))}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Simpan
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
