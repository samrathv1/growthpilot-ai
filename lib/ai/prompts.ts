import { ToolId } from '@/types';
import { ResultSection } from '@/types';

// ─── Prompt Templates ────────────────────────────────────────────────────────

export function businessAuditPrompt(data: Record<string, string>): string {
  return `You are a senior business growth consultant and digital strategist. Analyze the following business and provide a comprehensive audit.

Business Details:
- Business Name: ${data.businessName}
- Business Type: ${data.businessType}
- Website/Instagram: ${data.website || 'Not provided'}
- Goal: ${data.goal}
- Target Customer: ${data.targetCustomer}

Provide a detailed business audit with exactly these sections:
1. Business Problems (list 4-5 key issues holding this business back)
2. Website Improvement Ideas (4-5 specific, actionable improvements)
3. Content Ideas (5 content ideas tailored to their audience)
4. Automation Ideas (3-4 automation opportunities to save time and increase revenue)
5. 7-Day Action Plan (specific daily tasks for the next 7 days)

Be specific, actionable, and realistic. Format each section clearly.`;
}

export function landingPagePrompt(data: Record<string, string>): string {
  return `You are an expert conversion copywriter who has written landing pages for 500+ businesses. Create a complete, high-converting landing page copy.

Business Details:
- Business Type: ${data.businessType}
- Offer: ${data.offer}
- Target Audience: ${data.targetAudience}
- Tone: ${data.tone}
- Main Goal: ${data.mainGoal}

Write complete landing page copy with exactly these sections:
1. Hero Heading (powerful, benefit-driven, max 10 words)
2. Subheading (1-2 sentences expanding the hero)
3. Key Benefits (5 bullet-point benefits with icons suggested)
4. Service Sections (2-3 service descriptions, 50 words each)
5. Call to Action (primary CTA button text + surrounding copy)
6. FAQ Section (5 common questions with answers)

Write in ${data.tone} tone. Be persuasive, clear, and conversion-focused.`;
}

export function contentGeneratorPrompt(data: Record<string, string>): string {
  return `You are a viral content strategist and social media expert. Generate a complete content package.

Business Details:
- Business Type: ${data.businessType}
- Platform: ${data.platform}
- Goal: ${data.goal}
- Tone: ${data.tone}
- Number of Posts: ${data.numberOfPosts}

Create exactly these sections:
1. Post Ideas (${data.numberOfPosts} unique post concepts)
2. Instagram Captions (3 ready-to-use captions with hashtags)
3. LinkedIn Posts (2 professional posts, 150 words each)
4. Reel/Short Video Scripts (2 scripts with hook, body, CTA)
5. Ad Copy Variations (3 short ad copies for paid promotion)
6. Content Calendar (weekly posting schedule with best times)

Make content engaging, platform-appropriate, and goal-oriented.`;
}

export function leadFollowUpPrompt(data: Record<string, string>): string {
  return `You are a top sales consultant and communication expert. Create a complete follow-up sequence for a lead.

Lead Details:
- Lead Name: ${data.leadName}
- Interested Service: ${data.interestedService}
- Budget: ${data.budget}
- Urgency: ${data.urgency}
- Main Objection: ${data.objection}

Create personalized follow-up messages in exactly these sections:
1. WhatsApp Follow-up (casual, friendly, 50-80 words, address the objection)
2. Email Follow-up (professional, subject line + body, 100-150 words)
3. Call Script (opening, key talking points, objection handling, close)
4. Closing Message (final offer message for when they're almost ready)
5. Reminder Message (gentle nudge after 3 days of no response)

Address their objection "${data.objection}" naturally in at least 2 messages.`;
}

export function growthAgentPrompt(data: Record<string, string>): string {
  return `You are an elite AI business growth agent — like a personal Chief Growth Officer. The business owner has sent you a message. Analyze it deeply and provide a comprehensive, actionable growth strategy.

Business Owner's Message: "${data.query}"

Respond with a complete growth action plan in exactly these sections:
1. Best Next Action (the single most impactful thing they should do TODAY)
2. Website Improvement (3-4 specific changes to increase conversions)
3. Content Plan (what to post, where, and why — next 7 days)
4. Lead Generation Idea (1 creative, low-cost lead gen strategy)
5. Automation Suggestion (1 automation that will save time or generate leads on autopilot)
6. Message Templates (2 ready-to-send messages: one for outreach, one for follow-up)
7. 7-Day Execution Plan (day-by-day specific tasks, be very precise)

Be direct, actionable, and treat them like a high-paying client. No fluff.`;
}

export function getPromptForTool(tool: ToolId, data: Record<string, string>): string {
  switch (tool) {
    case 'business-audit': return businessAuditPrompt(data);
    case 'landing-page-generator': return landingPagePrompt(data);
    case 'content-generator': return contentGeneratorPrompt(data);
    case 'lead-follow-up': return leadFollowUpPrompt(data);
    case 'growth-agent': return growthAgentPrompt(data);
  }
}
