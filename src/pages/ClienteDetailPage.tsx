import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCliente, useClienteExpedientes } from '../api/hooks/useCliente';
import DataTable from '../components/DataTable'; // Reutilizar DataTable para expedientes
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// Placeholders para tipos (idealmente importados)
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  whatsapp?: string;
  es_persona_juridica?: boolean;
  cedula?: string;
  rnc?: string;
  direccion?: string;
  nota?: string;
  fecha_creacion?: string;
  // ... otros campos
}

interface ExpedienteSimple {
  id: number;
  numero_expediente: string;
  titulo: string;
  estado: string;
}

// Definición de columnas para la tabla de expedientes del cliente
interface ExpedienteClienteColumn {
  header: string;
  accessor: keyof ExpedienteSimple | ((row: ExpedienteSimple) => React.ReactNode);
}

const ClienteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clienteId = parseInt(id || '0', 10);

  const { data: cliente, isLoading: isLoadingCliente, isError: isClienteError, error: clienteError } = useCliente(clienteId);
  const { data: expedientes, isLoading: isLoadingExp, isError: isExpError, error: expError } = useClienteExpedientes(clienteId);

  const expedientesColumns: ExpedienteClienteColumn[] = React.useMemo(() => [
    { header: 'Número', accessor: 'numero_expediente' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Estado', accessor: 'estado' },
    // No añadir acciones aquí para simplificar, ya que el clic en fila navega
  ], []);


  if (isLoadingCliente) {
    return <CircularProgress />;
  }

  if (isClienteError) {
    return <Alert severity="error">Error al cargar el cliente: {clienteError?.message}</Alert>;
  }

  if (!cliente) {
    return <Alert severity="warning">Cliente no encontrado.</Alert>;
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Grid container spacing={3}>
        {/* Columna de Información del Cliente */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" gutterBottom>
            {cliente.nombre} {cliente.apellido}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            <ListItem><ListItemText primary="Teléfono" secondary={cliente.telefono || 'N/A'} /></ListItem>
            <ListItem><ListItemText primary="WhatsApp" secondary={cliente.whatsapp || 'N/A'} /></ListItem>
            <ListItem><ListItemText primary="Tipo" secondary={cliente.es_persona_juridica ? 'Jurídica' : 'Física'} /></ListItem>
            {cliente.es_persona_juridica ? (
                 <ListItem><ListItemText primary="RNC" secondary={cliente.rnc || 'N/A'} /></ListItem>
            ) : (
                <ListItem><ListItemText primary="Cédula" secondary={cliente.cedula || 'N/A'} /></ListItem>
            )}
            <ListItem><ListItemText primary="Dirección" secondary={cliente.direccion || 'N/A'} /></ListItem>
             <ListItem><ListItemText primary="Nota" secondary={cliente.nota || 'N/A'} /></ListItem>
             <ListItem><ListItemText primary="Registrado" secondary={cliente.fecha_creacion ? new Date(cliente.fecha_creacion).toLocaleDateString() : 'N/A'} /></ListItem>
          </List>
          <Button variant="outlined" onClick={() => navigate('/clientes')} sx={{ mt: 2 }}>
             Volver a la lista
          </Button>
           {/* Aquí podrías añadir un botón de Editar que abra el ClienteForm */}
        </Grid>

        {/* Columna de Expedientes Asociados */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Expedientes Asociados
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isLoadingExp ? (
            <CircularProgress />
          ) : isExpError ? (
            <Alert severity="error">Error al cargar expedientes: {expError?.message}</Alert>
          ) : (
            <DataTable<ExpedienteSimple>
              columns={expedientesColumns}
              data={expedientes || []}
              onRowClick={(row) => navigate(`/expedientes/${row.id}`)} // Navegar al detalle del expediente
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClienteDetailPage; 