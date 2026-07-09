import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai/client';
import type { GenerateRequest, ToolId } from '@/types';

// Explicit allowlist of valid tool IDs.
const VALID_TOOLS: ToolId[] = [
  'business-audit',
  'landing-page-generator',
  'content-generator',
  'lead-follow-up',
  'growth-agent',
];

// Maximum length for any individual form field value
const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    // ── Check environment variables ──────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      console.warn('[/api/generate] GEMINI_API_KEY and OPENAI_API_KEY are missing. Mock mode will be used.');
    }

    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error('[/api/generate] Invalid request body (JSON parse error):', parseErr.message || parseErr);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { tool, data } = body;

    // ── Validate tool ────────────────────────────────────────────────────────
    if (!tool || !VALID_TOOLS.includes(tool)) {
      console.error(`[/api/generate] Invalid tool requested: "${tool}"`);
      return NextResponse.json(
        { success: false, error: `Invalid tool. Must be one of: ${VALID_TOOLS.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Validate data ────────────────────────────────────────────────────────
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      console.error('[/api/generate] Invalid data payload: must be a non-empty object');
      return NextResponse.json(
        { success: false, error: 'Invalid data payload' },
        { status: 400 }
      );
    }

    // Sanitize each field: ensure values are strings and within length limit
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value !== 'string') continue;
      sanitizedData[key] = value.trim().slice(0, MAX_FIELD_LENGTH);
    }

    // ── Validate Business Audit payload (Task 8) ─────────────────────────────
    if (tool === 'business-audit') {
      const { businessName, businessType, goal, targetCustomer } = sanitizedData;
      if (!businessName || !businessType || !goal || !targetCustomer) {
        console.error('[/api/generate] Business Audit missing required fields in data payload:', sanitizedData);
        return NextResponse.json(
          { success: false, error: 'Missing required fields: businessName, businessType, goal, and targetCustomer are required.' },
          { status: 400 }
        );
      }
    }

    // ── Generate ─────────────────────────────────────────────────────────────
    try {
      const sections = await generateContent(tool, sanitizedData);
      return NextResponse.json({ success: true, content: sections });
    } catch (genError: any) {
      console.error(`[/api/generate] Generation failed for tool "${tool}":`, genError.message || genError);
      return NextResponse.json(
        { success: false, error: genError.message || 'Gemini generation failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[/api/generate] Unknown server error:', error.message || error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
