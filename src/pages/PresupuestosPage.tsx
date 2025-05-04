
import { DataTable } from '../components/DataTable';
import { usePresupuestos } from '../api/hooks/usePresupuestos';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function PresupuestosPage() {
  const { data, isLoading, error } = usePresupuestos();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Presupuestos"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
