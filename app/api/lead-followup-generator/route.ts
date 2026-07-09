import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getCleanErrorMessage } from '@/lib/ai/client';

const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      businessType,
      leadName,
      leadInterest,
      leadStage,
      mainGoal,
      leadObjection,
      preferredChannel,
      tone,
      extraNotes,
    } = body;

    // Validate required fields
    if (!businessName || !businessType || !leadName || !leadInterest || !leadStage || !mainGoal || !preferredChannel || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in all required inputs.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const cleanBusinessName = String(businessName).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanBusinessType = String(businessType).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanLeadName = String(leadName).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanLeadInterest = String(leadInterest).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanLeadStage = String(leadStage).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanMainGoal = String(mainGoal).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanLeadObjection = leadObjection ? String(leadObjection).trim().slice(0, MAX_FIELD_LENGTH) : 'None';
    const cleanPreferredChannel = String(preferredChannel).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanTone = String(tone).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanNotes = extraNotes ? String(extraNotes).trim().slice(0, MAX_FIELD_LENGTH * 2) : 'None';

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[/api/lead-followup-generator] Missing GEMINI_API_KEY environment variable. Defaulting to mock response.');
      await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate API delay
      
      const mockResponse = {
        isDemoMode: true,
        lead_summary: {
          lead_stage: cleanLeadStage,
          intent_level: cleanLeadStage === 'Cold' ? 'Low' : cleanLeadStage === 'Warm' ? 'Medium' : 'High',
          recommended_approach: `Provide immediate value and address the core objection: "${cleanLeadObjection}".`,
          lead_score: cleanLeadStage === 'Cold' ? 45 : cleanLeadStage === 'Warm' ? 70 : 90
        },
        whatsapp_messages: [
          { type: "First follow-up", message: `Hi ${cleanLeadName}! I'm following up on your interest in our ${cleanLeadInterest} at ${cleanBusinessName}. Did you have any questions about the package details?` },
          { type: "Second follow-up", message: `Hey ${cleanLeadName}! Just checking in to see if you had a moment to review the outline we sent over. Let me know if you want to jump on a quick call to map out your goals!` },
          { type: "Final follow-up", message: `Hi ${cleanLeadName}. Since I haven't heard back, I'll assume now isn't the best time. Feel free to reach out whenever you are ready to kick off your project!` }
        ],
        email_followups: [
          { subject: `Getting started with ${cleanLeadInterest} at ${cleanBusinessName}`, body: `Hi ${cleanLeadName},\n\nThanks for reaching out! We specialize in helping businesses like yours achieve their goals through our personalized ${cleanLeadInterest}.\n\nLet me know when you are free for a quick discovery chat this week.\n\nBest,\nSales Team` }
        ],
        call_script: {
          opening: `Hi ${cleanLeadName}, this is Sales from ${cleanBusinessName}. I noticed you requested details on our ${cleanLeadInterest}...`,
          questions_to_ask: [
            `What is the biggest roadblock you are currently facing?`,
            `How soon are you hoping to launch your growth plan?`
          ],
          pitch: `Our ${cleanLeadInterest} is designed specifically to address this pain point by streamlining your workflow.`,
          closing_line: `Let's schedule a 10-minute demo to get you set up.`
        },
        objection_handling: [
          { objection: cleanLeadObjection !== 'None' ? cleanLeadObjection : "Pricing is too high", response: `We offer flexible payment structures and guarantee positive ROI within 60 days.` }
        ],
        closing_messages: [
          { message: `Ready to get started, ${cleanLeadName}? Here is the link to complete your setup for ${cleanLeadInterest}. Let me know once it's done!` }
        ],
        followup_schedule: [
          { day: "Day 1", action: "Send initial message", message_type: cleanPreferredChannel },
          { day: "Day 3", action: "Follow up on the initial message", message_type: "Email" },
          { day: "Day 5", action: "Address objections and create urgency", message_type: cleanPreferredChannel }
        ],
        final_recommendation: `Keep the communication ${cleanTone.toLowerCase()}. Since they are a ${cleanLeadStage.toLowerCase()}, your priority is to ${cleanMainGoal.toLowerCase()} quickly before they lose interest.`
      };

      return NextResponse.json({ success: true, content: mockResponse });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const systemPrompt = `You are an expert sales strategist and copywriter. Create a highly personalized, high-converting lead follow-up plan based on the provided business and lead details. The tone must match the requested style. Avoid generic spammy language; write like a top-tier human sales professional who prioritizes relationship-building and conversion. Return ONLY valid JSON.`;

    const userPrompt = `
Generate a personalized lead follow-up plan with the following details:

- Business Name: ${cleanBusinessName}
- Business Type: ${cleanBusinessType}
- Lead Name: ${cleanLeadName}
- Lead Interest: ${cleanLeadInterest}
- Lead Stage: ${cleanLeadStage}
- Main Goal: ${cleanMainGoal}
- Lead Objection/Concern: ${cleanLeadObjection}
- Preferred Channel: ${cleanPreferredChannel}
- Tone: ${cleanTone}
- Extra Notes: ${cleanNotes}

Return ONLY valid JSON matching exactly this structure:
{
  "lead_summary": {
    "lead_stage": "string",
    "intent_level": "string",
    "recommended_approach": "string",
    "lead_score": 85
  },
  "whatsapp_messages": [
    { "type": "First follow-up", "message": "short, natural WhatsApp message" },
    { "type": "Second follow-up", "message": "follow-up message" },
    { "type": "Final follow-up", "message": "breakup or final push message" }
  ],
  "email_followups": [
    { "subject": "email subject", "body": "full email body" }
  ],
  "call_script": {
    "opening": "phone call opening",
    "questions_to_ask": ["question 1", "question 2", "question 3"],
    "pitch": "short pitch connecting their interest to the solution",
    "closing_line": "call closing to achieve the main goal"
  },
  "objection_handling": [
    { "objection": "the stated or likely objection", "response": "how to overcome it" }
  ],
  "closing_messages": [
    { "message": "a message designed to close the deal right now" }
  ],
  "followup_schedule": [
    { "day": "Day 1", "action": "what to do", "message_type": "WhatsApp/Email/Call" }
  ],
  "final_recommendation": "One paragraph of strategic advice on how to handle this lead"
}

Important Rules:
- Generate 3 WhatsApp messages
- Generate 2 Email follow-ups
- Generate a comprehensive call script
- Address the exact objection provided (or the most likely one if 'None')
- Provide 2 closing messages
- Build a 7-14 day follow-up schedule (3-5 steps)
- Make it highly specific to ${cleanBusinessName} and ${cleanLeadName}
- Tone MUST be ${cleanTone}
- Do not include markdown fences like \`\`\`json. Return raw JSON string only.
`;

    let lastError: any = null;
    let response = null;
    const maxRetries = 2;
    const retryDelay = 1500;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          config: { responseMimeType: 'application/json' }
        });
        break; // Success
      } catch (err: any) {
        lastError = err;
        console.warn(`[Attempt ${attempt + 1}/${maxRetries + 1}] Gemini API call failed:`, err.message || err);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!response) {
      const errString = String(lastError).toUpperCase() + ' ' + String(lastError?.message || '').toUpperCase();
      const is503 = lastError?.status === 503 ||
                    errString.includes('503') ||
                    errString.includes('UNAVAILABLE') ||
                    errString.includes('OVERLOADED');

      const errorMessage = is503
        ? 'Gemini is temporarily busy. Please try again in a few minutes.'
        : getCleanErrorMessage(lastError);

      return NextResponse.json({ success: false, error: errorMessage }, { status: is503 ? 503 : 500 });
    }

    const responseText = response.text || '';
    if (!responseText) throw new Error('Empty response received from Gemini API');

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Raw response:', responseText);
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanedText);
    }

    return NextResponse.json({
      success: true,
      content: {
        ...parsedResult,
        isDemoMode: false,
      }
    });
  } catch (error: any) {
    console.error('[/api/lead-followup-generator] Fatal Error:', error);
    
    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 || errString.includes('503') || errString.includes('UNAVAILABLE');
    const errorMessage = is503
      ? 'Gemini is temporarily busy. Please try again in a few minutes.'
      : getCleanErrorMessage(error);
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: is503 ? 503 : 500 }
    );
  }
}
