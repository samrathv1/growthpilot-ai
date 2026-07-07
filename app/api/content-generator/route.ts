import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Maximum length for fields to prevent abuse
const MAX_FIELD_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      businessType,
      offer,
      targetAudience,
      platform,
      goal,
      tone,
      contentDuration,
      extraNotes,
    } = body;

    // Validate required fields
    if (!businessName || !businessType || !offer || !targetAudience || !platform || !goal || !tone || !contentDuration) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in all required inputs.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const cleanName = String(businessName).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanType = String(businessType).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanOffer = String(offer).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanAudience = String(targetAudience).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanPlatform = String(platform).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanGoal = String(goal).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanTone = String(tone).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanDuration = String(contentDuration).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanNotes = extraNotes ? String(extraNotes).trim().slice(0, MAX_FIELD_LENGTH * 2) : 'None';

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a realistic mock response for demo / portfolio mode
      console.log('[/api/content-generator] GEMINI_API_KEY not configured. Returning dynamic mock response.');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      const durationDays = parseInt(cleanDuration) || 7;
      const calendarEntries = [];
      for (let i = 1; i <= durationDays; i++) {
        calendarEntries.push({
          day: `Day ${i}`,
          platform: cleanPlatform === 'Multi-platform' ? (i % 2 === 0 ? 'LinkedIn' : 'Instagram') : cleanPlatform,
          content_type: i % 3 === 0 ? 'Reel / Short Video' : i % 3 === 1 ? 'Carousel Post' : 'Static Image Post',
          topic: `${cleanOffer} — Angle ${((i - 1) % 4) + 1} for ${cleanAudience}`,
          caption: `Discover why ${cleanAudience} are switching to ${cleanName}. ${cleanOffer} is your fast track to results. ${cleanGoal === 'Get more leads' ? 'DM us "START" to get started!' : 'Tap the link in bio to learn more.'}`,
          cta: cleanGoal === 'Get more leads' ? 'DM "START" now' : 'Learn More →',
        });
      }

      const mockResponse = {
        isDemoMode: true,
        content_strategy: {
          summary: `A ${cleanDuration} content strategy for ${cleanName} (${cleanType}) focused on "${cleanGoal}" targeting ${cleanAudience} via ${cleanPlatform}. The tone will be ${cleanTone} throughout.`,
          target_audience_angle: `${cleanAudience} who are actively searching for solutions like ${cleanOffer} and engage with ${cleanTone.toLowerCase()} content on ${cleanPlatform}.`,
          main_message: `${cleanName} offers ${cleanOffer} — the smartest way for ${cleanAudience} to achieve their goals faster.`,
          recommended_platform: cleanPlatform === 'Multi-platform' ? 'Instagram + LinkedIn' : cleanPlatform,
          posting_frequency: durationDays <= 7 ? 'Daily' : durationDays <= 15 ? '5x per week' : '4-5x per week',
        },
        post_ideas: [
          { title: `Why ${cleanAudience} Love ${cleanOffer}`, description: `Share real results or scenarios showing how ${cleanOffer} solves a daily challenge for ${cleanAudience}.`, content_type: 'Carousel Post' },
          { title: `Behind the Scenes at ${cleanName}`, description: `Show the process, the team, or the preparation that goes into delivering ${cleanOffer}.`, content_type: 'Reel / Short Video' },
          { title: `3 Myths About ${cleanType}`, description: `Debunk common misconceptions in the ${cleanType} industry that stop ${cleanAudience} from taking action.`, content_type: 'Static Post' },
          { title: `Client Spotlight / Testimonial`, description: `Feature a real or realistic success story from someone who benefited from ${cleanOffer}.`, content_type: 'Story + Post' },
        ],
        captions: [
          { caption: `Still struggling to find the right ${cleanType.toLowerCase()} solution? ${cleanName}'s ${cleanOffer} was built for ${cleanAudience} who want real results — not empty promises.`, cta: cleanGoal === 'Get more leads' ? '💬 DM "INFO" to learn more' : '🔗 Link in bio', hashtags: [`#${cleanType.replace(/\s+/g, '')}`, `#${cleanName.replace(/\s+/g, '')}`, '#GrowthTips'] },
          { caption: `You don't need to figure it all out alone. ${cleanName} helps ${cleanAudience} go from confused → confident with ${cleanOffer}.`, cta: '📩 Save this post & share with someone who needs it', hashtags: ['#BusinessGrowth', '#SmartStrategy', `#${cleanType.replace(/\s+/g, '')}`] },
          { caption: `Here's the truth about ${cleanType.toLowerCase()} that nobody tells ${cleanAudience}. Swipe to see 👉`, cta: '💡 Follow for more tips', hashtags: ['#ExpertAdvice', `#${cleanName.replace(/\s+/g, '')}`, '#TipsAndTricks'] },
        ],
        reel_scripts: [
          { hook: `"POV: You finally found a ${cleanType.toLowerCase()} that actually works for ${cleanAudience}..."`, script: `Show a before-and-after transformation or day-in-the-life using ${cleanOffer}. End with a clear call-to-action.`, visual_idea: `Quick cuts showing the problem → the solution → the result. Use trending audio.`, cta: cleanGoal === 'Get more leads' ? 'DM us "START" for a free consultation' : 'Tap the link in bio' },
          { hook: `"3 things I wish I knew before starting ${cleanType.toLowerCase()}..."`, script: `Share 3 quick tips or lessons that position ${cleanName} as the expert. Keep each tip under 5 seconds.`, visual_idea: `Talking head with text overlays for each tip. Fast-paced edits.`, cta: 'Follow for more tips like this' },
        ],
        ad_copies: [
          { headline: `${cleanOffer} — Built for ${cleanAudience}`, primary_text: `Tired of wasting time on solutions that don't work? ${cleanName}'s ${cleanOffer} is specifically designed for ${cleanAudience} who want ${cleanGoal.toLowerCase()}. Join hundreds who already made the switch.`, cta: cleanGoal === 'Get more leads' ? 'Book Free Consultation' : 'Learn More' },
          { headline: `Stop Settling. Start Growing with ${cleanName}.`, primary_text: `${cleanAudience} deserve better. ${cleanOffer} gives you the tools, support, and strategy to ${cleanGoal.toLowerCase()} — starting today.`, cta: 'Get Started Now' },
        ],
        whatsapp_promos: [
          { message: `Hi! 👋 I'm reaching out from ${cleanName}. We're offering ${cleanOffer} for ${cleanAudience} who want to ${cleanGoal.toLowerCase()}. Would you like to know more?`, follow_up: `Just checking in — did you get a chance to look at ${cleanOffer}? Happy to answer any questions. Reply YES to get started! 🚀` },
          { message: `🎉 Limited-time offer from ${cleanName}! ${cleanOffer} is now available with a special introductory rate for ${cleanAudience}. DM for details!`, follow_up: `Hey! Just a reminder — our special rate for ${cleanOffer} ends soon. Don't miss out! Let me know if you'd like to secure your spot.` },
        ],
        content_calendar: calendarEntries,
        best_performing_angles: [
          `Transformation stories: Show how ${cleanAudience} go from problem → solution using ${cleanOffer}`,
          `Authority content: Position ${cleanName} as the expert in ${cleanType} with tips and myth-busting`,
          `Social proof: Client results, testimonials, and behind-the-scenes showing real activity`,
        ],
        final_recommendation: `Focus the first week on building trust and authority through educational content. Use Reels and carousels for maximum reach on ${cleanPlatform}. Every piece of content should tie back to "${cleanGoal}" with a clear, low-friction CTA. Consistency and ${cleanTone.toLowerCase()} messaging will set ${cleanName} apart from generic ${cleanType.toLowerCase()} competitors.`,
      };

      return NextResponse.json(mockResponse);
    }

    // Initialize Google Gen AI client
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const systemPrompt = `You are an expert social media strategist, content marketer, and copywriter. Create a comprehensive, platform-specific content plan for the given business. Make content specific, actionable, and ready to use. Avoid generic filler content. Every caption, script, and ad copy should be written as if a real marketing professional created it for a paying client. Return only valid JSON in the required structure.`;

    const userPrompt = `
Create a complete ${cleanDuration} content plan for this business:

- Business Name: ${cleanName}
- Business Type: ${cleanType}
- Product / Service / Offer: ${cleanOffer}
- Target Audience: ${cleanAudience}
- Platform: ${cleanPlatform}
- Main Goal: ${cleanGoal}
- Tone: ${cleanTone}
- Content Duration: ${cleanDuration}
- Extra Notes: ${cleanNotes}

Return ONLY valid JSON with this exact structure:
{
  "content_strategy": {
    "summary": "A concise overview of the content strategy",
    "target_audience_angle": "How to angle content for this specific audience",
    "main_message": "The core message running through all content",
    "recommended_platform": "Best platform(s) for this business",
    "posting_frequency": "How often to post"
  },
  "post_ideas": [
    { "title": "Post idea title", "description": "What to post and why", "content_type": "Carousel / Reel / Static / Story" }
  ],
  "captions": [
    { "caption": "Full ready-to-post caption", "cta": "Call-to-action line", "hashtags": ["hashtag1", "hashtag2", "hashtag3"] }
  ],
  "reel_scripts": [
    { "hook": "Opening hook line", "script": "Full reel script", "visual_idea": "What to show visually", "cta": "End CTA" }
  ],
  "ad_copies": [
    { "headline": "Ad headline", "primary_text": "Ad body text", "cta": "CTA button text" }
  ],
  "whatsapp_promos": [
    { "message": "Initial WhatsApp promo message", "follow_up": "Follow-up message" }
  ],
  "content_calendar": [
    { "day": "Day 1", "platform": "Platform name", "content_type": "Type", "topic": "Topic", "caption": "Short caption", "cta": "CTA" }
  ],
  "best_performing_angles": ["Angle 1", "Angle 2", "Angle 3"],
  "final_recommendation": "Final strategic recommendation paragraph"
}

Important:
- Generate at least 4 post ideas
- Generate at least 3 captions with hashtags
- Generate at least 2 reel scripts
- Generate at least 2 ad copies
- Generate at least 2 WhatsApp promo messages
- Generate a content calendar for all ${cleanDuration}
- Make all content specific to ${cleanName} and ${cleanOffer}
- Use a ${cleanTone} tone throughout
- Optimize for ${cleanPlatform}
- Align everything with the goal: ${cleanGoal}

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
        break; // Success
      } catch (err: any) {
        lastError = err;
        console.warn(`[Attempt ${attempt + 1}/${maxRetries + 1}] Gemini API call failed:`, err.message || err);
        
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!response) {
      const errString = String(lastError).toUpperCase() + ' ' + String(lastError?.message || '').toUpperCase();
      const is503 = lastError?.status === 503 ||
                    errString.includes('503') ||
                    errString.includes('UNAVAILABLE') ||
                    errString.includes('BUSY') ||
                    errString.includes('SERVICE UNAVAILABLE') ||
                    errString.includes('OVERLOADED');

      const errorMessage = is503
        ? 'Gemini is temporarily busy. Please try again in a few minutes.'
        : (lastError?.message || 'Failed to generate content plan.');

      return NextResponse.json(
        { error: errorMessage },
        { status: is503 ? 503 : 500 }
      );
    }

    const responseText = response.text || '';
    if (!responseText) {
      throw new Error('Empty response received from Gemini API');
    }

    // Safely parse the JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON. Raw response:', responseText);
      const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      parsedResult = JSON.parse(cleanedText);
    }

    return NextResponse.json({
      ...parsedResult,
      isDemoMode: false,
    });
  } catch (error: any) {
    console.error('[/api/content-generator] Fatal Error:', error);

    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 ||
                  errString.includes('503') ||
                  errString.includes('UNAVAILABLE') ||
                  errString.includes('BUSY') ||
                  errString.includes('SERVICE UNAVAILABLE') ||
                  errString.includes('OVERLOADED');

    const errorMessage = is503
      ? 'Gemini is temporarily busy. Please try again in a few minutes.'
      : (error?.message || 'Failed to generate content plan. Please try again.');

    return NextResponse.json(
      { error: errorMessage },
      { status: is503 ? 503 : 500 }
    );
  }
}
