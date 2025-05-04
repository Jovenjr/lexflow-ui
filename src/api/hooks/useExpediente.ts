import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '../axios';

const endp = "/expedientes";

export const useListExpediente = (params: Record<string, any> = {}) =>
  useQuery({ queryKey: ["expedientes", params], queryFn: async () => (await api.get(endp, { params })).data });

export const useCreateExpediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post(endp, payload)).data,
    onSuccess: () => qc.invalidateQueries(["expedientes"]),
  });
};

export const useUpdateExpediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => (await api.put(`${endp}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries(["expedientes"]),
  });
};

export const useDeleteExpediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`${endp}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(["expedientes"]),
  });
};
