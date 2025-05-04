
import { DataTable } from '../components/DataTable';
import { usePagos } from '../api/hooks/usePagos';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function PagosPage() {
  const { data, isLoading, error } = usePagos();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Pagos"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
