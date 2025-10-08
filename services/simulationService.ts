
import { ExperimentConfig, SimulationResults } from '../types.ts';

// This function simulates a backend API call.
// In a real application, this would be an HTTP request.
export const runMockSimulation = (config: ExperimentConfig): Promise<SimulationResults> => {
    console.log("Running mock simulation with config:", config);
    
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                // Fetch the mock data instead of using an import assertion for broader browser compatibility.
                const response = await fetch('./mocks/run-success.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const mockData = await response.json();

                // For a more realistic mock, we can slightly adjust the mock data based on the config.
                // Here, we just update the metadata.
                const results: SimulationResults = {
                    ...mockData,
                    meta: {
                        ...mockData.meta,
                        problem: config.problem,
                        t0: config.t0,
                        y0: config.y0,
                        t_end: config.t_end,
                        h: config.h,
                        order: config.order,
                        num_steps: Math.ceil((config.t_end - config.t0) / config.h),
                    }
                };
                resolve(results as SimulationResults);
            } catch (error) {
                console.error("Failed to load or process mock simulation data:", error);
                reject(error);
            }
        }, 1000); // Simulate network latency
    });
};

export const fetchComparisonData = (): Promise<{ solution: { euler: number[], rk4: number[] } }> => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch('./mocks/compare-methods.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                resolve(data);
            } catch (error) {
                console.error("Failed to load comparison data:", error);
                reject(error);
            }
        }, 500); // Simulate shorter latency for this call
    });
};