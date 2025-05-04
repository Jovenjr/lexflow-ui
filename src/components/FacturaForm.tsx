import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateFactura } from '../api/hooks/useFacturas';

const schema = z.object({
  cliente_id: z.coerce.number(),
  fecha_vencimiento: z.string(),
  titulo: z.string().optional(),
  notas: z.string().optional()
});

type FacturaInput = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

const FacturaForm: React.FC<Props> = ({ open, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FacturaInput>({
    resolver: zodResolver(schema)
  });
  const createMut = useCreateFactura();

  const onSubmit = (data: FacturaInput) => {
    const payload = { ...data, items: [] };
    createMut.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Factura</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Cliente ID" fullWidth type="number" {...register('cliente_id')} error={!!errors.cliente_id}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Fecha vencimiento (YYYY-MM-DD)" fullWidth {...register('fecha_vencimiento')} error={!!errors.fecha_vencimiento}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Título (opcional)" fullWidth {...register('titulo')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notas" fullWidth multiline rows={3} {...register('notas')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FacturaForm;
