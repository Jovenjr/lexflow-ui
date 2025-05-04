import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

// Get all documents
export function useDocumentos(params = {}) {
  return useQuery({
    queryKey: ['documentos', params],
    queryFn: async () => {
      const { data } = await api.get('/documentos/', { params });
      return data;
    }
  });
}

// Get a specific document by id
export function useDocumento(id: number) {
  return useQuery({
    queryKey: ['documentos', id],
    queryFn: async () => {
      const { data } = await api.get(`/documentos/${id}`);
      return data;
    },
    enabled: !!id, // Only run if id is provided
  });
}

// Step 1: Create document metadata and get upload URL
export function useCreateDocumentoMetadata() {
  return useMutation({
    mutationFn: async (metadata: any) => {
      const { data } = await api.post('/documentos/', metadata);
      return data;
    }
  });
}

// Step 2: Upload file to S3 (or other storage) using the signed URL
export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ url, file }: { url: string; file: File }) => {
      // Use fetch API for direct upload to S3 signed URL (no Authorization header)
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }
      
      return true;
    }
  });
}

// Step 3: Confirm document upload after file is uploaded
export function useConfirmDocumentoUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/documentos/${id}/confirmar`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    }
  });
}

// Delete a document
export function useDeleteDocumento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/documentos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    }
  });
}
