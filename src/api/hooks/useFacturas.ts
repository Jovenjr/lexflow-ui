import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

export const useFacturas = (params?: any) => {
  return useQuery({
    queryKey: ['facturas', params],
    queryFn: async () => (await api.get('/facturas', { params })).data
  });
};

export const useCreateFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post('/facturas', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['facturas'] })
  });
};
