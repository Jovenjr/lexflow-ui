
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

const baseUrl = '/configuracion';

export function useConfiguracion() {
  return useQuery(['configuracion'], async () => {
    const { data } = await axiosInstance.get(baseUrl);
    return data;
  });
}

export function useCreateConfiguracion() {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await axiosInstance.post(baseUrl, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['configuracion'])
    }
  );
}

export function useUpdateConfiguracion() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await axiosInstance.put(`$\{baseUrl\}/$\{id\}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['configuracion'])
    }
  );
}

export function useDeleteConfiguracion() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await axiosInstance.delete(`$\{baseUrl\}/$\{id\}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['configuracion'])
    }
  );
}
