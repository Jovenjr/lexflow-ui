
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

const baseUrl = '/comunicaciones';

export function useComunicaciones() {
  return useQuery(['comunicaciones'], async () => {
    const { data } = await axiosInstance.get(baseUrl);
    return data;
  });
}

export function useCreateComunicacion() {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await axiosInstance.post(baseUrl, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['comunicaciones'])
    }
  );
}

export function useUpdateComunicacion() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await axiosInstance.put(`$\{baseUrl\}/$\{id\}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['comunicaciones'])
    }
  );
}

export function useDeleteComunicacion() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await axiosInstance.delete(`$\{baseUrl\}/$\{id\}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['comunicaciones'])
    }
  );
}
