import { ToolId, ResultSection } from '@/types';

const mockData: Record<ToolId, ResultSection[]> = {
  'business-audit': [
    {
      title: '🔍 Business Problems',
      content: `• **No clear online presence**: Your website lacks compelling calls-to-action and loads slowly, causing visitors to leave within 3 seconds.
• **Inconsistent content strategy**: Posting irregularly (less than 3x/week) means your audience forgets about you — competitors who post daily win the attention game.
• **Weak lead capture system**: You're relying on word-of-mouth with no automated lead nurturing funnel in place.
• **Pricing not clearly communicated**: Potential clients can't quickly understand your value or pricing, leading to price-shoppers ignoring you.
• **No follow-up process**: 80% of sales happen after the 5th follow-up — most businesses give up after the 1st.`,
    },
    {
      title: '🌐 Website Improvement Ideas',
      content: `• **Add a sticky "Book Now" CTA bar** at the top — visible on every page scroll. This alone can increase bookings by 25-40%.
• **Add Google Reviews widget** on the homepage with a 4.8★ badge to build instant trust.
• **Create a "Results" or "Before & After" section** with real client transformations to prove your value visually.
• **Optimize page speed**: Compress images, remove unused plugins, and aim for a sub-3-second load time. Use Google PageSpeed Insights.
• **Add a lead magnet popup**: Offer a free guide, checklist, or first-session discount in exchange for an email address.`,
    },
    {
      title: '📱 Content Ideas',
      content: `• **"Day in the Life" Reel**: Show a behind-the-scenes look at your work process — gets 3-5x more engagement than product posts.
• **Client Transformation Story**: Before/after with a mini testimonial — the most shared content type in service businesses.
• **"Top 5 Mistakes" carousel**: Educational content that positions you as the expert and gets saved repeatedly.
• **FAQ Video series**: Answer your top 5 customer questions in 60-second videos — builds trust and reduces inbound queries.
• **Limited-time offer announcement**: "This week only" creates urgency and drives immediate bookings.`,
    },
    {
      title: '⚡ Automation Ideas',
      content: `• **WhatsApp Business Auto-reply**: Set up instant responses to DMs with your pricing, availability, and booking link — capture leads 24/7.
• **Email welcome sequence**: When someone joins your list, send a 3-email sequence over 7 days introducing your services and offering a discount.
• **Appointment reminder SMS**: Automatically send reminders 24 hours and 2 hours before appointments to reduce no-shows by 70%.
• **Review request automation**: After every completed service, auto-send a Google review request via SMS or email.`,
    },
    {
      title: '📅 7-Day Action Plan',
      content: `**Day 1 (Monday)**: Audit your Google Business Profile — add 10 photos, update hours, and reply to all reviews.
**Day 2 (Tuesday)**: Create your lead magnet (a simple PDF checklist). Set up a Mailchimp free account and create a signup form.
**Day 3 (Wednesday)**: Shoot 3 content pieces (one Reel, one carousel, one testimonial post). Schedule them for the week.
**Day 4 (Thursday)**: Set up WhatsApp Business with auto-reply messages. Add your booking link to the bio.
**Day 5 (Friday)**: Reach out to 10 past clients personally — ask for a Google review + referral with a small incentive.
**Day 6 (Saturday)**: Run a simple Facebook/Instagram ad with ₹200/day budget targeting your local area.
**Day 7 (Sunday)**: Review your week results, reply to all comments and messages, and plan next week's content.`,
    },
  ],

  'landing-page-generator': [
    {
      title: '🎯 Hero Heading',
      content: `**"Transform Your Body, Transform Your Life — Starting Today"**

*(Variation A)*: "The #1 [Business Type] in [City] — Results Guaranteed or Your Money Back"
*(Variation B)*: "Stop Wishing. Start Achieving. Expert [Service] That Actually Works."`,
    },
    {
      title: '💬 Subheading',
      content: `Join 500+ clients who've already discovered that professional [service] isn't a luxury — it's the fastest shortcut to the results you've been chasing for years. We combine expert guidance, proven methods, and genuine care to deliver transformations that last.

*Book your free consultation today. No pressure, no commitment — just real results.*`,
    },
    {
      title: '✅ Key Benefits',
      content: `🏆 **Proven Results**: 94% of our clients achieve their target goals within 90 days
⚡ **Expert Guidance**: Certified professionals with 10+ years of hands-on experience
📱 **24/7 Support**: WhatsApp access to your dedicated expert anytime you need it
🗓️ **Flexible Scheduling**: Morning, evening & weekend slots to fit your lifestyle
💰 **Money-Back Promise**: If you're not satisfied in 30 days, we'll refund you — no questions asked`,
    },
    {
      title: '📋 Service Sections',
      content: `**[Service Package 1 — Starter]**
Perfect for beginners or anyone looking to dip their toes in. Get personalized onboarding, a starter plan, and weekly check-ins. Everything you need to build momentum without overwhelm. Starting at just ₹2,999/month.

**[Service Package 2 — Pro]**
Our most popular package. Includes all Starter features plus bi-weekly 1-on-1 sessions, advanced tracking, priority support, and monthly strategy reviews. Trusted by 300+ professionals. ₹5,999/month.

**[Service Package 3 — Elite]**
The ultimate experience. Daily access, unlimited sessions, VIP event invites, and dedicated account management. For those who want the absolute best. ₹12,999/month.`,
    },
    {
      title: '🚀 Call To Action',
      content: `**Button Text**: "Claim Your Free Consultation →"

**Surrounding Copy**:
*"Join 500+ happy clients. No contracts, no hidden fees."*

**Secondary CTA**: "See Our Results First →" (links to testimonials section)

**Urgency trigger**: ⚠️ *Only 8 consultation slots available this week. Book now before they fill up.*`,
    },
    {
      title: '❓ FAQ Section',
      content: `**Q1: How quickly will I see results?**
Most clients notice a meaningful difference within the first 2-4 weeks. Significant transformations typically happen within 60-90 days when you follow the plan consistently.

**Q2: Do I need any prior experience?**
Absolutely not. We work with complete beginners to advanced clients. Your program is 100% customized to your current level and goals.

**Q3: What if I miss sessions or fall behind?**
Life happens — we get it. We offer flexible rescheduling with 24 hours notice. No penalties, no judgment.

**Q4: Is there a contract or minimum commitment?**
No long-term contracts. We offer month-to-month plans because we'd rather earn your loyalty through results than lock you in.

**Q5: How do I get started?**
Click "Claim Your Free Consultation," pick a time that works for you, and we'll have a 30-minute call to understand your goals and create your custom plan — completely free.`,
    },
  ],

  'content-generator': [
    {
      title: '💡 Post Ideas',
      content: `1. **"The Truth About [Common Misconception]"** — Debunk a myth in your industry. High engagement, high shares.
2. **"Before & After: [Client Name]'s Story"** — Real transformation with permission. Most trusted content type.
3. **"5 Signs You Need [Your Service]"** — Educational carousel that sells without selling.
4. **"A Day in My Life as a [Your Profession]"** — Humanizes your brand, builds connection.
5. **"Client Review Spotlight"** — Screenshot + story format. Social proof goldmine.
6. **"Mistake #1 That's Keeping You From [Desired Result]"** — Problem-aware content that positions you as the solution.
7. **"What ₹[Price] Gets You With Us vs. DIY"** — Value comparison that justifies your pricing.`,
    },
    {
      title: '📸 Instagram Captions',
      content: `**Caption 1 (Educational)**:
Most people think [common belief] — but here's the truth nobody tells you 👇

[3-4 lines of value-packed info]

The businesses that understand this grow 3x faster. Save this post for later!

#[YourNiche] #[YourCity] #BusinessGrowth #[IndustryTag] #GrowthHacks

---

**Caption 2 (Story/Testimonial)**:
"I was skeptical at first. Now I can't imagine going back." — [Client Name] ❤️

[Their short story in 2-3 sentences]

This is why we do what we do. Want results like [Name]? Link in bio to book your free call.

#ClientStory #RealResults #[YourService]

---

**Caption 3 (Promotional)**:
🚨 Limited spots available this month!

We only take on [X] new clients per month to ensure quality. [X-2] spots are already gone.

Here's what you get: ✅ [Benefit 1] ✅ [Benefit 2] ✅ [Benefit 3]

Comment "INFO" below and I'll DM you everything. 👇`,
    },
    {
      title: '💼 LinkedIn Posts',
      content: `**Post 1 (Thought Leadership)**:
I've worked with 100+ [business type] owners in the last 3 years.

The ones who grow consistently share 3 habits:

1. They invest in systems, not just skills
2. They post content that educates, not just promotes  
3. They follow up relentlessly — even when it feels awkward

The ones who struggle? They're still waiting for the "right time."

The market rewards action. Not perfection.

If you own a [business type] and want to grow faster, I share practical tips every week. Follow me for more.

What habit has made the biggest difference in your business? Comment below 👇

---

**Post 2 (Case Study)**:
One of my clients came to me 6 months ago with 0 online presence and 3 clients.

Today: 47 clients, ₹2.4L/month revenue, and a 3-month waitlist.

What changed? 3 things:
→ We built a simple funnel (not complicated — took 1 day)
→ We posted consistently for 60 days (not viral content — just consistent)
→ We automated follow-ups (he was losing 60% of leads by not following up)

Simple. Not easy. But simple.

Happy to share the exact template we used. Drop a 🙋 in the comments.`,
    },
    {
      title: '🎬 Reel/Video Scripts',
      content: `**Script 1: "The Hook Reel"**
🎬 HOOK (0-3 sec): *[On-screen text: "Most [business owners] are leaving ₹50,000/month on the table"]*
📢 SAY: "I'm going to show you the biggest mistake [business type] owners make — and how to fix it in 24 hours."
💬 BODY (3-45 sec): Walk through the mistake visually with text overlays + examples
✅ CTA (45-60 sec): "Follow me for more [niche] growth tips. And comment 'GUIDE' — I'll send you my free [relevant resource]."

---

**Script 2: "The Tutorial Reel"**
🎬 HOOK: *[On-screen: "Watch this if you run a [business type]"]*
📢 SAY: "Here's how we got [result] for a client in just 7 days — step by step."
💬 BODY: Steps shown visually with your face explaining
  - Step 1: [Actionable step]
  - Step 2: [Actionable step]  
  - Step 3: [Result achieved]
✅ CTA: "Save this! And follow for more — I post strategies like this every week."`,
    },
    {
      title: '📣 Ad Copy Variations',
      content: `**Ad Copy 1 (Problem-Pain)**:
"Tired of [pain point]? You're not alone. 
[Your Business] has helped 500+ people in [City] finally get [result].
Limited spots this month. Book your free consultation today."
[CTA Button: "Book Free Call"]

---

**Ad Copy 2 (Social Proof)**:
"⭐⭐⭐⭐⭐ Rated #1 [Business Type] in [City] — 200+ Google Reviews
Join thousands who've already chosen [Business Name] for [service].
First session FREE. No commitment required."
[CTA Button: "Claim Free Session"]

---

**Ad Copy 3 (Offer-Led)**:
"🔥 JULY SPECIAL — 30% OFF [Service Name]
For [City] residents only. This offer expires [Date].
[Business Name] — Expert [service] since [Year]."
[CTA Button: "Grab This Deal"]`,
    },
    {
      title: '📅 Content Calendar',
      content: `**Weekly Posting Schedule:**

| Day | Platform | Content Type | Best Time |
|-----|----------|--------------|-----------|
| Monday | Instagram | Motivational quote carousel | 8:00 AM |
| Tuesday | LinkedIn | Thought leadership post | 9:00 AM |
| Wednesday | Instagram | Educational Reel | 7:00 PM |
| Thursday | Instagram Stories | Behind the scenes | 12:00 PM |
| Friday | Instagram | Client testimonial/result | 6:00 PM |
| Saturday | Facebook | Local community post + offer | 10:00 AM |
| Sunday | Instagram Stories | Weekly poll / Q&A | 7:00 PM |

**Monthly Themes**: Week 1 = Education, Week 2 = Social Proof, Week 3 = Behind the Scenes, Week 4 = Offers & CTAs`,
    },
  ],

  'lead-follow-up': [
    {
      title: '💬 WhatsApp Follow-up',
      content: `Hey [Lead Name]! 👋

Just checking in on our conversation about [interested service]. I totally understand [their objection] — it's something many of our clients felt the same way about before they joined us.

Here's what changed their mind: [Brief solution to objection in 1-2 sentences].

We still have 2 spots open this week. Want me to hold one for you? Takes just 2 minutes to confirm. 😊

Looking forward to hearing from you!
— [Your Name]`,
    },
    {
      title: '📧 Email Follow-up',
      content: `**Subject**: Re: [Interested Service] — Quick question for you, [Lead Name]

Hi [Lead Name],

Thank you again for your interest in our [service]. I've been thinking about our conversation and wanted to address something you mentioned about [their objection].

I completely understand where you're coming from. In fact, [Lead Name from past] had the exact same concern before joining us. Here's what we did: [Brief solution]. Today, they're [result].

Here's what I'd like to offer you:
✅ A completely free 30-minute strategy call
✅ A customized plan built around your budget and goals
✅ No pressure — if it's not a fit, we part as friends

I have availability [Tuesday/Wednesday] at [morning/afternoon]. Would either of those work?

Warm regards,
[Your Name]
[Your Business] | [Phone] | [Website]`,
    },
    {
      title: '📞 Call Script',
      content: `**OPENING** (first 30 seconds):
"Hi [Lead Name], it's [Your Name] from [Business Name]. I hope I'm catching you at a good time — this will only take 3 minutes. I wanted to personally follow up because I genuinely believe we can help you with [their goal]."

**KEY TALKING POINTS:**
• "What's the biggest challenge you're facing right now with [their problem]?"
• "When you imagine [desired result], what does that look like for you?"
• "Our [service] specifically addresses [their objection] by doing [explanation]."

**OBJECTION HANDLING — for "[their objection]":**
"I hear you. A lot of clients felt the same way at first. What helped them move forward was [reframe]. Does that make sense?"

**CLOSE:**
"Based on what you've told me, I think [Package X] would be perfect for you. It's [price/terms] and I can have you started by [date]. Can we move forward today, or would you like 24 hours to think it over?" *(Silence — wait for their response)*`,
    },
    {
      title: '🤝 Closing Message',
      content: `Hey [Lead Name], I want to be transparent with you because I respect your time.

We have ONE spot left at our current pricing before we increase rates next month. I've been holding it because I think you'd be a great fit.

Here's what you get when you join today:
🎁 [Bonus 1] — valued at ₹[X]
🎁 [Bonus 2] — valued at ₹[X]  
🎁 [Bonus 3] — valued at ₹[X]

Total value: ₹[X]. Your investment: just ₹[your price].

I need your decision by [specific date/time]. After that, the spot goes to the next person on the waitlist.

Ready to move forward? Just reply "YES" and I'll send you everything to get started. 🚀`,
    },
    {
      title: '⏰ Reminder Message',
      content: `Hey [Lead Name]! Hope your week is going well.

I know things get busy — I wanted to give you a gentle nudge in case my last message got buried. 😊

We're still here whenever you're ready. No pressure at all.

If you have any more questions about [interested service] or need more info on [their objection concern], I'm literally here to help — not sell.

What would make this an easy "yes" for you? Just tell me and we'll figure it out together. 🙏

Talk soon,
[Your Name]`,
    },
  ],

  'growth-agent': [
    {
      title: '🚀 Best Next Action',
      content: `**Your #1 Priority This Week**: Set up a simple WhatsApp Business profile with an automated greeting message and a link to a booking/inquiry form (Google Forms is free).

Why this? Because **80% of local business leads come through WhatsApp** and the businesses that respond within 5 minutes of an inquiry close 70% more deals than those who take hours. Right now, every unanswered message is a lost customer.

⏱️ Time to complete: 2-3 hours
💰 Cost: FREE
📈 Expected impact: 30-50% increase in lead conversion within 2 weeks`,
    },
    {
      title: '🌐 Website Improvement',
      content: `Based on your situation, here are the highest-ROI website changes:

**1. Add a clear "Book / Enquire Now" button** above the fold (visible without scrolling). Make it a contrasting color. This alone can increase conversions by 25%.

**2. Add a trust bar** — show logos of certifications, "Google Verified Business", "500+ Happy Clients", etc. Builds instant credibility.

**3. Add a WhatsApp floating button** — visitors who can't find your contact info immediately leave. A floating WhatsApp icon removes all friction.

**4. Add 3-5 Google reviews** embedded directly on your homepage. 91% of people trust reviews as much as personal recommendations.

🛠️ Recommended tool: Wix, Webflow, or WordPress with Elementor (all beginner-friendly, no coding needed)`,
    },
    {
      title: '📱 Content Plan',
      content: `**7-Day Content Blitz Plan:**

📅 **Day 1 (Today)**: Post a "What we do" Reel — 30 seconds, show your service, add text overlays. Don't overthink it.
📅 **Day 2**: Post a client testimonial (even a screenshot of a WhatsApp review works perfectly)
📅 **Day 3**: Share a tip carousel — "5 things to know before choosing [your service type]"
📅 **Day 4**: Post a "Day in the Life" story — 3-5 clips from your work day
📅 **Day 5**: Post a "limited offer" — even a small discount creates urgency
📅 **Day 6**: Re-share your top post from last month. Evergreen content works 2x.
📅 **Day 7**: Go LIVE for 10 minutes — answer questions, show your space, introduce yourself

**Platform Priority**: Focus on Instagram + WhatsApp Stories first. Don't spread thin.`,
    },
    {
      title: '🎯 Lead Generation Idea',
      content: `**The Local Partnership Play — Zero Budget, High Impact:**

Partner with 2-3 complementary local businesses to cross-refer customers.

Example: If you're a gym → partner with a nutritionist, sports store, and physiotherapist. If you're a salon → partner with a bridal shop, photographer, and makeup artist.

**How to execute:**
1. Walk into 3 local businesses near you this week
2. Propose a simple referral deal: "You send me clients, I'll send you clients — let's grow together"
3. Create referral cards (print 50 cards, cost ~₹200)
4. Offer a 10% discount to anyone they refer

**Expected result**: 5-15 new leads per month per partner, at zero advertising cost. Most businesses that implement this see results within 2-3 weeks.`,
    },
    {
      title: '⚡ Automation Suggestion',
      content: `**Google Forms + WhatsApp + Email Automation (FREE setup):**

1. **Create a Google Form** as your "Free Consultation Request" form — collect name, phone, email, goal, and budget
2. **Share the form link** everywhere: bio, stories, business card, WhatsApp status
3. **Set up Google Sheets + Zapier free tier** to auto-send a WhatsApp message when someone submits the form
4. **Auto-response template**: "Hi [Name]! Thanks for reaching out. I've received your request for [service]. I'll call you within 2 hours to discuss your goals. — [Your Name]"

**Why this works**: You capture leads even while sleeping. Every lead gets an instant response. You look professional and organized.

⏱️ Setup time: 3-4 hours  
💰 Cost: FREE (Zapier free tier handles 100 tasks/month)`,
    },
    {
      title: '💬 Message Templates',
      content: `**Outreach Message (Cold)** — For reaching out to potential clients:
---
"Hey [Name]! I noticed you [follow us / live nearby / recently visited]. I'm [Your Name] from [Business Name] — we specialize in helping [target type] achieve [result].

I'd love to offer you a completely FREE [consultation/trial/session] — no strings attached. Just a chance to see if we can help.

Would that be something you'd be interested in? 😊"
---

**Follow-up Message** — For leads who showed interest but went quiet:
---
"Hi [Name], just wanted to check in! I know things get busy — I still have that free [offer] reserved for you.

Quick question: What's the one thing that's holding you back from [desired goal]? If you tell me, I'll share exactly how we'd fix it.

Here for you whenever you're ready 🙏"
---`,
    },
    {
      title: '📅 7-Day Execution Plan',
      content: `**Monday**: Set up WhatsApp Business (2hrs) + Create your Google Form inquiry link (1hr) + Post your first content piece (1hr)

**Tuesday**: Visit 2 local businesses for partnership conversations (2hrs) + Reply to all DMs and comments from yesterday's post (30min) + Set up Google Business Profile if not done (1hr)

**Wednesday**: Shoot 3 content pieces batch (2hrs) + Send your outreach message to 10 potential clients (1hr) + Set up your Zapier automation (1hr)

**Thursday**: Post content #2 + Follow up with everyone you messaged Monday-Wednesday + Ask 5 past/current clients for Google reviews

**Friday**: Run a small Instagram/Facebook ad (₹200-500 budget) targeting your local area + Reshare your best piece of content from this week in Stories

**Saturday**: Review your week — what got the most engagement? More of that + Plan next week's content + Rest and recharge

**Sunday**: Go LIVE on Instagram for 10 minutes — share a tip, answer questions, show your personality

**Weekly KPIs to track**: New inquiries, response time, conversion rate, social media reach, and Google reviews count.`,
    },
  ],
};

export function getMockResponse(tool: ToolId): ResultSection[] {
  return mockData[tool] || [];
}
