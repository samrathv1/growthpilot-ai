// This module is server-side ONLY.
// The 'server-only' import makes Next.js throw a build error
// if this file is ever accidentally imported in a Client Component.
import 'server-only';

import { ToolId, ResultSection } from '@/types';
import { getPromptForTool } from './prompts';
import { getMockResponse } from './mock-responses';
import { GoogleGenAI } from '@google/genai';

// ─── OpenAI ─────────────────────────────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<ResultSection[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[/lib/ai/client] callOpenAI: OPENAI_API_KEY is not configured');
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => 'Unknown error');
    console.error(`[/lib/ai/client] callOpenAI: OpenAI API error (${response.status}):`, err);
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const text: string = json.choices[0]?.message?.content || '';
  return parseTextToSections(text);
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

async function callGemini(tool: ToolId, prompt: string): Promise<ResultSection[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[/lib/ai/client] callGemini: GEMINI_API_KEY is not configured');
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  console.log(`[/lib/ai/client] Initializing GoogleGenAI client for tool "${tool}" using model "${model}"...`);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.text || '';
    if (!text) {
      console.error('[/lib/ai/client] callGemini: Empty response text received from Gemini API');
      throw new Error('Empty response received from Gemini API');
    }

    return parseTextToSections(text);
  } catch (error: any) {
    console.error('[/lib/ai/client] callGemini: Gemini API request failed:', error.message || error);
    
    // Check for specific error reasons
    const errString = String(error).toUpperCase();
    if (errString.includes('QUOTA') || errString.includes('LIMIT') || errString.includes('429')) {
      console.error('[/lib/ai/client] callGemini: Detected quota limit / 429 rate limit error');
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    }
    
    throw error;
  }
}

// ─── Text Parser ─────────────────────────────────────────────────────────────

function parseTextToSections(text: string): ResultSection[] {
  // Split on numbered headings like "1. Title" or "**Title**"
  const sectionRegex = /(?:^|\n)(?:\d+\.\s+|\*\*)(.*?)(?:\*\*)?\n([\s\S]*?)(?=\n(?:\d+\.\s+|\*\*)|$)/g;
  const sections: ResultSection[] = [];
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    sections.push({
      title: match[1].trim(),
      content: match[2].trim(),
    });
  }

  if (sections.length === 0) {
    sections.push({ title: 'AI Response', content: text });
  }

  return sections;
}

// ─── Public Entry Point ───────────────────────────────────────────────────────

export async function generateContent(
  tool: ToolId,
  data: Record<string, string>
): Promise<ResultSection[]> {
  if (process.env.OPENAI_API_KEY) {
    const prompt = getPromptForTool(tool, data);
    return callOpenAI(prompt);
  }

  if (process.env.GEMINI_API_KEY) {
    const prompt = getPromptForTool(tool, data);
    return callGemini(tool, prompt);
  }

  // No key set — use realistic mock responses (demo / portfolio mode)
  console.warn(`[/lib/ai/client] generateContent: No API key found. Defaulting to dynamic mock response for tool "${tool}".`);
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return getMockResponse(tool);
}
