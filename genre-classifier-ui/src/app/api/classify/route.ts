import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}-${file.name}`);
    
    // Ensure tmp directory exists
    await execAsync(`mkdir -p ${path.join(process.cwd(), 'tmp')}`);
    
    // Write the file
    await writeFile(tempFilePath, buffer);

    // Execute the Python script
    const { stdout, stderr } = await execAsync(`python3 classify_script.py "${tempFilePath}"`);

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // Parse the Python script output
    const predictions = stdout
      .split('\n')
      .filter(line => line.includes(':'))
      .map(line => {
        const [label, score] = line.split(':').map(s => s.trim());
        return {
          label,
          score: parseFloat(score)
        };
      });

    // Clean up the temporary file
    await unlink(tempFilePath);

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}