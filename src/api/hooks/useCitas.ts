import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

export const useCitas = (params?: any) => {
  return useQuery({
    queryKey: ['citas', params],
    queryFn: async () => {
      const { data } = await api.get('/citas', { params });
      return data;
    }
  });
};

export const useCreateCita = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post('/citas', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['citas'] })
  });
};
