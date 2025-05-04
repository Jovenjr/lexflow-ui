import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
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
  Tooltip,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DocumentoForm from '../components/DocumentoForm';
import { useDocumentos, useDeleteDocumento } from '../api/hooks/useDocumentos';

export default function DocumentosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { data: documentos, isLoading, error, refetch } = useDocumentos();
  const deleteMutation = useDeleteDocumento();

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };

  // Handle document deletion
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este documento? Esta acción no se puede deshacer.')) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error al eliminar el documento:', error);
      }
    }
  };

  // Handle document view/download
  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
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
        Error al cargar los documentos. Por favor intente de nuevo más tarde.
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Documentos</Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Subir Documento
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Expediente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentos?.length > 0 ? (
                documentos.map((doc: any) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>{doc.nombre}</TableCell>
                    <TableCell>{doc.tipo}</TableCell>
                    <TableCell>{doc.expediente_id}</TableCell>
                    <TableCell>{formatDate(doc.fecha_documento || doc.fecha_creacion)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={doc.estado} 
                        color={doc.estado === 'disponible' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {doc.estado === 'disponible' && (
                        <>
                          <Tooltip title="Ver documento">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDocument(doc.url)}
                              color="primary"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Descargar">
                            <IconButton 
                              size="small"
                              href={doc.url}
                              download
                              color="primary"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Eliminar documento">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteMutation.isPending}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay documentos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Document Upload Wizard */}
      <DocumentoForm 
        open={formOpen} 
        onClose={() => {
          setFormOpen(false);
          refetch(); // Refresh the list after adding a document
        }} 
      />
    </Container>
  );
}
