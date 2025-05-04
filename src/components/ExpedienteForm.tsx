
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateExpediente } from '../api/hooks/useExpedientes'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  titulo: z.string().min(3),
  tipo: z.string().min(3),
  cliente_id: z.number(),
  descripcion: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function ExpedienteForm() {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useCreateExpediente()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await mutateAsync({
      ...data,
      estado: 'abierto',
      equipo_id: 1,
      usuario_asignado_id: 1,
    })
    navigate('/expedientes')
  }

  return (
    <div className="max-w-xl mx-auto bg-brand-dark p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">Nuevo Expediente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input
            {...register('titulo')}
            className="w-full p-2 rounded bg-brand-light"
            placeholder="Título"
          />
          {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Tipo</label>
          <input
            {...register('tipo')}
            className="w-full p-2 rounded bg-brand-light"
            placeholder="Tipo de caso"
          />
          {errors.tipo && <p className="text-red-500 text-xs">{errors.tipo.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Cliente ID</label>
          <input
            type="number"
            {...register('cliente_id', { valueAsNumber: true })}
            className="w-full p-2 rounded bg-brand-light"
            placeholder="ID del cliente"
          />
          {errors.cliente_id && <p className="text-red-500 text-xs">Cliente requerido</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            {...register('descripcion')}
            className="w-full p-2 rounded bg-brand-light"
            rows={3}
          />
        </div>

        <button
          disabled={isPending}
          className="bg-brand-primary px-4 py-2 rounded disabled:opacity-50"
          type="submit"
        >
          Guardar
        </button>
      </form>
    </div>
  )
}

export default ExpedienteForm
