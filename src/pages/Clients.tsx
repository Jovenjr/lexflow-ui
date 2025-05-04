import React from 'react';
import { Container, Typography } from '@mui/material';
import { useClients } from '../api/hooks/useClients';
import DataTable from '../components/DataTable';

const ClientsPage: React.FC = () => {
  const { data, isLoading } = useClients();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Clientes</Typography>
      <DataTable rows={data?.items || []} columns={columns} loading={isLoading} />
    </Container>
  );
};

export default ClientsPage;
