import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

// Placeholder para tipo Cita - ASEGÚRATE de que coincida con la API
interface Cita {
  id: number;
  titulo: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  // Añadir OTROS campos que devuelve la API como cliente_id, etc.
  [key: string]: any; // Permite otros campos
}

const endp = "/citas";

// LISTAR
export const useListCita = (params: Record<string, any> = {}) =>
  // Especificar Cita[] como tipo de retorno esperado
  useQuery<Cita[]>({ queryKey: ["citas", params], queryFn: async () => (await api.get(endp, { params })).data });

// OBTENER UNO (Nuevo)
export const useCita = (id: number) =>
  useQuery<Cita>({ // Especificar tipo de retorno
    queryKey: ["cita", id],
    queryFn: async () => (await api.get(`${endp}/${id}`)).data,
    enabled: !!id, // Solo ejecutar si el ID es válido
  });

// CREAR (Existente)
export const useCreateCita = () => {
  const qc = useQueryClient();
  return useMutation<Cita, Error, Omit<Cita, 'id'>>({ // Tipos más específicos
    mutationFn: async (payload) => (await api.post(endp, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["citas"]}),
  });
};

// ACTUALIZAR (Existente)
export const useUpdateCita = () => {
  const qc = useQueryClient();
  return useMutation<Cita, Error, Partial<Cita> & { id: number }>({ // Tipos más específicos
    mutationFn: async ({ id, ...payload }) => (await api.put(`${endp}/${id}`, payload)).data,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["citas"]});
      qc.invalidateQueries({ queryKey: ["cita", variables.id]}); // Invalidar detalle
    }
  });
};

// ELIMINAR (Existente)
export const useDeleteCita = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({ // Tipos más específicos
    mutationFn: async (id: number) => (await api.delete(`${endp}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["citas"]}),
  });
};
