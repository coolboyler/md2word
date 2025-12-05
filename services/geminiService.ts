import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Repairs broken Markdown and LaTeX content.
 */
export const repairContent = async (content: string): Promise<string> => {
  try {
    // Initialize inside the function to avoid module-load crashes if process.env is not ready
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a technical document expert. Fix the following Markdown text. 
      1. Correct any LaTeX syntax errors (e.g., ensure commands like \\mathcal or \\nabla are used correctly).
      2. Ensure LaTeX blocks use correct delimiters ($...$ for inline, $$...$$ for block).
      3. Fix general Markdown syntax errors.
      4. Do NOT change the meaning or the structure of the text significantly.
      5. Return ONLY the fixed markdown content. Do not include any explanation or wrapping code blocks.

      Text to fix:
      ${content}`,
    });

    return response.text?.trim() || content;
  } catch (error) {
    console.error("Gemini repair failed:", error);
    throw error;
  }
};

/**
 * Converts Markdown to HTML with Presentation MathML for Word compatibility.
 * We use Gemini here because converting LaTeX to valid MathML client-side 
 * purely with JS libraries for Word export is notoriously difficult and buggy.
 */
export const convertToWordCompatibleHtml = async (markdown: string): Promise<string> => {
  try {
    // Initialize inside the function to avoid module-load crashes if process.env is not ready
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Convert the following Markdown content into a clean HTML body suitable for Microsoft Word.
      
      CRITICAL INSTRUCTIONS:
      1. Convert all LaTeX equations (both inline $...$ and block $$...$$) into standard Presentation MathML (<math>...</math>).
      2. Do NOT use <img> tags for math. Use <math> tags.
      3. Ensure headings, lists, and bold/italic text are converted to semantic HTML tags (h1, h2, ul, li, strong, em).
      4. Do NOT include <html>, <head>, or <body> tags. Just return the inner body content.
      5. Do NOT use markdown code blocks in your response. Just plain text.

      Markdown content:
      ${markdown}`,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini HTML conversion failed:", error);
    throw error;
  }
};