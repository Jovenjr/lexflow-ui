
import { DataTable } from '../components/DataTable';
import { useEquipos } from '../api/hooks/useEquipos';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function EquiposPage() {
  const { data, isLoading, error } = useEquipos();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Equipos"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
