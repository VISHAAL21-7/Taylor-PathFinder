import { ExperimentConfig } from './types.ts';

export const DEFAULT_CONFIG: ExperimentConfig = {
  t0: 0.0,
  y0: 1.0,
  t_end: 1.0,
  h: 0.1,
  order: 3,
  problem: 'exp',
  derivativeMode: 'analytic',
  logisticR: 1.0,
  logisticK: 10.0,
  harmonicA: 1.0,
  harmonicW: 1.0,
  customFunctionString: "y' = t * y",
};

export const EXAMPLE_CONFIG: ExperimentConfig = {
  t0: 0.0,
  y0: 1.0,
  t_end: 5.0,
  h: 0.2,
  order: 4,
  problem: 'exp',
  derivativeMode: 'analytic',
};