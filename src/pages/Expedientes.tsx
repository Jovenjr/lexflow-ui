import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import ExpedienteForm from '../components/ExpedienteForm';
import { useExpedientes } from '../api/hooks/useExpedientes';

const ExpedientesPage: React.FC = () => {
  const { data, isLoading } = useExpedientes();
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'numero_expediente', headerName: 'Número', flex: 1 },
    { field: 'titulo', headerName: 'Título', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    { field: 'cliente_nombre', headerName: 'Cliente', flex: 1 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Expedientes</Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nuevo Expediente</Button>
      <DataTable rows={data || []} columns={columns} loading={isLoading} />
      <ExpedienteForm open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default ExpedientesPage;
