import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import DownloadIcon from '@mui/icons-material/Download';
import DataTable from '../components/DataTable';
import FacturaForm from '../components/FacturaForm';
import { useFacturas } from '../api/hooks/useFacturas';
import PagosFacturaPage from './PagosFacturaPage';
import { downloadPdf } from '../utils/downloadPdf';

function FacturasList() {
  const navigate = useNavigate();
  const { data, isLoading } = useFacturas();
  const [open, setOpen] = useState(false);

  const handleRowClick = (row: any) => {
    navigate(`/facturas/${row.id}`);
  };

  const handlePagosClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/facturas/${id}/pagos`);
  };

  const handlePdfDownload = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      // Download PDF using utility function
      await downloadPdf(`/api/facturas/${id}/pdf`, `factura-${id}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error al descargar el PDF. Intente de nuevo más tarde.");
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'numero_factura', headerName: 'Número', flex: 1 },
    { field: 'cliente_nombre', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1, 
      valueFormatter: (params: any) => 
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'DOP' })
          .format(params.value || 0) 
    },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    { field: 'fecha_emision', headerName: 'Emisión', flex: 1,
      valueFormatter: (params: any) => 
        new Date(params.value).toLocaleDateString('es-ES')
    },
    { field: 'acciones', headerName: 'Acciones', flex: 1, sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Ver detalles">
            <IconButton 
              size="small" 
              onClick={() => navigate(`/facturas/${params.row.id}`)}
            >
              <ReceiptIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gestionar pagos">
            <IconButton 
              size="small"
              onClick={(e) => handlePagosClick(e, params.row.id)}
              color="primary"
            >
              <PaymentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PDF">
            <IconButton 
              size="small" 
              onClick={(e) => handlePdfDownload(e, params.row.id)}
              color="secondary"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Facturas</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Nueva Factura
        </Button>
      </Box>

      <DataTable 
        rows={data?.items || []} 
        columns={columns} 
        loading={isLoading} 
      />
      
      <FacturaForm open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}

// A placeholder component for individual invoice view
function FacturaDetailPage() {
  return <div>Detalle de Factura (en desarrollo)</div>;
}

export default function FacturasPage() {
  return (
    <Routes>
      <Route path="/" element={<FacturasList />} />
      <Route path="/:id" element={<FacturaDetailPage />} />
      <Route path="/:id/pagos" element={<PagosFacturaPage />} />
    </Routes>
  );
}
