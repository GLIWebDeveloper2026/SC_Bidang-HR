import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createCompany, getCompanies, updateCompany, type Company } from '@/api/api';
import { ButtonCreatePerusahaan } from '@/components/button/button-perusahaan/ButtonCreatePerusahaan';
import { DialogCreatePerusahaan } from '@/components/dialog/dialog-perusahaan/DialogCreatePerusahaan';
import { DialogEditPerusahaan } from '@/components/dialog/dialog-perusahaan/DialogEditPerusahaan';

type VerificationStatus = 'Terverifikasi' | 'Menunggu' | 'Ditolak';
type VerificationStatusValue = 'VERIFIED' | 'PENDING' | 'REJECTED';

export interface VerificationStatusOption {
  value: VerificationStatusValue;
  label: VerificationStatus;
}

interface Perusahaan {
  id: string;
  namaPerusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
}

const perusahaanSchema = z.object({
  namaPerusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  telepon: z.string().min(1, 'Telepon wajib diisi'),
  statusVerifikasi: z.enum(['VERIFIED', 'PENDING', 'REJECTED']),
});

export type PerusahaanFormData = z.infer<typeof perusahaanSchema>;

const createPerusahaanSchema = z.object({
  namaPerusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  telepon: z.string().min(1, 'Telepon wajib diisi'),
  nibNpwp: z.string().min(1, 'NIB/NPWP wajib diisi'),
  legalDocUrl: z.string().url('URL dokumen legal tidak valid'),
  jabatan: z.string().optional(),
});

export type CreatePerusahaanFormData = z.infer<typeof createPerusahaanSchema>;

const statusColor: Record<VerificationStatus, 'success' | 'warning' | 'error'> = {
  Terverifikasi: 'success',
  Menunggu: 'warning',
  Ditolak: 'error',
};

const statusLabel: Record<string, VerificationStatus> = {
  VERIFIED: 'Terverifikasi',
  PENDING: 'Menunggu',
  REJECTED: 'Ditolak',
};

const statusValue: Record<VerificationStatus, VerificationStatusValue> = {
  Terverifikasi: 'VERIFIED',
  Menunggu: 'PENDING',
  Ditolak: 'REJECTED',
};

const statusOptions: VerificationStatusOption[] = [
  { value: 'VERIFIED', label: 'Terverifikasi' },
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'REJECTED', label: 'Ditolak' },
];

const mapCompanyToPerusahaan = (company: Company): Perusahaan => ({
  id: company.uid,
  namaPerusahaan: company.nama_perusahaan,
  alamat: company.alamat || '-',
  email: company.email || '-',
  telepon: company.telepon || '-',
  statusVerifikasi: statusLabel[company.status_verifikasi] || 'Menunggu',
  createdAt: company.created_at,
});

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export function PerusahaanPage() {
  const [perusahaanData, setPerusahaanData] = useState<Perusahaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState<Perusahaan | null>(null);

  const createMethods = useForm<CreatePerusahaanFormData>({
    resolver: zodResolver(createPerusahaanSchema),
    defaultValues: {
      namaPerusahaan: '',
      alamat: '',
      email: '',
      telepon: '',
      nibNpwp: '',
      legalDocUrl: '',
      jabatan: '',
    },
  });

  const editMethods = useForm<PerusahaanFormData>({
    resolver: zodResolver(perusahaanSchema),
    defaultValues: {
      namaPerusahaan: '',
      alamat: '',
      email: '',
      telepon: '',
      statusVerifikasi: 'PENDING',
    },
  });

  const handleCreatePerusahaan = () => {
    setErrorMessage('');
    createMethods.reset();
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isSubmittingCreate) {
      return;
    }

    setCreateDialogOpen(false);
    createMethods.reset();
  };

  const handleSubmitCreatePerusahaan = async (data: CreatePerusahaanFormData) => {
    setIsSubmittingCreate(true);
    setErrorMessage('');

    try {
      const createdCompany = await createCompany({
        nama_perusahaan: data.namaPerusahaan,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        nib_npwp: data.nibNpwp,
        legal_doc_url: data.legalDocUrl,
        jabatan: data.jabatan || undefined,
      });
      const createdPerusahaan = mapCompanyToPerusahaan(createdCompany);

      setPerusahaanData((currentData) => [createdPerusahaan, ...currentData]);
      setCreateDialogOpen(false);
      createMethods.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menambahkan perusahaan');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleOpenEditDialog = (perusahaan: Perusahaan) => {
    setSelectedPerusahaan(perusahaan);
    editMethods.reset({
      namaPerusahaan: perusahaan.namaPerusahaan,
      alamat: perusahaan.alamat === '-' ? '' : perusahaan.alamat,
      email: perusahaan.email === '-' ? '' : perusahaan.email,
      telepon: perusahaan.telepon === '-' ? '' : perusahaan.telepon,
      statusVerifikasi: statusValue[perusahaan.statusVerifikasi],
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (isSubmittingEdit) {
      return;
    }

    setEditDialogOpen(false);
    setSelectedPerusahaan(null);
    editMethods.reset();
  };

  const handleSubmitEditPerusahaan = async (data: PerusahaanFormData) => {
    if (!selectedPerusahaan) {
      return;
    }

    setIsSubmittingEdit(true);
    setErrorMessage('');

    try {
      const updatedCompany = await updateCompany(selectedPerusahaan.id, {
        nama_perusahaan: data.namaPerusahaan,
        alamat: data.alamat,
        email: data.email,
        telepon: data.telepon,
        status_verifikasi: data.statusVerifikasi,
      });
      const updatedPerusahaan = mapCompanyToPerusahaan(updatedCompany);

      setPerusahaanData((currentData) =>
        currentData.map((perusahaan) =>
          perusahaan.id === updatedPerusahaan.id ? updatedPerusahaan : perusahaan
        )
      );
      setEditDialogOpen(false);
      setSelectedPerusahaan(null);
      editMethods.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal mengubah data perusahaan');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        const companies = await getCompanies();
        if (isMounted) {
          setPerusahaanData(companies.map(mapCompanyToPerusahaan));
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data perusahaan');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Perusahaan
        </Typography>
        <ButtonCreatePerusahaan onClick={handleCreatePerusahaan} />
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nama Perusahaan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Alamat</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Telepon</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status Verifikasi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
              <TableCell align="right" sx={{ width: 96 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && perusahaanData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Belum ada data perusahaan.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && perusahaanData.map((perusahaan) => (
              <TableRow key={perusahaan.id} hover>
                <TableCell>{perusahaan.namaPerusahaan}</TableCell>
                <TableCell>{perusahaan.alamat}</TableCell>
                <TableCell>{perusahaan.email}</TableCell>
                <TableCell>{perusahaan.telepon}</TableCell>
                <TableCell>
                  <Chip
                    label={perusahaan.statusVerifikasi}
                    color={statusColor[perusahaan.statusVerifikasi]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDate(perusahaan.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="edit perusahaan"
                    onClick={() => handleOpenEditDialog(perusahaan)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" aria-label="aksi perusahaan">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogEditPerusahaan
        open={editDialogOpen}
        methods={editMethods}
        statusOptions={statusOptions}
        onClose={handleCloseEditDialog}
        onSubmit={handleSubmitEditPerusahaan}
      />
      <DialogCreatePerusahaan
        open={createDialogOpen}
        isSubmitting={isSubmittingCreate}
        methods={createMethods}
        onClose={handleCloseCreateDialog}
        onSubmit={handleSubmitCreatePerusahaan}
      />
    </Box>
  );
}
