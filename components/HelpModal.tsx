import React from 'react';
import { EXAMPLE_CONFIG } from '../constants.ts';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-base-100 dark:bg-dark-base-100 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">About Taylor PathFinder</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
        </div>
        <div className="prose dark:prose-invert max-w-none text-base-content dark:text-dark-base-content">
          <h4>What is the Taylor Method?</h4>
          <p>
            The Taylor method is a numerical technique for approximating solutions to ordinary differential equations (ODEs). It uses a Taylor series expansion to predict the value of the solution at the next step, based on its value and derivatives at the current step. Higher-order methods generally provide better accuracy for a given step size.
          </p>
          
          <h4>How to Use This Tool</h4>
          <ol>
            <li><strong>Configure:</strong> Use the "Experiment Builder" to set your initial conditions (t0, y0), the end time (t_end), step size (h), and the order of the method.</li>
            <li><strong>Select Problem:</strong> Choose a pre-defined ODE problem like Exponential or Logistic growth.</li>
            <li><strong>Run:</strong> Click "Run Simulation" to see the results. Since this is a UI prototype, the backend is mocked, and results are generated instantly.</li>
            <li><strong>Analyze:</strong> View the summary, plots, and data table. You can download the results as CSV or JSON.</li>
            <li><strong>Save/Load:</strong> Use the "Manage Configurations" button to save your settings for later use.</li>
          </ol>
          
          <h4>Sample Configuration</h4>
          <p>Here's a sample configuration you can try:</p>
          <pre className="bg-base-200 dark:bg-dark-base-300 p-3 rounded-lg text-sm"><code>{JSON.stringify(EXAMPLE_CONFIG, null, 2)}</code></pre>

          <h4>About this Prototype</h4>
          <p>This application is a frontend prototype built with React, TypeScript, and Tailwind CSS. All "simulation" results are generated from a mocked local data source to demonstrate the UI/UX flow. No actual calculations are performed.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;