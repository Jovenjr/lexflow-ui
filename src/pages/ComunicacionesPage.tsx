
import { DataTable } from '../components/DataTable';
import { useComunicaciones } from '../api/hooks/useComunicaciones';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function ComunicacionesPage() {
  const { data, isLoading, error } = useComunicaciones();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Comunicaciones"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
