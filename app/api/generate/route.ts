import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai/client';
import type { GenerateRequest, ToolId } from '@/types';

// Explicit allowlist of valid tool IDs.
// Any request with a tool ID not in this list is rejected with 400.
const VALID_TOOLS: ToolId[] = [
  'business-audit',
  'landing-page-generator',
  'content-generator',
  'lead-follow-up',
  'growth-agent',
];

// Maximum length for any individual form field value (prevents prompt injection abuse)
const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { tool, data } = body;

    // ── Validate tool ────────────────────────────────────────────────────────
    if (!tool || !VALID_TOOLS.includes(tool)) {
      return NextResponse.json(
        { error: `Invalid tool. Must be one of: ${VALID_TOOLS.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate data ────────────────────────────────────────────────────────
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data: must be a non-empty object' },
        { status: 400 }
      );
    }

    // Sanitize each field: ensure values are strings and within length limit
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'string') continue;
      sanitizedData[key] = value.trim().slice(0, MAX_FIELD_LENGTH);
    }

    // ── Generate ─────────────────────────────────────────────────────────────
    // generateContent() is imported from a server-only module.
    // It reads OPENAI_API_KEY / GEMINI_API_KEY from process.env on the server.
    // These values are NEVER included in the JSON response sent to the client.
    const sections = await generateContent(tool, sanitizedData);

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('[/api/generate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
