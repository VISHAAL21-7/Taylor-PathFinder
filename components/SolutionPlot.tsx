import React from 'react';
import { SimulationPlots, ComparisonPlotData } from '../types.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SolutionPlotProps {
    data: SimulationPlots['solution'];
    comparisonData?: ComparisonPlotData | null;
}

const SolutionPlot: React.FC<SolutionPlotProps> = ({ data, comparisonData }) => {
    const plotData = data.t.map((t_val, i) => ({
        t: t_val,
        taylor: data.taylor[i],
        exact: data.exact[i],
        euler: comparisonData?.euler[i],
        rk4: comparisonData?.rk4[i],
    }));
    
    // Check for dark mode to adjust text color
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#f9fafb' : '#1f2937';
    const gridColor = isDarkMode ? '#374151' : '#e5e7eb';


    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={plotData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="t" tick={{ fill: textColor }} label={{ value: 't', position: 'insideBottomRight', offset: -5, fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} label={{ value: 'y(t)', angle: -90, position: 'insideLeft', fill: textColor }} />
                    <Tooltip
                        formatter={(value: number, name: string) => {
                            const formattedValue = typeof value === 'number' ? value.toFixed(5) : 'N/A';
                            // Capitalize name
                            const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                            return [formattedValue, displayName];
                        }}
                        contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            border: `1px solid ${gridColor}`,
                            borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: textColor }}
                    />
                    <Legend wrapperStyle={{ color: textColor }} />
                    <Line type="monotone" dataKey="taylor" name="Taylor" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="exact" name="Exact" stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    {comparisonData && (
                        <>
                            <Line type="monotone" dataKey="euler" name="Euler" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="rk4" name="RK4" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        </>
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SolutionPlot;