import React, { useMemo, useState, useCallback } from 'react';
import { Calendar, Views, EventProps, SlotInfo } from 'react-big-calendar';
import { localizer } from '../utils/calendarLocalizer'; // Importar el localizer
import { useListCita } from '../api/hooks/useCita';
import { Box, CircularProgress, Alert, Paper } from '@mui/material';
import CitaForm from '../components/CitaForm'; // Importar CitaForm

// Evento formateado para react-big-calendar
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: any; // Para datos adicionales
}

// Componente personalizado para renderizar eventos (opcional)
const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  return (
    <span>
      <strong>{event.title}</strong>
      {/* Aquí podrías añadir más info si la pasas en event.resource */}
    </span>
  );
};

const AgendaPage: React.FC = () => {
  const { data: citas, isLoading, isError, error } = useListCita();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  // Mapear las citas al formato que espera react-big-calendar
  const events: CalendarEvent[] = useMemo(() => {
    if (!citas) return [];
    return citas.map((cita) => ({
      id: cita.id,
      title: cita.titulo,
      start: new Date(cita.fecha_hora_inicio),
      end: new Date(cita.fecha_hora_fin),
      resource: cita,
    }));
  }, [citas]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null); // Asegurar que no estamos editando
    setIsFormOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null); // Asegurar que no estamos creando
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
    // Podríamos necesitar refetch de citas aquí si CitaForm no lo hace
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error al cargar las citas: {error?.message}</Alert>;

  return (
    <Paper sx={{ p: 2, height: '85vh' }}> {/* Ajustar altura según necesidad */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.WEEK}
        style={{ height: '100%' }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay eventos en este rango.",
          // ... puedes añadir más traducciones
        }}
        // onView={(view) => console.log("Cambiando vista a:", view)}
        // onNavigate={(date, view) => console.log("Navegando a:", date, view)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        // components={{ // Opcional: usar componente personalizado
        //   event: EventComponent,
        // }}
        selectable // Permite seleccionar slots de tiempo
      />
      {/* Renderizar el modal CitaForm */}
      {isFormOpen && (
        <CitaForm
          open={isFormOpen}
          onClose={handleCloseForm}
          citaId={selectedEvent?.id} // Pasar ID si estamos editando
          initialData={{ // Pasar fechas si creamos desde slot
            fecha_hora_inicio: selectedSlot?.start.toISOString(),
            fecha_hora_fin: selectedSlot?.end.toISOString(),
          }}
        />
      )}
    </Paper>
  );
};

export default AgendaPage; 