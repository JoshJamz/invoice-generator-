import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

export interface BrandingInfo {
  companyName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  accentStyle?: string;
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export function useBranding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranding = async (websiteUrl: string): Promise<BrandingInfo | null> => {
    if (!ai) {
      setError('Gemini API key is not configured.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `Given the user input "${websiteUrl}", identify the company's real-world website domain, name, primary brand color (HEX), secondary brand color (HEX), and a recommended Google Font family. Also recommend an accent style from one of: ["solid", "minimal", "gradient", "sharp", "rounded"]. 
If the user provides a domain directly, use it. If they provide a name, deduce the domain.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              domain: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              fontFamily: { type: Type.STRING },
              accentStyle: { type: Type.STRING },
            },
            required: ["companyName", "domain", "primaryColor", "secondaryColor", "fontFamily", "accentStyle"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from AI');
      }

      const parsed: BrandingInfo = JSON.parse(text);
      if (parsed.domain) {
        parsed.logoUrl = `https://logo.clearbit.com/${parsed.domain}`;
      }
      
      return parsed;

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch branding info.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBranding, loading, error };
}
