import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  LinearProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  useCreateDocumentoMetadata, 
  useUploadFile, 
  useConfirmDocumentoUpload 
} from '../api/hooks/useDocumentos';

// Define step validation schemas
const metadataSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  tipo: z.string().min(1, 'El tipo de documento es requerido'),
  expediente_id: z.coerce.number().min(1, 'El expediente es requerido'),
  descripcion: z.string().optional(),
});

type MetadataFormValues = z.infer<typeof metadataSchema>;

const TIPO_DOCUMENTO_OPTIONS = [
  'ESCRITO',
  'DICTAMEN',
  'SENTENCIA',
  'EVIDENCIA',
  'CONTRATO',
  'NOTIFICACION',
  'OTRO'
];

interface DocumentoFormProps {
  open: boolean;
  onClose: () => void;
}

export default function DocumentoForm({ open, onClose }: DocumentoFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentData, setDocumentData] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const metadataMutation = useCreateDocumentoMetadata();
  const uploadFileMutation = useUploadFile();
  const confirmMutation = useConfirmDocumentoUpload();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MetadataFormValues>({
    resolver: zodResolver(metadataSchema)
  });

  const handleClose = () => {
    reset();
    setActiveStep(0);
    setFile(null);
    setUploadProgress(0);
    setDocumentData(null);
    setUploadError(null);
    onClose();
  };

  // Step 1: Submit metadata and get upload URL
  const onMetadataSubmit = async (values: MetadataFormValues) => {
    try {
      if (!file) {
        setUploadError('Debe seleccionar un archivo');
        return;
      }

      const fileMetadata = {
        ...values,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      };

      const response = await metadataMutation.mutateAsync(fileMetadata);
      setDocumentData(response);
      setActiveStep(1);
      setUploadError(null);
    } catch (error: any) {
      console.error("Error creating document metadata:", error);
      setUploadError(error.message || 'Error al crear el documento. Intente de nuevo.');
    }
  };

  // Step 2: Upload file to the provided URL
  const handleFileUpload = async () => {
    if (!documentData || !file) return;
    
    try {
      // Simulating upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload file to S3 or other storage
      await uploadFileMutation.mutateAsync({
        url: documentData.upload_url,
        file
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Confirm upload with the API
      await confirmMutation.mutateAsync(documentData.id);
      
      // Success - give the user some feedback before closing
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setUploadError(error.message || 'Error al subir el archivo. Intente de nuevo.');
      setUploadProgress(0);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Subir Documento</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Información del Documento</StepLabel>
          </Step>
          <Step>
            <StepLabel>Subir Archivo</StepLabel>
          </Step>
        </Stepper>

        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>
        )}

        {activeStep === 0 ? (
          <form id="metadata-form" onSubmit={handleSubmit(onMetadataSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre del Documento *"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  {...register('nombre')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.tipo}>
                  <InputLabel>Tipo de Documento *</InputLabel>
                  <Select
                    label="Tipo de Documento *"
                    {...register('tipo')}
                    defaultValue=""
                  >
                    {TIPO_DOCUMENTO_OPTIONS.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipo && (
                    <Typography color="error" variant="caption">
                      {errors.tipo.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="ID del Expediente *"
                  fullWidth
                  type="number"
                  error={!!errors.expediente_id}
                  helperText={errors.expediente_id?.message}
                  {...register('expediente_id')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  rows={3}
                  {...register('descripcion')}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Seleccione el archivo a subir *
                </Typography>
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  style={{ width: '100%' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {!file && (
                  <Typography color="error" variant="caption">
                    Debe seleccionar un archivo
                  </Typography>
                )}
                {file && (
                  <Typography variant="caption" display="block" gutterBottom>
                    Archivo: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Información del documento
            </Typography>
            <Typography>
              <strong>Nombre:</strong> {documentData?.nombre}
            </Typography>
            <Typography>
              <strong>Archivo:</strong> {file?.name}
            </Typography>
            <Typography>
              <strong>Tamaño:</strong> {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
            </Typography>

            <Box sx={{ my: 4 }}>
              <Typography gutterBottom>Progreso de subida: {uploadProgress}%</Typography>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
            </Box>

            {uploadProgress === 100 && (
              <Alert severity="success">
                ¡Documento subido con éxito!
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        
        {activeStep === 0 ? (
          <Button 
            type="submit" 
            variant="contained" 
            disabled={metadataMutation.isPending || !file}
            form="metadata-form"
          >
            {metadataMutation.isPending ? 'Procesando...' : 'Siguiente'}
          </Button>
        ) : (
          <Button 
            onClick={handleFileUpload}
            variant="contained"
            disabled={uploadFileMutation.isPending || confirmMutation.isPending || uploadProgress === 100}
          >
            {uploadProgress === 100 ? 'Completado' : uploadFileMutation.isPending ? 'Subiendo...' : 'Subir Archivo'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
