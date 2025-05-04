import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../api/axios';

// Hooks for different dashboard statistics
const useDashboardStats = () => 
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

const useFacturasDashboard = () => 
  useQuery({
    queryKey: ['facturas-dashboard'],
    queryFn: async () => (await api.get('/facturas/dashboard')).data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

const useCotizacionesDashboard = () => 
  useQuery({
    queryKey: ['cotizaciones-dashboard'],
    queryFn: async () => (await api.get('/cotizaciones/dashboard')).data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

const StatCard = ({ title, value, subtitle, loading = false, color = 'primary.main' }) => (
  <Card raised sx={{ height: '100%', bgcolor: 'background.paper' }}>
    <CardContent>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, color }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        </Box>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: facturaStats, isLoading: facturasLoading } = useFacturasDashboard();
  const { data: cotizacionesStats, isLoading: cotizacionesLoading } = useCotizacionesDashboard();

  if (statsError) {
    return <Alert severity="error">Error al cargar las estadísticas del dashboard</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* General stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Expedientes Activos" 
            value={stats?.expedientes_activos || 0} 
            loading={statsLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Clientes Activos" 
            value={stats?.clientes_activos || 0} 
            loading={statsLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Citas Pendientes" 
            value={stats?.citas_pendientes || 0} 
            loading={statsLoading} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Documentos" 
            value={stats?.total_documentos || 0} 
            loading={statsLoading} 
          />
        </Grid>
      </Grid>
      
      {/* Facturas stats */}
      <Typography variant="h5" mb={2}>Facturas</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Pendiente" 
            value={facturaStats?.total_pendiente || 0} 
            subtitle={`${facturaStats?.conteo_pendiente || 0} facturas`}
            loading={facturasLoading}
            color="warning.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Pagado" 
            value={facturaStats?.total_pagado || 0} 
            subtitle={`${facturaStats?.conteo_pagado || 0} facturas`}
            loading={facturasLoading}
            color="success.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Vencido" 
            value={facturaStats?.total_vencido || 0} 
            subtitle={`${facturaStats?.conteo_vencido || 0} facturas`}
            loading={facturasLoading}
            color="error.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Facturas" 
            value={facturaStats?.total_facturas || 0}
            loading={facturasLoading} 
          />
        </Grid>
      </Grid>
      
      {/* Cotizaciones stats */}
      <Typography variant="h5" mb={2}>Cotizaciones</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Pendiente" 
            value={cotizacionesStats?.total_pendiente || 0} 
            subtitle={`${cotizacionesStats?.conteo_pendiente || 0} cotizaciones`}
            loading={cotizacionesLoading}
            color="info.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Aceptado" 
            value={cotizacionesStats?.total_aceptado || 0} 
            subtitle={`${cotizacionesStats?.conteo_aceptado || 0} cotizaciones`}
            loading={cotizacionesLoading}
            color="success.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Cotizaciones Rechazadas" 
            value={cotizacionesStats?.conteo_rechazado || 0}
            loading={cotizacionesLoading}
            color="error.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Cotizaciones Expiradas" 
            value={cotizacionesStats?.conteo_expirado || 0}
            loading={cotizacionesLoading}
            color="warning.dark" 
          />
        </Grid>
      </Grid>
    </Box>
  );
}
