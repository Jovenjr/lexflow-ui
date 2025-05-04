
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

const baseUrl = '/presupuestos';

export function usePresupuestos() {
  return useQuery(['presupuestos'], async () => {
    const { data } = await axiosInstance.get(baseUrl);
    return data;
  });
}

export function useCreatePresupuesto() {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await axiosInstance.post(baseUrl, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['presupuestos'])
    }
  );
}

export function useUpdatePresupuesto() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await axiosInstance.put(`$\{baseUrl\}/$\{id\}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['presupuestos'])
    }
  );
}

export function useDeletePresupuesto() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await axiosInstance.delete(`$\{baseUrl\}/$\{id\}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['presupuestos'])
    }
  );
}
