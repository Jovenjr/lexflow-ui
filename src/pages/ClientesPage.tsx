import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListCliente, useDeleteCliente } from '../api/hooks/useCliente';
import DataTable from '../components/DataTable';
import ClienteForm from '../components/ClienteForm';
import { Button, CircularProgress, Alert, IconButton, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Placeholder para el tipo Cliente
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  // ... otros campos si se muestran en la tabla
}

// Definición de columna específica para el DataTable personalizado
interface ClienteColumn {
  header: string;
  accessor: keyof Cliente | ((row: Cliente) => React.ReactNode);
}

const ClientesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: clientes, isLoading, isError, error } = useListCliente();
  const deleteMutation = useDeleteCliente();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClienteId, setEditingClienteId] = useState<number | null>(null);

  const handleDelete = (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${nombre}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    setEditingClienteId(id);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingClienteId(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingClienteId(null);
  };

  const columns: ClienteColumn[] = useMemo(() => [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Teléfono', accessor: 'telefono' },
    // Añadir más columnas si es necesario
    {
      header: 'Acciones',
      accessor: (row: Cliente) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${row.id}`); }} title="Ver Detalles">
            <VisibilityIcon fontSize="inherit" />
          </IconButton>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(row.id); }} title="Editar">
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id, `${row.nombre} ${row.apellido}`); }}
            disabled={deleteMutation.isPending}
            title="Eliminar"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ], [deleteMutation.isPending, navigate]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error al cargar clientes: {error?.message}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>Lista de Clientes</Typography>
        <Button variant="contained" onClick={handleCreate} color="primary" sx={{ px: 2, py: 1 }}>
          Nuevo Cliente
        </Button>
      </Box>
      {deleteMutation.isError && (
         <Alert severity="error" sx={{ mb: 2 }}>Error al eliminar el cliente.</Alert>
      )}
      <DataTable<Cliente>
         columns={columns}
         data={clientes || []}
         loading={isLoading}
         onRowClick={(row) => navigate(`/clientes/${row.id}`)}
       />
      <ClienteForm
        open={isFormOpen}
        onClose={handleCloseForm}
        clienteId={editingClienteId}
      />
    </Box>
  );
};

export default ClientesPage;
