
import { DataTable } from '../components/DataTable';
import { useUsuarios } from '../api/hooks/useUsuarios';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function UsuariosPage() {
  const { data, isLoading, error } = useUsuarios();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Usuarios"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
