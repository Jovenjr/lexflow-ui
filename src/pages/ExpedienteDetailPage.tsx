import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExpediente } from '../api/hooks/useExpedientes';
import { Box, CircularProgress, Typography, Tabs, Tab, Alert } from '@mui/material';

// Placeholder para el tipo Expediente (idealmente importado)
interface Expediente {
  id: number;
  numero_expediente: string;
  titulo: string;
  tipo: string;
  cliente_nombre: string;
  estado: string;
  fecha_apertura: string;
  descripcion?: string;
  juzgado?: string;
  usuario_asignado_nombre?: string;
}

// Componente para el contenido de cada pestaña (por ahora vacíos)
const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expediente-tabpanel-${index}`}
      aria-labelledby={`expediente-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ExpedienteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const expedienteId = parseInt(id || '0', 10);
  const { data: expediente, isLoading, isError, error } = useExpediente(expedienteId);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error al cargar el expediente: {error?.message}</Alert>;
  }

  if (!expediente) {
    return <Alert severity="warning">Expediente no encontrado.</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Expediente: {expediente.titulo} (#{expediente.numero_expediente})
      </Typography>
      {/* Aquí podrías mostrar más detalles básicos como Cliente, Estado, etc. */}
      <Typography variant="subtitle1">Cliente: {expediente.cliente_nombre}</Typography>
      <Typography variant="subtitle1">Estado: {expediente.estado}</Typography>
      <Typography variant="subtitle1">Tipo: {expediente.tipo}</Typography>
      <Typography variant="subtitle1">Asignado a: {expediente.usuario_asignado_nombre || 'N/A'}</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="expediente details tabs">
          <Tab label="Información General" id="expediente-tab-0" aria-controls="expediente-tabpanel-0" />
          <Tab label="Documentos" id="expediente-tab-1" aria-controls="expediente-tabpanel-1" />
          <Tab label="Citas Relacionadas" id="expediente-tab-2" aria-controls="expediente-tabpanel-2" />
          <Tab label="Tareas" id="expediente-tab-3" aria-controls="expediente-tabpanel-3" />
        </Tabs>
      </Box>

      {/* Contenido de las Pestañas */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6">Descripción:</Typography>
        <Typography paragraph>{expediente.descripcion || 'No disponible'}</Typography>
        <Typography variant="h6">Juzgado:</Typography>
        <Typography paragraph>{expediente.juzgado || 'No disponible'}</Typography>
        <Typography variant="h6">Fecha Apertura:</Typography>
        <Typography paragraph>{expediente.fecha_apertura ? new Date(expediente.fecha_apertura).toLocaleDateString() : 'N/A'}</Typography>
        {/* Añadir más campos si es necesario */}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Aquí irá la lista/gestión de documentos */} Documentos (Pendiente)
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Aquí irá la lista de citas relacionadas */} Citas (Pendiente)
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {/* Aquí irá la lista de tareas relacionadas */} Tareas (Pendiente)
      </TabPanel>
    </Box>
  );
};

export default ExpedienteDetailPage;
