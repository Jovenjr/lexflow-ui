
import { DataTable } from '../components/DataTable';
import { useConfiguracion } from '../api/hooks/useConfiguracion';
import { CircularProgress, Alert, Box } from '@mui/material';

export default function ConfiguracionPage() {
  const { data, isLoading, error } = useConfiguracion();

  if (isLoading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <DataTable
      title="Configuracion"
      rows={data ?? []}
      getRowId={(row) => row.id}
    />
  );
}
