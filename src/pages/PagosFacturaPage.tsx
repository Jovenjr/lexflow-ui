import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PagoForm from '../components/PagoForm';
import { useFacturaPagos, useDeletePago } from '../api/hooks/usePagos';

export default function PagosFacturaPage() {
  const { id } = useParams<{ id: string }>();
  const facturaId = parseInt(id || '0');
  const [formOpen, setFormOpen] = useState(false);
  
  const { data: pagos, isLoading, error, refetch } = useFacturaPagos(facturaId);
  const deleteMutation = useDeletePago();

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  // Handle delete payment
  const handleDelete = async (pagoId: number) => {
    if (window.confirm('¿Está seguro de eliminar este pago? Esta acción no se puede deshacer.')) {
      try {
        await deleteMutation.mutateAsync({
          id: pagoId,
          facturaId
        });
        refetch();
      } catch (error) {
        console.error("Error al eliminar el pago:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar los pagos. Por favor intente de nuevo más tarde.
      </Alert>
    );
  }

  // Calculate total paid amount
  const totalPagado = pagos?.reduce((acc: number, pago: any) => acc + pago.monto, 0) || 0;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Pagos de la Factura #{id}</Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Registrar Nuevo Pago
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabla de pagos">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Método</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos?.length ? (
                pagos.map((pago: any) => (
                  <TableRow key={pago.id} hover>
                    <TableCell>{pago.id}</TableCell>
                    <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                    <TableCell>{pago.metodo}</TableCell>
                    <TableCell align="right">{formatCurrency(pago.monto)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Eliminar pago">
                        <IconButton 
                          onClick={() => handleDelete(pago.id)}
                          disabled={deleteMutation.isPending}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay pagos registrados para esta factura
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={2} p={2} bgcolor="background.paper" borderRadius={1}>
        <Typography variant="h6">
          Total pagado: {formatCurrency(totalPagado)}
        </Typography>
      </Box>

      {/* Payment Form Dialog */}
      <PagoForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        facturaId={facturaId}
      />
    </Box>
  );
}