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
      mainGoal, 
      landingPageType, 
      designStyle, 
      tone, 
      cta, 
      extraNotes 
    } = body;

    // Validate required fields
    if (!businessName || !businessType || !offer || !targetAudience || !mainGoal || !landingPageType || !designStyle || !tone || !cta) {
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
    const cleanGoal = String(mainGoal).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanPageType = String(landingPageType).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanStyle = String(designStyle).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanTone = String(tone).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanCTA = String(cta).trim().slice(0, MAX_FIELD_LENGTH);
    const cleanNotes = extraNotes ? String(extraNotes).trim().slice(0, MAX_FIELD_LENGTH * 2) : 'None';

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('[/api/landing-page-generator] GEMINI_API_KEY not configured. Returning dynamic mock response.');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      // Make dynamic mock response that reflects user inputs
      const mockResponse = {
        isDemoMode: true,
        page_title: `${cleanOffer} by ${cleanName}`,
        recommended_layout: cleanPageType.includes('SaaS') ? 'SaaS / Product Layout' : cleanPageType.includes('Brand') || cleanPageType.includes('Portfolio') ? 'Personal Brand / Service Layout' : 'Lead Generation Layout',
        layout_reason: `${cleanName} is a ${cleanType} seeking to "${cleanGoal}" using a ${cleanPageType}. The recommended layout focuses attention on the "${cleanOffer}" and addresses the pain points of ${cleanAudience}.`,
        target_goal: cleanGoal,
        hero: {
          headline: `Transform Your Experience with ${cleanOffer}`,
          subheadline: `A custom-tailored solution designed specifically for ${cleanAudience} who want to achieve results, save time, and grow.`,
          primary_cta: cleanCTA,
          secondary_cta: "Learn More"
        },
        problem_section: {
          heading: `Why is it so hard to get results as a ${cleanType}?`,
          description: `Most solutions in the market are too generic. They fail to solve the actual frustrations faced by ${cleanAudience}.`,
          pain_points: [
            `Lacking a specialized system tailored to your unique situations`,
            `Wasting precious hours on trial-and-error without a clear path`,
            `High fees or complexity with zero personal accountability`
          ]
        },
        solution_section: {
          heading: `Introducing the Ultimate ${cleanType} Solution`,
          description: `We do the heavy lifting for you. Our process combines expert oversight, seamless tools, and dedicated attention to make sure you achieve your target: "${cleanGoal}".`
        },
        benefits: [
          {
            "title": "Customized to Your Needs",
            "description": "Get a hyper-personalized plan that integrates smoothly into your current workflow."
          },
          {
            "title": "Time-Saving Efficiency",
            "description": "Skip the guesswork. Our proven templates and frameworks deliver speed and precision."
          },
          {
            "title": "Guaranteed Support",
            "description": "Access direct help when you need it, keeping you consistent and moving forward."
          }
        ],
        features: [
          {
            "title": "Advanced Framework Delivery",
            "description": "Engineered structures optimized specifically for target results."
          },
          {
            "title": "Integrated Diagnostics Dashboard",
            "description": "Monitor and track key milestones in real-time, validating progress automatically."
          },
          {
            "title": "Dedicated 1-on-1 Guidance",
            "description": "Regular advisory syncs to resolve bottlenecks, modify strategies, and clarify tasks."
          }
        ],
        social_proof: {
          "heading": `Trusted by Over 250+ ${cleanAudience} Internationally`,
          "testimonial_examples": [
            {
              "quote": `This completely overhauled my business. The speed and care provided was exemplary, enabling us to easily hit our main target of "${cleanGoal}".`,
              "name": "Alex Carter",
              "role": `Managing Partner`
            },
            {
              "quote": `Finally, a professional service that understands exactly what a ${cleanType} needs. The custom frameworks saved us hours of friction.`,
              "name": "Jordan Lee",
              "role": `Independent consultant`
            }
          ]
        },
        process_steps: [
          {
            "step": "01",
            "title": "Book Consultation",
            "description": `Schedule a brief call to align on your goal: "${cleanGoal}".`
          },
          {
            "step": "02",
            "title": "Receive Custom Strategy",
            "description": `We define the roadmap tailored directly to ${cleanAudience}.`
          },
          {
            "step": "03",
            "title": "Execute & Scale",
            "description": "Put the plan into action and monitor key growth metrics."
          }
        ],
        faq: [
          {
            "question": `Who is this ${cleanType} program built for?`,
            "answer": `It is specifically customized for ${cleanAudience} who want to solve their bottlenecks once and for all.`
          },
          {
            "question": "What is the expected timeline for results?",
            "answer": "Most of our clients report clear progression and milestones within the first 14 to 30 days of onboarding."
          },
          {
            "question": "Is there a support channel?",
            "answer": "Yes, we provide WhatsApp support channels and email guidance to address any queries within 24 hours."
          }
        ],
        final_cta: {
          "heading": `Ready to scale your business and achieve your goals?`,
          "subheading": `Onboarding is limited each month to guarantee quality coach-to-client attention. Secure your spot now.`,
          "button_text": cleanCTA
        },
        seo: {
          "meta_title": `${cleanOffer} | ${cleanName}`,
          "meta_description": `Transform your experience with our specialized ${cleanType} services. Built for ${cleanAudience} to achieve "${cleanGoal}".`,
          "keywords": ["business growth", cleanType, cleanOffer, "leads automation"]
        },
        expert_review_summary: {
          "what_to_improve": [
            `Incorporate the primary CTA button text ("${cleanCTA}") more times throughout the layout sections.`,
            `Introduce an interactive quiz step prior to lead capture to filter visitors.`,
            `Embed custom visuals or workflow wireframes illustrative of the features.`
          ],
          "conversion_score": 85,
          "best_next_action": `Place a limited-offer timer at the top to increase urgency.`
        }
      };

      return NextResponse.json(mockResponse);
    }

    // Initialize Google Gen AI client using @google/genai
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

    const systemPrompt = `You are an expert AI copywriter, conversion strategist, and landing page designer. Analyze the given business details and generate a highly converting landing page copy layout in raw JSON format. Keep advice simple, useful, and client-ready. Do not write generic text. Return only valid JSON matching the requested structure.`;

    const userPrompt = `
Analyze this business and return a structured JSON response:
- Business Name: ${cleanName}
- Business Type: ${cleanType}
- Product / Service / Offer: ${cleanOffer}
- Target Audience: ${cleanAudience}
- Main Goal: ${cleanGoal}
- Landing Page Type: ${cleanPageType}
- Design Style: ${cleanStyle}
- Writing Tone: ${cleanTone}
- Call To Action Text: ${cleanCTA}
- Extra Requirements: ${cleanNotes}

Expected JSON response structure:
{
  "page_title": "Optimized Page Title for the offer",
  "recommended_layout": "Which layout layout fits best: Lead Generation Layout, SaaS / Product Layout, or Personal Brand / Service Layout",
  "layout_reason": "Brief strategic copy reasoning why this layout was recommended.",
  "target_goal": "Goal matching",
  "hero": {
    "headline": "A catchy, conversion-focused main headline",
    "subheadline": "A subheadline addressing target audience frustrations and solutions",
    "primary_cta": "CTA text",
    "secondary_cta": "Secondary action text"
  },
  "problem_section": {
    "heading": "Heading addressing the core struggle/problem",
    "description": "Brief text context explaining why standard options fail",
    "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"]
  },
  "solution_section": {
    "heading": "A solution statement connecting offer to pain points",
    "description": "Details about how the product/service resolves the problem"
  },
  "benefits": [
    { "title": "Benefit 1 Title", "description": "Short explanation" },
    { "title": "Benefit 2 Title", "description": "Short explanation" },
    { "title": "Benefit 3 Title", "description": "Short explanation" }
  ],
  "features": [
    { "title": "Feature 1 Title", "description": "Short explanation" },
    { "title": "Feature 2 Title", "description": "Short explanation" },
    { "title": "Feature 3 Title", "description": "Short explanation" }
  ],
  "social_proof": {
    "heading": "Testimonial heading establishing authority",
    "testimonial_examples": [
      { "quote": "Quote text", "name": "Reviewer Name", "role": "Reviewer Job Title" },
      { "quote": "Quote text 2", "name": "Reviewer Name 2", "role": "Reviewer Job Title 2" }
    ]
  },
  "process_steps": [
    { "step": "01", "title": "Step 1 Title", "description": "Details" },
    { "step": "02", "title": "Step 2 Title", "description": "Details" },
    { "step": "03", "title": "Step 3 Title", "description": "Details" }
  ],
  "faq": [
    { "question": "Question 1", "answer": "Answer 1" },
    { "question": "Question 2", "answer": "Answer 2" },
    { "question": "Question 3", "answer": "Answer 3" }
  ],
  "final_cta": {
    "heading": "Closing headline building urgency",
    "subheading": "Subtext summarizing offer benefit",
    "button_text": "Primary button text"
  },
  "seo": {
    "meta_title": "SEO Page Title",
    "meta_description": "SEO Meta Description",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "expert_review_summary": {
    "what_to_improve": ["Improvement suggestion 1", "Improvement suggestion 2", "Improvement suggestion 3"],
    "conversion_score": 85,
    "best_next_action": "Single action item that will make the biggest improvement"
  }
}

Do not include any markdown fences (like \`\`\`json or \`\`\`) in your output. Return ONLY the raw JSON string. Ensure it is valid JSON.
`;

    let lastError: any = null;
    let response = null;
    const maxRetries = 2;
    const retryDelay = 1500;

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
        break;
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
        : (lastError?.message || 'Failed to generate landing page.');
        
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: is503 ? 503 : 500 }
      );
    }

    const responseText = response.text || '';
    if (!responseText) {
      throw new Error('Empty response received from Gemini API');
    }

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
    console.error('[/api/landing-page-generator] Fatal Error:', error);
    const errString = String(error).toUpperCase() + ' ' + String(error?.message || '').toUpperCase();
    const is503 = error?.status === 503 || 
                  errString.includes('503') || 
                  errString.includes('UNAVAILABLE') || 
                  errString.includes('BUSY') ||
                  errString.includes('SERVICE UNAVAILABLE') ||
                  errString.includes('OVERLOADED');

    const errorMessage = is503 
      ? 'Gemini is temporarily busy. Please try again in a few minutes.'
      : (error?.message || 'Failed to generate landing page. Please try again.');

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: is503 ? 503 : 500 }
    );
  }
}
