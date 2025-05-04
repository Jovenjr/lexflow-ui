import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import CotizacionForm from '../components/CotizacionForm';
import { useCotizaciones } from '../api/hooks/useCotizaciones';

const CotizacionesPage: React.FC = () => {
  const { data, isLoading } = useCotizaciones();
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'titulo', headerName: 'Título', flex: 1 },
    { field: 'cliente_nombre', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    { field: 'fecha_emision', headerName: 'Emisión', flex: 1 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Cotizaciones</Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nueva Cotización</Button>
      <DataTable rows={data?.items || []} columns={columns} loading={isLoading} />
      <CotizacionForm open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default CotizacionesPage;
