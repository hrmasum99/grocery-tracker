import React from 'react';

const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 text-sm ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm text-right">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;