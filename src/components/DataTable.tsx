"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Column {
  key: string;
  label: string;
  hideOnMobile?: boolean;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function DataTable({ columns, data, emptyMessage = "Aucune donnée" }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium text-sm">{emptyMessage}</p>
      </div>
    );
  }

  const mobileColumns = columns.filter(c => !c.hideOnMobile);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2.5">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm touch-active">
            {/* First column = header */}
            {mobileColumns.length > 0 && (
              <div className="mb-2 pb-2 border-b border-gray-50">
                <div className="font-semibold text-gray-900 text-sm">
                  {mobileColumns[0].render ? mobileColumns[0].render(item) : String(item[mobileColumns[0].key] ?? "")}
                </div>
              </div>
            )}
            {/* Rest = key-value pairs */}
            <div className="space-y-1.5">
              {mobileColumns.slice(1).map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400 font-medium flex-shrink-0">{col.label}</span>
                  <span className="text-[13px] text-gray-700 text-right truncate">{col.render ? col.render(item) : String(item[col.key] ?? "")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
