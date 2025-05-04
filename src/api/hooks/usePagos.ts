import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

const baseUrl = '/pagos';

export function usePagos() {
  return useQuery(['pagos'], async () => {
    const { data } = await api.get(baseUrl);
    return data;
  });
}

// Get all payments for a specific invoice
export function useFacturaPagos(facturaId: number) {
  return useQuery({
    queryKey: ['pagos', 'factura', facturaId],
    queryFn: async () => {
      const { data } = await api.get(`/pagos/facturas/${facturaId}/pagos`);
      return data;
    },
    enabled: !!facturaId, // Only run if facturaId is provided
  });
}

// Create a new payment for a specific invoice
export function useCreatePago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ facturaId, payload }: { facturaId: number, payload: any }) => {
      const { data } = await api.post(`/pagos/facturas/${facturaId}/pagos`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pagos', 'factura', variables.facturaId] });
      queryClient.invalidateQueries({ queryKey: ['facturas'] }); // Update invoice list as payment may change status
      queryClient.invalidateQueries({ queryKey: ['facturas-dashboard'] });
    }
  });
}

export function useUpdatePago() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const { data } = await api.put(`${baseUrl}/${id}`, payload);
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['pagos'])
    }
  );
}

// Delete a payment
export function useDeletePago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, facturaId }: { id: number, facturaId: number }) => {
      await api.delete(`/pagos/pagos/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pagos', 'factura', variables.facturaId] });
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.invalidateQueries({ queryKey: ['facturas-dashboard'] });
    }
  });
}

// Get a specific payment details
export function usePago(id: number) {
  return useQuery({
    queryKey: ['pago', id],
    queryFn: async () => {
      const { data } = await api.get(`/pagos/pagos/${id}`);
      return data;
    },
    enabled: !!id, // Only run if id is provided
  });
}
