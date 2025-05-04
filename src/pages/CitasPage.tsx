
import { Calendar, Views, momentLocalizer, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useListCita } from "../api/hooks/useCita";

const localizer = dayjsLocalizer(dayjs);

export default function CitasPage() {
  const { data } = useListCita();
  const events =
    data?.map((c: any) => ({
      id: c.id,
      title: c.titulo,
      start: new Date(c.fecha_hora_inicio),
      end: new Date(c.fecha_hora_fin || c.fecha_hora_inicio),
    })) || [];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Agenda</h1>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        style={{ height: 600 }}
      />
    </div>
  );
}
