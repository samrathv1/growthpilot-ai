import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasKeys: !!(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
  });
}
