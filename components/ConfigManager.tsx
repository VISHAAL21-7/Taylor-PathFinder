import React, { useState } from 'react';
import { ExperimentConfig, SavedConfig } from '../types.ts';
import TrashIcon from './icons/TrashIcon.tsx';

interface ConfigManagerProps {
  savedConfigs: SavedConfig[];
  setSavedConfigs: (configs: SavedConfig[]) => void;
  currentConfig: ExperimentConfig;
  onLoadConfig: (config: ExperimentConfig) => void;
  onClose: () => void;
}

const ConfigManager: React.FC<ConfigManagerProps> = ({ savedConfigs, setSavedConfigs, currentConfig, onLoadConfig, onClose }) => {
  const [newConfigName, setNewConfigName] = useState('');

  const handleSave = () => {
    if (newConfigName.trim() === '') {
      alert('Please enter a name for the configuration.');
      return;
    }
    const newSavedConfig: SavedConfig = {
      id: new Date().toISOString(),
      name: newConfigName.trim(),
      config: currentConfig,
    };
    setSavedConfigs([...savedConfigs, newSavedConfig]);
    setNewConfigName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
        setSavedConfigs(savedConfigs.filter(c => c.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-base-100 dark:bg-dark-base-100 rounded-2xl shadow-xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Configuration Manager</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
        </div>

        <div className="space-y-2 mb-6">
          <input
            type="text"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            placeholder="New configuration name"
            className="w-full p-2 border border-base-300 dark:border-dark-base-300 bg-base-100 dark:bg-dark-base-200 rounded-md focus:ring-brand-primary focus:border-brand-primary"
          />
          <button
            onClick={handleSave}
            className="w-full bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Save Current Configuration
          </button>
        </div>

        <h3 className="text-lg font-medium mb-2">Saved Configurations</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {savedConfigs.length === 0 ? (
            <p className="text-base-content-secondary dark:text-dark-base-content-secondary text-sm">No configurations saved yet.</p>
          ) : (
            savedConfigs.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-base-200 dark:bg-dark-base-200 rounded-lg">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => onLoadConfig(item.config)} className="text-sm text-brand-primary hover:underline">Load</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;