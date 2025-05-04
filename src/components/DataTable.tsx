
import { HtmlHTMLAttributes } from 'react'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

interface Props<T> extends HtmlHTMLAttributes<HTMLTableElement> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (row: T) => void
}

function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading,
  onRowClick,
  ...tableProps
}: Props<T>) {
  return (
    <div className="overflow-x-auto bg-brand-dark rounded-xl shadow">
      <table className="min-w-full divide-y divide-brand-light" {...tableProps}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-2 text-left text-sm font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-light">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Cargando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center opacity-60">
                Sin resultados
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-brand-light cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, idx) => {
                  const content =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as any)
                  return (
                    <td key={idx} className="px-4 py-2 text-sm">
                      {content}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
