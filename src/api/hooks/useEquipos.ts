
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

const baseUrl = '/equipos';

export function useEquipos() {
  return useQuery(['equipos'], async () => {
    const { data } = await axiosInstance.get(baseUrl);
    return data;
  });
}

export function useCreateEquipo() {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await axiosInstance.post(baseUrl, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['equipos'])
    }
  );
}

export function useUpdateEquipo() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await axiosInstance.put(`$\{baseUrl\}/$\{id\}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['equipos'])
    }
  );
}

export function useDeleteEquipo() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await axiosInstance.delete(`$\{baseUrl\}/$\{id\}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['equipos'])
    }
  );
}
