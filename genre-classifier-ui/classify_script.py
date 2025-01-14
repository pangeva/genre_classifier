import sys
from transformers import pipeline
import librosa
import soundfile as sf
import os

def process_audio(file_path):
    try:
        # Load audio
        y, sr = librosa.load(file_path, sr=None)
        
        # Calculate sample positions
        one_minute_samples = int(60 * sr)  # Number of samples in one minute
        duration_samples = int(29 * sr)    # Number of samples in 29 seconds
        
        # Check if audio is long enough
        if len(y) < one_minute_samples + duration_samples:
            raise ValueError("Audio file must be at least 1 minute and 29 seconds long")
        
        # Get the segment from 1:00 to 1:29
        y_trimmed = y[one_minute_samples:one_minute_samples + duration_samples]
        
        # Save temporary file
        temp_path = "temp_trimmed.wav"
        sf.write(temp_path, y_trimmed, sr)
        
        # Classify
        classifier = pipeline("audio-classification", model="ana-mariya/distilhubert-finetuned-gtzan")
        predictions = classifier(temp_path)
        
        # Clean up
        os.remove(temp_path)
        
        # Print results (will be captured by Node.js)
        for pred in predictions:
            print(f"{pred['label']}: {pred['score']}")
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python classify_script.py <audio_file>", file=sys.stderr)
        sys.exit(1)
    
    process_audio(sys.argv[1])