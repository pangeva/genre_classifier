'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ResultsProps {
  results: {
    predictions: { label: string; score: number }[];
    filename: string;
  };
}

const Results = ({ results }: ResultsProps) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-lg font-semibold">Results:</h2>
        <p className="text-sm text-gray-500 mt-1 truncate">{results.filename}</p>
      </div>
      {results.predictions.map((result, index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex justify-between items-center mb-2"
        >
          <span className="text-gray-700">{result.label}</span>
          <span className="text-gray-500">{(result.score * 100).toFixed(1)}%</span>
        </motion.div>
      ))}
    </div>
  );
};

export default Results;