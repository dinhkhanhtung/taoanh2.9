import { GoogleGenAI, Modality } from "@google/genai";
import type { Gender, Location } from "../types";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Detects the gender of a person in an image.
 * @param base64Data The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to "Male", "Female", or "Unknown".
 */
export const detectGender = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Based on the person in the image, are they Male or Female? Respond with only the word 'Male' or 'Female'. If you cannot determine, respond with 'Unknown'.",
          },
        ],
      },
    });
    const detectedGender = response.text.trim();
    return detectedGender;
  } catch (error) {
    console.error("Error in detectGender:", error);
    throw new Error("Failed to analyze image for gender detection.");
  }
};

/**
 * Generates a holiday-themed image based on an input image, gender, and location.
 * @param base64Data The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @param gender The gender of the person.
 * @param location The location for the new image background.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateHolidayImage = async (
  base64Data: string,
  mimeType: string,
  gender: Gender,
  location: Location
): Promise<string | null> => {
  const aoDaiType = gender === 'Male' ? 'male Ao Dai' : 'female Ao Dai';

  const prompt = `
    This is a photo of a person. KEEP THEIR FACE EXACTLY THE SAME. Edit the image significantly:
    1. Clothing: Change their entire outfit to a beautiful, traditional Vietnamese ${aoDaiType}. The Ao Dai must only use two colors: a vibrant, patriotic red and a brilliant, shining gold. Add intricate traditional patterns.
    2. Pose: Change their pose to a full-body standing shot. Do not crop their body. The person should look proud and happy.
    3. Background: Completely replace the background. ${location.promptFragment}
    4. Color Palette & Lighting: The entire image's color scheme, including the background and lighting, must be strictly limited to shades of red and yellow/gold. The lighting should be warm, celebratory, and heroic. No other colors are allowed. Emphasize the Vietnamese flag symbol (red flag with a yellow star).
    5. Watermark: Add a faint, semi-transparent watermark of the text "A80" behind the person. The watermark text should be a light yellow color.
    6. Final Image: The final output must be a photorealistic, high-quality image that looks like a real photograph.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const generatedBase64 = part.inlineData.data;
        const imageMimeType = part.inlineData.mimeType;
        return `data:${imageMimeType};base64,${generatedBase64}`;
      }
    }
    return null; // Return null if no image part is found
  } catch (error) {
    console.error(`Error generating image for location "${location.name}":`, error);
    // Instead of throwing, we can return null to allow other images to be generated
    // This makes the app more resilient to single generation failures.
    return null; 
  }
};