import React from 'react';
import { SimulationMeta } from '../types.ts';
import DownloadIcon from './icons/DownloadIcon.tsx';

interface SummaryCardProps {
  meta: SimulationMeta;
  onDownloadCSV: () => void;
  onDownloadJSON: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ meta, onDownloadCSV, onDownloadJSON }) => {
  const StatItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="p-3 bg-base-200 dark:bg-dark-base-300 rounded-lg text-center">
      <p className="text-sm text-base-content-secondary dark:text-dark-base-content-secondary">{label}</p>
      <p className="text-lg font-semibold text-base-content dark:text-dark-base-content">{value !== undefined ? value : 'N/A'}</p>
    </div>
  );

  return (
    <div className="bg-base-100 dark:bg-dark-base-100 p-6 rounded-2xl shadow-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-semibold text-base-content dark:text-dark-base-content">Run Summary</h3>
            <div className="flex items-center gap-2">
                <button onClick={onDownloadCSV} className="flex items-center gap-2 text-sm bg-base-200 dark:bg-dark-base-300 hover:bg-base-300 dark:hover:bg-dark-base-200 text-base-content dark:text-dark-base-content font-medium py-2 px-3 rounded-md transition-colors">
                    <DownloadIcon /> CSV
                </button>
                <button onClick={onDownloadJSON} className="flex items-center gap-2 text-sm bg-base-200 dark:bg-dark-base-300 hover:bg-base-300 dark:hover:bg-dark-base-200 text-base-content dark:text-dark-base-content font-medium py-2 px-3 rounded-md transition-colors">
                    <DownloadIcon /> JSON
                </button>
            </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatItem label="Num Steps" value={meta.num_steps} />
        <StatItem label="Step Size (h)" value={meta.h} />
        <StatItem label="Order" value={meta.order} />
        <StatItem label="Max Error" value={meta.max_error.toExponential(2)} />
        <StatItem label="RMSE" value={meta.rmse.toExponential(2)} />
        <StatItem label="Runtime" value={meta.runtime || '0.05s'} />
      </div>
    </div>
  );
};

export default SummaryCard;