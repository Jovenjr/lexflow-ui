import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import DataTable from '../components/DataTable';
import FacturaForm from '../components/FacturaForm';
import { useFacturas } from '../api/hooks/useFacturas';

const FacturasPage: React.FC = () => {
  const { data, isLoading } = useFacturas();
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'numero_factura', headerName: 'Número', flex: 1 },
    { field: 'cliente_nombre', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    { field: 'fecha_emision', headerName: 'Emisión', flex: 1 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Facturas</Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Nueva Factura</Button>
      <DataTable rows={data?.items || []} columns={columns} loading={isLoading} />
      <FacturaForm open={open} onClose={() => setOpen(false)} />
    </Container>
  );
};

export default FacturasPage;
