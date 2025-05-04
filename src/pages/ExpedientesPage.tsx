import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useExpedientes, useCreateExpediente, useDeleteExpediente } from '../api/hooks/useExpedientes'
import DataTable from '../components/DataTable'
import ExpedienteForm from '../components/ExpedienteForm'
import { Button, CircularProgress, Alert, IconButton, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Tipo Expediente (debe coincidir con la data real)
interface Expediente {
  id: number;
  numero_expediente: string;
  titulo: string;
  cliente_nombre: string;
  estado: string;
  // Añadir otros campos si existen en la respuesta de useExpedientes
}

// Definición de columna específica para el DataTable personalizado
interface ExpedienteColumn {
  header: string;
  accessor: keyof Expediente | ((row: Expediente) => React.ReactNode);
}

const ExpedientesPage: React.FC = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useExpedientes()
  const deleteMutation = useDeleteExpediente()

  const handleDelete = (id: number, titulo: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el expediente "${titulo}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  // Definir columnas usando el formato del DataTable personalizado
  const columns: ExpedienteColumn[] = React.useMemo(() => [
    { header: 'Número', accessor: 'numero_expediente' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Cliente', accessor: 'cliente_nombre' },
    { header: 'Estado', accessor: 'estado' },
    {
      header: 'Acciones',
      accessor: (row: Expediente) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}> { /* Usar sx prop para estilos */ }
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/expedientes/${row.id}`); }} title="Ver Detalles">
            <VisibilityIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id, row.titulo); }}
            disabled={deleteMutation.isPending}
            title="Eliminar"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ], [deleteMutation.isPending, navigate])

  if (isLoading) return <CircularProgress />
  if (isError) return <Alert severity="error">Error al cargar expedientes: {error?.message}</Alert>

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Box> { /* Usar Box para consistencia con MUI */ }
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}> { /* Usar sx */ }
              <Typography variant="h4" gutterBottom sx={{ mb: 0 }}> { /* Quitar margen inferior extra */ }
                Lista de Expedientes
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/expedientes/nuevo')}
                color="primary"
                sx={{ px: 2, py: 1 }}
              >
                Nuevo Expediente
              </Button>
            </Box>
            {deleteMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>Error al eliminar el expediente.</Alert>
            )}
            <DataTable<Expediente>
              columns={columns}
              data={data?.items ?? []}
              loading={isLoading}
              onRowClick={(row) => navigate(String(row.id))}
            />
          </Box>
        }
      />
      <Route path="nuevo" element={<ExpedienteForm />} />
      <Route path=":id" element={<div>Detalle de expediente (próximamente)</div>} />
    </Routes>
  )
}

export default ExpedientesPage
