import React, { useState, useEffect, useCallback } from 'react';
import { ExperimentConfig } from '../types.ts';
import ChevronDownIcon from './icons/ChevronDownIcon.tsx';

interface ExperimentBuilderProps {
  config: ExperimentConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExperimentConfig>>;
  onRun: (config: ExperimentConfig) => void;
  isLoading: boolean;
  onOpenConfigManager: () => void;
}

interface FormErrors {
  t0?: string;
  y0?: string;
  t_end?: string;
  h?: string;
  order?: string;
  logisticR?: string;
  logisticK?: string;
  harmonicA?: string;
  harmonicW?: string;
  customFunctionString?: string;
}

const ExperimentBuilder: React.FC<ExperimentBuilderProps> = ({ config, setConfig, onRun, isLoading, onOpenConfigManager }) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    if (config.h <= 0) newErrors.h = "Step size must be > 0.";
    if (config.t_end <= config.t0) newErrors.t_end = "t_end must be > t0.";
    if (!Number.isInteger(config.order) || config.order < 1 || config.order > 6) {
        newErrors.order = "Order must be an integer from 1 to 6.";
    }
    if (config.problem === 'logistic') {
        if (config.logisticR === undefined || config.logisticR <= 0) newErrors.logisticR = "r must be > 0.";
        if (config.logisticK === undefined || config.logisticK <= 0) newErrors.logisticK = "K must be > 0.";
    }
    if (config.problem === 'harmonic') {
        if (config.harmonicA === undefined) newErrors.harmonicA = "Amplitude is required.";
        if (config.harmonicW === undefined) newErrors.harmonicW = "Frequency is required.";
    }
    if (config.problem === 'custom') {
        if (!config.customFunctionString || config.customFunctionString.trim() === '') {
            newErrors.customFunctionString = "Function definition cannot be empty.";
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config]);

  useEffect(() => {
    validate();
  }, [config, validate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumericField = !['problem', 'derivativeMode', 'customFunctionString'].includes(name);
    setConfig(prev => ({ ...prev, [name]: isNumericField ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRun(config);
    }
  };

  const InputField = ({ label, name, type = "number", value, error, children, ...props }: any) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-base-content-secondary dark:text-dark-base-content-secondary">{label}</label>
      <div className="mt-1 relative">
        {type === 'select' ? (
          <>
            <select
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 text-base bg-base-100 dark:bg-dark-base-100 border-base-300 dark:border-dark-base-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md appearance-none"
              {...props}
            >
              {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDownIcon />
            </div>
          </>
        ) : type === 'textarea' ? (
             <textarea
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-base-100 dark:bg-dark-base-100 ${error ? 'border-red-500' : 'border-base-300 dark:border-dark-base-300'} focus:ring-brand-primary focus:border-brand-primary`}
                {...props}
             />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md bg-base-100 dark:bg-dark-base-100 ${error ? 'border-red-500' : 'border-base-300 dark:border-dark-base-300'} focus:ring-brand-primary focus:border-brand-primary`}
            {...props}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="bg-base-100 dark:bg-dark-base-100 p-6 rounded-2xl shadow-card">
      <h2 className="text-2xl font-semibold text-base-content dark:text-dark-base-content mb-4">Experiment Builder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="t0" name="t0" value={config.t0} error={errors.t0} step="any" />
          <InputField label="y0" name="y0" value={config.y0} error={errors.y0} step="any" />
          <InputField label="t_end" name="t_end" value={config.t_end} error={errors.t_end} step="any" />
          <InputField label="Step Size (h)" name="h" value={config.h} error={errors.h} step="any" />
        </div>
        
        <InputField label="Order" name="order" type="select" value={config.order} error={errors.order}>
            {[1, 2, 3, 4, 5, 6].map(o => <option key={o} value={o}>{o}</option>)}
        </InputField>

        <InputField label="Problem" name="problem" type="select" value={config.problem}>
            <option value="exp">Exponential</option>
            <option value="logistic">Logistic</option>
            <option value="harmonic">Harmonic</option>
            <option value="custom">Custom Function</option>
        </InputField>

        {config.problem === 'logistic' && (
          <div className="grid grid-cols-2 gap-4 p-4 border border-base-200 dark:border-dark-base-300 rounded-md">
            <InputField label="Growth Rate (r)" name="logisticR" value={config.logisticR} error={errors.logisticR} step="any" />
            <InputField label="Capacity (K)" name="logisticK" value={config.logisticK} error={errors.logisticK} step="any" />
          </div>
        )}
        
        {config.problem === 'harmonic' && (
          <div className="grid grid-cols-2 gap-4 p-4 border border-base-200 dark:border-dark-base-300 rounded-md">
            <InputField label="Amplitude (A)" name="harmonicA" value={config.harmonicA} error={errors.harmonicA} step="any" />
            <InputField label="Frequency (ω)" name="harmonicW" value={config.harmonicW} error={errors.harmonicW} step="any" />
          </div>
        )}
        
        {config.problem === 'custom' && (
          <div className="p-4 border border-base-200 dark:border-dark-base-300 rounded-md">
            <InputField label="y' = f(t, y)" name="customFunctionString" type="textarea" value={config.customFunctionString} error={errors.customFunctionString} rows={2} />
            <p className="text-xs text-base-content-secondary dark:text-dark-base-content-secondary mt-1">Note: Function parsing is not implemented in this prototype.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-base-content-secondary dark:text-dark-base-content-secondary">Derivative Mode</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button type="button" onClick={() => setConfig(p => ({...p, derivativeMode: 'analytic'}))} className={`px-4 py-2 text-sm font-medium ${config.derivativeMode === 'analytic' ? 'bg-brand-primary text-white' : 'bg-base-100 dark:bg-dark-base-100 text-base-content dark:text-dark-base-content hover:bg-base-200 dark:hover:bg-dark-base-300'} border border-gray-300 dark:border-dark-base-300 rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary`}>Analytic</button>
            <button type="button" onClick={() => setConfig(p => ({...p, derivativeMode: 'finite'}))} className={`-ml-px px-4 py-2 text-sm font-medium ${config.derivativeMode === 'finite' ? 'bg-brand-primary text-white' : 'bg-base-100 dark:bg-dark-base-100 text-base-content dark:text-dark-base-content hover:bg-base-200 dark:hover:bg-dark-base-300'} border border-gray-300 dark:border-dark-base-300 rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary`}>Finite</button>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={isLoading || Object.keys(errors).length > 0}
            className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            {isLoading ? 'Running...' : 'Run Simulation'}
          </button>
          <button
            type="button"
            onClick={onOpenConfigManager}
            className="w-full bg-base-200 dark:bg-dark-base-300 text-base-content dark:text-dark-base-content font-semibold py-2 px-4 rounded-lg hover:bg-base-300 dark:hover:bg-dark-base-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-300"
          >
            Manage Configurations
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperimentBuilder;