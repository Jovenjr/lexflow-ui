import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

const endp = "/facturas";

export const useListFactura = (params: Record<string, any> = {}) =>
  useQuery({ queryKey: ["facturas", params], queryFn: async () => (await api.get(endp, { params })).data });

export const useCreateFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await api.post(endp, payload)).data,
    onSuccess: () => qc.invalidateQueries(["facturas"]),
  });
};

export const useUpdateFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => (await api.put(`${endp}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries(["facturas"]),
  });
};

export const useDeleteFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`${endp}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(["facturas"]),
  });
};
