import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      businessType,
      currentSituation,
      mainGoal,
      onlinePresence,
      biggestProblem,
      targetAudience,
      offer,
      budgetLevel,
      timeframe,
      extraNotes,
    } = body;

    // Validate required fields
    if (!businessName || !businessType || !mainGoal || !biggestProblem || !onlinePresence || !targetAudience || !offer || !budgetLevel || !timeframe) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in all required inputs.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const cleanBusinessName = String(businessName).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanBusinessType = String(businessType).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanCurrentSituation = currentSituation ? String(currentSituation).trim().slice(0, MAX_FIELD_LENGTH) : 'None provided';
    const cleanMainGoal = String(mainGoal).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanOnlinePresence = String(onlinePresence).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanBiggestProblem = String(biggestProblem).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanTargetAudience = String(targetAudience).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanOffer = String(offer).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanBudgetLevel = String(budgetLevel).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanTimeframe = String(timeframe).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanNotes = extraNotes ? String(extraNotes).trim().slice(0, MAX_FIELD_LENGTH * 2) : 'None';

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock fallback
      console.log('[/api/growth-agent] GEMINI_API_KEY not configured. Returning dynamic mock response.');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = {
        isDemoMode: true,
        business_diagnosis: {
          summary: `${cleanBusinessName} is a ${cleanBusinessType} struggling with ${cleanBiggestProblem.toLowerCase()}.`,
          main_problem: cleanBiggestProblem,
          growth_stage: "Scaling",
          priority_level: "High"
        },
        next_best_action: {
          title: `Focus on ${cleanMainGoal.toLowerCase()}`,
          reason: `Because you want to see results in ${cleanTimeframe.toLowerCase()}.`,
          expected_impact: "High immediate return on investment"
        },
        website_actions: [
          { action: "Optimize hero section", why_it_matters: "First impressions drive conversions", difficulty: "Low" },
          { action: "Add clear CTA for " + cleanOffer, why_it_matters: "Directs users to purchase", difficulty: "Medium" }
        ],
        content_actions: [
          { action: "Post 3 Reels about " + cleanOffer, platform: "Instagram", content_idea: "Behind the scenes", cta: "Link in bio" }
        ],
        lead_followup_actions: [
          { action: "Send WhatsApp message to new leads", message_angle: "Quick check-in", when_to_send: "Within 5 minutes" }
        ],
        automation_actions: [
          { automation: "Automated Email sequence", tool_suggestion: "Mailchimp / ActiveCampaign", benefit: "Nurtures leads automatically" }
        ],
        seven_day_growth_plan: [
          { day: "Day 1", task: "Audit existing website", goal: "Identify conversion blockers" },
          { day: "Day 3", task: "Set up automated follow-up", goal: "Never miss a lead" },
          { day: "Day 7", task: "Launch new content campaign", goal: "Generate fresh traffic" }
        ],
        thirty_day_growth_plan: [
          { week: "Week 1", focus: "Foundation setup", actions: ["Website audit", "CRM setup", "Offer refinement"] },
          { week: "Week 2", focus: "Content strategy", actions: ["Plan 30 days of content", "Record 5 videos", "Setup social tools"] }
        ],
        quick_wins: ["Add a WhatsApp widget to the website", "Email past leads with a special offer"],
        mistakes_to_avoid: ["Not following up fast enough", "Confusing website copy", "Trying to be on every platform at once"],
        recommended_growth_stack: {
          website: "WordPress / Framer",
          content: "Canva + Buffer",
          lead_capture: "Typeform",
          followup: "WhatsApp Business API",
          automation: "Zapier"
        },
        final_recommendation: `Stay focused on ${cleanMainGoal.toLowerCase()} and execute the 7-day plan consistently.`
      };

      return NextResponse.json(mockResponse);
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

    const systemPrompt = `You are an elite AI Business Consultant and Growth Strategist. Your goal is to analyze a business's current state and generate a hyper-specific, actionable growth plan spanning website, content, leads, sales, and automation. Give practical actions the owner can actually do based on their budget and timeframe. Avoid generic fluff. Return ONLY valid JSON matching the exact requested structure.`;

    const userPrompt = `
Generate a comprehensive growth strategy with the following business details:

- Business Name: ${cleanBusinessName}
- Business Type: ${cleanBusinessType}
- Current Situation: ${cleanCurrentSituation}
- Main Goal: ${cleanMainGoal}
- Current Online Presence: ${cleanOnlinePresence}
- Biggest Problem: ${cleanBiggestProblem}
- Target Audience: ${cleanTargetAudience}
- Offer/Product/Service: ${cleanOffer}
- Budget Level: ${cleanBudgetLevel}
- Timeframe: ${cleanTimeframe}
- Extra Notes: ${cleanNotes}

Return ONLY valid JSON matching exactly this structure:
{
  "business_diagnosis": {
    "summary": "Short paragraph summarizing their situation",
    "main_problem": "Identify the root cause of their biggest problem",
    "growth_stage": "e.g., Starting, Stabilizing, Scaling",
    "priority_level": "e.g., Critical, High, Medium"
  },
  "next_best_action": {
    "title": "The #1 thing they must do right now",
    "reason": "Why this is the highest leverage action",
    "expected_impact": "What results they can expect"
  },
  "website_actions": [
    {
      "action": "Specific website tweak",
      "why_it_matters": "Reason",
      "difficulty": "Low/Medium/High"
    }
  ],
  "content_actions": [
    {
      "action": "Specific content strategy",
      "platform": "e.g., Instagram/LinkedIn",
      "content_idea": "Concrete idea",
      "cta": "Call to action to use"
    }
  ],
  "lead_followup_actions": [
    {
      "action": "How to handle leads",
      "message_angle": "What to say",
      "when_to_send": "Timing"
    }
  ],
  "automation_actions": [
    {
      "automation": "What to automate",
      "tool_suggestion": "Suggested software",
      "benefit": "Time saved or conversion increased"
    }
  ],
  "seven_day_growth_plan": [
    {
      "day": "Day 1",
      "task": "Specific task",
      "goal": "Outcome"
    }
  ],
  "thirty_day_growth_plan": [
    {
      "week": "Week 1",
      "focus": "Weekly theme",
      "actions": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "quick_wins": ["Win 1", "Win 2", "Win 3"],
  "mistakes_to_avoid": ["Mistake 1", "Mistake 2", "Mistake 3"],
  "recommended_growth_stack": {
    "website": "Recommendation",
    "content": "Recommendation",
    "lead_capture": "Recommendation",
    "followup": "Recommendation",
    "automation": "Recommendation"
  },
  "final_recommendation": "A closing motivational and strategic paragraph"
}

Important Rules:
- Generate 3-5 website actions.
- Generate 3-5 content actions.
- Generate 2-3 lead follow-up actions.
- Generate 2-3 automation actions.
- 7-day plan should have 3-5 actionable days.
- 30-day plan should have 4 weeks.
- Make all advice extremely tailored to ${cleanBusinessName}, factoring in their budget (${cleanBudgetLevel}) and timeframe (${cleanTimeframe}).
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
        : (lastError?.message || 'Failed to generate growth plan.');

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
    console.error('[/api/growth-agent] Fatal Error:', error);
    
    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 || errString.includes('503') || errString.includes('UNAVAILABLE');
    
    return NextResponse.json(
      { success: false, error: is503 ? 'Gemini is temporarily busy. Please try again in a few minutes.' : 'Failed to generate plan. Please try again.' },
      { status: is503 ? 503 : 500 }
    );
  }
}
