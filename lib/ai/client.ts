// This module is server-side ONLY.
// The 'server-only' import makes Next.js throw a build error
// if this file is ever accidentally imported in a Client Component.
import 'server-only';

import { ToolId, ResultSection } from '@/types';
import { getPromptForTool } from './prompts';
import { getMockResponse } from './mock-responses';

// ─── OpenAI ─────────────────────────────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<ResultSection[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  // Guard: key must be present (checked by caller, but double-checked here)
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Key is read from server env — never sent to or from the browser
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
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const text: string = json.choices[0]?.message?.content || '';
  return parseTextToSections(text);
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<ResultSection[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  // Key is appended server-side to the URL — it never touches the browser
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseTextToSections(text);
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
//
// Called only from app/api/generate/route.ts (a server Route Handler).
// process.env values are NEVER forwarded to the client response.

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
    return callGemini(prompt);
  }

  // No key set — use realistic mock responses (demo / portfolio mode)
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return getMockResponse(tool);
}
