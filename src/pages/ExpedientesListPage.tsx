
import { useListExpediente } from "../api/hooks/useExpediente";
import DataTable from "../components/DataTable";
import { Column } from "react-table";
import { Link } from "react-router-dom";

interface Row {
  id: number;
  titulo: string;
  estado: string;
  cliente_nombre: string;
}

export default function ExpedientesListPage() {
  const { data } = useListExpediente();

  const columns: Column<Row>[] = [
    {
      Header: "Título",
      accessor: "titulo",
      Cell: ({ row }) => (
        <Link to={`/expedientes/${row.original.id}`} className="text-blue-500">
          {row.original.titulo}
        </Link>
      ),
    },
    { Header: "Cliente", accessor: "cliente_nombre" },
    { Header: "Estado", accessor: "estado" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Expedientes</h1>
      {data ? (
        <DataTable<Row> data={data} columns={columns} />
      ) : (
        "Cargando..."
      )}
    </div>
  );
}
