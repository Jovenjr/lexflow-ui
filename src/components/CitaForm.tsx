import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, CircularProgress, Alert, Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCita, useUpdateCita, useCita } from '../api/hooks/useCita';

const schema = z.object({
  cliente_id: z.coerce.number().positive("Debe ser un ID válido"),
  usuario_asignado_id: z.coerce.number().positive("Debe ser un ID válido"),
  titulo: z.string().min(3, "El título es muy corto"),
  fecha_hora_inicio: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  fecha_hora_fin: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Fecha inválida" }),
  descripcion: z.string().optional(),
  modalidad: z.string().optional(),
  lugar: z.string().optional(),
});

type CitaInput = z.infer<typeof schema>;

interface CitaFormProps {
  open: boolean;
  onClose: () => void;
  citaId?: number | null;
  initialData?: {
      fecha_hora_inicio?: string;
      fecha_hora_fin?: string;
  };
}

const CitaForm: React.FC<CitaFormProps> = ({ open, onClose, citaId, initialData }) => {
  const { data: citaData, isLoading: isLoadingCita } = useCita(citaId || 0);
  const createMutation = useCreateCita();
  const updateMutation = useUpdateCita();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CitaInput>({
    resolver: zodResolver(schema),
    defaultValues: {
        cliente_id: undefined,
        usuario_asignado_id: undefined,
        titulo: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        descripcion: '',
        modalidad: 'PRESENCIAL',
        lugar: '',
    }
  });

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    if (citaId && citaData) {
      reset({
        ...citaData,
        cliente_id: Number(citaData.cliente_id),
        usuario_asignado_id: Number(citaData.usuario_asignado_id),
      });
    } else if (initialData) {
      reset({
          ...initialData,
          fecha_hora_inicio: initialData.fecha_hora_inicio || '',
          fecha_hora_fin: initialData.fecha_hora_fin || '',
      });
    } else {
        reset();
    }
  }, [open, citaId, citaData, initialData, reset]);

  const onSubmit = (data: CitaInput) => {
    const payload = {
      ...data,
      fecha_hora_fin: data.fecha_hora_fin || undefined,
      descripcion: data.descripcion || undefined,
      modalidad: data.modalidad || undefined,
      lugar: data.lugar || undefined,
    };

    if (citaId) {
      updateMutation.mutate({ ...payload, id: citaId }, {
        onSuccess: () => { reset(); onClose(); }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { reset(); onClose(); }
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isCreating = createMutation.isPending;
  const isUpdating = updateMutation.isPending;
  const isClientLoading = Boolean(citaId && isLoadingCita);
  const isLoading = isCreating || isUpdating || isClientLoading;
  const mutationError = createMutation.error || updateMutation.error;

  const formatDateTimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    } catch (e) {
        return '';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{citaId ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} id="cita-form">
        <DialogContent dividers>
          {(citaId && isLoadingCita) ? (
            <Box display="flex" justifyContent="center" sx={{ p: 4 }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={2}>
              {mutationError && <Grid item xs={12}><Alert severity="error">{mutationError.message}</Alert></Grid>}
              <Grid item xs={12} sm={6}>
                 <Controller
                   name="cliente_id"
                   control={control}
                   render={({ field }) => <TextField {...field} label="Cliente ID" type="number" fullWidth error={!!errors.cliente_id} helperText={errors.cliente_id?.message} />}
                 />
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Controller
                   name="usuario_asignado_id"
                   control={control}
                   render={({ field }) => <TextField {...field} label="Usuario Asignado ID" type="number" fullWidth error={!!errors.usuario_asignado_id} helperText={errors.usuario_asignado_id?.message} />}
                 />
              </Grid>
              <Grid item xs={12}>
                 <Controller
                   name="titulo"
                   control={control}
                   render={({ field }) => <TextField {...field} label="Título" fullWidth error={!!errors.titulo} helperText={errors.titulo?.message} />}
                 />
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Controller
                   name="fecha_hora_inicio"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Fecha y Hora Inicio"
                       type="datetime-local"
                       fullWidth
                       InputLabelProps={{ shrink: true }}
                       error={!!errors.fecha_hora_inicio}
                       helperText={errors.fecha_hora_inicio?.message}
                       value={formatDateTimeLocal(field.value)}
                     />
                   )}
                 />
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Controller
                   name="fecha_hora_fin"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Fecha y Hora Fin (Opcional)"
                       type="datetime-local"
                       fullWidth
                       InputLabelProps={{ shrink: true }}
                       error={!!errors.fecha_hora_fin}
                       helperText={errors.fecha_hora_fin?.message}
                       value={formatDateTimeLocal(field.value)}
                     />
                   )}
                 />
              </Grid>
              <Grid item xs={12}>
                 <Controller
                   name="descripcion"
                   control={control}
                   render={({ field }) => <TextField {...field} label="Descripción (Opcional)" fullWidth multiline rows={3} />}
                 />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" form="cita-form" variant="contained" disabled={isLoading}>
             {isLoading ? <CircularProgress size={24} /> : (citaId ? 'Guardar Cambios' : 'Crear Cita')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CitaForm;
