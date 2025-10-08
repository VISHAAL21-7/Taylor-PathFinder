import React, { useState, useCallback, useEffect } from 'react';
import { ExperimentConfig, SimulationResults, SavedConfig } from './types.ts';
import { DEFAULT_CONFIG, EXAMPLE_CONFIG } from './constants.ts';
import { runMockSimulation } from './services/simulationService.ts';
import ExperimentBuilder from './components/ExperimentBuilder.tsx';
import ResultsPanel from './components/ResultsPanel.tsx';
import ConfigManager from './components/ConfigManager.tsx';
import HelpModal from './components/HelpModal.tsx';
import useLocalStorage from './hooks/useLocalStorage.ts';
import SunIcon from './components/icons/SunIcon.tsx';
import MoonIcon from './components/icons/MoonIcon.tsx';


const App: React.FC = () => {
    const [config, setConfig] = useState<ExperimentConfig>(DEFAULT_CONFIG);
    const [results, setResults] = useState<SimulationResults | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isConfigManagerOpen, setConfigManagerOpen] = useState(false);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);

    const [savedConfigs, setSavedConfigs] = useLocalStorage<SavedConfig[]>('taylorPathfinderConfigs', []);
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleRun = useCallback(async (runConfig: ExperimentConfig) => {
        setIsLoading(true);
        setResults(null);
        setError(null);
        try {
            const simResults = await runMockSimulation(runConfig);
            setResults(simResults);
        } catch (err) {
            setError('Simulation failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRunSample = () => {
        setConfig(EXAMPLE_CONFIG);
        handleRun(EXAMPLE_CONFIG);
    };
    
    const handleNewExperiment = () => {
        setResults(null);
        setConfig(DEFAULT_CONFIG);
        setError(null);
    }

    const loadConfig = (loadedConfig: ExperimentConfig) => {
        setConfig(loadedConfig);
        setConfigManagerOpen(false);
        setResults(null);
    }

    return (
        <div className="min-h-screen bg-base-200 dark:bg-dark-base-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-base-content dark:text-dark-base-content">Taylor PathFinder</h1>
                        <p className="text-lg text-base-content-secondary dark:text-dark-base-content-secondary mt-1">Series-based solver — StepSize, Order, Accuracy</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-base-100 dark:bg-dark-base-100 shadow-sm hover:bg-base-300 dark:hover:bg-dark-base-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </header>
                
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {!results && !isLoading && (
                            <div className="bg-base-100 dark:bg-dark-base-100 p-6 rounded-2xl shadow-card flex flex-col items-start space-y-4">
                               <h2 className="text-2xl font-semibold text-base-content dark:text-dark-base-content">Get Started</h2>
                                <p className="text-base-content-secondary dark:text-dark-base-content-secondary">Run a sample simulation or configure your own experiment.</p>
                                <button
                                    onClick={handleRunSample}
                                    className="w-full bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
                                >
                                    Run Sample
                                </button>
                            </div>
                        )}
                        <ExperimentBuilder 
                            config={config} 
                            setConfig={setConfig} 
                            onRun={handleRun}
                            isLoading={isLoading}
                            onOpenConfigManager={() => setConfigManagerOpen(true)}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {isLoading && (
                            <div className="flex items-center justify-center h-96 bg-base-100 dark:bg-dark-base-100 rounded-2xl shadow-card">
                                <div className="text-center">
                                    <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="mt-4 text-lg font-semibold text-base-content dark:text-dark-base-content">Running simulation...</p>
                                </div>
                            </div>
                        )}
                        {error && (
                             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {results && (
                            <ResultsPanel results={results} onNewExperiment={handleNewExperiment} />
                        )}
                    </div>
                </main>
                
                <footer className="text-center mt-12 text-base-content-secondary dark:text-dark-base-content-secondary">
                    <button onClick={() => setHelpModalOpen(true)} className="text-brand-primary hover:underline">Help / About</button>
                    <p className="mt-2 text-sm">Taylor PathFinder UI Prototype</p>
                </footer>
            </div>
            
            {isConfigManagerOpen && (
                <ConfigManager 
                    savedConfigs={savedConfigs}
                    setSavedConfigs={setSavedConfigs}
                    currentConfig={config}
                    onLoadConfig={loadConfig}
                    onClose={() => setConfigManagerOpen(false)} 
                />
            )}

            {isHelpModalOpen && (
                <HelpModal onClose={() => setHelpModalOpen(false)} />
            )}
        </div>
    );
};

export default App;