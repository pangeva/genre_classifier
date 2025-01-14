'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from './DropZone';
import Results from './Results';

const AudioClassifier = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ predictions: { label: string; score: number }[], filename: string } | null>(null);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const processAudio = async (file: File) => {
    setIsProcessing(true);
    setResults(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResults({
        predictions: data.predictions,
        filename: file.name
      });
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
      setCurrentSong(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <motion.div
        layout
        className="fixed"
        initial={false}
        animate={{
          top: results ? '25%' : '50%',
          translateY: '-50%',
          scale: results ? 0.7 : 1,
        }}
        transition={{ 
          type: "spring",
          bounce: 0.2,
          duration: 0.6
        }}
      >
        <DropZone
          isProcessing={isProcessing}
          currentSong={currentSong}
          onFileAccepted={(file) => {
            setCurrentSong(file.name);
            processAudio(file);
          }}
        />
      </motion.div>

      <AnimatePresence>
        {results && (
          <motion.div 
            className="w-full px-4 absolute top-[55%]"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Results results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioClassifier;