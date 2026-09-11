import { storageService } from './storage';
import type { Formula, NoteSection } from '../types';

export interface AIAnalysisResult {
  notes: Omit<NoteSection, 'id' | 'order'>[];
  formulas: Omit<Formula, 'id' | 'unitId' | 'isFavorite' | 'isDraft' | 'source'>[];
}

const SYSTEM_PROMPT = `You are an expert Excel Tutor for Thai university students.
Your job is to read lecture slides or screenshots and generate highly structured, easy-to-understand study materials.

STRICT RULES:
1. OUTPUT LANGUAGE: MUST BE THAI. Even if the input is English, explain everything in natural, easy-to-read Thai like a tutor speaking to a student.
2. FUNCTION NAMES: Do NOT translate Excel function names. Keep them in English (e.g. VLOOKUP, INDEX, MATCH).
3. DO NOT HALLUCINATE: Only extract formulas and concepts present in the provided file.
4. STRUCTURE: Output valid JSON exactly matching the requested schema.

JSON SCHEMA:
{
  "notes": [
    {
      "title": "String (e.g. 01 VLOOKUP คืออะไร?)",
      "content": "String (HTML format, use <p>, <ul>, <li>, <strong> for emphasis. Tutor style explanation, simple and easy to remember.)",
      "layout": "text" | "warning"
    }
  ],
  "formulas": [
    {
      "name": "String (e.g. VLOOKUP)",
      "category": "String (e.g. Lookup)",
      "shortDescription": "String (Short Thai description)",
      "purpose": "String (Detailed Thai explanation)",
      "formula": "String (e.g. =VLOOKUP(...))",
      "syntax": "String (e.g. VLOOKUP(lookup_value, ...))",
      "example": "String (A real example formula)",
      "teacherNote": "String (Tips, Tricks, or Exam focus in Thai)",
      "commonError": "String (Common errors like #N/A in Thai)",
      "importance": "exam" | "normal"
    }
  ]
}

Make sure the JSON is clean, valid, and contains no markdown formatting outside of the JSON string.
`;

export const analyzeFileWithGemini = async (base64Data: string, mimeType: string, fileName: string): Promise<AIAnalysisResult> => {
  const apiKey = storageService.getApiKey();
  if (!apiKey) {
    throw new Error('Please add your Gemini API Key in Settings first.');
  }

  // Ensure base64Data is just the raw string without the data URI prefix
  const rawBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      {
        parts: [
          { text: `Please analyze this lecture material (${fileName}) and generate the Thai study content and formula library in JSON format.` },
          { inlineData: { mimeType, data: rawBase64 } }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to analyze file with Gemini.');
  }

  const data = await response.json();
  const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!jsonString) {
    throw new Error('Gemini returned an empty response.');
  }

  try {
    return JSON.parse(jsonString) as AIAnalysisResult;
  } catch (e) {
    console.error('Failed to parse JSON:', jsonString);
    throw new Error('Failed to parse Gemini response as JSON.');
  }
};
