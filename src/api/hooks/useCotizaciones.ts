import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

export const useCotizaciones = (params?: any) => {
  return useQuery({
    queryKey: ['cotizaciones', params],
    queryFn: async () => (await api.get('/cotizaciones', { params })).data
  });
};

export const useCreateCotizacion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post('/cotizaciones', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cotizaciones'] })
  });
};
