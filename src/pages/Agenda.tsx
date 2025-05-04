import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import CitaForm from '../components/CitaForm';
import { useCitas } from '../api/hooks/useCitas';

const AgendaPage: React.FC = () => {
  const { data, isLoading } = useCitas();
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'titulo', headerName: 'Título', flex: 1 },
    { field: 'cliente_nombre', headerName: 'Cliente', flex: 1 },
    { field: 'fecha_hora_inicio', headerName: 'Fecha', flex: 1 },
    { field: 'modalidad', headerName: 'Modalidad', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Agenda</Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nueva Cita</Button>
      <DataTable rows={data?.items || []} columns={columns} loading={isLoading} />
      <CitaForm open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default AgendaPage;
