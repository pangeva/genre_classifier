from transformers import pipeline
import sys
import librosa
import soundfile as sf
import os
import numpy as np

def trim_audio(audio_path, start_time=60, duration=29):
    """
    Loads and trims audio file to specified duration starting at start_time.
    Returns path to temporary trimmed audio file.
    """
    try:
        # Load audio file
        y, sr = librosa.load(audio_path, sr=None)
        
        # Convert times to samples
        start_sample = int(start_time * sr)
        duration_samples = int(duration * sr)
        
        # Trim the audio
        y_trimmed = y[start_sample:start_sample + duration_samples]
        
        # Create temporary file
        temp_path = "temp_trimmed_audio.wav"
        sf.write(temp_path, y_trimmed, sr)
        
        return temp_path
        
    except Exception as e:
        raise Exception(f"Error trimming audio: {e}")

def classify_song(audio_path):
    try:
        # Trim the audio first
        trimmed_path = trim_audio(audio_path)
        
        # Initialize the classifier
        classifier = pipeline("audio-classification", model="ana-mariya/distilhubert-finetuned-gtzan")
        
        # Predict
        predictions = classifier(trimmed_path)
        
        # Print results
        print("\nPredicted genres:")
        for pred in predictions:
            print(f"{pred['label']}: {pred['score']:.3f}")
        
        # Clean up temporary file
        if os.path.exists(trimmed_path):
            os.remove(trimmed_path)
            
    except Exception as e:
        print(f"Error processing file: {e}")
        # Ensure temporary file is cleaned up even if there's an error
        if 'trimmed_path' in locals() and os.path.exists(trimmed_path):
            os.remove(trimmed_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_model.py path/to/your/song.mp3")
    else:
        audio_path = sys.argv[1]
        classify_song(audio_path)