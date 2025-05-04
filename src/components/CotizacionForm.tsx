import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateCotizacion } from '../api/hooks/useCotizaciones';

const schema = z.object({
  cliente_id: z.coerce.number(),
  titulo: z.string().min(3),
  descripcion: z.string().optional()
});

type CotizacionInput = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

const CotizacionForm: React.FC<Props> = ({ open, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CotizacionInput>({
    resolver: zodResolver(schema)
  });
  const createMut = useCreateCotizacion();

  const onSubmit = (data: CotizacionInput) => {
    const payload = { ...data, items: [] };
    createMut.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Cotización</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Cliente ID" fullWidth type="number" {...register('cliente_id')} error={!!errors.cliente_id}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Título" fullWidth {...register('titulo')} error={!!errors.titulo}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" fullWidth multiline rows={3} {...register('descripcion')} />
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

export default CotizacionForm;
