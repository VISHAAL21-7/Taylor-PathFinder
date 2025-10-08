import React from 'react';
import { SimulationPlots } from '../types.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface ErrorPlotProps {
    data: SimulationPlots['error'];
}

const ErrorPlot: React.FC<ErrorPlotProps> = ({ data }) => {
    const plotData = data.t.map((t_val, i) => ({
        t: t_val,
        // Log scale cannot handle 0. Replace with null so the point is ignored by the chart.
        error: data.error[i] > 0 ? data.error[i] : null,
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
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="t" tick={{ fill: textColor }} label={{ value: 't', position: 'insideBottomRight', offset: -5, fill: textColor }} />
                    <YAxis scale="log" domain={['auto', 'auto']} tick={{ fill: textColor }}>
                        <Label value="|error|" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: textColor }} />
                    </YAxis>
                    <Tooltip
                        formatter={(value: number) => {
                            if (typeof value !== 'number') return null;
                            return value.toExponential(3);
                        }}
                        contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            border: `1px solid ${gridColor}`,
                            borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: textColor }}
                    />
                    <Legend wrapperStyle={{ color: textColor }} />
                    <Line type="monotone" dataKey="error" name="Absolute Error (log scale)" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ErrorPlot;