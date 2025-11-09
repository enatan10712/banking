import type { ReactNode } from "react";
import clsx from "clsx";

export interface TableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = "No records found." }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/10">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.header + index}
                scope="col"
                className={clsx(
                  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800/40">
                {columns.map((column, colIndex) => (
                  <td
                    key={column.header + colIndex}
                    className={clsx(
                      "px-4 py-3 text-slate-200",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
