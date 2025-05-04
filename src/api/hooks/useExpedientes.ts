import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../axios'

export function useExpedientes(params: any = {}) {
  return useQuery({
    queryKey: ['expedientes', params],
    queryFn: async () => {
      const { data } = await api.get('/expedientes', { params })
      return data
    },
  })
}

export function useExpediente(id: number) {
  return useQuery({
    queryKey: ['expediente', id],
    queryFn: async () => {
      const { data } = await api.get(`/expedientes/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateExpediente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/expedientes', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expedientes'] })
    },
  })
}

export function useUpdateExpediente(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.put(`/expedientes/${id}`, payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expedientes'] })
      qc.invalidateQueries({ queryKey: ['expediente', id] })
    },
  })
}

export function useDeleteExpediente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/expedientes/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expedientes'] })
    },
    onError: (error) => {
      console.error("Error deleting expediente:", error)
      alert(`Error al eliminar el expediente: ${error.message}`)
    }
  })
}
