import React from 'react';
import { SimulationDataPoint } from '../types.ts';

interface DataTableProps {
  data: SimulationDataPoint[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="bg-base-100 dark:bg-dark-base-100 p-4 sm:p-6 rounded-2xl shadow-card">
      <h3 className="text-xl font-semibold text-base-content dark:text-dark-base-content mb-4">Data Preview (First 10 Rows)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['t', 'y_taylor', 'y_exact', 'abs_error'].map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-base-100 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-base-content">{row.t.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-base-content-secondary">{row.y_taylor.toFixed(6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-base-content-secondary">{row.y_exact.toFixed(6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-base-content-secondary">{row.abs_error.toExponential(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;