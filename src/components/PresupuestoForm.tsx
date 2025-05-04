
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePresupuesto, useUpdatePresupuesto } from '../api/hooks/usePresupuestos';

const schema = z.object({
  // TODO: Define campos concretos según el recurso 'Presupuesto'
  titulo: z.string().min(1, 'Requerido')
});

type FormValues = z.infer<typeof schema>;

interface PresupuestoFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<FormValues> & { id?: number };
  isEdit?: boolean;
}

export default function PresupuestoForm({ open, onClose, initialData = {}, isEdit = false }: PresupuestoFormProps) {
  const createMutation = useCreatePresupuesto();
  const updateMutation = useUpdatePresupuesto();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: initialData,
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                fullWidth
                error={!!errors.titulo}
                helperText={errors.titulo?.message}
                {...register('titulo')}
              />
            </Grid>
            {/* TODO: Agregar más campos */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={createMutation.isLoading || updateMutation.isLoading}>
            {isEdit ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
