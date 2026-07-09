import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Maximum length for fields to prevent abuse
const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, businessType, website, goal, targetAudience } = body;

    // Validate required fields
    if (!businessName || !businessType || !goal || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, businessType, goal, targetAudience are required.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const cleanName = String(businessName).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanType = String(businessType).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanWebsite = website ? String(website).trim().slice(0, MAX_FIELD_LENGTH) : 'None';
    const cleanGoal = String(goal).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanAudience = String(targetAudience).trim().slice(0, MAX_FIELD_LENGTH);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a realistic mock response for demo / portfolio mode
      console.error('[/api/business-audit] Missing GEMINI_API_KEY environment variable. Defaulting to mock response.');
      await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate API delay
      
      const mockResponse = {
        isDemoMode: true,
        business_summary: `${cleanName} is a ${cleanType} business focused on the primary goal of "${cleanGoal}". They target ${cleanAudience}.`,
        main_problems: [
          `No clear system to capture and nurture leads interested in ${cleanType} services.`,
          `Marketing messaging doesn't directly address the primary pain points of ${cleanAudience}.`,
          `Missed opportunities in follow-up automation, causing interested prospects to drop off.`
        ],
        website_improvements: [
          `Implement a clear call-to-action (CTA) matching the goal: "${cleanGoal}" above the fold.`,
          `Showcase social proof, results, or testimonies specifically relevant to ${cleanAudience}.`,
          cleanWebsite !== 'None' 
            ? `Optimize layout and mobile user flow on the current link (${cleanWebsite}).`
            : `Build a mobile-first, high-converting one-page site with a prominent lead capture form.`
        ],
        content_ideas: [
          `Publish a series of short educational videos highlighting solutions for ${cleanAudience}.`,
          `Create "Behind the scenes" or customer success stories illustrating how you achieve "${cleanGoal}".`,
          `Write a downloadable checklist or resource addressing the biggest frustration of ${cleanAudience}.`,
          `Launch an interactive Q&A or FAQ highlight clarifying how your ${cleanType} service works.`
        ],
        automation_ideas: [
          `Send an automated welcome email/SMS sequence immediately after a lead submits their info.`,
          `Set up an instant WhatsApp/SMS booking confirmation system for new consultations.`,
          `Implement an automated customer feedback/review request loop after services are completed.`
        ],
        ai_tool_suggestions: [
          `ManyChat for automating Instagram/Facebook DM responses to prospects.`,
          `Mailchimp or ActiveCampaign for automated lead nurturing email flows.`,
          `Gemini/ChatGPT to draft rapid marketing content and social media captions.`
        ],
        seven_day_action_plan: [
          { "day": "Day 1", "task": "Design and set up a landing page with a direct form focused on: " + cleanGoal + "." },
          { "day": "Day 2", "task": "Set up the automated welcome message or email sequence for new submissions." },
          { "day": "Day 3", "task": "Draft and post the first content piece addressing " + cleanAudience + "'s needs." },
          { "day": "Day 4", "task": "Reach out to 5 past clients to ask for reviews to use as social proof." },
          { "day": "Day 5", "task": "Install a chatbot or instant contact widget on your link/website." },
          { "day": "Day 6", "task": "Create standard reply templates for FAQs to speed up response times." },
          { "day": "Day 7", "task": "Review lead capture data and launch a simple organic promo showing your offer." }
        ],
        final_recommendation: `To successfully achieve your goal of "${cleanGoal}", you must lower the friction for ${cleanAudience} to engage with ${cleanName}. Focus on establishing a fast, automated follow-up process and presenting clear social proof immediately to build maximum trust.`
      };

      return NextResponse.json({ success: true, content: mockResponse });
    }

    // Initialize Google Gen AI client using @google/genai
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const systemPrompt = `You are an expert AI business consultant and growth strategist. Analyze the given business details and create a practical business audit. Keep the advice simple, useful, and action-focused. Do not give generic advice. Give suggestions that can help the business improve leads, website, content, sales follow-up, and automation. Return only valid JSON in the required structure.`;

    const userPrompt = `
    Analyze this business and return a structured JSON response:
    - Business Name: ${cleanName}
    - Business Type: ${cleanType}
    - Website/Instagram Link: ${cleanWebsite}
    - Main Goal: ${cleanGoal}
    - Target Audience: ${cleanAudience}
    
    Expected JSON response structure:
    {
      "business_summary": "A short summary of the business based on the inputs and their online presence context.",
      "main_problems": ["Problem 1", "Problem 2", "Problem 3"],
      "website_improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
      "content_ideas": ["Content Idea 1", "Content Idea 2", "Content Idea 3", "Content Idea 4"],
      "automation_ideas": ["Automation Idea 1", "Automation Idea 2", "Automation Idea 3"],
      "ai_tool_suggestions": ["AI Tool 1", "AI Tool 2", "AI Tool 3"],
      "seven_day_action_plan": [
        { "day": "Day 1", "task": "Task detail for Day 1" },
        { "day": "Day 2", "task": "Task detail for Day 2" },
        { "day": "Day 3", "task": "Task detail for Day 3" },
        { "day": "Day 4", "task": "Task detail for Day 4" },
        { "day": "Day 5", "task": "Task detail for Day 5" },
        { "day": "Day 6", "task": "Task detail for Day 6" },
        { "day": "Day 7", "task": "Task detail for Day 7" }
      ],
      "final_recommendation": "A summarizing final recommendation that wraps up the action strategy."
    }
    
    Do not include any markdown fences (like \`\`\`json or \`\`\`) in your output. Return ONLY the raw JSON string. Ensure it is valid JSON.
    `;

    let lastError: any = null;
    let response = null;
    const maxRetries = 2;
    const retryDelay = 1500; // 1.5 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          config: {
            responseMimeType: 'application/json',
          }
        });
        break; // Success! Break the loop
      } catch (err: any) {
        lastError = err;
        console.error(`[/api/business-audit] [Attempt ${attempt + 1}/${maxRetries + 1}] Gemini API call failed:`, err.message || err);
        
        // If we have retries left, wait before retrying
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!response) {
      // Analyze error context to see if it is 503 (service busy) or similar
      const errString = String(lastError).toUpperCase() + ' ' + String(lastError?.message || '').toUpperCase();
      console.error('[/api/business-audit] Gemini API request failed ultimately with error:', lastError);
      
      const is503 = lastError?.status === 503 || 
                    errString.includes('503') || 
                    errString.includes('UNAVAILABLE') || 
                    errString.includes('BUSY') ||
                    errString.includes('SERVICE UNAVAILABLE') ||
                    errString.includes('OVERLOADED');
      
      const errorMessage = is503 
        ? 'Gemini is temporarily busy. Please try again in a few minutes.'
        : (lastError?.message || 'Failed to generate audit.');
        
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: is503 ? 503 : 500 }
      );
    }

    const responseText = response.text || '';
    if (!responseText) {
      console.error('[/api/business-audit] Empty response received from Gemini API');
      throw new Error('Empty response received from Gemini API');
    }

    // Safely parse the JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('[/api/business-audit] Failed to parse Gemini response as JSON. Raw response:', responseText);
      // Clean up markdown block styling if LLM accidentally added them despite the system instruction
      const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
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
    console.error('[/api/business-audit] Fatal Error:', error);
    
    // Analyze if the fatal error was 503-related
    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 || 
                  errString.includes('503') || 
                  errString.includes('UNAVAILABLE') || 
                  errString.includes('BUSY') ||
                  errString.includes('SERVICE UNAVAILABLE') ||
                  errString.includes('OVERLOADED');

    const errorMessage = is503 
      ? 'Gemini is temporarily busy. Please try again in a few minutes.'
      : (error?.message || 'Failed to generate audit. Please try again.');

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: is503 ? 503 : 500 }
    );
  }
}
