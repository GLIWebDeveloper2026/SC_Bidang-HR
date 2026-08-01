import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FormTextField } from '@/components/forms';
import type { CreatePerusahaanFormData } from '@/pages/master/PerusahaanPage';

interface DialogCreatePerusahaanProps {
  open: boolean;
  isSubmitting?: boolean;
  methods: UseFormReturn<CreatePerusahaanFormData>;
  onClose: () => void;
  onSubmit: (data: CreatePerusahaanFormData) => void;
}

export function DialogCreatePerusahaan({
  open,
  isSubmitting = false,
  methods,
  onClose,
  onSubmit,
}: DialogCreatePerusahaanProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Tambah Perusahaan</DialogTitle>
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
              <FormTextField
                name="nibNpwp"
                label="NIB/NPWP"
                placeholder="Masukkan NIB atau NPWP"
              />
              <FormTextField
                name="legalDocUrl"
                label="URL Dokumen Legal"
                placeholder="https://storage.url/docs/legal.pdf"
              />
              <FormTextField
                name="jabatan"
                label="Jabatan"
                placeholder="HR Manager"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
