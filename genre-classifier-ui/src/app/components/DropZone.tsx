'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WaveAnimation = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-purple-300 opacity-40"
        initial={{ width: "100%", height: "100%" }}
        animate={{
          width: ["100%", "170%"],
          height: ["100%", "170%"],
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

interface DropZoneProps {
  isProcessing: boolean;
  currentSong: string | null;
  onFileAccepted: (file: File) => void;
}

const DropZone = ({ isProcessing, currentSong, onFileAccepted }: DropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative
        w-96 h-96
        flex flex-col items-center justify-center
        rounded-full
        bg-purple-50
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
        <LoaderCircle className="w-16 h-16 text-purple-500 animate-spin relative z-10" />
      ) : (
        <Music className={`w-16 h-16 ${isDragActive ? 'text-purple-500' : 'text-purple-400'}`} />
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
  );
};

export default DropZone;