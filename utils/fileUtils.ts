
import type { Base64ConversionResult } from '../types';

export const toBase64 = (file: File): Promise<Base64ConversionResult> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const result = reader.result as string;
    // result is "data:image/jpeg;base64,LzlqLzRBQ..."
    const parts = result.split(',');
    if (parts.length !== 2) {
      return reject(new Error("Invalid file format for Base64 conversion."));
    }

    const mimeType = parts[0].split(':')[1].split(';')[0];
    const base64Data = parts[1];
    
    resolve({ base64Data, mimeType });
  };
  reader.onerror = error => reject(error);
});
