export interface ExperimentConfig {
  t0: number;
  y0: number;
  t_end: number;
  h: number; // StepSize
  order: number;
  problem: 'exp' | 'logistic' | 'harmonic' | 'custom';
  // Logistic parameters
  logisticR?: number;
  logisticK?: number;
  // Harmonic parameters
  harmonicA?: number;
  harmonicW?: number;
  // Custom function
  customFunctionString?: string;
  derivativeMode: 'analytic' | 'finite';
}

export interface SimulationMeta {
  problem: string;
  t0: number;
  y0: number;
  t_end: number;
  h: number;
  order: number;
  num_steps: number;
  max_error: number;
  rmse: number;
  runtime?: string;
}

export interface SimulationDataPoint {
  t: number;
  y_taylor: number;
  y_exact: number;
  abs_error: number;
}

export interface SimulationPlots {
  solution: {
    t: number[];
    taylor: number[];
    exact: number[];
  };
  error: {
    t: number[];
    error: number[];
  };
}

export interface ComparisonPlotData {
  euler: number[];
  rk4: number[];
}

export interface SimulationResults {
  meta: SimulationMeta;
  data: SimulationDataPoint[];
  plots: SimulationPlots;
}

export interface SavedConfig {
  id: string;
  name: string;
  config: ExperimentConfig;
}