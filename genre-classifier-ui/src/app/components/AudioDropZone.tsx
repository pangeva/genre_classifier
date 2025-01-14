'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WaveAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-purple-300 opacity-40"
        initial={{ width: "100%", height: "100%" }}
        animate={{
          width: ["100%", "150%"],
          height: ["100%", "150%"],
          opacity: [0.4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

const AudioDropZone = () => {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setCurrentSong(file.name);
      processAudio(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        layout
        animate={{
          y: results ? 0 : "50%",
          scale: results ? 0.8 : 1,
          translateY: results ? -180 : 0
        }}
        transition={{ type: "spring", bounce: 0.2 }}
        className="relative"
      >
        <div
          {...getRootProps()}
          className={`
            relative
            w-64 h-64
            flex flex-col items-center justify-center
            rounded-full
            bg-white
            shadow-lg
            transition-all duration-300 ease-in-out
            cursor-pointer
            border-4
            ${isDragActive ? 'border-purple-500 scale-105' : 'border-purple-200'}
            ${isProcessing ? 'bg-purple-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isProcessing && <WaveAnimation />}
          
          {isProcessing ? (
            <LoaderCircle className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
          ) : (
            <Music className={`w-12 h-12 ${isDragActive ? 'text-purple-500' : 'text-purple-400'}`} />
          )}
          
          <div className="mt-4 text-center relative z-10">
            {isProcessing ? (
              <>
                <p className="text-sm text-purple-500 font-medium">Processing...</p>
                {currentSong && (
                  <p className="text-xs text-gray-500 mt-2 max-w-[200px] truncate">
                    {currentSong}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Drop your MP3 here
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-md w-full"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioDropZone;