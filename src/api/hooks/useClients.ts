import { useQuery } from '@tanstack/react-query';
import api from '../axios';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get('/clientes');
      return data;
    }
  });
};
