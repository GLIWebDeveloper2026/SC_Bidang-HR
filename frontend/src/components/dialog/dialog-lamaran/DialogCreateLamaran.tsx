import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  AttachMoney as SalaryIcon,
  Description as DocumentIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { Controller, FormProvider, type UseFormReturn } from 'react-hook-form';
import { FormTextField } from '@/components/forms';
import type { LamaranFormData, Lowongan } from '@/pages/mahasiswa-page/LamaranPage';

interface DialogCreateLamaranProps {
  open: boolean;
  methods: UseFormReturn<LamaranFormData>;
  lowongan: Lowongan | null;
  onClose: () => void;
  onSubmit: (data: LamaranFormData) => void;
}

const detailItems = [
  { key: 'posisi', label: 'Posisi' },
  { key: 'kategori_bidang', label: 'Kategori Bidang' },
  { key: 'kuota_posisi', label: 'Kuota' },
  { key: 'perusahaan', label: 'Perusahaan' },
  { key: 'lokasi_kerja', label: 'Lokasi Kerja' },
] as const;

export function DialogCreateLamaran({
  open,
  methods,
  lowongan,
  onClose,
  onSubmit,
}: DialogCreateLamaranProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Lamar Lowongan</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
                gap: 2.5,
                alignItems: 'start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  position: { md: 'sticky' },
                  top: { md: 16 },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Detail Lowongan
                </Typography>
                {detailItems.map((item) => (
                  <Box key={item.key}>
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {lowongan?.[item.key] ?? '-'}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Controller
                  name="cv"
                  control={methods.control}
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <FormControl error={!!error} fullWidth>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<DocumentIcon />}
                        sx={{
                          minHeight: 56,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          overflow: 'hidden',
                          '& .MuiButton-startIcon': { flexShrink: 0 },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {value?.name || 'Upload CV'}
                        </Box>
                        <input
                          {...field}
                          hidden
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                        />
                      </Button>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />

                <FormTextField
                  name="nomor_hp"
                  label="Nomor HP"
                  placeholder="Contoh: 081234567890"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormTextField
                  name="pendidikan"
                  label="Pendidikan"
                  placeholder="Contoh: S1 Sistem Informasi"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormTextField
                  name="harapan_salary"
                  label="Harapan Salary"
                  type="number"
                  placeholder="Masukkan harapan salary"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SalaryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <FormTextField
                    name="surat_lamaran"
                    label="Surat Lamaran"
                    placeholder={`Yth. Tim Rekrutmen,\n\nSaya tertarik melamar posisi ini karena...\n\nPengalaman dan keahlian saya yang relevan adalah...`}
                    multiline
                    minRows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <DocumentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Controller
                    name="setuju_syarat"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl error={!!error}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(event) => field.onChange(event.target.checked)}
                            />
                          }
                          label="Saya menyetujui syarat dan ketentuan lamaran"
                        />
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<WorkIcon />}>
              Lamar
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
