
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosInstance';

const baseUrl = '/usuarios';

export function useUsuarios() {
  return useQuery(['usuarios'], async () => {
    const { data } = await axiosInstance.get(baseUrl);
    return data;
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await axiosInstance.post(baseUrl, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['usuarios'])
    }
  );
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await axiosInstance.put(`$\{baseUrl\}/$\{id\}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['usuarios'])
    }
  );
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      await axiosInstance.delete(`$\{baseUrl\}/$\{id\}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['usuarios'])
    }
  );
}
