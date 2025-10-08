import { ExperimentConfig, SimulationResults } from '../types.ts';

const FACTORIALS = [1, 1, 2, 6, 24, 120, 720]; // 0! to 6!

// --- Problem Definitions ---

const expProblem = {
    f: (_t: number, y: number) => y,
    exact: (t: number, config: ExperimentConfig) => config.y0 * Math.exp(t - config.t0),
    getDerivatives: (_t: number, y: number, order: number) => {
        return Array(order).fill(y);
    }
};

const logisticProblem = {
    f: (_t: number, y: number, config: ExperimentConfig) => {
        const r = config.logisticR || 1;
        const K = config.logisticK || 1;
        if (K <= 0) return 0;
        return r * y * (1 - y / K);
    },
    exact: (t: number, config: ExperimentConfig) => {
        const { t0, y0 } = config;
        const r = config.logisticR || 1;
        const K = config.logisticK || 1;
        if (y0 === 0 || K <= 0) return 0;
        const A = (K - y0) / y0;
        return K / (1 + A * Math.exp(-r * (t - t0)));
    },
    getDerivatives: (_t: number, y: number, order: number, config: ExperimentConfig) => {
        const r = config.logisticR || 1;
        const K = config.logisticK || 1;
        if (K <= 0) return Array(order).fill(0);
        
        const derivatives = [];
        if (order < 1) return [];

        const d1 = r * y * (1 - y / K);
        derivatives.push(d1);
        if (order === 1) return derivatives;

        const d2 = d1 * (r - (2 * r * y) / K);
        derivatives.push(d2);
        if (order === 2) return derivatives;

        const d3 = d2 * (r - (2 * r * y) / K) - (2 * r / K) * d1 ** 2;
        derivatives.push(d3);
        if (order === 3) return derivatives;

        const d4 = d3 * (r - (2 * r * y) / K) - (6 * r / K) * d1 * d2;
        derivatives.push(d4);
        if (order === 4) return derivatives;

        const d5 = d4 * (r - (2 * r * y) / K) - (8 * r / K) * d1 * d3 - (6 * r / K) * d2 ** 2;
        derivatives.push(d5);
        if (order === 5) return derivatives;
        
        const d6 = d5 * (r - (2 * r * y) / K) - (10 * r / K) * d1 * d4 - (20 * r / K) * d2 * d3;
        derivatives.push(d6);

        return derivatives;
    }
};

const harmonicProblem = {
    f: (t: number, _y: number, config: ExperimentConfig) => {
        const A = config.harmonicA || 1;
        const w = config.harmonicW || 1;
        return A * w * Math.cos(w * t);
    },
    exact: (t: number, config: ExperimentConfig) => {
        const { t0, y0 } = config;
        const A = config.harmonicA || 1;
        const w = config.harmonicW || 1;
        if (w === 0) return y0;
        return A * (Math.sin(w * t) - Math.sin(w*t0)) + y0;
    },
    getDerivatives: (t: number, _y: number, order: number, config: ExperimentConfig) => {
        const A = config.harmonicA || 1;
        const w = config.harmonicW || 1;
        const derivatives = [];
        for (let i = 1; i <= order; i++) {
            const powerOfW = Math.pow(w, i);
            switch (i % 4) {
                case 1: derivatives.push(A * powerOfW * Math.cos(w * t)); break;
                case 2: derivatives.push(-A * powerOfW * Math.sin(w * t)); break;
                case 3: derivatives.push(-A * powerOfW * Math.cos(w * t)); break;
                case 0: derivatives.push(A * powerOfW * Math.sin(w * t)); break;
            }
        }
        return derivatives;
    }
};

const problems = {
    exp: expProblem,
    logistic: logisticProblem,
    harmonic: harmonicProblem,
    custom: expProblem, // Fallback for custom
};


const generateSimulationData = (config: ExperimentConfig): SimulationResults => {
    const start_time = performance.now();
    
    const { t0, y0, t_end, h, order } = config;
    const problem = problems[config.problem];
    
    const num_steps = Math.ceil((t_end - t0) / h);
    
    const t = [t0];
    const y_taylor = [y0];
    const y_euler = [y0];
    const y_rk4 = [y0];
    const y_exact = [y0];
    const abs_error = [0];

    let current_y_taylor = y0;
    let current_y_euler = y0;
    let current_y_rk4 = y0;

    for (let i = 0; i < num_steps; i++) {
        const current_t = t0 + i * h;
        const next_t = Math.min(t0 + (i + 1) * h, t_end);
        const actual_h = next_t - current_t;

        if (actual_h <= 0) continue;

        // Euler
        const f_euler = problem.f(current_t, current_y_euler, config);
        current_y_euler += actual_h * f_euler;
        
        // RK4
        const k1 = problem.f(current_t, current_y_rk4, config);
        const k2 = problem.f(current_t + actual_h / 2, current_y_rk4 + actual_h * k1 / 2, config);
        const k3 = problem.f(current_t + actual_h / 2, current_y_rk4 + actual_h * k2 / 2, config);
        const k4 = problem.f(current_t + actual_h, current_y_rk4 + actual_h * k3, config);
        current_y_rk4 += (actual_h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        
        // Taylor
        const derivatives = problem.getDerivatives(current_t, current_y_taylor, order, config);
        let taylor_sum = 0;
        for (let j = 0; j < order; j++) {
            taylor_sum += (derivatives[j] * Math.pow(actual_h, j + 1)) / FACTORIALS[j + 1];
        }
        current_y_taylor += taylor_sum;

        t.push(next_t);
        y_taylor.push(current_y_taylor);
        y_euler.push(current_y_euler);
        y_rk4.push(current_y_rk4);
        
        const exact_val = problem.exact(next_t, config);
        y_exact.push(exact_val);
        
        const error = Math.abs(current_y_taylor - exact_val);
        abs_error.push(error);
    }
    
    let max_error = 0;
    let rmse_sum = 0;
    for(let i=0; i < abs_error.length; i++) {
        if (isFinite(abs_error[i])) {
            if (abs_error[i] > max_error) max_error = abs_error[i];
            rmse_sum += abs_error[i] ** 2;
        }
    }
    const rmse = Math.sqrt(rmse_sum / abs_error.length);
    const runtime = ((performance.now() - start_time) / 1000).toFixed(3) + 's';

    const data = t.map((time, i) => ({
        t: time,
        y_taylor: y_taylor[i],
        y_exact: y_exact[i],
        abs_error: abs_error[i]
    }));

    return {
        meta: {
            problem: config.problem,
            t0, y0, t_end, h, order, num_steps, max_error, rmse, runtime
        },
        data: data,
        plots: {
            solution: { t, taylor: y_taylor, exact: y_exact, euler: y_euler, rk4: y_rk4 },
            error: { t, error: abs_error }
        }
    };
}


export const runMockSimulation = (config: ExperimentConfig): Promise<SimulationResults> => {
    console.log("Running dynamic simulation with config:", config);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = generateSimulationData(config);
            resolve(results);
        }, 500); // Simulate network latency
    });
};
