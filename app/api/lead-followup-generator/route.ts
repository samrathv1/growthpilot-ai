import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

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
      // Mock fallback
      console.log('[/api/lead-followup-generator] GEMINI_API_KEY not configured. Returning dynamic mock response.');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = {
        isDemoMode: true,
        lead_summary: {
          lead_stage: cleanLeadStage,
          intent_level: "High",
          recommended_approach: `Focus on ${cleanMainGoal.toLowerCase()} by addressing their interest in ${cleanLeadInterest}.`,
          lead_score: 85
        },
        whatsapp_messages: [
          { type: "First follow-up", message: `Hi ${cleanLeadName}! 👋 This is from ${cleanBusinessName}. Just checking in about your interest in ${cleanLeadInterest}. Do you have a quick moment to chat?` },
          { type: "Second follow-up", message: `Hey ${cleanLeadName}, I know you're busy! I don't want you to miss out on ${cleanLeadInterest}. Let me know if you still want to ${cleanMainGoal.toLowerCase()}.` },
          { type: "Final follow-up", message: `Hi ${cleanLeadName}, I'll be closing the list for ${cleanLeadInterest} soon. If things have changed, no worries! Just reply "NOT NOW". Otherwise, let's get you set up! 🚀` }
        ],
        email_followups: [
          {
            subject: `Quick question about ${cleanLeadInterest}`,
            body: `Hi ${cleanLeadName},\n\nI hope you're having a great week.\n\nI'm reaching out from ${cleanBusinessName} regarding your interest in ${cleanLeadInterest}.\n\nMy goal is to help you ${cleanMainGoal.toLowerCase()}. Let me know what time works best for a quick chat to discuss the next steps.\n\nBest,\nThe ${cleanBusinessName} Team`
          }
        ],
        call_script: {
          opening: `Hi, is this ${cleanLeadName}? This is [Your Name] from ${cleanBusinessName}. How are you doing today?`,
          questions_to_ask: [
            `What originally sparked your interest in ${cleanLeadInterest}?`,
            `What is the biggest challenge you're facing right now with [topic]?`,
            `If we could solve [problem] for you this week, would you be ready to move forward?`
          ],
          pitch: `Based on what you've told me, ${cleanLeadInterest} is exactly what you need because [benefit]. We can help you ${cleanMainGoal.toLowerCase()} very quickly.`,
          closing_line: `Does that sound like a plan? Let's get you onboarded.`
        },
        objection_handling: [
          {
            objection: cleanLeadObjection !== 'None' ? cleanLeadObjection : "Price is too high",
            response: `I completely understand, ${cleanLeadName}. It is an investment. But think about the cost of not solving this right now. Our ${cleanLeadInterest} is designed to give you an ROI that covers the cost within the first month.`
          }
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

      return NextResponse.json(mockResponse);
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

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
        : (lastError?.message || 'Failed to generate follow-up plan.');

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
      ...parsedResult,
      isDemoMode: false,
    });
  } catch (error: any) {
    console.error('[/api/lead-followup-generator] Fatal Error:', error);
    
    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 || errString.includes('503') || errString.includes('UNAVAILABLE');
    
    return NextResponse.json(
      { success: false, error: is503 ? 'Gemini is temporarily busy. Please try again in a few minutes.' : 'Failed to generate plan. Please try again.' },
      { status: is503 ? 503 : 500 }
    );
  }
}
