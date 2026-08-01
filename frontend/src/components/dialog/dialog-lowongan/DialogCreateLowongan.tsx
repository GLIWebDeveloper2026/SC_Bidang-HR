import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FormSelect, FormTextField } from '@/components/forms';
import type {
  LowonganFormData,
  LowonganStatus,
} from '@/pages/perusahaan-page/LowonganPage';

interface DialogCreateLowonganProps {
  open: boolean;
  methods: UseFormReturn<LowonganFormData>;
  kategoriOptions: string[];
  statusOptions: LowonganStatus[];
  onClose: () => void;
  onSubmit: (data: LowonganFormData) => void | Promise<void>;
}

export function DialogCreateLowongan({
  open,
  methods,
  kategoriOptions,
  statusOptions,
  onClose,
  onSubmit,
}: DialogCreateLowonganProps) {
  const isSubmitting = methods.formState.isSubmitting;

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Tambah Lowongan</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormTextField name="posisi" label="Posisi" placeholder="Masukkan posisi" />
              <FormSelect
                name="kategori_bidang"
                label="Kategori Bidang"
                options={kategoriOptions.map((kategori) => ({ value: kategori, label: kategori }))}
              />
              <FormTextField
                name="kuota_posisi"
                label="Kuota Posisi"
                type="number"
                placeholder="Masukkan kuota"
              />
              <FormTextField
                name="perusahaan"
                label="Perusahaan"
                placeholder="Masukkan nama perusahaan"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormTextField
                name="lokasi_kerja"
                label="Lokasi Kerja"
                placeholder="Masukkan lokasi kerja"
              />
              <FormSelect
                name="status"
                label="Status"
                options={statusOptions.map((status) => ({ value: status, label: status }))}
              />
              <FormTextField name="tanggal" label="Tanggal Tutup" type="date" InputLabelProps={{ shrink: true }} />
              <FormTextField
                name="deskripsi"
                label="Deskripsi"
                placeholder="Masukkan deskripsi lowongan"
                multiline
                minRows={3}
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
