import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePago } from '../api/hooks/usePagos';

const schema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
  fecha_pago: z.string().min(1, 'La fecha es requerida'),
  metodo: z.string().min(1, 'El método de pago es requerido'),
});

type FormValues = z.infer<typeof schema>;

interface PagoFormProps {
  open: boolean;
  onClose: () => void;
  facturaId: number;
}

export default function PagoForm({ open, onClose, facturaId }: PagoFormProps) {
  const createPagoMutation = useCreatePago();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      monto: 0,
      fecha_pago: new Date().toISOString().split('T')[0],
      metodo: 'EFECTIVO'
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createPagoMutation.mutateAsync({
        facturaId,
        payload: values
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Pago</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Monto"
                fullWidth
                type="number"
                error={!!errors.monto}
                helperText={errors.monto?.message}
                {...register('monto')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha de Pago"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_pago}
                helperText={errors.fecha_pago?.message}
                {...register('fecha_pago')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Método de Pago"
                fullWidth
                select
                SelectProps={{ native: true }}
                error={!!errors.metodo}
                helperText={errors.metodo?.message}
                {...register('metodo')}
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="CHEQUE">Cheque</option>
                <option value="OTRO">Otro</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={createPagoMutation.isPending}
          >
            {createPagoMutation.isPending ? 'Guardando...' : 'Guardar Pago'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
