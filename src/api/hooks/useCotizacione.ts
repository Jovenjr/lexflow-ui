
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";

const endp = "/cotizaciones";

export const useListCotizacione = (params: Record<string, any> = {}) =>
  useQuery({ queryKey: ["cotizaciones", params], queryFn: async () => (await axiosInstance.get(endp, { params })).data });

export const useCreateCotizacione = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => (await axiosInstance.post(endp, payload)).data,
    onSuccess: () => qc.invalidateQueries(["cotizaciones"]),
  });
};

export const useUpdateCotizacione = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => (await axiosInstance.put(`${endp}/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries(["cotizaciones"]),
  });
};

export const useDeleteCotizacione = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await axiosInstance.delete(`${endp}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries(["cotizaciones"]),
  });
};
