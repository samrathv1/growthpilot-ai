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
      console.error('[/api/growth-agent] Missing GEMINI_API_KEY environment variable. Defaulting to mock response.');
      await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate API delay
      
      const mockResponse = {
        isDemoMode: true,
        business_diagnosis: {
          summary: `${cleanBusinessName} is currently operating as a ${cleanBusinessType} with the primary goal of: ${cleanMainGoal}. Their biggest constraint is "${cleanBiggestProblem}".`,
          main_problem: `Lack of a streamlined automated mechanism to nurture ${cleanTargetAudience} and convert them to the core offer: ${cleanOffer}.`,
          growth_stage: cleanBudgetLevel === 'Low' || cleanBudgetLevel === 'Zero' ? 'Starting' : 'Stabilizing',
          priority_level: 'High'
        },
        next_best_action: {
          title: `Build a highly focused Lead Magnet landing page for ${cleanOffer}`,
          reason: `It addresses the core constraint "${cleanBiggestProblem}" at a low budget by converting organic traffic into qualified leads.`,
          expected_impact: 'Expected 15-25% increase in weekly opt-in rate.'
        },
        website_actions: [
          { action: "Place a bold value proposition above the fold explaining what makes your offer unique.", why_it_matters: "Keeps visitors from leaving within the first 5 seconds.", difficulty: "Low" },
          { action: "Embed a simple lead capture form that requests only Name, Email, and Phone Number.", why_it_matters: "Reduces friction for your target customers.", difficulty: "Low" },
          { action: "Add 3 prominent customer testimonials or results below the form.", why_it_matters: "Establishes immediate trust.", difficulty: "Medium" }
        ],
        content_actions: [
          { action: "Create a 3-part educational post series detailing tips on " + cleanBusinessType + ".", platform: "LinkedIn / Instagram", content_idea: "Debunking 3 common myths that hold back clients.", cta: "Comment 'GROWTH' to download our complete strategy guide." }
        ],
        lead_followup_actions: [
          { action: "Send a friendly WhatsApp/email sequence within 5 minutes of sign-up.", message_angle: "Offer immediate help or answer standard FAQs.", when_to_send: "Instant" }
        ],
        automation_actions: [
          { automation: "Integrate form submissions directly with Google Sheets or CRM.", tool_suggestion: "Zapier / Make", benefit: "Zero manual data entry delays." }
        ],
        seven_day_growth_plan: [
          { day: "Day 1", task: "Configure the lead form and connect it to your database.", goal: "Lead capture automation set up." },
          { day: "Day 2", task: "Draft 3 quick social media posts addressing " + cleanTargetAudience + ".", goal: "Organic traffic generation ready." },
          { day: "Day 3", task: "Send a re-engagement email to all existing leads or past contacts.", goal: "Reactivate stale conversations." }
        ],
        thirty_day_growth_plan: [
          { week: "Week 1", focus: "Conversion Landing Page Setup", actions: ["Deploy the CTA button", "Add social proof reviews"] }
        ],
        quick_wins: ["Standardize lead replies", "Post a client success story"],
        mistakes_to_avoid: ["Not following up leads within 24 hours", "Complicating the landing page checkout"],
        recommended_growth_stack: {
          website: "Carrd or WordPress",
          content: "Canva / ChatGPT",
          lead_capture: "Tally Forms",
          followup: "Email Octopus / Mailerlite",
          automation: "Make.com"
        },
        final_recommendation: `Stay focused on ${cleanMainGoal.toLowerCase()} and execute the 7-day plan consistently.`
      };

      return NextResponse.json({ success: true, content: mockResponse });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

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
      success: true,
      content: {
        ...parsedResult,
        isDemoMode: false,
      }
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
