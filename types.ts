
export type Gender = 'Male' | 'Female';

export interface Location {
  name: string;
  promptFragment: string;
}

export interface Base64ConversionResult {
  base64Data: string;
  mimeType: string;
}
