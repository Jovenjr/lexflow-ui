import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCliente, useUpdateCliente, useCliente } from '../api/hooks/useCliente';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

// Esquema Zod basado en ClienteCrear y ClienteUpdate de la API
const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  whatsapp: z.string().optional(),
  es_persona_juridica: z.boolean().default(false),
  cedula: z.string().optional(),
  rnc: z.string().optional(),
  direccion: z.string().optional(),
  nota: z.string().optional(),
  // Asumiendo que equipo_id y usuario_responsable_id se manejan de otra forma o vienen del contexto
  // equipo_id: z.number(),
  // usuario_responsable_id: z.number(),
}).refine(data => !data.es_persona_juridica || data.rnc, {
  message: "RNC es requerido para personas jurídicas",
  path: ["rnc"],
}).refine(data => data.es_persona_juridica || data.cedula, {
    message: "Cédula es requerida para personas físicas",
    path: ["cedula"],
});

type ClienteFormData = z.infer<typeof schema>;

interface ClienteFormProps {
  open: boolean;
  onClose: () => void;
  clienteId?: number | null; // ID para modo edición
}

const ClienteForm: React.FC<ClienteFormProps> = ({ open, onClose, clienteId }) => {
  const { data: clienteData, isLoading: isLoadingCliente } = useCliente(clienteId || 0); // Cargar datos para edición
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ClienteFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        nombre: '',
        apellido: '',
        telefono: '',
        whatsapp: '',
        es_persona_juridica: false,
        cedula: '',
        rnc: '',
        direccion: '',
        nota: ''
    }
  });

  const esPersonaJuridica = watch("es_persona_juridica");

  // Resetear el form cuando se abre/cierra o cambian los datos del cliente
  useEffect(() => {
    if (open && clienteId && clienteData) {
      reset(clienteData); // Llenar con datos existentes si estamos editando
    } else {
      reset(); // Limpiar si es nuevo o cerramos
    }
  }, [open, clienteId, clienteData, reset]);

  const onSubmit = (data: ClienteFormData) => {
    if (clienteId) {
      updateMutation.mutate({ ...data, id: clienteId }, {
        onSuccess: () => {
          reset();
          onClose();
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onClose();
        }
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isCreating = createMutation.isPending;
  const isUpdating = updateMutation.isPending;
  const isClientLoading = Boolean(clienteId && isLoadingCliente);
  const isLoading = isCreating || isUpdating || isClientLoading;

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{clienteId ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
      <DialogContent>
        {(clienteId && isLoadingCliente) ? (
           <Box display="flex" justifyContent="center" sx={{ p: 4 }}><CircularProgress /></Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} id="cliente-form">
            {mutationError && <Alert severity="error" sx={{ mb: 2 }}>{mutationError.message}</Alert>}
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => <TextField {...field} label="Nombre" fullWidth margin="normal" error={!!errors.nombre} helperText={errors.nombre?.message} />}
            />
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => <TextField {...field} label="Apellido" fullWidth margin="normal" error={!!errors.apellido} helperText={errors.apellido?.message} />}
            />
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => <TextField {...field} label="Teléfono" fullWidth margin="normal" error={!!errors.telefono} helperText={errors.telefono?.message} />}
            />
            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => <TextField {...field} label="WhatsApp (Opcional)" fullWidth margin="normal" />}
            />
             <FormControlLabel
                control={
                <Controller
                    name="es_persona_juridica"
                    control={control}
                    render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />}
                label="Es Persona Jurídica"
            />
            {esPersonaJuridica ? (
                 <Controller
                    name="rnc"
                    control={control}
                    render={({ field }) => <TextField {...field} label="RNC" fullWidth margin="normal" error={!!errors.rnc} helperText={errors.rnc?.message} />}
                 />
            ) : (
                <Controller
                    name="cedula"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Cédula" fullWidth margin="normal" error={!!errors.cedula} helperText={errors.cedula?.message} />}
                 />
            )}
            <Controller
              name="direccion"
              control={control}
              render={({ field }) => <TextField {...field} label="Dirección (Opcional)" fullWidth margin="normal" />}
            />
            <Controller
              name="nota"
              control={control}
              render={({ field }) => <TextField {...field} label="Nota (Opcional)" fullWidth margin="normal" multiline rows={3} />}
            />
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button
          type="submit"
          form="cliente-form"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : (clienteId ? 'Guardar Cambios' : 'Crear Cliente')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteForm; 