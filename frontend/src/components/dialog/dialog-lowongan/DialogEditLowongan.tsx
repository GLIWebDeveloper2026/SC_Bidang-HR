import { useEffect } from 'react';
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
  Lowongan,
  LowonganFormData,
  LowonganStatus,
} from '@/pages/perusahaan-page/LowonganPage';

interface DialogEditLowonganProps {
  open: boolean;
  lowongan: Lowongan | null;
  methods: UseFormReturn<LowonganFormData>;
  kategoriOptions: string[];
  statusOptions: LowonganStatus[];
  onClose: () => void;
  onSubmit: (data: LowonganFormData) => void | Promise<void>;
}

const getEditableValue = (value?: string | null) => {
  if (!value || value === '-') return '';
  return value;
};

const getInputDateValue = (value?: string | null) => {
  if (!value || value === '-') return '';

  const dateValue = value.split('T')[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(dateValue) ? dateValue : '';
};

export function DialogEditLowongan({
  open,
  lowongan,
  methods,
  kategoriOptions,
  statusOptions,
  onClose,
  onSubmit,
}: DialogEditLowonganProps) {
  const isSubmitting = methods.formState.isSubmitting;

  useEffect(() => {
    if (!open || !lowongan) return;

    methods.reset({
      posisi: getEditableValue(lowongan.posisi),
      kategori_bidang: getEditableValue(lowongan.kategori_bidang),
      kuota_posisi: lowongan.kuota_posisi || 1,
      perusahaan: getEditableValue(lowongan.perusahaan),
      lokasi_kerja: getEditableValue(lowongan.lokasi_kerja),
      status: lowongan.status || 'Draft',
      deskripsi: getEditableValue(lowongan.deskripsi),
      tanggal: getInputDateValue(lowongan.tanggal_tutup),
    });
  }, [lowongan, methods, open]);

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Lowongan</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
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
              <FormTextField
                name="tanggal"
                label="Tanggal Tutup"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <FormTextField
                name="deskripsi"
                label="Deskripsi"
                placeholder="Masukkan deskripsi lowongan"
                multiline
                minRows={3}
                sx={{ gridColumn: { sm: '1 / -1' } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting || !lowongan}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
