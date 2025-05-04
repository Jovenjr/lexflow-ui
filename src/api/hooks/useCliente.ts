import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

// Placeholder para el tipo Cliente (idealmente importado)
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  // ... otros campos de la definición Cliente en la API
}

// Placeholder para el tipo ExpedienteSimple
interface ExpedienteSimple {
  id: number;
  numero_expediente: string;
  titulo: string;
  estado: string;
}

const endp = "/clientes";

export const useListCliente = (params: Record<string, any> = {}) =>
  useQuery<Cliente[]>({ queryKey: ["clientes", params], queryFn: async () => (await api.get(endp, { params })).data });

export const useCliente = (id: number) =>
  useQuery<Cliente>({ queryKey: ["cliente", id], queryFn: async () => (await api.get(`${endp}/${id}`)).data, enabled: !!id });

export const useCreateCliente = () => {
  const qc = useQueryClient();
  return useMutation<Cliente, Error, Omit<Cliente, 'id'>>({
    mutationFn: async (payload) => (await api.post(endp, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"]}),
  });
};

export const useUpdateCliente = () => {
  const qc = useQueryClient();
  return useMutation<Cliente, Error, Partial<Cliente> & { id: number }>({
    mutationFn: async ({ id, ...payload }) => (await api.put(`${endp}/${id}`, payload)).data,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["clientes"]});
      qc.invalidateQueries({ queryKey: ["cliente", variables.id]});
    }
  });
};

export const useDeleteCliente = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => (await api.delete(`${endp}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"]}),
  });
};

export const useClienteExpedientes = (clienteId: number) =>
  useQuery<ExpedienteSimple[]>({ queryKey: ["clienteExpedientes", clienteId], queryFn: async () => (await api.get(`${endp}/${clienteId}/expedientes`)).data, enabled: !!clienteId });
