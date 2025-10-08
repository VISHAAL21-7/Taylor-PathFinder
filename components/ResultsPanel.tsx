import React, { useState, useCallback } from 'react';
import { SimulationResults, ComparisonPlotData } from '../types.ts';
import { fetchComparisonData } from '../services/simulationService.ts';
import SummaryCard from './SummaryCard.tsx';
import SolutionPlot from './SolutionPlot.tsx';
import ErrorPlot from './ErrorPlot.tsx';
import DataTable from './DataTable.tsx';

interface ResultsPanelProps {
  results: SimulationResults;
  onNewExperiment: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onNewExperiment }) => {
    const [activeTab, setActiveTab] = useState<'solution' | 'error'>('solution');
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonData, setComparisonData] = useState<ComparisonPlotData | null>(null);
    const [isComparisonLoading, setIsComparisonLoading] = useState(false);
    const [comparisonError, setComparisonError] = useState<string | null>(null);

    const handleCompareToggle = useCallback(async (enabled: boolean) => {
        setIsComparing(enabled);
        if (enabled && !comparisonData) {
            setIsComparisonLoading(true);
            setComparisonError(null);
            try {
                const data = await fetchComparisonData();
                setComparisonData(data.solution);
            } catch (err) {
                setComparisonError('Failed to load comparison data.');
                setIsComparing(false); // Toggle off on error
            } finally {
                setIsComparisonLoading(false);
            }
        }
    }, [comparisonData]);

    const downloadCSV = () => {
        const headers = "t,y_taylor,y_exact,abs_error";
        const rows = results.data.map(d => `${d.t},${d.y_taylor},${d.y_exact},${d.abs_error}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `taylor_results_${results.meta.problem}_h${results.meta.h}_o${results.meta.order}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadJSON = () => {
        const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results.meta, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", jsonContent);
        link.setAttribute("download", `summary_${results.meta.problem}_h${results.meta.h}_o${results.meta.order}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-base-content dark:text-dark-base-content">Results</h2>
        <button
            onClick={onNewExperiment}
            className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
        >
            + New Experiment
        </button>
      </div>

      <SummaryCard meta={results.meta} onDownloadCSV={downloadCSV} onDownloadJSON={downloadJSON} />
      
      <div className="bg-base-100 dark:bg-dark-base-100 p-4 sm:p-6 rounded-2xl shadow-card">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('solution')}
                    className={`${activeTab === 'solution' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Solution Plot
                </button>
                <button
                    onClick={() => setActiveTab('error')}
                    className={`${activeTab === 'error' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Error Plot
                </button>
            </nav>
            <div className="flex items-center gap-2 py-2">
                <label htmlFor="compare-toggle" className="text-sm font-medium text-base-content-secondary dark:text-dark-base-content-secondary">Compare Methods</label>
                <button
                    role="switch"
                    aria-checked={isComparing}
                    id="compare-toggle"
                    onClick={() => handleCompareToggle(!isComparing)}
                    className={`${isComparing ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2`}
                >
                    <span
                        aria-hidden="true"
                        className={`${isComparing ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                </button>
                {isComparisonLoading && (
                     <svg className="animate-spin h-4 w-4 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
            </div>
        </div>
        {comparisonError && <p className="text-red-500 text-sm mt-2">{comparisonError}</p>}
        <div className="mt-6">
            {activeTab === 'solution' && <SolutionPlot data={results.plots.solution} comparisonData={isComparing ? comparisonData : null} />}
            {activeTab === 'error' && <ErrorPlot data={results.plots.error} />}
        </div>
      </div>

      <DataTable data={results.data.slice(0, 10)} />
    </div>
  );
};

export default ResultsPanel;