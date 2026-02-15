# Teach Charlie AI — Complete SaaS Launch Playbook

> **Generated**: February 15, 2026
> **Product**: Teach Charlie AI (app.teachcharlie.ai)
> **Founder**: Adam — Solo, non-technical, 10+ years no-code automation
> **Status**: MVP Complete, Production Live
> **Goal**: $5K-$25K MRR Year 1, 100-500 users, 5+ workshops

---

## Table of Contents

1. [Section 1: Pre-Launch Validation (Weeks 1-4)](#section-1-pre-launch-validation-weeks-1-4)
2. [Section 2: Positioning & Messaging](#section-2-positioning--messaging)
3. [Section 3: Workshop Strategy & Curriculum](#section-3-workshop-strategy--curriculum)
4. [Section 4: Pricing & Monetization](#section-4-pricing--monetization)
5. [Section 5: Content Marketing & SEO Strategy](#section-5-content-marketing--seo-strategy)
6. [Section 6: Community Building Strategy](#section-6-community-building-strategy)
7. [Section 7: Growth Loops & Viral Mechanics](#section-7-growth-loops--viral-mechanics)
8. [Section 8: Technical Priorities for Growth](#section-8-technical-priorities-for-growth)
9. [Section 9: Financial Planning & P&L](#section-9-financial-planning--pl)
10. [Section 10: Metrics & Decision Framework](#section-10-metrics--decision-framework)
11. [Section 11: Risk Mitigation](#section-11-risk-mitigation)
12. [Section 12: 90-Day Launch Sprint Plan](#section-12-90-day-launch-sprint-plan)
13. [Appendix A: Competitive Intelligence Deep Dive](#appendix-a-competitive-intelligence-deep-dive)

---

---

# PRE-LAUNCH VALIDATION PLAYBOOK — Weeks 1-4

## Teach Charlie AI: "Fisher-Price meets Langflow"

---

## Executive Summary

This playbook covers the four weeks before Teach Charlie AI's public launch push. The goal is not to build more product — the MVP is live — but to **validate the four riskiest assumptions** before investing further time and money:

1. Non-technical users will pay $19/month when free alternatives exist
2. Workshop attendees convert to paying SaaS customers
3. "Education-first" positioning differentiates in a crowded market
4. The "Dog Trainer" metaphor resonates beyond the founder's immediate network

**Total estimated budget for Weeks 1-4**: $280-$450
**Time commitment**: ~18-20 hours/week (fits the 20hr/week constraint)

---

## 1. PRICE POINT VALIDATION

### 1A. Van Westendorp Price Sensitivity Survey

**Why this matters**: $19/month is the entire unit economics foundation. If the acceptable range is actually $9/month or $29/month, every projection changes. You need data from real potential users, not gut feeling. This is the single highest-leverage validation activity in the entire playbook.

**The Four Standard Van Westendorp Questions** (use these verbatim):

> *Imagine a tool that lets you build an AI assistant for your business by answering 3 simple questions — no coding, no technical setup. It can answer customer FAQs, qualify leads, or handle routine inquiries 24/7.*
>
> 1. **At what monthly price would you consider this tool to be so inexpensive that you would question its quality?** (Too Cheap)
> 2. **At what monthly price would you consider this tool to be a bargain — a great buy for the money?** (Cheap/Good Value)
> 3. **At what monthly price would you consider this tool to be getting expensive — you'd still consider it, but you'd have to think about it?** (Expensive/High)
> 4. **At what monthly price would you consider this tool to be so expensive that you would not consider buying it?** (Too Expensive)

**Additional context questions to include** (asked before the price questions to prime respondents):

> 5. How much do you currently spend per month on software tools for your business? [$0 / $1-50 / $51-150 / $151-500 / $500+]
> 6. Have you tried building a chatbot or AI assistant before? [Never / Tried and gave up / Currently use one / Built one successfully]
> 7. How many customer inquiries does your business handle per week? [0-10 / 11-50 / 51-200 / 200+]

**Sample size**: Minimum 40 responses for directional data, 80+ for statistical confidence. At 40 responses you can identify the acceptable price range with roughly +/-15% precision. At 80 you tighten to +/-10%.

**How to interpret the results**:
- Plot cumulative frequency curves for all four questions
- The intersection of "Too Cheap" and "Too Expensive" curves = **Point of Marginal Cheapness** (PMC)
- The intersection of "Cheap" and "Expensive" curves = **Indifference Price Point** (IPP)
- The acceptable range is between PMC and IPP
- **If $19 falls within this range**: price is validated, proceed
- **If $19 is above the IPP**: consider $14/mo or restructuring the value prop
- **If $19 is below the PMC**: you are leaving money on the table, test $29/mo

**Tool**: Create in Tally (free, unlimited forms) or Typeform (free tier, 10 responses/month — upgrade to Basic at $25/month if needed for the month). Tally is the better choice here because you need >10 responses and the free tier is unlimited.

**Distribution** (aim for 60+ responses over 10 days):
- Post in 3-5 relevant online communities (see Section 4 for specific communities)
- Share with your existing professional network on LinkedIn (1 post + DMs to 30 contacts)
- Include at the end of workshop registrations
- Add as a pop-up or exit-intent survey on teachcharlie.ai (use Tally embed)

**Timeline**: Launch survey Day 1 of Week 1. Close and analyze by end of Week 2.

**Budget**: $0 (Tally free tier) or $25 (Typeform Basic for one month)

### 1B. Fake Door Test

**Why this matters**: Surveys measure stated preference. Fake door tests measure revealed preference — what people actually do with their wallet hovering over the button. The gap between these two numbers is where most pricing assumptions die.

**Method**: Create a pricing page at `teachcharlie.ai/pricing` (already implied by current tiers). Add a Stripe checkout link to the $19/month Individual plan. When a user clicks "Start Free Trial" or "Subscribe," they reach a page that says:

> *"You're one of the first! We're opening Individual plans to founding members in [Month]. Enter your email to lock in the founding member price of $19/month (regular price will be $29/month) and get priority access."*

**Key metrics to track**:
- **Pricing page visitors** (via PostHog or simple analytics)
- **CTA click-through rate** (clicked "Subscribe" or "Start Trial")
- **Email capture rate** (entered email on the "not yet available" page)
- **Benchmark**: A 3-8% CTA click rate from pricing page visitors is healthy for a new B2B SaaS. Below 2% signals the price/value equation is off. Above 10% suggests strong demand.

**Implementation**: This requires a simple landing page variation. Use the existing site and add a dedicated pricing page if one doesn't exist, or modify the existing one. Use PostHog (free tier, 1M events/month) for click tracking.

**Timeline**: Set up in Week 1 (2-3 hours). Run throughout Weeks 1-4. Analyze weekly.

**Budget**: $0 (PostHog free tier)

### 1C. Competitor Price Benchmarking Matrix

**Why this matters**: Your price needs to be justified relative to alternatives. "Why should I pay $19 when ChatGPT custom GPTs are free?" is the objection you will hear most often. You need a crisp answer.

| Competitor | Free Tier | Paid Entry | Key Limitation of Free | Teach Charlie Advantage |
|---|---|---|---|---|
| **ChatGPT Custom GPTs** | Free (with ChatGPT Plus $20/mo) | $20/mo (ChatGPT Plus required) | Requires ChatGPT subscription; no embed; no business tools; no lead capture | No ChatGPT sub needed; embeddable; business-focused templates |
| **Botpress** | Free (5 bots, 2K messages/mo) | $79/mo (Team) | Complex visual builder; steep learning curve; 2K msg limit | 3-question setup; no-code; unlimited test runs on free |
| **Voiceflow** | Free (2 agents, limited) | $60/mo (Pro) | Complex dialog design; aimed at product teams | Educational metaphor; workshop support; no technical skills needed |
| **FlowiseAI** | Free (self-hosted) | $35/mo (cloud) | Requires self-hosting or technical setup; no guided onboarding | Fully hosted; guided 3-step wizard; no server management |
| **Langflow** | Free (open source) | $0 (self-hosted) | Must self-host; complex node-based UI; developer-focused | Langflow under the hood but completely abstracted away |
| **Zapier AI Agents** | Included in Zapier plans | $29.99/mo (Starter) | Tied to Zapier ecosystem; not standalone | Standalone; purpose-built for AI agents; education-first |

**Positioning statement to validate**: "Teach Charlie costs $19/month — less than a ChatGPT Plus subscription — and you get a business-ready AI agent in 2 minutes without any technical knowledge. Free tools exist, but they require technical skills you don't have and time you don't have to learn them."

**Key insight**: Your real competitor is not Botpress or Voiceflow. It is **inaction** — the small business owner who keeps manually answering the same 50 customer questions because every AI tool looks too complicated. Your price is not competing with free tools. It is competing with the cost of the owner's time.

### 1D. Early Adopter Price Interviews (5-8 conversations)

**Why this matters**: Surveys give you numbers. Conversations give you the reasoning behind the numbers. You need both. Five to eight focused interviews will surface objections and value perceptions that no survey can capture.

**Interview script** (15-20 minutes each, over Zoom or phone):

1. "Tell me about a repetitive task in your business that takes up too much of your time." [Open-ended, let them talk for 2-3 minutes]
2. "Have you ever tried using AI or a chatbot for your business? What happened?" [Understand prior experience]
3. *[Demo Teach Charlie for 3 minutes — show the 3-question wizard]*
4. "On a scale of 1-10, how useful would something like this be for your business right now?"
5. "If this existed today at $19/month, would you sign up?" [Direct ask — note hesitation]
6. "What would make it worth $19/month to you? What's missing?" [Surface value gaps]
7. "What would you compare this to? What's the closest thing you've used?" [Understand mental model]
8. "If it were $9/month but with fewer features, or $29/month with everything, which would you lean toward?" [Bracket the price]

**Who to interview**: 3 small business owners, 2 marketing managers, 2-3 people from your existing network who match the target persona. Recruit via LinkedIn DMs or warm intros.

**Compensation**: None needed for warm contacts. For cold outreach, offer "free lifetime access to Individual plan" as compensation — costs you nothing and creates a committed beta user.

**Timeline**: Schedule across Weeks 2-3. Five interviews minimum.

**Budget**: $0

**ASSUMPTION MOST LIKELY WRONG HERE**: The assumption that $19/month is the right single price point. The Van Westendorp data will very likely reveal that the acceptable range is wider than expected, and that different segments (small business owners vs. marketing managers) have different willingness-to-pay. Be prepared to introduce an intermediate tier or adjust the Individual price. The credit pack model ($10 for 2,000 runs) may actually be more attractive to low-volume users than a $19/month subscription.

---

## 2. WORKSHOP-TO-SAAS CONVERSION TESTING

### 2A. Pre-Workshop Survey (Sent 48 hours before each workshop)

**Why this matters**: You cannot measure conversion if you do not know where attendees start. This survey establishes a baseline for each person's technical comfort, current pain points, and buying intent — so you can segment your post-workshop analysis.

**Survey tool**: Tally (free) — embed in the registration confirmation email.

**Questions** (keep to 6 or fewer — respect pre-workshop attention spans):

1. What best describes you? [Small business owner / Marketing professional / Consultant / Student / Curious about AI / Other]
2. How would you rate your comfort with technology? [1-5 scale: "I still use paper notebooks" to "I write code for fun"]
3. What's your biggest frustration with handling customer questions or leads right now? [Open text, 1-2 sentences]
4. Have you tried any AI tools before? [Never / Tried once / Use regularly]
5. If you could have an AI assistant handle one task for you, what would it be? [Open text]
6. How likely are you to invest in a paid tool if it saves you 5+ hours per week? [Very unlikely / Unlikely / Neutral / Likely / Very likely]

**Target completion rate**: 60-70% of registered attendees. Send a reminder 24 hours before the workshop to non-completers.

### 2B. During-Workshop Tracking Framework

**Why this matters**: Workshops are your primary sales channel. Every workshop is a live experiment. You need to observe specific behaviors, not just "how it went."

**What to track during each workshop** (assign one person to note these, or record the session and review):

| Metric | How to Capture | What It Tells You |
|---|---|---|
| **"Aha" moment timing** | Note the clock time when attendees visibly engage (lean in, ask excited questions, start typing) | When the value proposition clicks — this should happen within the first 10 minutes |
| **3-question completion rate** | Count how many attendees finish all 3 wizard steps during the workshop | If <80%, the wizard UX needs simplification |
| **Questions asked** | Log every question (verbatim if possible) | Reveals confusion points and unmet expectations |
| **Drop-off point** | Note when attendees disengage (check phones, leave early) | Identifies where the workshop loses momentum |
| **"Can it do X?" requests** | Log every feature request or "can it..." question | Reveals the gap between expectations and current capabilities |
| **Peer-to-peer moments** | Note when one attendee helps another or when someone says "oh, I could use this for..." | Social proof forming in real time — these are your future testimonials |

**Workshop structure recommendation** (90-minute format):

| Time | Activity | Tracking Focus |
|---|---|---|
| 0-10 min | Welcome + "Why AI matters for your business" framing | Energy level, engagement |
| 10-25 min | Live demo: Build an AI agent in 2 minutes using 3 questions | "Aha" moment timing |
| 25-45 min | Hands-on: Each attendee builds their own agent | Completion rate, questions asked |
| 45-60 min | Test your agent: Playground interaction | Engagement quality, excitement level |
| 60-75 min | Advanced: Show what "unlocking the flow" looks like (optional complexity) | Interest in advanced features vs. confusion |
| 75-90 min | Q&A + "How to keep using this" (transition to SaaS pitch) | Conversion intent signals |

**The SaaS transition script** (use in the final 15 minutes):

> "Everything you built today is saved in your free account. You get 1 agent and 1,000 test runs per month — that's enough to keep experimenting. When you're ready to go live with customers, the Individual plan is $19/month — less than a single hour of your time answering the same customer questions. And here's the thing — your agent works 24/7. It never calls in sick. I'll send everyone a link after the workshop with a special founding member offer."

### 2C. Post-Workshop Conversion Funnel

**Why this matters**: This is the make-or-break metric for the entire business model. If workshops do not convert to paying users, you have a training business, not a SaaS business. Both can work, but they require completely different strategies.

**Funnel stages and expected conversion rates**:

| Stage | Metric | Target Rate | "Validated" Threshold | "Invalidated" Threshold |
|---|---|---|---|---|
| **Attended** → **Signed Up (Free)** | Created a free account | 60-75% | >50% | <30% |
| **Signed Up** → **Activated** | Built at least 1 agent + sent 1 message in playground | 50-65% | >40% | <25% |
| **Activated** → **Returned (Day 7)** | Logged in again within 7 days | 30-45% | >25% | <15% |
| **Returned** → **Paid** | Converted to Individual plan ($19/mo) within 30 days | 8-15% | >5% | <3% |

**What "validated" means**: If you run 3 workshops (30-50 total attendees) and achieve the target rates above, the workshop-to-SaaS model is viable. Specifically, if 50 attendees yield 30 sign-ups, 15 activated, 5 returning, and 2-3 paying customers, that is a $38-$57/mo contribution per workshop. At 2 workshops/month, that is $76-$114/mo growing — not enough alone, but combined with organic sign-ups, it is a valid foundation.

**What "invalidated" means**: If fewer than 3% of activated users convert to paid within 30 days across 3+ workshops, the workshop-to-SaaS pipeline is broken. Possible diagnoses:
- The free tier is too generous (users never need to upgrade)
- The $19/month price is too high for this audience
- The product does not deliver enough ongoing value after the workshop excitement fades
- The audience is "curious" not "committed" — wrong attendee profile

**Post-workshop email sequence** (send from your personal email, not a marketing tool — these are warm contacts):

**Email 1: Same day (within 2 hours of workshop ending)**
> Subject: Your Charlie agent is waiting for you
>
> Hey [Name],
>
> Thanks for joining today's workshop! Your AI agent is saved and ready to go:
> [Link to their account / playground]
>
> Quick reminder — you have 1,000 free test runs this month. Try sharing your agent link with a friend or colleague and see how it handles their questions.
>
> If you get stuck, just reply to this email. I read every one.
>
> — Adam

**Email 2: Day 3**
> Subject: Did Charlie handle that question?
>
> Hey [Name],
>
> Just checking in — have you had a chance to test your agent with a real customer question yet?
>
> If not, here's a quick challenge: open your playground and ask your agent the #1 question your customers ask you. See how it does. Takes 30 seconds.
>
> [Link to playground]
>
> — Adam

**Email 3: Day 7**
> Subject: What one thing would make Charlie more useful?
>
> Hey [Name],
>
> Quick question (hit reply, one sentence is fine):
>
> **What's the one thing that would make your AI agent actually useful for your business day-to-day?**
>
> I'm building this based on what real business owners need, and your answer directly shapes what I build next.
>
> — Adam

**Email 4: Day 14 (only to users who activated)**
> Subject: Ready to go live? Founding member pricing inside.
>
> Hey [Name],
>
> You've been testing your agent for a couple weeks now. If you're ready to put it to work — embed it on your website, handle real customer questions, build more agents — the Individual plan is $19/month.
>
> As a workshop attendee, you get founding member pricing: **$19/month locked in for life** (we'll be raising prices later this year).
>
> [CTA: Upgrade to Individual →]
>
> Not ready? No worries — your free account isn't going anywhere.
>
> — Adam

**Tool for email sequence**: Send manually for the first 2-3 workshops (you will have 10-20 people per workshop — manageable). Once you hit 50+ contacts, use Buttondown ($9/month for up to 1,000 subscribers) or Loops.so (free up to 1,000 contacts). Do not use Mailchimp or ConvertKit — they are overkill and expensive for this stage.

**Budget**: $0-$9/month

**ASSUMPTION MOST LIKELY WRONG HERE**: The 8-15% activated-to-paid conversion rate. Industry benchmarks for freemium B2B SaaS with no sales team range from 2-5%. The higher end (8-15%) is achievable only because workshops create a personal relationship and urgency that cold sign-ups do not. If your workshops attract "curious" rather than "committed" attendees, expect the lower end. The critical lever is attendee selection — screen for people with an actual, current business problem, not just general AI curiosity.

---

## 3. LANDING PAGE OPTIMIZATION

### 3A. Hero Section Copy Recommendations

**Why this matters**: The hero section gets 5-8 seconds of attention. It must communicate three things instantly: (1) what this is, (2) who it is for, and (3) why it is different. Most SaaS landing pages fail by being too clever or too vague.

**Recommended hero (Version A — test this first)**:

> **Headline**: Build Your AI Employee in 2 Minutes. No Code. No Kidding.
>
> **Subheadline**: Answer 3 simple questions and Charlie creates a custom AI agent that handles customer inquiries, qualifies leads, and works 24/7 — so you can stop answering the same questions over and over.
>
> **CTA Button**: Build Your First Agent Free →
>
> **Supporting text below CTA**: Free forever. No credit card. Upgrade when you're ready.

**Recommended hero (Version B — A/B test against Version A)**:

> **Headline**: Stop Answering the Same Customer Questions. Let Charlie Do It.
>
> **Subheadline**: Teach Charlie AI builds you a custom AI assistant in under 2 minutes. Just answer 3 questions about your business — no technical skills, no coding, no complicated setup.
>
> **CTA Button**: Try It Free — Takes 2 Minutes →
>
> **Supporting text below CTA**: Join 50+ business owners already using Charlie. No credit card required.

**Key copy principles**:
- Lead with the **pain point** (answering repetitive questions) not the technology (AI agent builder)
- Quantify the ease ("2 minutes," "3 questions") — specificity builds trust
- Address the objection preemptively ("no code," "no technical skills")
- CTA should imply low commitment and fast result

### 3B. Social Proof Section

**Why this matters**: You are pre-launch with limited users. Manufactured social proof will backfire. Instead, use "credibility signals" that are honest and compelling.

**For Weeks 1-4 (pre-launch, limited users)**:

> **Section headline**: Trusted by Business Owners Who'd Rather Grow Than Troubleshoot
>
> - "I built an AI assistant for my photography business in literally 2 minutes. I'm not exaggerating." — *[Name], Workshop Attendee, [City]*
> - "I've tried ChatGPT, Zapier, and three other tools. This is the first one I actually finished setting up." — *[Name], [Business Type]*
>
> **Below testimonials**:
> - "Built on enterprise-grade AI infrastructure (Langflow + OpenAI)"
> - "256-bit encryption for all conversations"
> - "SOC 2 compliance roadmap in progress"

**How to get these testimonials**: After every workshop, ask 2-3 attendees: "Would you be willing to give me a one-sentence quote about your experience? I'll draft something based on what you said and you just approve it." This gets a 70%+ yes rate because you are doing the work for them.

**Once you hit 20+ users**: Add a counter — "Join [X] business owners using Charlie" — update manually weekly. Do not fake the number. Even "Join 23 business owners" is more credible than "Join thousands" because it is obviously real.

### 3C. Feature Breakdown Section

**Why this matters**: After the hero convinces someone to keep scrolling, the feature section must answer "but can it do what I need?" Structure this around outcomes, not features.

**Recommended structure** (3 columns or alternating left-right sections):

**Column 1: "Build in 2 Minutes"**
> Answer 3 simple questions:
> 1. What does your AI agent do? (e.g., "Answer customer FAQs for my bakery")
> 2. What rules should it follow? (e.g., "Always be friendly, never discuss competitors")
> 3. What tools does it need? (e.g., "Look up order status, book appointments")
>
> Charlie builds your agent instantly. No flowcharts. No coding. No YouTube tutorials.

**Column 2: "Test Before You Launch"**
> Chat with your agent in a safe playground before it talks to real customers. See exactly how it responds. Tweak the personality, add knowledge, refine the rules — all without touching code.

**Column 3: "Go Live Anywhere"**
> Embed your agent on your website with one line of code (we'll give it to you). Or share a direct chat link with customers. Your agent works 24/7 across any device.

**Below the columns — "For the Curious" progressive disclosure**:
> Want to see what's under the hood? Unlock the full visual builder and see exactly how your AI agent works — nodes, connections, the whole thing. Think of it as X-ray vision for your AI. (Most users never need this. But it's there when you're ready.)

### 3D. CTA Button Strategy

**Primary CTAs** (above the fold and at page bottom):
- "Build Your First Agent Free →" (emphasizes action + free)
- Use a contrasting color (if the page is primarily blue/white, use orange or green for CTAs)

**Secondary CTAs** (mid-page, after feature sections):
- "See Charlie in Action →" (links to a 60-second demo video or interactive demo)
- "Join a Free Workshop →" (links to workshop registration)

**Pricing page CTA**:
- Free tier: "Get Started Free" (no credit card language)
- Individual tier: "Start 14-Day Free Trial" (if you add a trial) or "Subscribe — $19/month"
- Business tier: "Talk to Adam →" (personal, approachable)

### 3E. A/B Tests to Run (In Priority Order)

**Why this matters**: Do not A/B test everything. With low traffic (likely <500 visitors/month initially), you need large effect sizes to get signal. Test one thing at a time, for 2 weeks minimum per test.

| Priority | Test | Hypothesis | Minimum Traffic Needed |
|---|---|---|---|
| **1 (Week 1-2)** | Hero headline: Version A ("Build Your AI Employee...") vs Version B ("Stop Answering...") | Pain-point-first converts better than product-first | 200 visitors per variant (400 total) |
| **2 (Week 3-4)** | CTA text: "Build Your First Agent Free" vs "Try It Free — Takes 2 Minutes" | Time-to-value messaging increases clicks | 200 visitors per variant |
| **3 (Later)** | With vs. without demo video on landing page | Video increases trust and conversion | 300 visitors per variant |

**Tool**: PostHog (free tier) for event tracking and basic A/B testing. If you cannot get 400 visitors in 2 weeks, skip A/B testing and instead do **sequential testing** — run Version A for 2 weeks, measure, then switch to Version B for 2 weeks. Less rigorous but still directional.

**Landing page tool recommendation**: You already have a live site. Do not rebuild on a separate landing page tool. Use your existing frontend and PostHog for tracking. If you need a separate landing page for workshop-specific campaigns, use Carrd ($19/year) for a simple one-pager that redirects to the main app.

**Budget**: $0 (PostHog free) + $19/year (Carrd, optional)

### 3F. Specific Technical Implementation

**Why this matters**: Tracking must be in place before any traffic arrives. Retroactive analytics is impossible.

**PostHog events to track** (add these to the frontend):

```
- page_view (automatic with PostHog snippet)
- hero_cta_clicked
- pricing_page_viewed
- pricing_cta_clicked (with tier property: free/individual/business)
- signup_started
- signup_completed
- agent_wizard_started
- agent_wizard_step_completed (with step number: 1/2/3)
- agent_wizard_completed
- playground_message_sent
- upgrade_modal_viewed
- upgrade_completed
```

**Implementation effort**: 2-3 hours to add PostHog snippet and custom events. PostHog's autocapture will handle basic click tracking automatically.

---

## 4. BETA TESTER RECRUITMENT

### 4A. How Many Beta Testers You Need

**Why this matters**: Too few and you get anecdotes, not data. Too many and you cannot provide personal attention (critical for a solo founder). The number depends on what you are validating.

**Target: 30-50 beta testers** over Weeks 1-4, recruited in two cohorts:

- **Cohort 1 (Week 1-2): 15-25 testers** — "Warm" recruits from your network and workshops. These validate core UX and provide qualitative feedback.
- **Cohort 2 (Week 3-4): 15-25 testers** — "Cold" recruits from online communities. These validate whether the product resonates beyond your immediate network (critical for scalability).

**Why 30-50 specifically**:
- At 30 users, you can identify major UX blockers with 95% confidence (if >20% of users hit a problem, you will see it at least once with 30 testers — per the binomial probability model)
- At 50 users, you can calculate meaningful activation and retention rates
- More than 50 and you cannot personally respond to every user's feedback (which you must do at this stage)

### 4B. Where to Find Them (Specific Communities)

**Tier 1 — Highest quality, most relevant** (recruit 15-20 from these):

| Community | Where | Expected Yield | Approach |
|---|---|---|---|
| **Your workshop attendees** | In-person events | 8-12 testers from 2 workshops | Direct ask at end of workshop |
| **Your LinkedIn network** | LinkedIn feed + DMs | 5-8 testers | Post + DM 30 people who fit the persona |
| **Local small business groups** | Facebook Groups (search "[Your City] Small Business Owners") | 3-5 testers | Post asking for "AI curious" business owners |
| **Chamber of Commerce contacts** | Email/phone | 2-3 testers | Personal outreach to contacts from previous work |

**Tier 2 — Good quality, requires more effort** (recruit 10-15 from these):

| Community | Where | Expected Yield | Approach |
|---|---|---|---|
| **r/smallbusiness** | Reddit (938K members) | 3-5 testers | Post titled "Looking for small business owners to test a free AI tool — feedback wanted" |
| **r/Entrepreneur** | Reddit (2.3M members) | 2-4 testers | Post about the journey + ask for beta testers |
| **r/artificial** or **r/ChatGPT** | Reddit | 2-3 testers (more technical, still useful) | Focus on "non-technical user testing" angle |
| **Indie Hackers** | indiehackers.com/groups | 2-3 testers | Post in "AI Tools" or "SaaS" groups |
| **No-Code Communities** | nocode.tech community, Makerpad | 2-3 testers | Post about "AI for non-coders" |
| **LinkedIn Groups** | "Small Business Marketing," "AI for Business," "No-Code Movement" | 2-4 testers | Join and post value-first content, then recruit |
| **Facebook Groups** | "AI for Small Business," "Chatbot Marketing," local entrepreneur groups | 2-3 testers | Same approach as Reddit — value first, then recruit |

**Tier 3 — Cold outreach (only if Tiers 1-2 underperform)**:

| Channel | Approach | Expected Yield |
|---|---|---|
| **Product Hunt Upcoming** | List on upcoming page to collect subscribers | 5-10 email addresses |
| **BetaList** | Submit for listing ($0 for free listing, $129 for fast-track) | 20-40 sign-ups (but lower quality) |
| **Twitter/X** | Post about building in public + recruit | 2-5 testers (slow, but builds audience) |

### 4C. Recruitment Message Template

**For warm outreach (LinkedIn DMs, email)**:

> Hey [Name],
>
> I'm building a tool that lets non-technical business owners create AI assistants by answering 3 simple questions (no coding). Think of it as teaching a smart dog to handle your customer questions.
>
> I'm looking for 20 business owners to test it for free and give honest feedback over the next 2-3 weeks. Takes about 15 minutes to set up, then I'd love a 10-minute feedback call.
>
> In exchange: free lifetime access to the Individual plan ($19/month value) + your feedback directly shapes the product.
>
> Interested? I can send you the link right now.

**For community posts (Reddit, forums)**:

> **Title**: Built an AI agent builder for non-technical people — looking for beta testers (free)
>
> I spent the last year building Teach Charlie AI — it lets you create an AI assistant for your business by answering 3 simple questions. No flowcharts, no code, no PhD required.
>
> I'm looking for 20 small business owners or marketing managers to test it and give brutally honest feedback. It's free, takes about 15 minutes to set up, and I'll jump on a 10-minute call with anyone who tests it.
>
> **What you get**: Free lifetime Individual plan access ($19/month value).
> **What I need**: Honest feedback — what works, what doesn't, what's confusing.
>
> Comment or DM me if interested and I'll send the link.
>
> (I'm a solo founder, not a marketing team. This is a real request for real feedback.)

### 4D. Beta Tester Interview Script (15-20 minutes, via Zoom)

**Why this matters**: These interviews are the highest-signal data source available to a solo founder. No analytics dashboard will tell you *why* someone hesitated on step 2 of the wizard. Five focused interviews replace 500 support tickets.

**Conduct after the tester has used the product for at least 3 days.**

**Opening (2 minutes)**:
1. "Thanks for taking the time. This is going to be super casual — there are no wrong answers. I just want to understand your honest experience."
2. "Everything you say helps me build a better product. Brutal honesty is more valuable to me than politeness."

**First Impressions (3 minutes)**:
3. "When you first landed on Teach Charlie, what was your gut reaction? What did you think it was?" [Tests messaging clarity]
4. "Was anything confusing when you first signed up?" [Tests onboarding UX]

**Core Experience (5 minutes)**:
5. "Walk me through building your agent. What happened at each step?" [Let them narrate freely — listen for friction points]
6. "On a scale of 1-10, how easy was the 3-question setup? What would make it a 10?" [Quantifies + surfaces improvements]
7. "Did the agent respond the way you expected in the playground? What surprised you — good or bad?" [Tests the "aha" moment]

**Value and Positioning (4 minutes)**:
8. "How would you describe Teach Charlie to a friend in one sentence?" [Tests whether your positioning sticks — if they say "it's like ChatGPT" you have a differentiation problem]
9. "Is this something you'd actually use in your business? Why or why not?" [Tests real intent vs. polite interest]
10. "What would have to be true for you to pay $19/month for this?" [Tests value perception and missing features]

**Competitive Context (3 minutes)**:
11. "Have you tried any other AI tools? How does this compare?" [Tests competitive positioning]
12. "If Teach Charlie didn't exist, what would you do instead to solve this problem?" [Tests urgency and alternatives]

**Closing (2 minutes)**:
13. "What's the one thing I should fix or add first?" [Prioritization signal]
14. "Would you recommend this to someone? Who?" [NPS proxy + identifies best-fit persona]

**After the call**: Send a thank-you email within 1 hour. Log notes immediately in a spreadsheet with columns: Name, Date, Persona, Key Quote, Top Issue, Would They Pay, Referral Likelihood.

### 4E. Compensation and Incentive Structure

| Tier | Who | Incentive | Cost to You |
|---|---|---|---|
| **Free lifetime Individual** | First 20 beta testers who complete feedback interview | $19/month plan free forever | $0 (marginal cost is near zero) |
| **Credit gift** | Beta testers who refer another tester | 5,000 bonus credits | $0-$12.50 (depending on API cost) |
| **Shoutout** | Testers who provide a testimonial | Named on the "Early Supporters" page | $0 |
| **Workshop invite** | Anyone who signs up but does not complete onboarding | Free spot in the next workshop | $0 |

**Key principle**: At pre-launch, give away product access generously. Your cost per user is negligible (API costs + infrastructure are minimal at <50 users). Every beta tester with lifetime access becomes a long-term source of feedback, referrals, and testimonials.

**Budget**: $0 direct cost. Opportunity cost of ~$380/month in lost subscription revenue if all 20 lifetime users would have paid (they would not have — they are beta testers, not customers yet).

---

## 5. FEEDBACK COLLECTION FRAMEWORK

### 5A. Metrics That Matter at This Stage (Not Vanity Metrics)

**Why this matters**: At pre-launch with 30-50 users, aggregate metrics like "monthly active users" or "pageviews" are meaningless noise. You need micro-metrics that answer specific validation questions.

| Metric | Why It Matters | Target | Tool | Vanity Equivalent to Ignore |
|---|---|---|---|---|
| **Activation Rate** | % of sign-ups who build 1 agent + send 1 message | >40% | PostHog | "Total sign-ups" |
| **Time to First Agent** | Minutes from sign-up to completing 3-question wizard | <5 min | PostHog (event timestamps) | "Average session duration" |
| **Wizard Completion Rate** | % who start the wizard and finish all 3 steps | >75% | PostHog (funnel) | "Wizard page views" |
| **Day 7 Return Rate** | % who log in again within 7 days of activation | >25% | PostHog (cohort) | "Total logins" |
| **Playground Messages per Session** | Average messages sent per playground visit | >3 | PostHog | "Total messages sent" |
| **Upgrade Intent Rate** | % who view pricing page or click upgrade CTA | >10% of activated users | PostHog | "Pricing page views" |
| **Qualitative: "Would you pay?"** | Direct yes/no from interviews | >50% of interviewees say yes with conviction | Interview notes | NPS (too early) |
| **Qualitative: One-sentence description** | How users describe the product in their own words | Matches your positioning | Interview notes | Brand awareness surveys |

**The single most important metric in Weeks 1-4**: **Wizard Completion Rate**. If people start the 3-question wizard and do not finish, the core product promise ("build an AI agent by answering 3 questions") is broken. Everything else is secondary until this number is above 75%.

### 5B. Tools and Implementation

| Tool | Purpose | Cost | Setup Time |
|---|---|---|---|
| **PostHog** (posthog.com) | Product analytics, funnel tracking, session replay | Free (1M events/month, 15K sessions) | 1 hour (JS snippet + custom events) |
| **Tally** (tally.so) | Surveys (Van Westendorp, pre/post workshop, in-app feedback) | Free (unlimited forms and responses) | 30 min per survey |
| **Spreadsheet (Google Sheets)** | Interview notes, beta tester tracking, feedback log | Free | 30 min to set up template |
| **Loom** (loom.com) | Record feedback interviews (with permission) for later review | Free (25 videos) | 0 min |
| **Canny** (canny.io) | Feature request tracking (add later, not Week 1) | Free (up to 100 tracked posts) | Skip in Weeks 1-4 |

**Do NOT use at this stage**: Hotjar (PostHog has session replay), Mixpanel (overkill), Amplitude (overkill), Intercom (too expensive), Zendesk (no support volume yet).

**PostHog session replay setup**: Enable session replay in PostHog (free for 15,000 sessions/month). Watch 5 recordings per week of new user sessions. Focus on: where do they pause? Where do they click something unexpected? Where do they leave? This takes 30 minutes per week and is worth more than any dashboard.

### 5C. In-App Feedback Mechanisms

**Why this matters**: The best feedback comes at the moment of experience, not in a follow-up email three days later.

**Mechanism 1: Post-wizard micro-survey** (show immediately after completing the 3-question wizard)

> "How was that? Rate your experience building Charlie."
> [5-star rating]
> [Optional: "Anything confusing? (one sentence)"]

**Implementation**: Add a modal or inline component after wizard completion. Store in your database. Takes 1-2 hours to implement.

**Mechanism 2: Playground feedback button** (persistent in the playground UI)

> Small thumbs-up/thumbs-down on each agent response, plus a "Give Feedback" link that opens a Tally form.

**Implementation**: 2-3 hours for the thumbs up/down component. Link the "Give Feedback" to a Tally form embed.

**Mechanism 3: Exit-intent survey** (show when a user is about to leave during the wizard or after sign-up without activating)

> "Leaving so soon? Quick question — what stopped you from finishing?"
> [Checkboxes: "Too confusing" / "Not what I expected" / "Just browsing" / "Need more time" / "Other"]

**Implementation**: Use PostHog's survey feature (free, built into the product) or a simple modal triggered by mouseleave event on desktop.

### 5D. Feedback Interview Cadence

| Week | Activity | Time Required |
|---|---|---|
| **Week 1** | 3 price validation interviews + launch Van Westendorp survey | 2 hours interviews + 1 hour survey setup |
| **Week 2** | 3 beta tester interviews (Cohort 1, warm recruits) + review 5 PostHog sessions | 2 hours interviews + 30 min session review |
| **Week 3** | 3 beta tester interviews (Cohort 2, cold recruits) + workshop post-mortems | 2 hours interviews + 1 hour analysis |
| **Week 4** | 2 "deep dive" interviews with most engaged users + compile all feedback | 1.5 hours interviews + 2 hours compilation |

**Total interview time over 4 weeks**: ~11 hours (fits within the 20hr/week budget alongside other activities)

### 5E. NPS and CSAT Timing

**Why this matters**: Running NPS too early gives you garbage data. Users need enough experience to form a genuine opinion.

- **Do NOT run NPS in Weeks 1-4.** You have too few users and they have not used the product long enough. NPS requires at least 30 days of usage and 50+ respondents for meaningful results.
- **Do run a simple CSAT (1-5 stars) after the wizard** (see Mechanism 1 above). This is immediate, contextual, and actionable.
- **Plan to run first NPS at Week 8** (after users have had 30+ days and you have 50+ activated users).

**When you do run NPS (Week 8+)**: Use the standard question: "On a scale of 0-10, how likely are you to recommend Teach Charlie to a friend or colleague?" Follow up with: "What's the primary reason for your score?" Send via email to all users who activated >30 days ago.

---

## 6. MINIMUM VIABLE AUDIENCE BUILDING

### 6A. Email List Building (Target: 200-500 emails by end of Week 4)

**Why this matters**: An email list is the only marketing channel you fully own. Social media algorithms change. SEO takes months. But an email to 300 interested people can fill a workshop in 24 hours.

**Strategy 1: Landing page email capture** (Week 1 setup, ongoing)

Add an email capture to the landing page for non-ready visitors:

> **Headline**: Not ready to build yet? Get the free guide.
> **Offer**: "5 Things Your AI Assistant Should Know About Your Business" (a 1-page PDF or email series — positions you as an educator, not a salesperson)
> **Form**: Email address only. No name, no company, no phone number. Every additional field reduces conversion by 10-15%.

**Tool**: Buttondown ($0 for first 100 subscribers, $9/month for up to 1,000). Alternative: Loops.so (free up to 1,000 contacts). Both are simple, founder-friendly, and not bloated like Mailchimp.

**Strategy 2: Workshop registration list** (ongoing)

Every workshop attendee's email goes into your list (with consent). Expected yield: 10-20 emails per workshop, 20-60 over Weeks 1-4 (assuming 2-3 workshops).

**Strategy 3: Beta tester referral** (Week 2+)

At the end of each beta tester interview, ask: "Do you know 2-3 people who might find this useful? I'd love an intro." Expected yield: 0.5 referrals per interview (some will give you 2, many will give you 0).

**Strategy 4: LinkedIn content** (ongoing, 15 min/day)

Post 3-4 times per week on LinkedIn. Content types:
- **Build-in-public updates**: "Week 3 of beta testing Teach Charlie. Here's what 30 users taught me..."
- **Educational posts**: "3 things I wish someone told me before I tried to build an AI chatbot"
- **Workshop announcements**: "Running a free workshop next Tuesday — build your first AI agent in 90 minutes"
- **Contrarian takes**: "You don't need to understand AI to use AI. Here's proof."

**Expected yield from LinkedIn**: 2-5 email sign-ups per week if posting consistently. The real value is credibility building, not lead generation.

### 6B. Social Media Presence (Minimum Viable Effort)

**Why this matters**: You cannot be everywhere. As a solo founder with 20 hours/week, pick ONE primary channel and ONE secondary channel. Everything else is a distraction.

**Primary channel: LinkedIn**
- Why: Your target users (small business owners, marketing managers) are on LinkedIn. Your 10+ years of no-code sales experience is a credibility asset. LinkedIn's algorithm rewards consistent posting.
- Commitment: 3-4 posts/week, 15 min/day engaging with comments and connections
- Profile optimization: Update headline to "Building Teach Charlie AI — Helping non-technical business owners build AI agents in 2 minutes" + link to teachcharlie.ai

**Secondary channel: Twitter/X (optional, only if you already have a presence)**
- Why: Build-in-public community, indie hackers, AI enthusiasts
- Commitment: 2-3 posts/week, repurpose LinkedIn content
- Only pursue if you can do it in <30 min/week

**Explicitly skip (for now)**: TikTok, YouTube, Instagram, Pinterest, Facebook page (not groups). These require content production capacity you do not have.

### 6C. Waitlist Strategy

**Why this matters**: A waitlist creates urgency and collects demand signal before you have the capacity to onboard everyone.

**When to use a waitlist**: Only if your beta is full (50+ testers) and you are not ready for open access. If you have capacity, skip the waitlist and just let people sign up. A premature waitlist with no actual constraint behind it destroys credibility.

**If you do implement a waitlist**:

> **Waitlist page copy**:
> "Teach Charlie AI is currently in limited beta with 50 early testers. We're opening more spots every week. Join the waitlist and you'll be first to know — plus you'll get founding member pricing ($19/month locked in for life)."
>
> **Confirmation email**:
> "You're on the list! You're #[X] in line. While you wait, here are 3 things to think about for your first AI agent:
> 1. What's the #1 question your customers ask?
> 2. What should your AI assistant's personality be like?
> 3. What's one thing it should NEVER say?
>
> When your spot opens up, you'll already know exactly what to build."

**Tool**: Tally form (free) that sends to Buttondown/Loops.so. Do not pay for a dedicated waitlist tool (Waitlist.me, LaunchRock, etc.) — they add no value over a simple form + email.

### 6D. Pre-Launch Content Plan (4-Week Calendar)

| Week | LinkedIn Post 1 (Mon) | LinkedIn Post 2 (Wed) | LinkedIn Post 3 (Fri) | Email to List (Sat) |
|---|---|---|---|---|
| **Week 1** | "I spent a year building an AI tool for non-technical people. Here's why." (Origin story) | "The 3-question framework that replaces complex AI setups" (Educational) | "Looking for 20 beta testers — here's what you get" (Recruitment) | Welcome email to new subscribers |
| **Week 2** | "5 things our first beta testers told us" (Social proof) | "Why I'm not worried about ChatGPT competing with us" (Positioning) | Workshop announcement + registration link | Beta tester highlight + workshop reminder |
| **Week 3** | "Workshop recap: 15 people built AI agents in 90 minutes" (Event recap) | "The #1 mistake small business owners make with AI" (Educational) | Build-in-public update: key metric or learning | Content from workshop + invite to next one |
| **Week 4** | "What 50 beta testers taught me about pricing" (Transparency) | "3 real examples of small business AI agents" (Use cases) | "We're almost ready for launch — here's what's coming" (Anticipation) | Launch preview + founding member offer |

**Content creation time**: 1-2 hours per week for all posts (batch write on Sunday evening). LinkedIn posts should be 100-200 words — not essays.

**Budget for entire Section 6**: $0-$9/month (Buttondown if over 100 subscribers)

---

## WEEKLY TIME ALLOCATION (20 hours/week)

| Activity | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| **Price validation** (surveys, interviews) | 4 hrs | 3 hrs | 1 hr | 1 hr |
| **Beta recruitment** (outreach, onboarding) | 4 hrs | 3 hrs | 3 hrs | 1 hr |
| **Feedback interviews** | 2 hrs | 3 hrs | 3 hrs | 4 hrs |
| **Workshop prep/execution** | 3 hrs | 4 hrs | 4 hrs | 2 hrs |
| **Landing page + analytics setup** | 4 hrs | 2 hrs | 1 hr | 1 hr |
| **Content creation + LinkedIn** | 2 hrs | 3 hrs | 3 hrs | 3 hrs |
| **Data analysis + synthesis** | 1 hr | 2 hrs | 3 hrs | 6 hrs |
| **Buffer** | 0 hrs | 0 hrs | 2 hrs | 2 hrs |
| **Total** | **20 hrs** | **20 hrs** | **20 hrs** | **20 hrs** |

---

## TOTAL BUDGET SUMMARY (Weeks 1-4)

| Item | Cost | Required? |
|---|---|---|
| PostHog (analytics + session replay) | $0 | Yes |
| Tally (surveys) | $0 | Yes |
| Buttondown (email list, if >100 subscribers) | $0-$9/mo | Yes when needed |
| Carrd (workshop landing page) | $19/year (~$1.60/mo) | Optional |
| Loom (recording interviews) | $0 | Recommended |
| Google Sheets (tracking) | $0 | Yes |
| Zoom (interviews) | $0 (free tier) | Yes |
| Workshop venue/costs | $0-$50/workshop | Depends on format |
| **Total** | **$2-$70/month** | |

This fits well within the $100-$500/month budget, leaving substantial room for paid advertising experiments in later phases.

---

## WEEK 4 DECISION FRAMEWORK

At the end of Week 4, answer these five questions. Each requires a clear yes or no with data behind it.

| Question | Data Source | "Go" Answer | "Pivot" Answer |
|---|---|---|---|
| **1. Is $19/month in the acceptable price range?** | Van Westendorp survey (40+ responses) + interviews | $19 falls between PMC and IPP | $19 is above IPP or below PMC |
| **2. Do workshop attendees convert to active users?** | Post-workshop funnel data from 2+ workshops | >40% activation rate | <25% activation rate |
| **3. Can non-technical users complete the wizard without help?** | Wizard completion rate from PostHog | >75% completion | <60% completion |
| **4. Do users describe the product the way we want them to?** | Interview question #8 ("How would you describe this?") | Mentions ease/simplicity/no-code | Mentions AI/technical/complicated |
| **5. Is there willingness to pay (not just use for free)?** | Fake door test CTR + interview question #10 | >3% pricing CTA click rate + >50% interview WTP | <2% CTR + <30% WTP |

**If 4-5 answers are "Go"**: Proceed to launch phase with confidence. The model works.

**If 2-3 answers are "Go"**: Proceed cautiously. Investigate the "Pivot" areas. Likely need to adjust pricing, onboarding, or positioning before scaling.

**If 0-1 answers are "Go"**: Pause. Do not spend money on growth. Conduct 10 additional deep-dive interviews to understand why. Consider whether the product needs fundamental changes or whether you are targeting the wrong audience.

---

## WHERE ASSUMPTIONS ARE MOST LIKELY WRONG

In order of risk, flagged throughout this document but consolidated here:

1. **Workshop-to-paid conversion rate (Section 2C)**: The 8-15% target is aggressive. Industry norms for freemium without a sales team are 2-5%. Your personal relationship advantage from workshops may close this gap, or it may not. This is the assumption with the widest uncertainty range.

2. **"Non-technical" self-identification (Section 4)**: People who join AI workshops and participate in online AI communities are not representative of truly non-technical small business owners. Your beta testers may be "tech-curious" rather than "tech-averse." This means their feedback about ease-of-use may be overly positive.

3. **Free tier generosity (Section 2C)**: 1 agent + 1,000 test runs/month may be enough for most small business use cases. If 90% of users never need more than the free tier, the $19/month conversion will be near zero regardless of willingness-to-pay. Watch the usage distribution closely — if the median user uses <200 runs/month, the free tier ceiling is too high.

4. **"Dog Trainer" metaphor resonance (Section 3A)**: This metaphor works brilliantly in workshops where you can explain it in context. On a landing page with 5 seconds of attention, it may confuse more than it clarifies. The A/B test between product-first and pain-point-first headlines will reveal this.

5. **Solo founder time allocation (Weekly schedule)**: 20 hours/week for validation work assumes zero time on product bugs, infrastructure issues, or customer support. In reality, beta testers will surface bugs that require immediate attention. Build in the Week 3-4 buffer hours aggressively and be willing to cut content creation first.

---

This playbook is designed to produce a clear go/no-go decision by the end of Week 4 with minimal spend and maximum learning. Every activity maps to one of the four core hypotheses. If an activity does not help answer "should we go all-in on this model," cut it.

---

# TEACH CHARLIE AI: POSITIONING & MESSAGING PLAYBOOK

## Executive Summary

This playbook establishes Teach Charlie AI's market position not as a technical tool competing on features, but as an **educational experience** competing on accessibility. The core strategic insight: every competitor is building for developers who already understand AI. Teach Charlie is building for the 90% of business owners who don't — yet. The dog trainer metaphor is not a gimmick; it is a deliberate pedagogical framework that reduces cognitive load, creates emotional connection, and provides a persistent mental model that makes AI concepts stick.

---

## 1. COMPETITIVE POSITIONING MATRIX

### 1.1 Positioning Statements (Against Each Competitor)

**vs. ChatGPT Custom GPTs**
> "Unlike ChatGPT's custom GPTs, which lock you inside a single chat interface with no way to connect to your actual business tools, Teach Charlie gives you a fully deployable AI agent that plugs into 500+ apps, embeds on your website, and teaches you how AI works along the way — so you're not just using AI, you're understanding it."

*Why this matters:* ChatGPT GPTs are the number-one response you will hear. The rebuttal must acknowledge their convenience while exposing three critical gaps: (1) no deployment beyond ChatGPT's interface, (2) no integration with business tools, (3) zero educational scaffolding. The user learns nothing about how AI works by filling in a GPT form.

**vs. Botpress**
> "Unlike Botpress, which requires you to learn decision trees, intents, and conversation design patterns before building anything useful, Teach Charlie lets you create a working AI agent in under 5 minutes by answering three plain-English questions — and then gradually teaches you the advanced concepts if and when you want them."

*Why this matters:* Botpress has enterprise credibility but a steep learning curve. Their free tier is generous, which means the fight is not on price — it is on time-to-value and cognitive overhead. Position against the learning curve, not the feature set.

**vs. Voiceflow**
> "Unlike Voiceflow, which was designed for conversation designers and product teams building complex voice and chat experiences, Teach Charlie is purpose-built for small business owners who just want an AI that answers customer questions, handles bookings, or responds to leads — without learning what a 'dialog flow' is."

*Why this matters:* Voiceflow targets a professional persona (conversation designers, product managers). Their interface assumes familiarity with UX design patterns. The positioning here draws a clean line between professional tooling and accessible tooling.

**vs. FlowiseAI**
> "Unlike FlowiseAI, which gives you a blank canvas of nodes and connections and expects you to know what 'LLM chains,' 'vector stores,' and 'retrieval augmentation' mean, Teach Charlie translates all of that into a 3-question wizard — and only shows the canvas when you're ready for it."

*Why this matters:* FlowiseAI is the closest open-source analog. It is free, capable, and growing. But it has zero educational layer — it is a power tool for developers. The positioning must make the free-vs-paid comparison irrelevant by foregrounding the educational wrapper.

**vs. Langflow (Direct Upstream)**
> "Unlike Langflow, which is a powerful open-source framework built for developers and data scientists, Teach Charlie is the guided, educational experience built on top of Langflow — think of it as the friendly driving school that uses the same car, but actually teaches you how to drive."

*Why this matters:* This is the most sensitive positioning because Teach Charlie literally wraps Langflow. The driving school analogy is critical: nobody argues that driving schools are unnecessary just because cars exist. The value is in the instruction, not the vehicle.

**vs. Zapier AI Agents**
> "Unlike Zapier's AI features, which bolt AI onto an automation platform you already have to understand, Teach Charlie starts with AI-first education and then connects to 500+ apps — so you learn what AI can do before you try to automate with it."

*Why this matters:* Zapier has massive brand recognition and trust with non-technical users. The counter-position is that Zapier's AI features assume you already understand automation. Teach Charlie inverts the flow: learn AI first, automate second.

---

### 1.2 Competitive Comparison Table

| Dimension | Teach Charlie | ChatGPT GPTs | Botpress | Voiceflow | FlowiseAI | Langflow | Zapier AI |
|---|---|---|---|---|---|---|---|
| **Ease of Use** (1-10, 10=easiest) | **9** — 3-question wizard, dog metaphor, guided UX | 7 — Simple form but limited | 4 — Intent/entity learning curve | 5 — Pro UI, conversation design needed | 3 — Raw node canvas, dev terminology | 3 — Raw node canvas, Python knowledge helps | 6 — Familiar Zapier UX but AI bolted on |
| **Price (Entry)** | Free tier, $19/mo Pro | Free (ChatGPT Plus $20/mo for better models) | Free tier, $79/mo Pro | Free tier, $60/mo Pro | Free (self-hosted) | Free (open source) | Free tier, $19.99/mo Starter |
| **Customization Depth** | Medium → High (progressive canvas unlock) | Low — Prompt + knowledge only | High — Full conversation design | High — Multi-modal flows | Very High — Full node graph | Very High — Full node graph + Python | Medium — Pre-built AI actions |
| **Education / Learning Support** | **10** — Missions, guided tours, metaphor system, progressive disclosure | 1 — No education | 3 — Docs + academy videos | 4 — University program, docs | 1 — Docs only | 2 — Docs + community | 2 — Help articles |
| **Deployment Options** | Embed widget, playground, API | ChatGPT only | Web, WhatsApp, Messenger, API | Web, voice, chat, API | API, embed | API, embed | Zapier ecosystem |
| **App Integrations** | 500+ (Composio) | None native | Limited native | Limited native | Via custom code | Via custom code | 7,000+ (core strength) |
| **Target User** | Non-technical business owners | General consumers | Developers, conversation designers | Product teams, CX designers | Developers | Developers, data scientists | SMB automation users |
| **Workshop / Live Training Fit** | **Purpose-built** — wizard designed for live demos | Poor — individual tool | Poor — too complex for live | Moderate — visual but steep | Poor — too technical | Poor — too technical | Moderate — familiar but not AI-focused |

*Why this table matters:* This is your sales ammunition. Print it. Put it in your pitch deck. Reference it in workshops when someone inevitably asks "why not just use [X]?" The two axes where Teach Charlie dominates — education/learning support and ease of use — are the exact dimensions your target users care about most. You will never win on customization depth or price against open-source tools. You do not need to.

---

## 2. CORE MESSAGING FRAMEWORK

### 2.1 Primary Taglines (3 Options)

**Option A: "Teach Your AI. No Code Required."**
- *Rationale:* Leads with the action verb "teach," which maps to the core product experience (you are teaching Charlie). "No code required" is the essential qualifier for the target audience. Clean, direct, 7 words.
- *Best for:* Homepage hero, paid ads, workshop banners.
- *Risk:* "No code" is becoming generic. Mitigate by always pairing with the visual brand (Charlie the dog).

**Option B: "The AI Platform That Teaches You Back."**
- *Rationale:* This is the most differentiated tagline because it names the unique value — education is bidirectional. You teach Charlie, and the platform teaches you AI. No competitor can claim this.
- *Best for:* Investor pitches, PR headlines, content marketing.
- *Risk:* Slightly abstract. Requires a beat for the reader to "get it." Pair with a concrete subheadline.

**Option C: "Build AI Agents the Way You'd Train a Dog — One Trick at a Time."**
- *Rationale:* Leans fully into the metaphor. Creates immediate mental imagery. The phrase "one trick at a time" communicates progressive complexity without jargon.
- *Best for:* Social media, workshop openers, viral-optimized content.
- *Risk:* May alienate non-dog-people or feel juvenile in enterprise contexts. Use selectively.

**Recommendation:** Use Option A as the primary tagline across all channels. Use Option B for thought leadership and investor contexts. Use Option C for social media and workshops where playfulness is an asset.

---

### 2.2 Elevator Pitches

**30-Second Version (For Workshops)**

> "Right now, building an AI agent requires you to understand prompts, APIs, vector databases, and a dozen other technical concepts. Most small business owners hear those words and shut down. Teach Charlie flips that. You answer three simple questions — what job should your AI do, what rules should it follow, and what tools does it need — and we build a working AI agent for you in under five minutes. Then, as you use it, the platform gradually teaches you how it all works. It's the Fisher-Price-to-Langflow pipeline — and I've been running workshops on it for the last [X] months."

*Why this structure works:* Problem (technical barrier) → Solution (3 questions) → Differentiator (education built in) → Credibility (workshops). The Fisher-Price line is a deliberate laugh line that makes the pitch memorable.

**60-Second Version (For Investors / Partners)**

> "There are 33 million small businesses in the US alone, and the vast majority have heard they 'need to use AI' but have no idea where to start. The existing tools — ChatGPT, Langflow, Botpress — are either too simple to be useful or too complex to be accessible. Teach Charlie sits in the gap. We've built an educational wrapper around Langflow, one of the most powerful open-source AI agent frameworks, and made it accessible to non-technical users through a 3-step wizard, a 'dog trainer' learning metaphor, and progressive complexity that grows with the user. We don't need to innovate on the AI — Langflow does that. We innovate on the packaging. Think of us as the Canva to Langflow's Photoshop. Our go-to-market is workshops — I've spent 10 years selling no-code automation to SMBs, and every workshop becomes a pipeline of paying users who already trust the product because they built something live. Free tier gets them in, $19/month Pro converts them when they want integrations and deployment. We're live at app.teachcharlie.ai and currently converting [X]% of workshop attendees to paid."

*Why this structure works:* Market size → Gap in market → Solution → Business model → GTM → Traction. The Canva/Photoshop analogy is essential for investors who need a one-line mental model.

---

### 2.3 One-Liners by Channel

**Twitter/X Bio:**
> "Teaching non-technical humans to build AI agents — one trick at a time. No code. No jargon. Just a dog named Charlie."

*Why:* Personality-forward, keyword-rich (AI agents, no code), memorable.

**LinkedIn Profile Headline:**
> "Founder, Teach Charlie AI | Helping small businesses build AI agents without writing code | 10+ years in no-code automation"

*Why:* Professional, benefit-led, establishes credibility. No metaphor — LinkedIn rewards clarity over cleverness.

**Email Signature:**
> "[Name] | Founder, Teach Charlie AI
> Build your first AI agent in 5 minutes — teachcharlie.ai"

*Why:* The call-to-action ("5 minutes") creates urgency. URL is clean and memorable.

**Podcast Intro (for hosts to read):**
> "Today's guest is [Name], founder of Teach Charlie AI — a platform that teaches small business owners to build AI agents using a 'dog trainer' metaphor. Think of it as Duolingo meets AI development. [Name] has spent over a decade selling no-code tools and now runs workshops where people build working AI agents in under five minutes."

*Why:* Gives the host three hooks: the dog metaphor, the Duolingo comparison, and the 5-minute claim. Any of these can become a conversation thread.

**Workshop Opening Line:**
> "By the end of the next 45 minutes, you will have built a working AI agent — and I promise, you will not write a single line of code. You're going to teach a dog named Charlie to do a job, and Charlie is going to teach you how AI actually works."

*Why:* Sets a concrete deliverable (working AI agent), removes fear (no code), introduces the metaphor organically, and frames the bidirectional value (you teach Charlie, Charlie teaches you).

---

### 2.4 Homepage Hero Headlines (3 Variations for A/B Testing)

**Variation A: Direct + Benefit**
- **Headline:** "Build Your AI Agent in 5 Minutes. No Code. No Jargon."
- **Subheadline:** "Answer 3 simple questions, and Teach Charlie builds a working AI agent for your business — then teaches you how to make it smarter."
- **CTA Button:** "Build Your First Agent — Free"

**Variation B: Metaphor-Led**
- **Headline:** "Teach Your AI New Tricks."
- **Subheadline:** "Teach Charlie is the first AI platform designed for non-technical people. Create powerful AI agents by answering 3 questions — no coding, no jargon, no PhD required."
- **CTA Button:** "Start Teaching Charlie — Free"

**Variation C: Outcome-Led**
- **Headline:** "Your Business Deserves an AI Employee. Meet Charlie."
- **Subheadline:** "Charlie is an AI agent you can teach to answer customer questions, handle leads, book appointments, and more — in 5 minutes, with zero technical skills."
- **CTA Button:** "Hire Charlie — Free"

*Testing Guidance:* Run Variation A vs. C first. A tests clarity; C tests emotional resonance. Use the winner against B to test whether the metaphor helps or hurts cold-traffic conversion. Hypothesis: Variation A wins for paid traffic (search intent), Variation C wins for social traffic (curiosity-driven).

---

### 2.5 Value Proposition Canvas (Per Persona)

#### Persona 1: Small Business Owner (35-50, Non-Technical)

| Jobs to Be Done | Pains | Gains |
|---|---|---|
| Answer repetitive customer questions without hiring staff | Every "AI tool" article is full of jargon they don't understand | Feels smart and capable — "I built an AI" |
| Automate lead qualification and booking | Tried ChatGPT but couldn't figure out how to deploy it on their site | Saves 5-10 hours/week on customer support |
| Stay competitive ("my competitors are using AI") | Afraid of looking stupid or making expensive mistakes | Can show it off to peers, clients, and at networking events |
| Reduce dependency on expensive agencies/contractors | Doesn't have time to take a course or watch 10 hours of YouTube | Progressive learning means they grow into the platform |

**Key Messaging Angle:** "You don't need to understand AI to use it. Teach Charlie is built for business owners who have real work to do — not developers who want a side project."

#### Persona 2: Marketing Manager (28-40, Semi-Technical)

| Jobs to Be Done | Pains | Gains |
|---|---|---|
| Build a lead-gen chatbot for the company website | Boss expects them to "figure out AI" but gave them no budget | Looks like an innovator internally — career capital |
| Create an internal FAQ bot for the team | Evaluated Botpress/Voiceflow but couldn't justify the learning curve | Can prototype in a meeting and demo same-day |
| Experiment with AI for content, email, and social workflows | Tools are either too simple (ChatGPT) or too complex (Langflow) | Platform grows with their skills — starts simple, gets powerful |
| Prove ROI to justify budget for AI tools | Needs something they can demo to leadership in 15 minutes | Embeddable widget means they can deploy without IT involvement |

**Key Messaging Angle:** "Impress your boss by Friday. Teach Charlie lets you build and deploy an AI agent fast enough to demo it in your next team meeting."

#### Persona 3: Workshop Attendee (22-60, Mixed Technical Levels)

| Jobs to Be Done | Pains | Gains |
|---|---|---|
| Learn what AI agents actually are and how they work | Overwhelmed by AI hype — doesn't know what's real vs. marketing | Hands-on experience — they actually built something |
| Build something tangible to take home from the workshop | Most workshops are slides and theory, no hands-on | Confidence to explore further on their own |
| Decide whether AI is relevant for their specific business/role | Feels behind — everyone talks about AI but they haven't started | Community of peers at the same level (not developers) |
| Find a tool they can actually continue using after the workshop | Free trial ends, complexity spikes, they abandon | Free tier is genuinely usable; paid tier is affordable ($19/mo) |

**Key Messaging Angle:** "You'll leave this workshop with a working AI agent — not just a slide deck. And you can keep using Teach Charlie for free to keep learning."

---

## 3. "DOG TRAINER" METAPHOR PLAYBOOK

### 3.1 Strategic Framework: When to Lean In vs. Pull Back

The dog trainer metaphor is a **pedagogical tool**, not a brand gimmick. Its purpose is to reduce cognitive load by mapping unfamiliar AI concepts onto a familiar mental model (training a dog). Like any metaphor, it has a zone of effectiveness.

**LEAN IN HARD (Playful, Full Metaphor)**

| Context | Reason | Example |
|---|---|---|
| Workshops (live) | Audience is warm, humor lands, builds rapport | "Alright, Charlie needs a job. What are we training him to do?" |
| Onboarding wizard | User is anxious, metaphor reduces intimidation | "Step 1: Give Charlie a job description" |
| Social media (organic) | Personality drives engagement, scroll-stopping | "Charlie learned a new trick today: answering customer emails at 3am" |
| Email nurture sequences | Familiar character creates continuity across emails | "Charlie's been practicing. Here's what he learned this week." |
| Product tours / missions | Gamification + metaphor reinforce each other | "Mission 3: Teach Charlie to Fetch (connect a knowledge source)" |
| Community / Discord | Shared language creates belonging | "My Charlie just passed the 1,000 conversation mark!" |

**TONE IT DOWN (Professional, Metaphor as Accent)**

| Context | Reason | Example |
|---|---|---|
| Enterprise sales decks | Decision-makers need ROI, not whimsy | "Teach Charlie AI: An educational AI agent builder for non-technical teams" — mention the metaphor as a "learning framework" |
| SEO blog content | Search intent is informational, not playful | Title: "How to Build an AI Chatbot for Your Small Business (No Code)" — Charlie appears in the product screenshots, not the headline |
| Investor pitches | Investors fund markets and models, not mascots | "We use a 'dog trainer' pedagogical framework to reduce time-to-value" — frame it as a design decision, not a personality |
| Partnership outreach | Partner orgs need to see professionalism first | "Teach Charlie AI is a guided AI agent builder with an educational scaffolding system" |
| Pricing pages | User is in evaluation mode, needs clarity | Lead with features and value; Charlie appears in illustrations, not in pricing tier names |
| Technical documentation | Users in the canvas need precision, not playfulness | Use standard terms ("system prompt," "knowledge source") with friendly tone but drop the dog metaphor |

---

### 3.2 Metaphor Translation Guide

This is the mapping between AI jargon and the dog trainer vocabulary. Use the left column externally in all beginner-facing contexts. Use the right column in technical docs and canvas view.

| Dog Trainer Language | Technical Reality | Where to Use Trainer Language |
|---|---|---|
| "Charlie's job description" | System prompt | Wizard Step 1, agent cards, onboarding |
| "Charlie's rules" | Behavioral constraints, guardrails | Wizard Step 2, agent editing |
| "Charlie's tricks" | Tool integrations, function calls | Wizard Step 3, tool configuration |
| "Teaching Charlie" | Configuring the agent | All beginner-facing UI |
| "Charlie's memory" | Conversation history, context window | Playground, chat settings |
| "Charlie's knowledge" | RAG knowledge sources (text, files, URLs) | Knowledge source management |
| "Unleash Charlie" | Deploy / publish agent | Publish flow, embed widget |
| "Fetch" | Retrieve information (RAG) | Knowledge source missions |
| "New trick" | New integration / tool | Composio connection UI |
| "Obedience training" | Testing and iterating in playground | Playground mode |
| "Dog park" | Public agent gallery / community | Future feature: agent sharing |
| "Treat" | Positive feedback / mission reward | Missions, gamification |
| "Graduation" | Unlock advanced canvas view | Progressive disclosure trigger |

---

### 3.3 Metaphor Across Channels: Specific Examples

**Email Subject Lines (Lean In)**
- "Charlie learned a new trick (and it could save you 5 hours/week)"
- "Your AI agent is waiting to be trained"
- "3 questions. 5 minutes. 1 very good boy."
- "Charlie's ready for his first day on the job"
- "Sit. Stay. Automate. (Your workshop recap)"

**Social Media Posts**
- Twitter/X: "Most AI tools expect you to be a developer. Teach Charlie expects you to answer 3 questions. Build your first AI agent in 5 minutes — no code, no jargon, just a very good boy. teachcharlie.ai"
- LinkedIn: "I've spent 10 years teaching non-technical people to use automation tools. The #1 barrier is always the same: jargon. That's why we built Teach Charlie AI with a 'dog trainer' framework — you teach an AI agent the way you'd train a dog: give it a job, set the rules, teach it tricks. It sounds simple because it is. That's the point."
- Instagram/TikTok: [Video of someone answering 3 questions → agent appears → handles a customer query] Caption: "I just trained my AI agent in under 5 minutes. His name is Charlie and he's a very good boy."

**Ad Copy (Facebook/Google)**
- Facebook: "Build an AI agent for your business in 5 minutes. No code. No jargon. Just answer 3 questions and let Charlie do the work. Free to start."
- Google Search (keyword: "build ai chatbot no code"): "Build an AI Chatbot — No Code Required | teachcharlie.ai — Answer 3 questions and deploy a custom AI agent. Free tier available. 500+ app integrations."

**Documentation Headers (Tone Down)**
- Instead of "How to teach Charlie a new trick": "How to Add a Tool Integration"
- Instead of "Charlie's memory explained": "Conversation Memory & Context"
- Instead of "Unleashing Charlie": "Publishing & Deploying Your Agent"

*Why:* Documentation users are in task-completion mode. Metaphor adds cognitive overhead when the user is trying to accomplish something specific. Keep docs warm and friendly in tone, but literal in terminology.

---

### 3.4 Metaphor Risk Mitigation

**Risk 1: "This seems childish / not serious"**
- *Trigger:* Enterprise buyers, skeptical LinkedIn commenters, investors
- *Mitigation:* Frame the metaphor as a deliberate pedagogical design choice, not a brand personality. Say: "We use a learning framework inspired by how people intuitively teach skills — through progressive, hands-on training. The 'dog trainer' model maps directly to how LLM agents are actually configured: define a role, set constraints, add capabilities. The metaphor isn't cute — it's accurate."
- *Supporting data point:* "Duolingo uses a cartoon owl. Canva uses drag-and-drop simplicity. Wealthfront uses a friendly robot. Approachable design is not the same as unserious design."

**Risk 2: "I'm not a dog person"**
- *Trigger:* Users who do not connect with the dog metaphor emotionally
- *Mitigation:* Charlie is a mascot, not a requirement. The onboarding works without understanding or caring about the dog metaphor — it is just 3 questions. The metaphor provides flavor, not function. Users who don't engage with it simply experience a clean, simple wizard.
- *Design principle:* Never make the metaphor a gate. The product should work perfectly if you strip out every dog reference.

**Risk 3: "This is confusing when I get to the advanced features"**
- *Trigger:* Users who unlock the Langflow canvas and suddenly see "system prompt" instead of "job description"
- *Mitigation:* Create a transitional glossary that appears when the user first enters the canvas. "You've graduated! Here's what the technical world calls the things you already know: Charlie's job description = System Prompt. Charlie's tricks = Tools. Charlie's knowledge = Knowledge Sources." This moment should feel like a reward, not a disconnect.

**Risk 4: "The metaphor doesn't translate internationally"**
- *Trigger:* Non-English-speaking markets, cultures where dogs are not common pets
- *Mitigation:* For now, this is a US/UK-focused product. If international expansion becomes relevant, the metaphor is modular — "Charlie" can become any trainable character. The 3-question structure is universal; only the framing language changes.

---

### 3.5 Visual Brand Guidelines for the Metaphor

**Charlie the Character:**
- Breed: Friendly, approachable (golden retriever or mixed breed energy — not intimidating, not overly cute)
- Expressions: Eager, attentive, occasionally confused (mirrors user emotions)
- Style: Clean line art or flat illustration — NOT photorealistic, NOT cartoon/chibi
- Appears: In onboarding, empty states, loading screens, error messages, mission completion
- Does NOT appear: In the canvas view, technical documentation code blocks, pricing comparison tables

**Color Palette Association:**
- Charlie-related UI: Warm tones (amber, soft gold, warm gray)
- Technical/canvas UI: Cool tones (standard Langflow palette)
- The visual transition from warm → cool mirrors the pedagogical transition from beginner → advanced

**Tone of Voice Spectrum:**

```
PLAYFUL ←————————————————————→ PROFESSIONAL
|          |          |          |          |
Workshops  Social     Product    Docs/      Enterprise
Onboarding Media      UI         SEO        Sales
Emails     Ads        Settings   API Docs   Investors
```

---

## 4. OBJECTION HANDLING SCRIPTS

### 4.1 "Why not just use ChatGPT custom GPTs? They're free."

> "Totally fair question — I hear it all the time. ChatGPT's custom GPTs are great for personal use, but they have three limitations that matter for business: you can't embed them on your website, you can't connect them to your actual business tools like your CRM or calendar, and your customers need a ChatGPT account to use them. Teach Charlie gives you a deployable AI agent with 500+ app integrations that lives on your site — and it teaches you how AI works so you can keep building on it."

*Framework: Acknowledge → Reframe (personal vs. business) → Three specific gaps → Bridge to value.*

### 4.2 "I can build this myself with Langflow/FlowiseAI."

> "You absolutely can — and if you're comfortable working with node graphs, prompt engineering, and API configurations, Langflow is a phenomenal tool. But most of the people I work with don't know what any of those words mean yet. Teach Charlie is the guided path into that world. You start by answering three questions, and the platform progressively teaches you the concepts until you're ready for the full canvas. Think of it as the on-ramp to Langflow, not a replacement for it."

*Framework: Validate their capability → Name the actual audience → Reposition as on-ramp, not competitor.*

### 4.3 "Langflow is free and open source, why would I pay?"

> "Langflow is an incredible open-source project — we actually build on top of it. The difference is like the difference between having access to a professional kitchen and knowing how to cook. Langflow gives you every tool a developer needs. Teach Charlie gives you the recipes, the guided lessons, and the support to actually use those tools — even if you've never coded. The $19/month isn't for the technology; it's for the education and the time it saves you."

*Framework: Praise the competitor → Kitchen analogy → Reframe what they're paying for (education, not technology).*

### 4.4 "I don't need AI / AI is overhyped."

> "I completely understand that feeling — there's a lot of noise right now. But here's what I've seen in 10 years of working with small businesses: the ones who learned automation early got a massive advantage, and the ones who waited had to catch up later at a much higher cost. AI is the same pattern. You don't need to go all-in — but spending 5 minutes building your first agent at least lets you see what's possible, so you can make an informed decision about whether it's right for your business."

*Framework: Validate the skepticism → Pattern from personal experience → Low-commitment invitation → Informed decision framing.*

### 4.5 "$19/month is too expensive for what this does."

> "I get that — every dollar matters when you're running a business. Here's how I think about it: if your AI agent handles even 5 customer conversations a day that you'd otherwise handle personally, that's roughly 10 hours a month of your time saved. At $19/month, that's less than $2 per hour of your time back. And the free tier lets you test it with no commitment before you decide the Pro features are worth it."

*Framework: Empathize → Reframe as time-value equation → Specific math → Risk reversal (free tier).*

### 4.6 "I'm not technical enough to use this."

> "That's actually exactly who we built this for. Every person in our workshops starts by saying some version of 'I'm not technical' — and every single one of them leaves with a working AI agent. The whole platform is designed around three plain-English questions. If you can describe what you want your AI to do in a sentence, you can use Teach Charlie. Seriously — no code, no jargon, no setup."

*Framework: Flip the objection (you ARE our user) → Social proof (workshops) → Concrete simplicity → Reassurance.*

### 4.7 "How is this different from Zapier's AI features?"

> "Great question — I'm a huge Zapier fan, and a lot of our users use both. The difference is the starting point. Zapier assumes you already understand automation and adds AI on top. Teach Charlie starts with AI and teaches you the concepts from scratch. If you already know Zapier well, their AI features might be enough. But if the phrase 'AI agent' still feels fuzzy, Teach Charlie is where you should start — and then you can connect it to Zapier and 500+ other tools once you're ready."

*Framework: Show respect for competitor → Name the difference (starting point) → Segment the audience → Position as complementary.*

---

## 5. EDUCATION-FIRST POSITIONING PLAYBOOK

### 5.1 Core Positioning Statement

> "Teach Charlie AI is the 'learn AI by doing' platform for non-technical professionals. We don't just give you an AI tool — we teach you how AI works by having you build something real."

This is not a chatbot builder that happens to be easy. It is an **educational platform** that happens to produce working AI agents. The distinction matters because it changes every downstream decision: pricing (investment in learning, not software cost), marketing (transformation, not features), retention (skills growth, not feature lock-in).

---

### 5.2 The "Graduation" Narrative

The core educational arc has four stages. Every user should be able to identify which stage they are at, and the product should always show them what the next stage looks like.

**Stage 1: "The First Day" (Minutes 0-5)**
- User answers 3 questions in the wizard
- Agent is created automatically
- User tests it in the playground
- **Emotional state:** Surprised delight ("Wait, that actually works?")
- **Messaging:** "You just built your first AI agent. Seriously. That's it."

**Stage 2: "Obedience School" (Days 1-7)**
- User refines the agent through playground testing
- Adds knowledge sources (text, files, URLs)
- Completes 2-3 missions
- **Emotional state:** Growing confidence ("I'm starting to understand this")
- **Messaging:** "Charlie's getting smarter. So are you."

**Stage 3: "Advanced Training" (Weeks 2-4)**
- User connects external tools via Composio
- Embeds the agent on their website
- Explores the Langflow canvas for the first time
- **Emotional state:** Empowerment ("I can see how this all fits together")
- **Messaging:** "You've graduated from the wizard. Welcome to the full toolkit."

**Stage 4: "Off-Leash" (Month 2+)**
- User builds multi-agent workflows
- Creates custom flows in the canvas
- Helps others in the community
- **Emotional state:** Mastery ("I teach other people this now")
- **Messaging:** "Remember when you said you weren't technical?"

*Why this narrative matters:* It gives users a sense of progression that justifies continued engagement AND continued payment. The free tier maps to Stage 1-2. Pro maps to Stage 3-4. The narrative itself is the retention mechanism — people don't churn from a journey they're invested in.

---

### 5.3 Content Angles for Education-First Positioning

**Blog / SEO Content Strategy**

| Content Angle | Example Title | Funnel Stage | Metaphor Level |
|---|---|---|---|
| "What is an AI agent?" explainers | "AI Agents Explained: What They Are, What They Do, and Why Your Business Needs One" | Top of funnel | Minimal — educational authority |
| Step-by-step tutorials | "How to Build a Customer Support AI Agent in 5 Minutes (No Code)" | Mid funnel | Moderate — Charlie appears in screenshots |
| Use-case showcases | "How a Real Estate Agent Uses Teach Charlie to Qualify Leads 24/7" | Mid funnel | Light — product reference, not metaphor |
| "Before/After" transformations | "I Went From 'AI-Confused' to Building 3 AI Agents in One Workshop" | Bottom funnel | Full — workshop narrative |
| Technical deep dives | "Understanding RAG: How Your AI Agent Retrieves Knowledge" | Retention / education | Minimal — technical audience |
| Industry-specific guides | "AI Agents for Coaches: Automate Intake, Scheduling, and FAQ" | Mid funnel | Moderate — practical focus |

**Video Content Strategy**
- Workshop recordings (edited, 15-20 min) — YouTube, LinkedIn
- "Build with me" screencasts (5-7 min) — YouTube Shorts, TikTok
- "5-minute agent" challenges — Instagram Reels, TikTok
- Founder "lessons learned" talking heads — LinkedIn, YouTube

**Email Course: "AI in 5 Days"**
- Day 1: What AI agents actually are (and aren't)
- Day 2: Build your first agent with Teach Charlie (live in 5 min)
- Day 3: Make it smarter with knowledge sources
- Day 4: Connect it to your business tools
- Day 5: Deploy it to your website

*Why this structure matters:* Each email delivers standalone value AND progresses the user through the graduation arc. Day 2 is the conversion point — they build something real and become an active user.

---

### 5.4 Partnership Messaging for Educational Institutions

**For Community Colleges, Continuing Education Programs:**
> "Teach Charlie AI provides a hands-on AI curriculum that doesn't require students to know how to code. In a single 90-minute session, students build a working AI agent they can actually deploy — giving them tangible, portfolio-worthy skills. We provide workshop materials, instructor guides, and a free institutional tier."

**For Business Incubators and Accelerators:**
> "Your cohort members need to understand AI, but most of them aren't technical. Teach Charlie gives them a structured way to build AI into their business — starting with a 5-minute agent and progressing to advanced automations. We've run [X] workshops with [Y] participants and a [Z]% completion rate."

**For Professional Associations (SCORE, Chamber of Commerce, BNI):**
> "Your members are hearing about AI everywhere but have no idea where to start. We offer a 60-minute hands-on workshop where every attendee builds a working AI agent for their specific business. No slides. No theory. Just results."

*Why education partnerships matter:* They provide three things simultaneously — distribution (access to your exact audience), credibility (institutional endorsement), and content (workshop recordings become marketing assets).

---

### 5.5 Making "Beginner-Friendly" Feel Aspirational

**The Problem:** "Beginner-friendly" can feel condescending. It implies the user is lacking something. The target audience — successful business owners in their 30s-50s — does not want to feel like beginners.

**The Solution: Reframe "Beginner" as "Pioneer"**

Instead of: "Teach Charlie is for AI beginners"
Use: "Teach Charlie is for business professionals who are ready to add AI to their toolkit"

Instead of: "Simple enough for anyone"
Use: "Designed for people who have better things to do than learn to code"

Instead of: "No technical skills needed"
Use: "Built for business expertise, not technical expertise"

Instead of: "Easy AI for non-technical users"
Use: "AI that respects your time and speaks your language"

**The Narrative Reframe:**

> "You're not a beginner. You've been running a business, managing teams, and solving real problems for years. You just haven't applied those skills to AI yet — because nobody made a tool that matched the way you think. Teach Charlie does."

*Why this matters:* The target user's identity is "competent professional," not "clueless newbie." Every piece of messaging must reinforce their existing competence while adding AI as a new capability. They are not starting from zero — they are adding a new tool to an already-full toolkit.

**Specific Language Shifts:**

| Condescending Version | Aspirational Version |
|---|---|
| "Even you can build AI!" | "Your business expertise is the hardest part. We handle the technical part." |
| "AI made simple" | "AI made practical" |
| "For non-technical users" | "For business professionals" |
| "No experience needed" | "Bring your business knowledge — we'll supply the technology" |
| "Dummy-proof AI" | "AI that works the way you think" |
| "Learn AI from scratch" | "Add AI to your toolkit" |

---

### 5.6 The Education-First Flywheel

This is the strategic engine that makes education-first positioning a business model, not just a marketing angle.

```
Workshops (Free or Paid)
    ↓ attendees build an agent live
Free Tier Signups
    ↓ continue using, hit limits
Pro Conversions ($19/mo)
    ↓ succeed, tell peers
Word-of-Mouth Referrals
    ↓ new workshop attendees
Workshops (Growing)
    ↓ recordings become content
Content Marketing (SEO, Social, YouTube)
    ↓ organic signups
Free Tier Signups
    ↓ cycle repeats
```

Every workshop is simultaneously:
1. A sales event (attendees become users)
2. A content event (recording becomes marketing)
3. A product event (real users stress-test the platform)
4. A research event (you learn what confuses people)

*Why this flywheel matters:* It means the founder's core strength (workshops and sales) IS the growth engine. There is no need to become a growth hacker, SEO expert, or paid ads specialist. The workshops drive everything, and everything drives more workshops.

---

## APPENDIX: QUICK-REFERENCE MESSAGING CHEAT SHEET

| Context | Use This | Avoid This |
|---|---|---|
| Workshop opening | "Teach a dog named Charlie to do a job" | "Configure an LLM agent with custom prompts" |
| Cold LinkedIn DM | "Build AI agents without code — designed for business owners" | "Our AI platform uses a gamified dog trainer metaphor" |
| Investor deck, slide 1 | "The Canva of AI Agent Development" | "Fisher-Price meets Langflow" (save this for verbal pitch) |
| Pricing page | "Pro: Deploy your agent + 500 integrations" | "Pro: Teach Charlie advanced tricks" |
| SEO title tag | "Build an AI Chatbot for Your Business — No Code | Teach Charlie" | "Train Your AI Dog — Teach Charlie AI" |
| Error message in product | "Charlie got confused. Try rephrasing that?" | "Error 500: Internal server error" |
| Workshop follow-up email | "Charlie's waiting for you. Finish what you started." | "Complete your account setup to continue." |
| Enterprise pitch | "Educational AI agent builder for non-technical teams" | "It's like training a dog but for AI" |

---

**Final Note on Execution:** This playbook is designed to be a living document. Every messaging element should be tested, measured, and iterated. The dog trainer metaphor is a hypothesis — a strong one, validated by workshop reactions — but it should be measured against non-metaphor variants in paid ads, landing pages, and email subject lines. Let data confirm what intuition suggests. The positioning, however, is non-negotiable: **education-first, non-technical audience, workshops as the growth engine.** That is not a hypothesis. That is the strategy.

---

# TEACH CHARLIE AI — WORKSHOP STRATEGY PLAYBOOK

## Complete Launch Playbook Section: Workshops as Primary Growth Engine

---

## STRATEGIC OVERVIEW

**Why Workshops Are Your #1 Growth Channel**

You have a rare founder-market fit advantage: 10+ years of in-person selling and no-code education experience combined with a product that *must be experienced* to be understood. Workshop-led growth is your unfair advantage over every VC-backed AI startup relying on paid ads and content marketing.

The math: A single 20-person workshop converting at 30% to free signups, with 20% of those converting to $49/mo Pro plans within 30 days, generates $59/mo in recurring revenue per workshop. At 4 workshops/month, that is $235/mo new MRR added monthly. By month 12, you are at $2,820 MRR from workshops alone — and that is the conservative floor assuming zero organic growth, zero referrals, and zero upsells.

But workshops do more than generate revenue. They produce:
- **Product feedback** from watching real users struggle in real time
- **Testimonials and case studies** from attendees who build something live
- **Content** (recordings, slides, photos) for marketing
- **Community** that retains and refers
- **Authority positioning** that opens doors to corporate deals

**The Constraint Budget**: $100-$500/month, ~20 hrs/week non-technical time. Every recommendation below is designed within these limits.

---

## 1. WORKSHOP CURRICULUM DESIGN

### Format A: 60-Minute "AI Tasting" — Intro Workshop

**Purpose**: Low-barrier introduction for non-technical audiences. Free or venue-sponsored. Primary goal: collect emails, create "aha moment," drive signups.

**Ideal Venues**: Public libraries, community centers, senior centers, Rotary Club meetings, church groups, neighborhood business associations.

**Audience Size**: 10-30 people. Works best at 15-20.

**Materials Needed**:
- Laptop with HDMI/USB-C to HDMI adapter ($15 one-time)
- Portable Bluetooth clicker/presenter ($20 one-time)
- Printed one-page handouts, 30 copies ($8 per workshop at Staples/FedEx)
- QR code stand or large printed QR code ($5 one-time)
- Name tags and markers ($3 per workshop)
- Wi-Fi access (confirm with venue 48 hours before)

**Total recurring cost per workshop**: ~$11

**Slide Count**: 18 slides (Google Slides — free)

**Handout Content (single sheet, double-sided)**:
- Front: "Your AI Agent Starter Card" — QR code to app.teachcharlie.ai, the 3 questions they will answer, 4 example agents (Customer Service Charlie, Marketing Charlie, HR Charlie, Sales Charlie), coupon code for 14-day Pro trial
- Back: "AI Vocabulary Cheat Sheet" — 12 terms defined in plain English (AI Agent, Prompt, RAG, Integration, etc.), plus "What to Try This Week" with 3 homework challenges

---

#### MINUTE-BY-MINUTE BREAKDOWN

**Minutes 0:00–2:00 — THE OPENING HOOK** (Verbatim Script)

Stand at the front. No slides yet. Screen is off or showing the Teach Charlie logo.

> "Hey everyone, thanks for being here. Quick question before we start — raise your hand if you've heard the phrase 'artificial intelligence' at least five times this week."
>
> [Wait. Most hands go up. Smile.]
>
> "Okay, now keep your hand up if you could explain to your neighbor what AI actually *does* for a small business."
>
> [Pause. Watch hands drop. Laugh warmly.]
>
> "That's exactly why we're here. I'm [Name], and I've spent the last ten years helping people like you — business owners, marketing folks, people who are *great* at what they do but didn't sign up to become software engineers — I help people like you use technology without the headache.
>
> Here's what I want you to know: by the end of the next 55 minutes, you're going to watch me build a working AI assistant — live, from scratch — in under three minutes. No coding. No technical background needed. And if you want, you'll get to try it yourself before you leave.
>
> I'm not going to sell you anything tonight. What I *am* going to do is show you something that took me ten years in this industry to understand: AI isn't magic. It's a tool. And the people who learn to use it first are going to have an enormous advantage.
>
> Let's get started."

[Click to Slide 1: "What If You Could Clone Your Best Employee?"]

**Why this opening matters**: It does four things in 120 seconds: (1) creates participatory energy with hand-raising, (2) validates the audience's confusion as normal, (3) establishes your credibility without bragging, (4) sets a concrete promise (build an AI agent in 3 minutes) that creates anticipation. The "I'm not going to sell you anything" line is critical — it drops the audience's guard and paradoxically makes them *more* receptive to your CTA later.

---

**Minutes 2:00–10:00 — "AI Is Just a Really Fast Intern" (Context Setting)**

Slides 2-5.

- **Slide 2**: "What AI Can Do Today" — Three columns: What it's great at (answering questions, summarizing, writing drafts), What it's okay at (creative work, analysis), What it can't do (make decisions for you, replace relationships, be 100% accurate). *Spend 90 seconds.*
- **Slide 3**: "The AI Agent Concept" — Simple visual: a person talks to a box, the box has a job description, the box answers. Use the dog metaphor: "Think of an AI agent like training a really smart dog. You tell it its job, you set the rules, and you teach it tricks. That's literally what we're going to do." *Spend 90 seconds.*
- **Slide 4**: "Real Examples" — Show 4 real use cases with before/after: (1) A bakery using an AI agent to answer "Are your cupcakes gluten-free?" on their website 24/7, (2) A real estate agent with a listing Q&A bot, (3) A nonprofit using one for volunteer FAQ, (4) A fitness coach with a nutrition Q&A agent. Keep these relatable to the audience. *Spend 2 minutes.*
- **Slide 5**: "The 3 Questions" — Preview the framework: "Who is Charlie? What are Charlie's rules? What tricks does Charlie know?" Simple. Memorable. *Spend 1 minute.*

Interaction: After Slide 4, ask: "Quick — who here has a question they get asked over and over in their work? Shout one out." Take 2-3 answers. Write them on a whiteboard or say them back. "Perfect. That's exactly the kind of thing an AI agent handles for you."

---

**Minutes 10:00–25:00 — LIVE DEMO: "Build Charlie in 3 Minutes"**

Slides 6-8 (but mostly live screen).

- **Slide 6**: "Let's Build One — Live" — Transition slide. Switch to live browser.
- **LIVE SCREEN**: Navigate to app.teachcharlie.ai. Show the signup process (use a pre-made demo account to avoid delays). Click "Create New Agent."
- Walk through the 3-step Q&A wizard out loud:
  - **Step 1 — "Who is Charlie?"**: "I'm going to make Charlie a customer service agent for a coffee shop. Watch how simple this is." Select the Customer Service preset or type a description.
  - **Step 2 — "What are Charlie's rules?"**: "I'll tell Charlie to always be friendly, always recommend our seasonal special, and never make up information he doesn't know."
  - **Step 3 — "What tricks does Charlie know?"**: Show one integration or tool. Keep it simple — maybe a knowledge base with the coffee shop's menu.
- Click "Create" and show the agent being built.
- Switch to the Playground. Send a test message: "Do you have oat milk?"
- Show Charlie responding accurately based on the rules.
- Send a harder question: "What's the Wi-Fi password?" Show Charlie saying "I don't have that information — let me connect you with the team."
- **Total demo time**: 8-10 minutes. Rehearse this until you can do it in 7.

**Slide 7**: Brief pause slide — "What just happened?" Recap: You answered 3 questions. An AI agent was created. It's already working. No code. No engineering degree.

**Slide 8**: "What would YOUR agent do?" — Transition to participation.

**Troubleshooting**: If Wi-Fi fails, have a screen recording of this exact demo saved locally as a backup MP4. Practice the demo 5 times before your first workshop. Have a second browser tab with the playground already open in case the creation flow has a hiccup.

---

**Minutes 25:00–40:00 — AUDIENCE PARTICIPATION: "Design Your Agent"**

Slides 9-12.

- **Slide 9**: "Your Turn — Grab a Handout" — Direct people to the handout. Point to the 3 questions.
- **Activity (10 minutes)**: Have each person write down answers to the 3 questions for THEIR business on the back of the handout (or on a blank card you provide). Walk around the room. Help people who are stuck. Give examples. Be encouraging.
- **Slide 10**: "Let's Hear Some!" — Ask 3-4 volunteers to share what they wrote. React enthusiastically. "Oh, a travel agent Charlie — that's brilliant. Imagine your clients getting instant trip recommendations at 2am."
- **Slide 11**: Show the QR code to app.teachcharlie.ai. "If you want to try building yours right now on your phone, scan this QR code. You don't need to — but if you're curious, go for it."
- **Slide 12**: For those who sign up live, walk them through the first screen. "Everyone who just scanned — you should see a 'Create Agent' button. Go ahead and tap it."

**Why the participation moment matters**: This is where the workshop shifts from passive to active. People who *write down* their agent idea are 3x more likely to sign up later. People who sign up *in the room* are 5x more likely to become active users. The social proof of others scanning the QR code creates momentum.

---

**Minutes 40:00–50:00 — "The Bigger Picture" + Q&A**

Slides 13-16.

- **Slide 13**: "What Else Can AI Agents Do?" — Show the breadth: embed on your website, connect to 500+ tools, add knowledge bases, create agent teams. Keep this aspirational, not detailed.
- **Slide 14**: "The AI Adoption Curve" — Simple chart showing Early Adopters → Early Majority. "You're here tonight. That puts you ahead of 90% of small businesses. The question isn't whether AI will change your industry — it's whether you'll be the one using it or the one disrupted by it."
- **Slide 15**: "Questions?" — Open Q&A for 8-10 minutes. Common questions to prepare for:
  - "Is this going to replace my employees?" (No — it handles repetitive tasks so your team can focus on relationships.)
  - "How much does it cost?" (Free to start, Pro plans start at $49/mo.)
  - "Is my data safe?" (Yes, explain briefly.)
  - "Do I need technical skills?" (You just watched me build one in 3 minutes.)
  - "What if the AI gives wrong answers?" (That's what the 'rules' step is for — you control it.)
- **Slide 16**: Transition to close.

---

**Minutes 50:00–58:00 — THE CLOSE + CTA**

Slides 17-18.

- **Slide 17**: "Your Next Step" — Three clear options:
  1. **Try it free tonight**: Scan QR code → app.teachcharlie.ai (free account, no credit card)
  2. **Join our next hands-on workshop**: "Next [date], I'm running a 90-minute session where you'll actually build your agent and walk out with it working. Space is limited to 15 people. Sign up at [URL]." Show QR code for registration.
  3. **Get the replay + cheat sheet**: "Drop your email in the signup sheet going around and I'll send you tonight's slides plus a step-by-step guide."

- **Slide 18**: "Thank You" slide with: your name, email, website, QR code, and the line: "The best time to start using AI was yesterday. The second best time is tonight."

**Minutes 58:00–60:00 — MINGLE**

Stay in the room. Be available. This is where the best conversations happen. People who are too shy to ask questions publicly will approach you now. Have business cards (Vistaprint, $20 for 250). Collect the email signup sheet.

---

**Post-Workshop Admin (30 minutes)**:
- Photograph the signup sheet, enter emails into your email tool (ConvertKit, Mailchimp)
- Send "Thanks for coming" email within 2 hours (template in Section 3)
- Post a photo to LinkedIn/social: "Just wrapped a great session at [Venue]! 22 people learned how to build their first AI agent tonight. Next one is [date]."
- Note what questions came up, what confused people, what got the biggest reaction. Iterate the deck.

---

### Format B: 90-Minute "Build Your First AI Agent" — Hands-On Workshop

**Purpose**: Working session where every attendee walks out with a functioning AI agent. This is your conversion workhorse. Charges $29-$49 or free at sponsored venues.

**Ideal Venues**: Coworking spaces, tech meetups, Meetup.com groups, startup incubators, maker spaces.

**Audience Size**: 8-15 people (cap at 15 for hands-on support). This is critical — more than 15 and you cannot provide individual help, quality drops, and conversions drop.

**Materials Needed**:
- Everything from the 60-minute format, plus:
- Attendees MUST bring laptops (state this in registration — "Laptop required. Tablets will not work for this session.")
- Printed 4-page workbook ($2.50/copy at Staples for color) containing: the 3 questions worksheet, troubleshooting FAQ, "What to Build Next" ideas list, QR codes for resources
- Extension cord and power strip ($25 one-time) — coworking spaces never have enough outlets
- Portable Wi-Fi hotspot as backup ($35/mo on Google Fi, cancel after) — venue Wi-Fi with 15 people all hitting the same site can choke

**Total recurring cost per workshop**: ~$45-$60 (handouts + venue fee if any)

**Slide Count**: 24 slides

**Pre-Workshop Requirements for Attendees** (sent via email 48 hours before):
1. Bring a laptop (not a tablet)
2. Create a free account at app.teachcharlie.ai before arriving (include link + screenshot of signup)
3. Think about one repetitive question or task in your business that you wish someone else could handle
4. Optional: bring a document or FAQ list you'd like your AI agent to know about

---

#### AGENDA + MINUTE-BY-MINUTE BREAKDOWN

**Minutes 0:00–5:00 — ARRIVALS + SETUP**

Slide 1 on screen: "Build Your First AI Agent — Wi-Fi: [network] / Password: [password]"

Greet people as they arrive. Confirm they have laptops and accounts. Help anyone who didn't create an account pre-register on the spot. Have them open app.teachcharlie.ai and log in.

**Minutes 5:00–10:00 — WELCOME + ICEBREAKER**

Slide 2: Your name, background, what you are building.

Quick icebreaker (critical for group energy in a hands-on session): "Go around the room — name, what you do, and the one task you wish you could hand off to a clone of yourself." This takes 3-4 minutes with 12-15 people and simultaneously generates agent ideas for the build session.

**Minutes 10:00–20:00 — "THE FRAMEWORK" (Compressed version of 60-min context)**

Slides 3-8.

- What an AI agent is (2 min)
- The dog trainer metaphor (2 min)
- Live demo: build a coffee shop agent in 3 minutes (5 min)
- Show the playground, send test messages (1 min)
- "Now it's your turn" transition

This is faster than the 60-minute version because the audience self-selected by registering for a hands-on session — they already have baseline curiosity and commitment.

**Minutes 20:00–50:00 — BUILD SESSION: "Create Your Agent" (30 minutes)**

Slides 9-14 (shown briefly, then switch to roaming support).

- **Slide 9**: "Step 1 — Open app.teachcharlie.ai and click 'Create New Agent'"
- **Slide 10**: "Step 1 of 3 — Who Is Charlie?" with guidance prompts
- Walk them through each step live. You do it on screen; they follow on their laptops.
- Pause after each step. Walk the room. Check screens. Help anyone stuck.
- **Slide 11**: "Step 2 of 3 — What Are Charlie's Rules?" with example rules
- **Slide 12**: "Step 3 of 3 — What Tricks Does Charlie Know?" — For this session, keep it simple: skip integrations, focus on the knowledge base. Have them paste in some FAQ text or a paragraph about their business.
- **Slide 13**: "Click Create — Watch the Magic"
- **Slide 14**: "Test Your Agent in the Playground" — Give them 5 test prompts to try:
  1. A question Charlie should answer well
  2. A question Charlie should redirect or decline
  3. A question from a rude customer
  4. A question that tests the knowledge you gave it
  5. A question in a different language (fun surprise moment)

**Troubleshooting Guide for Common Issues (have printed, keep nearby)**:

| Issue | Solution |
|-------|----------|
| "I can't log in" | Clear cookies, try incognito. If Clerk auth fails, use a different email. |
| "Create Agent button doesn't work" | Hard refresh (Ctrl+Shift+R). Check browser — must be Chrome, Firefox, Safari, or Edge. |
| "Charlie gives wrong answers" | Go back to Step 2, add more specific rules. Common mistake: rules are too vague. |
| "Charlie says 'I don't know' to everything" | Knowledge base might not have saved. Re-enter the knowledge text in Step 3. |
| "The page is loading forever" | Check Wi-Fi connection. Try switching to phone hotspot temporarily. |
| "My agent doesn't sound like my brand" | Add personality notes in Step 1: "Charlie should sound professional but warm, like a friendly barista." |
| "Can I start over?" | Yes — delete the agent and create a new one. No penalty. |
| "It's slow" | Normal during creation. The agent takes 10-30 seconds to build. Playground responses: 2-5 seconds. |

**Minutes 50:00–60:00 — SHOW & TELL**

Slides 15-16.

Ask 3-5 volunteers to demo their agent to the group. They share their screen (or you type their test question on the projector) and everyone sees the response. This is a powerful social proof moment — people see diverse use cases and get inspired.

Celebrate each one. "That's amazing — you just built an AI agent for your dog grooming business in 20 minutes. Six months ago, that would have cost you $10,000 and a developer."

**Minutes 60:00–75:00 — "LEVEL UP" — Advanced Features Tour**

Slides 17-21.

Now that they have a working agent, show them what is possible next:
- **Embed widget**: "Put Charlie on your website — takes 2 minutes. Copy this code, paste it in." (Show the embed feature, do not make them do it live — too many website platform variables.)
- **Integrations**: "Connect Charlie to your Google Calendar, Slack, email — 500+ tools." Show Composio briefly.
- **RAG / Knowledge Sources**: "Upload your entire FAQ document, product catalog, or employee handbook. Charlie learns it all." Demo uploading a file.
- **Missions**: "We've gamified learning — complete missions to level up your AI skills." Show the missions screen briefly.

This is aspirational content. The goal is to show depth so they feel the free tier is not the ceiling — there is a reason to upgrade.

**Minutes 75:00–85:00 — Q&A + PRICING OVERVIEW**

Slides 22-23.

- Open Q&A: 5-7 minutes.
- **Slide 23**: Pricing overview. Be transparent: "Free plan gives you 1 agent and 50 messages/month. Pro is $49/month for unlimited agents, priority support, and all integrations. If you sign up for Pro in the next 7 days, use code WORKSHOP for 50% off your first month."

**Why mention pricing explicitly**: People who attend hands-on workshops are further down the funnel. They have invested 90 minutes and built something. Hiding pricing feels evasive. Being direct builds trust and lets them make a decision.

**Minutes 85:00–90:00 — CLOSE + NEXT STEPS**

Slide 24.

- "Your agent is live. It's yours. Keep building it this week."
- Share 3 homework challenges: (1) Add 5 more rules to Charlie, (2) Test Charlie with a friend or colleague, (3) Try embedding Charlie on your website.
- "I'll email you tomorrow with a recording of today's session, plus a link to our community where you can ask questions."
- "My next workshop is [date] — a half-day intensive where we go deep. Details in your follow-up email."
- Thank them. Mingle.

---

### Format C: Half-Day "AI for Your Business" Intensive — Premium Workshop

**Purpose**: Deep-dive session for committed learners. Charges $99-$199. The premium offering that generates the highest per-attendee revenue and the strongest conversions.

**Ideal Venues**: Chambers of Commerce conference rooms, hotel meeting rooms, community college classrooms, library meeting rooms (larger ones), corporate training rooms.

**Audience Size**: 8-20 people. Sweet spot is 12-15.

**Duration**: 4 hours (including one 15-minute break and one 5-minute stretch break)

**Materials Needed**:
- Everything from 90-minute format, plus:
- Printed 12-page workbook in a folder ($6/copy) — includes all worksheets, reference guides, glossary, and "AI Strategy Canvas" (one-page business strategy template)
- Name tent cards (folded cardstock so you can see their names from across the room) ($0.50 each)
- Snacks and coffee ($3/person — bulk buy coffee box from Starbucks or Dunkin', plus a fruit/granola tray from Costco)
- Certificate of completion (printed on cardstock, your logo, their name filled in by hand) ($0.75 each)
- USB drive or QR code to shared Google Drive folder with all slides, templates, recordings ($0 — digital delivery)

**Total recurring cost per workshop (15 attendees)**: ~$160-$200

**Slide Count**: 48 slides across 4 modules

**Pre-Work Requirements** (sent 5 days before):
1. Complete a "Business AI Readiness" survey (Google Form, 8 questions: What's your biggest time waste? What questions do customers ask repeatedly? What tools do you currently use? What's your comfort level with technology 1-10? etc.)
2. Create a free account at app.teachcharlie.ai
3. Bring: laptop, charger, one document you'd want your AI agent to know (FAQ, product list, policy doc, etc.)
4. Watch a 5-minute intro video (you record this once, reuse forever — Loom, free)
5. Optional reading: "What Is an AI Agent?" (one-page PDF you write, attached to email)

---

#### MODULE BREAKDOWN

**MODULE 1: "The AI Landscape" (45 minutes) — 9:00am to 9:45am**

*Goal*: Level-set the room. Build shared vocabulary. Eliminate fear.

Slides 1-12.

- **9:00–9:10**: Welcome, housekeeping (bathrooms, Wi-Fi, schedule on screen), icebreaker: "Name, business, and the one thing you hope to walk out with today."
- **9:10–9:25**: "The State of AI for Small Business" — What is working right now. Not hype, not sci-fi. Real examples: small businesses using AI agents for customer service, lead qualification, internal HR FAQ, appointment scheduling. Show 4 case study slides with before/after metrics (make these up based on realistic scenarios if you do not have real ones yet — replace with real data as you collect it).
- **9:25–9:35**: "The Three Levels of AI Adoption" — (1) Using AI tools (ChatGPT, etc.), (2) Building AI agents (what we are doing today), (3) AI workflows and automation. Most people are at Level 1. Today we move them to Level 2.
- **9:35–9:45**: **Group Exercise**: "AI Opportunity Audit" — In pairs, take 5 minutes to list every repetitive task, question, or communication in your business. Then star the top 3. Share one with the group.

*What's on screen*: Slides → Live examples → Timer for group exercise.

---

**MODULE 2: "Build Your First Agent" (60 minutes) — 9:45am to 10:45am**

*Goal*: Every attendee builds a working AI agent. This is the core hands-on session.

Slides 13-26.

- **9:45–9:55**: Live demo — you build an agent in 3 minutes (same as 60-min format but faster, they have seen the pre-work video).
- **9:55–10:00**: "Your AI Strategy Canvas" — Hand out the one-page strategy canvas from the workbook. They fill in: Agent Name, Agent Job, 5 Rules, 3 Knowledge Sources, Target Audience. This is their blueprint.
- **10:00–10:30**: **Guided Build** — Step-by-step, they build their agent. You demonstrate each step on screen, they follow on laptops. Walk the room constantly. Pair up anyone struggling with someone who is ahead.
- **10:30–10:40**: **Testing + Refinement** — They test their agents in the playground. You give them a "Test Script" (5 specific prompts to try) from the workbook.
- **10:40–10:45**: **3-Minute Show & Tell** — 2-3 quick volunteer demos.

*What's on screen*: Your live browser → Their step-by-step instructions on slides → Timer.

---

**BREAK: 10:45am to 11:00am (15 minutes)**

Have coffee and snacks set up in the back. Play ambient music. This is when informal networking happens — do not rush them back. Walk around and chat with individuals.

---

**MODULE 3: "Supercharge Your Agent" (50 minutes) — 11:00am to 11:50am**

*Goal*: Add depth — knowledge bases, integrations, embedding. Show the Pro features.

Slides 27-38.

- **11:00–11:15**: **Knowledge Bases Deep Dive** — Demo adding a knowledge base. Then have attendees upload their document (the one you asked them to bring). Walk them through adding text, files, or URLs. Test that Charlie now knows this information.
- **11:15–11:25**: **Integrations Overview** — Show 5 high-value integrations: Google Calendar, Slack, Gmail, Notion, Shopify. Demo connecting one live (use a test account). Explain the concept: "Charlie can now *do things*, not just answer questions."
- **11:25–11:35**: **Embed Widget** — Show how to embed the agent on a website. For attendees with websites, walk them through getting the embed code. For others, show what it looks like. This is a strong "wow" moment.
- **11:35–11:50**: **Individual Build Time** — Unstructured time for attendees to add knowledge, try integrations, refine their agent. You roam and help. This is where the best learning happens because people are working on *their* specific problems.

*What's on screen*: Live demos → their agents → optional reference slides.

---

**5-MINUTE STRETCH BREAK: 11:50am to 11:55am**

Stand up, stretch, refill coffee. Keep it short.

---

**MODULE 4: "Your AI Strategy + Next Steps" (35 minutes) — 11:55am to 12:30pm**

*Goal*: Help them think beyond today. Create commitment to continue. Drive paid conversions.

Slides 39-48.

- **11:55–12:05**: **"Your 30-Day AI Roadmap"** — Walk through a realistic roadmap: Week 1 (refine your agent, test with 5 real customers), Week 2 (add knowledge base, connect one integration), Week 3 (embed on website, share with team), Week 4 (review analytics, plan your second agent). This is in the workbook.
- **12:05–12:15**: **Group Exercise: "Pitch Your Agent"** — Each person gives a 30-second pitch of their AI agent to a partner: what it does, who it serves, and what it will save them. Partner gives feedback. Then 3-4 share with the room. This creates *ownership* and *identity* — "I'm someone who builds AI agents now."
- **12:15–12:22**: **Q&A** — Open questions. Address pricing directly if it comes up. Be honest about what the free plan includes and what Pro adds.
- **12:22–12:28**: **Pricing + Special Offer** — "Everyone here has already built a working agent. The free plan keeps your agent running. Pro unlocks unlimited agents, priority support, and all integrations for $49/month. Because you committed to a full morning, I have a special offer: use code INTENSIVE for 30% off your first 3 months. That's $34/month. The offer expires Friday."
- **12:28–12:30**: **Certificate Ceremony** — Hand each person a certificate of completion. Have them write their name. Take a group photo (for social proof marketing). "You are now officially AI-capable business owners. Congratulations."

**Post-session**: Mingle for 15-20 minutes. This is where corporate/group deals happen organically — "Could you do this for my team of 10?"

---

## 2. VENUE SOURCING STRATEGY

### Venue Type 1: Public Libraries

**Who to Contact**: Adult Programming Coordinator or Community Engagement Librarian. Not the front desk — ask specifically for the person who books adult programs. Larger systems (county-level) may have a "Program Manager" or "Director of Community Services."

**What They Care About**:
- Free to the public (they will not promote paid events)
- Educational, not commercial (frame as digital literacy, not a sales pitch)
- Attendance numbers (they report to their board — "30 people attended" matters)
- Community relevance (AI education is a hot topic they want to offer)
- They do NOT want you to sell from the stage (respect this; your CTA is "try this free tool")

**Typical Lead Time**: 4-8 weeks. Libraries book programs monthly or quarterly. Some have seasonal catalogs (fall, winter, spring) that close 2-3 months ahead.

**Room Details**: Libraries have meeting rooms with projectors, screens, and Wi-Fi. Usually seat 20-50. Ask about: AV setup, Wi-Fi bandwidth, room layout (classroom vs. theater), power outlets.

**Revenue Model**: Free workshop. The library promotes it to their community (email list, flyers, website). You get a captive audience of 15-30 local people and their emails.

**Budget Impact**: $0 venue cost + $11 materials = $11 per workshop.

---

**Cold Outreach Email — Library Version**

Subject: Free AI Workshop for Your Community? (90% Booked Elsewhere)

> Hi [Name],
>
> I'm [Your Name], a local educator who teaches small business owners how to use AI tools — no technical background required.
>
> I'm reaching out because I'd love to offer a free, 60-minute workshop at [Library Name] called **"AI for the Rest of Us: What Small Business Owners Need to Know."**
>
> Here's the concept: attendees learn what AI agents actually are (no jargon), watch me build one live in 3 minutes, and leave with a free tool they can try at home. It's educational, interactive, and designed for complete beginners.
>
> I've been running these sessions at [other venues/meetups if you have them — if this is your first, say "community groups and coworking spaces across the area"] and they consistently draw 20-30 people.
>
> A few logistics:
> - **Cost to the library**: Free (I cover all materials)
> - **Duration**: 60 minutes + Q&A
> - **Requirements**: Room with a projector, screen, and Wi-Fi
> - **Audience**: Adults interested in technology, small business, or career development
>
> Would you be open to a quick call or email exchange about scheduling this for [Month]? I'm flexible on dates and times — evenings and weekends work great.
>
> Thanks for considering it!
>
> [Your Name]
> [Your Phone]
> [Your Website]

**Follow-Up Cadence**:
- Day 0: Send initial email (Tuesday or Wednesday morning, 9-10am)
- Day 5: Follow-up if no response: "Just bumping this up — would love to bring this to your community. Any interest?"
- Day 12: Final follow-up: "Last note on this — I have a few slots left for [Month]. If the timing isn't right now, I'd love to be considered for your [next season] lineup."
- If no response after 3 emails, move on. Try again in 3 months or approach a different branch.

---

### Venue Type 2: Coworking Spaces

**Who to Contact**: Community Manager or Events Coordinator. At WeWork, this is the "Community Lead" at each location. At local coworking spaces, it is often the owner.

**What They Care About**:
- Value for their members (AI education is a huge draw)
- Foot traffic (non-members who come for the event may tour the space and convert)
- Content for their events calendar (most coworking spaces need to run 2-4 events/month to justify their "community" branding)
- Low effort on their end (you bring everything, they provide the room)

**Typical Lead Time**: 2-4 weeks. Coworking spaces are informal and fast-moving.

**Partnership Models**:
1. **Free event, they promote**: You run a free 60- or 90-minute workshop. They email their members and promote on social. You get attendees and emails. Best for building relationships and initial proof.
2. **Ticketed event, revenue share**: You charge $29-$49. They get 20-30% for promoting and hosting. You keep 70-80%. Example: 15 attendees × $39 = $585 gross. They get $117-$175. You keep $410-$468 minus $45 materials = $365-$423 net. This is viable once you have proof.
3. **Sponsored monthly series**: They pay you $200-$400/month to run a monthly workshop exclusively for their members as a member benefit. The "white whale" deal — pursue after proving value with 2-3 free events.

---

**Cold Outreach Email — Coworking Space Version**

Subject: AI Workshop for Your Members? (Free to Host)

> Hi [Name],
>
> I help non-technical professionals build AI agents for their businesses — think automated customer service, internal FAQ bots, lead qualification tools — all without coding.
>
> I'm looking for coworking spaces in [City] to partner with for hands-on workshops, and [Space Name] looks like a perfect fit.
>
> Here's what I'm proposing:
>
> **"Build Your First AI Agent" — 90-Minute Hands-On Workshop**
> - Attendees bring laptops and walk out with a working AI agent for their business
> - I provide all materials, you provide the room and promotion
> - Free for your members, or we can co-ticket it (your call)
> - Cap at 15 people for quality (I help each person individually)
>
> I've been running these for [X months / in other venues] and the feedback has been overwhelmingly positive — people are shocked at what they can build in under an hour.
>
> Would you be open to trying one? I'm flexible on timing and happy to make it work with your events calendar.
>
> [Your Name]
> [Your Phone]
> [Your Website]

---

### Venue Type 3: Chambers of Commerce

**Who to Contact**: Events Director, Member Services Director, or the President/CEO directly (smaller chambers).

**What They Care About**:
- Member value and retention (they need to justify membership fees)
- Practical, relevant programming (AI education is a top request from members in 2026)
- Revenue generation (they charge for premium programs)
- Positioning as forward-thinking

**Typical Lead Time**: 4-8 weeks. Chambers plan quarterly.

**Pricing Positioning**: Frame the half-day intensive as a member benefit at a discounted rate:
- Member price: $99 (they sell tickets, keep $20-30 per ticket as revenue/commission)
- Non-member price: $149 (incentivizes membership)
- Group rate: $79/person for 5+ from the same company

**Revenue Math**: 15 attendees × $99 = $1,485. Chamber keeps $375 (25%). You gross $1,110 minus $200 materials/snacks = $910 net. For 4 hours of teaching plus 2 hours of prep/travel.

---

**Cold Outreach Email — Chamber Version**

Subject: "AI for Small Business" Workshop — Member Programming Idea

> Hi [Name],
>
> I'm reaching out because I think [Chamber Name]'s members would benefit from a practical, hands-on AI training I've been developing.
>
> Here's the context: 78% of small business owners say they want to use AI but don't know where to start (Goldman Sachs, 2025). I've created a half-day workshop where attendees actually *build* an AI agent for their business — no coding, no technical background needed. They walk out with a working tool.
>
> **"AI for Your Business" — Half-Day Intensive**
> - 4-hour workshop with hands-on building, group exercises, and strategy planning
> - Attendees leave with: a working AI agent, a 30-day AI roadmap, and a certificate
> - Limited to 15-20 attendees for quality
> - Suggested pricing: $99/member, $149/non-member (revenue share negotiable)
>
> This could be a great quarterly or semi-annual offering for your members. I handle all curriculum, materials, and delivery — your team just handles promotion and registration.
>
> Would it be worth a 15-minute call to explore this?
>
> [Your Name]
> [Your Phone]
> [Your Website]

---

### Venue Type 4: Community Colleges

**Who to Contact**: Dean of Continuing Education, or the Coordinator/Director of Community Education / Non-Credit Programs. Sometimes listed as "Workforce Development" or "Professional Development."

**What They Care About**:
- Enrollment numbers (they have quotas)
- Job-relevant skills (AI training checks this box emphatically)
- Instructor credentials (your 10 years in no-code automation qualifies you)
- Revenue split (they typically take 30-50% of tuition)

**How to Become an Approved Instructor**:
1. Find the continuing education catalog on the college's website
2. Look for "Propose a Course" or "Teach for Us" links (most have them)
3. Submit: course title, description (100-200 words), learning objectives (5-7 bullet points), your bio/CV, proposed schedule
4. They review (2-6 weeks), may ask for a meeting or syllabus
5. Once approved, they handle registration, payment processing, classroom booking, and promotion
6. You typically get $40-$60/student or 50-70% of tuition

**Lead Time**: 6-12 weeks minimum. They publish catalogs seasonally.

**Pricing**: $79-$149 per student for a half-day or full-day workshop. The college sets the price based on their market.

---

### Venue Type 5: Online (Virtual Workshops)

**Platform Comparison for Solo Founder**:

| Platform | Best For | Cost | Features | Verdict |
|----------|----------|------|----------|---------|
| **Zoom** | Familiarity, reliability | $13/mo (Pro) | Breakout rooms, screen share, recording, 100 participants | **Best overall** — everyone has it |
| **Luma** | Beautiful event pages, social proof | Free (basic) or $59/mo | Built-in registration, waitlist, reminders, Stripe integration | **Best for registration + marketing** |
| **Eventbrite** | Discovery/SEO, ticketing | Free for free events; 6.2% + $0.79 for paid | Large marketplace, SEO, attendee management | **Best for paid event ticketing** |
| **StreamYard** | Professional live streaming | $25/mo | Multi-guest, branding overlays, simultaneous streaming | Overkill for workshops |

**Recommended Stack**: Luma for registration + Zoom for delivery. Total cost: $13/mo (Zoom Pro) + $0 (Luma free tier). Use Eventbrite only when you want to tap into their marketplace for discovery.

---

### Venue Checklist (Use Before Every Workshop)

Print this and check off 48 hours before the event:

- [ ] Room confirmed with venue contact (email confirmation saved)
- [ ] Projector / large screen tested or confirmed
- [ ] HDMI / USB-C adapter in bag
- [ ] Wi-Fi network name and password confirmed
- [ ] Wi-Fi tested with 10+ simultaneous users (ask venue)
- [ ] Power outlets available + extension cord packed
- [ ] Handouts/workbooks printed
- [ ] Name tags and markers packed
- [ ] QR code stand or printout ready
- [ ] Backup demo video saved locally on laptop
- [ ] app.teachcharlie.ai tested and working (check 2 hours before)
- [ ] Demo account logged in and ready
- [ ] Signup sheet printed (name, email, business name columns)
- [ ] Business cards in bag
- [ ] Water bottle for you (you will talk for 60-240 minutes)
- [ ] Arrive 30 minutes early for setup

---

## 3. WORKSHOP-TO-SAAS CONVERSION FUNNEL

### PHASE 1: PRE-WORKSHOP (Registration → Day of Event)

**Registration Form Fields** (Luma, Eventbrite, or Google Form):
1. Full Name (required)
2. Email (required)
3. Business Name (required — for personalization in follow-ups)
4. Role/Title (required — for segmentation)
5. "What's the #1 thing you want to learn about AI?" (required — open text, for tailoring your talk)
6. "How comfortable are you with technology? (1-5)" (optional — helps you gauge the room)
7. Phone number (optional — for SMS reminders, converts 20% better than email-only)

**Why these specific fields**: Name + email is the minimum. Business name lets you personalize post-workshop emails ("I remember you're running a bakery — here's how to..."). Role tells you if they are a decision-maker (owner) or influencer (marketing manager). The open question gives you talk material and shows you care.

---

**Pre-Workshop Email Sequence (3 Emails)**

**Email 1: Confirmation (Immediate upon registration)**

Subject: You're in! Here's how to prepare for [Workshop Name]

> Hi [First Name],
>
> You're confirmed for **[Workshop Name]** on [Date] at [Time] at [Venue].
>
> Here's what to do before you arrive:
>
> **1. Create your free account** (takes 30 seconds)
> → [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> **2. Bring your laptop** (not a tablet — you'll need a full keyboard)
>
> **3. Think about this question**: What's one task in your business that you wish someone else could handle?
>
> That's it. No homework, no reading, no prep beyond those three things.
>
> If you have questions before the event, just reply to this email.
>
> See you [Day]!
>
> [Your Name]
>
> P.S. — Parking is [details]. The room is [details]. I'll be the one setting up early — say hi!

---

**Email 2: Anticipation Builder (48 hours before)**

Subject: What we're building on [Day] (sneak peek)

> Hi [First Name],
>
> Quick preview of what's happening [Day]:
>
> You're going to watch me build a working AI agent — live, from scratch — in under 3 minutes. Then you're going to build your own.
>
> By the time you leave, you'll have:
> ✓ A working AI agent customized for [their answer to "what do you want to learn" OR "your business"]
> ✓ A clear understanding of what AI can (and can't) do for small businesses
> ✓ A plan for what to do next
>
> **Quick reminder**: Please create your free account before arriving if you haven't yet → [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> See you in 48 hours!
>
> [Your Name]

---

**Email 3: Day-of Reminder (Morning of, 8-9am for afternoon events, or evening before for morning events)**

Subject: See you today! (Room details inside)

> Hi [First Name],
>
> Today's the day! Here's your quick reference:
>
> 📍 **Where**: [Venue], [Room Name/Number]
> 🕐 **When**: [Time] (doors open 10 min early)
> 💻 **Bring**: Laptop + charger
> 📶 **Wi-Fi**: [Network] / Password: [Password]
>
> If you need to reach me: [Your phone number]
>
> See you soon!
>
> [Your Name]

---

### PHASE 2: DURING WORKSHOP (The Conversion Moments)

**When to Mention the Platform** (Timing matters enormously):

| Minute | What to Say | Why |
|--------|-------------|-----|
| Minute 0-25 | Do NOT mention pricing or plans. Only mention the platform as a tool: "Open app.teachcharlie.ai" | Trust-building phase. Any sales energy destroys credibility. |
| Minute 25-50 | During the build, naturally reference features: "This is part of the free plan" or "On Pro, you can also..." | Casual exposure. They are focused on building, absorb it passively. |
| Minute 50-70 | During the "Level Up" / advanced features section: "These are Pro features — I'll share pricing at the end" | Set expectation that pricing is coming. Reduces surprise/resistance. |
| Last 10 min | Direct pricing overview + special offer | They have *already built something*. The loss aversion of abandoning their agent drives conversion. |

**The "Aha Moment" to Engineer**:

The single most important conversion moment is when an attendee's agent *responds correctly to a question specific to their business*. Not a generic demo — their agent, their knowledge, their question, their answer.

Engineer this by:
1. Having them paste in real business information during the knowledge base step
2. Then asking them to test with a real customer question
3. When it works: "That's YOUR AI agent. It just answered that question correctly. Imagine that running 24/7 on your website."

This is the moment when the abstract ("AI agents are cool") becomes concrete ("This solves MY problem"). Conversion rates double for attendees who experience this moment vs. those who do not.

**Getting Everyone Signed Up Live**:

Do this at minute 25 during the build session, not at the end:
1. Show the QR code / URL on screen
2. "Okay, everyone open app.teachcharlie.ai on your laptops"
3. Walk them through signup step by step
4. "Raise your hand when you see the dashboard" — this creates social pressure to complete it
5. Help anyone struggling (Clerk auth is fast, should take < 60 seconds)

Target: 90%+ of attendees should be signed up before they leave the room.

---

### PHASE 3: POST-WORKSHOP (7-Day Conversion Nurture)

**Email 1: Same day, 2-3 hours after workshop**

Subject: Your AI agent is waiting for you 🐕

> Hi [First Name],
>
> Thanks for an amazing session today! I loved seeing [reference specific moment — "Marcus's real estate agent was brilliant" or "the energy when everyone's agents started working"].
>
> **Your agent is live**: Log in at [app.teachcharlie.ai](https://app.teachcharlie.ai) to keep building.
>
> **3 things to try this week**:
> 1. Add 5 more rules to your agent (make Charlie smarter)
> 2. Test your agent with a colleague — send them the playground link
> 3. Try adding a knowledge source (paste in your FAQ or upload a document)
>
> **Workshop attendee perk**: Use code **WORKSHOP** for 50% off your first month of Pro ($24.50 instead of $49). Valid for 7 days.
>
> Reply to this email if you have questions — I read every one.
>
> [Your Name]
>
> P.S. — [Attach slides or link to shared Google Drive with workshop materials]

---

**Email 2: Day 2 (next day)**

Subject: Did your agent surprise you?

> Hi [First Name],
>
> Quick question: Did you test your agent after the workshop?
>
> If you did — what surprised you? (Seriously, reply and tell me. I love hearing these.)
>
> If you haven't logged back in yet, here's your direct link: [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> One tip: the biggest improvement you can make right now is adding more **rules** (Step 2 when you edit your agent). The more specific your rules, the better Charlie performs.
>
> Example rules that make a big difference:
> - "Always ask the customer's name before helping them"
> - "Never make up information — say 'Let me check on that' instead"
> - "Always end with: 'Is there anything else I can help with?'"
>
> Try adding 3 rules and test the difference.
>
> [Your Name]

---

**Email 3: Day 3**

Subject: "I saved 6 hours this week" — how [Name] used their agent

> Hi [First Name],
>
> I wanted to share a quick story.
>
> [Name — real attendee or composite], who runs a [type of business], built an agent at a workshop just like ours. Within a week, they had it embedded on their website answering customer questions. They told me: "I used to spend 6 hours a week answering the same 15 questions. Now Charlie handles it."
>
> The pattern I see: people who embed their agent on their website in the first week get the most value. Here's a 2-minute guide: [link to help doc or short video].
>
> (If you don't have a website, you can share your agent's playground link directly: just copy the URL from the playground page and send it to anyone.)
>
> Still have questions? Reply to this email.
>
> [Your Name]
>
> P.S. — Your WORKSHOP code for 50% off Pro expires in 4 days.

---

**Email 4: Day 4**

Subject: What 500+ integrations actually means for you

> Hi [First Name],
>
> In the workshop, I briefly mentioned that Teach Charlie connects to 500+ tools. Here's what that actually looks like for a [business type from their registration]:
>
> - **Google Calendar**: Charlie can check your availability and suggest meeting times
> - **Slack**: Charlie can post updates to your team channel
> - **Gmail**: Charlie can draft responses to common inquiries
> - **Shopify/Stripe**: Charlie can look up order status for customers
> - **Notion**: Charlie can search your knowledge base
>
> You don't need all of these. Most people start with just one integration that saves them the most time.
>
> Which one would help you most? (Reply — I can point you to the right setup guide.)
>
> [Your Name]

---

**Email 5: Day 5 — The Deadline Email**

Subject: Your workshop discount expires tomorrow

> Hi [First Name],
>
> Quick heads up: your workshop attendee code **WORKSHOP** (50% off your first month of Pro) expires tomorrow at midnight.
>
> To use it:
> 1. Log in at [app.teachcharlie.ai](https://app.teachcharlie.ai)
> 2. Go to Settings → Billing
> 3. Choose Pro plan
> 4. Enter code WORKSHOP at checkout
>
> **Pro gives you**: Unlimited agents, all integrations, priority support, knowledge base uploads, and the embed widget.
>
> If you're not ready for Pro yet, that's totally fine — the free plan keeps your agent running.
>
> [Your Name]

---

**Email 6: Day 7 — Last Chance + Alternative CTA**

Subject: Last call (+ a free alternative)

> Hi [First Name],
>
> Your WORKSHOP code expires tonight at midnight.
>
> But here's the thing: if you're not ready for Pro, I have two other options:
>
> **Option 1**: Keep using the free plan. Your agent stays live. You get 1 agent and 50 messages/month. No pressure.
>
> **Option 2**: Join our community. I run a free monthly "AI Office Hours" session where you can ask questions, get help, and see what other people are building. [Link to register for next one]
>
> **Option 3**: Upgrade to Pro with code WORKSHOP before midnight. $24.50/month.
>
> Whatever you choose, I'm glad you came to the workshop. You're ahead of 95% of business owners just by understanding what AI agents can do.
>
> Talk soon,
>
> [Your Name]

---

**Email 7: Day 10 — The "No-Sell" Check-in**

Subject: Quick question (not selling anything)

> Hi [First Name],
>
> It's been 10 days since the workshop. How's your agent doing?
>
> I'm genuinely curious:
> - Have you used it since the workshop?
> - Has anyone else tried it?
> - What would make it more useful for your business?
>
> Your answers help me make the workshops better and the product better. Reply with even one sentence and you'll make my day.
>
> [Your Name]

*Why this email matters*: This is the highest-reply-rate email in the sequence. People respond to genuine curiosity, especially after the sales pressure has stopped. Their responses give you testimonials, feature requests, and re-engagement hooks.

---

### CONVERSION RATE TARGETS AND VALIDATION

| Metric | Target | Red Flag | Green Flag |
|--------|--------|----------|------------|
| Registration → Attendance | 65-75% | <50% (your pre-event emails or targeting are off) | >80% |
| Attendee → Free Signup (in room) | 80-90% | <60% (your live signup process is broken) | >90% |
| Free Signup → Active (used playground) | 40-50% | <25% (product friction or unclear next step) | >60% |
| Active → Paid (within 30 days) | 10-15% | <5% (pricing, value prop, or follow-up issue) | >20% |
| **End-to-end: Attendee → Paid** | **5-10%** | **<3% (fundamental model problem)** | **>12%** |

**What These Numbers Mean for Your Goals**:

To hit $5K MRR ($5,000/month) at $49/month Pro plan:
- Need ~102 paying users
- At 7.5% end-to-end conversion: need ~1,360 workshop attendees total
- At 20 attendees/workshop: need ~68 workshops total
- Over 12 months: ~5.7 workshops/month

To hit $5K MRR more realistically (workshops + organic + referrals):
- Workshops generate ~60% of signups, organic/referral generate ~40%
- Need ~816 workshop attendees (40 workshops over 12 months, 3-4/month)
- This is ambitious but achievable at ~1/week pace by month 6-8

**Validation Checkpoints**:
- After 3 workshops: If attendance is consistently <10 people, revisit venue/promotion strategy
- After 5 workshops: If end-to-end conversion is <3%, investigate (is the product confusing? is the follow-up sequence not sending? is the pricing wrong?)
- After 10 workshops: If end-to-end conversion is 5-10%, the model is validated — focus on scaling
- If end-to-end conversion is >12%, you have product-market fit — accelerate immediately

---

## 4. WORKSHOP PRICING STRATEGY

### Decision Framework

**When to Do FREE Workshops**:
1. **Your first 5 workshops** — Always free. You are refining the curriculum, building confidence, collecting testimonials, and learning what works. Charging before you have proof is premature optimization. *Budget impact: $55-$100 in materials across 5 workshops.*
2. **Libraries and community centers** — Always free. They will not promote paid events. The trade is their audience (15-30 people + email addresses) for your time (2 hours including travel/setup).
3. **When a venue is new to you** — First workshop at any new venue type should be free. Prove value, then negotiate paid.
4. **Strategic lead gen events** — When you are specifically trying to fill a pipeline for corporate workshops or consulting. Free public workshop → attendees mention you to their boss → corporate gig at $1,000+.

**When to Charge and How Much**:

| Price | Format | Justification | When to Use |
|-------|--------|---------------|-------------|
| **Free** | 60-min AI Tasting | Lead generation | Libraries, first 5 workshops, new venues |
| **$29** | 90-min Build | Low barrier, covers materials | Meetup groups, community events, price-sensitive audiences |
| **$49** | 90-min Build | Standard rate after proof | Coworking spaces, Eventbrite, established brand |
| **$99** | Half-day Intensive | Premium, includes materials/certificate | Chambers of Commerce, professional groups |
| **$149-$199** | Half-day Intensive | High-value audience | Business associations, corporate-adjacent groups |
| **$500-$2,000** | Private/Corporate | Per-group, customized content | Companies, teams, orgs booking you directly |

---

### Revenue Math: Workshop Revenue as a Standalone Stream vs. Loss Leader

**Scenario A: Workshops as Loss Leader (Recommended for Year 1)**

Focus: maximize attendees and signups, not workshop revenue.

| Item | Monthly | Annual |
|------|---------|--------|
| Free workshops | 2/month | 24/year |
| Paid workshops ($49 avg) | 2/month × 12 attendees = $1,176/mo | $14,112/year |
| Materials cost | -$100/mo | -$1,200/year |
| Venue costs | -$50/mo (avg) | -$600/year |
| **Net workshop revenue** | **~$1,026/mo** | **~$12,312/year** |
| SaaS conversions from workshops | ~5 new paid/month × $49 = $245 MRR added/mo | ~$17,640 total MRR by month 12 |

Year 1 total from workshops (direct + SaaS): ~$12,312 + $17,640 = ~$29,952

**Scenario B: Workshops as Premium Revenue Stream (Year 2+)**

Once you have proof, testimonials, and demand:

| Item | Monthly | Annual |
|------|---------|--------|
| Free workshops | 1/month | 12/year |
| Paid workshops ($79 avg) | 4/month × 15 attendees = $4,740/mo | $56,880/year |
| Corporate workshops ($1,500 avg) | 1/month | $18,000/year |
| Materials cost | -$200/mo | -$2,400/year |
| Venue costs | -$100/mo | -$1,200/year |
| **Net workshop revenue** | **~$5,940/mo** | **~$71,280/year** |

---

### Cost Calculation Per Workshop

| Cost Item | Free Workshop | $49 Workshop | $99 Intensive |
|-----------|--------------|--------------|---------------|
| Handouts/workbooks | $8 | $8 | $90 (12-page workbook) |
| Name tags | $3 | $3 | $8 |
| Snacks/coffee | $0 | $0 | $45 |
| Certificates | $0 | $0 | $12 |
| Venue fee | $0 (library) | $0-$100 | $0-$200 |
| Travel (gas, parking) | $10 | $15 | $20 |
| Your time (valued at $50/hr) | $100 (2hr) | $150 (3hr) | $300 (6hr) |
| **Total cost** | **$21 + your time** | **$26-$126 + time** | **$175-$375 + time** |
| **Revenue** | $0 | $588-$735 | $1,485-$2,985 |
| **Net (excluding your time)** | -$21 | $462-$709 | $1,110-$2,810 |

**Why the "your time" calculation matters**: At $50/hour (a modest rate for a skilled educator), a free 60-minute workshop "costs" you $100 in opportunity cost. But if 20 attendees generate 2 paid users at $49/month, that is $98/month in perpetuity. Payback in 1 month. By month 12, that single free workshop has generated $1,176. The ROI on your time is 1,076%. This is why free workshops are not charity — they are your highest-ROI marketing channel.

---

### Corporate/Group Workshop Pricing

**Private workshop pricing formula**: $500 base + $75/attendee (for groups of 5-20). Includes customized content for their industry, follow-up support, and team accounts.

| Group Size | Price | Per-Person Cost |
|------------|-------|-----------------|
| 5 | $875 | $175 |
| 10 | $1,250 | $125 |
| 15 | $1,625 | $108 |
| 20 | $2,000 | $100 |

**How corporate deals happen**: They almost never come from cold outreach. They come from:
1. An attendee at a free/public workshop who tells their boss
2. A Chamber of Commerce contact who recommends you to a member company
3. A LinkedIn post about your workshop that gets reshared
4. Your website "Book a Private Workshop" page (create this)

Budget $0 for corporate sales outreach. Focus on doing great public workshops and the corporate deals will emerge organically.

---

## 5. VIRTUAL WORKSHOP STRATEGY

### Why Virtual Matters

Even as an in-person specialist, virtual workshops:
- Remove geographic limitations (your TAM goes from [City] to the entire US)
- Are lower cost (no venue, no travel, no snacks)
- Are more scalable (can handle 30-50 people with the same effort as 15)
- Create recordings for repurposing (course content, YouTube, social clips)
- Serve as top-of-funnel for in-person events ("Come to my next live workshop!")

### Platform Setup

**Recommended Stack**: Luma (registration) + Zoom (delivery) + OBS (optional, for recording quality)

**Zoom Configuration for Workshops**:
- Enable screen sharing (for your demos)
- Enable chat (for questions)
- Enable breakout rooms (for pair exercises in 90-min format)
- Disable participant screen sharing by default
- Enable waiting room (to control start time)
- Record to cloud (for repurposing)
- Virtual background: use a clean, branded background with your logo and URL

Cost: $13/month for Zoom Pro. $0 for Luma free tier.

### Format Differences: Virtual vs. In-Person

| Element | In-Person | Virtual |
|---------|-----------|---------|
| Duration | 60/90/240 min | 45/60/120 min (shorter — screen fatigue) |
| Audience size | 10-20 | 15-50 (can go larger since less individual help) |
| Participation | Hand raising, shout-outs, walking around | Chat, polls, breakout rooms, "unmute and share" |
| Energy management | Natural — you read the room | Harder — use polls every 10 min, name people directly |
| Live signup | QR code scan on phone | Drop link in chat, "everyone click this now" |
| Show & tell | Volunteer shares screen | Volunteer shares screen or pastes playground link in chat |
| Materials | Physical handouts | PDF workbook sent pre-event + in chat |
| Follow-up | Email sequence | Same email sequence + recording access |

### Virtual Engagement Tactics

1. **Poll every 10 minutes**: "Quick poll — have you ever used ChatGPT? Yes / No / What's ChatGPT?" Keeps attention and gives you data.
2. **Name-call for interaction**: "Sarah, you mentioned in registration that you run a pet grooming business — would you share what question your customers ask most often?"
3. **Chat waterfall**: "Everyone type in the chat: what's the #1 task you want to automate? Type it but DON'T hit enter until I say go. Ready? GO." This creates a simultaneous flood of responses that feels energetic.
4. **Breakout rooms for pair work**: 5-minute breakout rooms with 2-3 people each for the "design your agent" exercise. Give clear instructions BEFORE sending them to rooms.
5. **"Show me your screen" volunteer**: Ask someone to share their screen while building. Coach them live. The audience learns from watching someone else struggle and succeed.

### Recording and Repurposing Plan

Every virtual workshop should be recorded (with attendee consent, announced at start).

**Repurposing pipeline**:
1. **Full recording** → Gate behind email signup on your website ("Watch our latest workshop — enter your email")
2. **3-5 minute clips** → Social media content (the live demo, a great Q&A answer, the "aha moment")
3. **Key slides** → Carousel posts for LinkedIn/Instagram
4. **Q&A section** → FAQ page on your website
5. **Testimonial moments** → "Here's what [Name] said after building their first agent" clips

Tools for editing: Descript ($24/mo — AI-powered video editing, auto-captions, easy clipping). Alternative: CapCut (free).

Budget: Zoom $13/mo + Descript $24/mo = $37/month for the entire virtual workshop + content operation.

### Hybrid Model

Run in-person workshops with a Zoom link for remote attendees. This is harder than it sounds because:
- You need a camera pointed at you + a screen share running simultaneously
- Remote attendees feel like second-class citizens unless you actively engage them
- Audio quality for remote attendees is often bad

**Recommendation**: Do NOT do hybrid in Year 1. Pick one format per event. Run in-person workshops for local audiences and virtual workshops for broader audiences. Hybrid adds complexity without proportional value when you are solo.

---

## 6. SCALING WORKSHOPS

### Phase 1: Solo Operation (Months 1-6) — 1-4 Workshops/Month

You run everything. Target: 1/week by month 4.

**Monthly schedule template**:
- Week 1: Free 60-min at a library (lead gen)
- Week 2: Paid 90-min at a coworking space (revenue + conversions)
- Week 3: Virtual 60-min via Zoom/Luma (geographic expansion)
- Week 4: Prep/admin/outreach week (no workshop — recharge and book next month)

Time investment: ~8-10 hours/week (including prep, delivery, travel, follow-up).

### Phase 2: Optimized Solo (Months 6-12) — 4-6 Workshops/Month

By now you have: refined curriculum (minimal prep), established venue relationships (they reach out to you), email sequences automated (ConvertKit/Mailchimp handles follow-up), and enough testimonials for marketing.

Add:
- Second virtual workshop per month (Thursday evening, targeting East Coast)
- Corporate workshops as they emerge (1-2/month is realistic)
- Recorded workshop sold as self-paced course ($29-$49, passive income)

Time investment: ~12-15 hours/week. This is the limit before burnout as a solo founder.

### Phase 3: Leverage (Year 2) — 6-10+ Workshops/Month

**Train-the-Trainer Model**:

You cannot run 10 workshops/month alone. You need teaching partners.

**How to find them**:
1. Your best workshop attendees who are enthusiastic and articulate
2. Local tech educators, community college adjuncts, retired professionals
3. Post on LinkedIn: "I'm looking for workshop facilitators who love teaching and want to learn about AI"

**Licensing structure**:
- You provide: curriculum, slides, workbooks, training, ongoing support, platform access
- They provide: their time, their local network, their venue relationships
- Revenue split: They keep 60% of workshop ticket revenue. You keep 40% + all SaaS subscription revenue generated from their workshops.

**Training program**:
1. Facilitator attends 2 of your workshops as an observer
2. Facilitator co-teaches 1 workshop with you
3. Facilitator solo-teaches 1 workshop with you observing (and giving feedback after)
4. Facilitator is certified and can run independently

Cost: Your time (4 workshops × 3-4 hours = 12-16 hours to train one facilitator). No cash cost.

**Recorded/Self-Paced Version**:

Record your best 90-minute workshop. Edit into a structured course:
- Module 1: What Are AI Agents? (15 min)
- Module 2: The 3 Questions Framework (10 min)
- Module 3: Build Your First Agent (25 min, screen recording with voiceover)
- Module 4: Level Up Your Agent (20 min)
- Module 5: Your AI Strategy (10 min)

Sell for $29-$49 on your website or Gumroad. This generates passive income and serves as the "pre-work" for your live intensives.

Platform: Gumroad ($0 to start, 10% transaction fee) or your own website with Stripe.

Budget: $0-$24/month (Descript for editing). Revenue potential: 5-20 sales/month × $39 = $195-$780/month passive.

---

## 7. POST-WORKSHOP 30-DAY NURTURE SEQUENCE

This builds on the 7-day sequence from Section 3 and extends through day 30.

**Sending Tool**: ConvertKit ($29/month for up to 1,000 subscribers) or Mailchimp (free up to 500 contacts). ConvertKit is recommended for its automation builder and tagging.

**Segmentation**: Tag contacts as "workshop-attendee" and track who opened the account, who activated (used playground), and who upgraded. Tailor later emails accordingly.

---

### Complete 30-Day Sequence

| Day | Subject Line | Send Time | Content Summary | Goal |
|-----|-------------|-----------|-----------------|------|
| 0 (same day) | Your AI agent is waiting for you | 2-3 hrs post | Thanks, 3 challenges, workshop code, slides link | Re-engage same day |
| 1 | Did your agent surprise you? | 10am | Tip: add more rules, ask for reply | Drive product usage |
| 3 | "I saved 6 hours this week" | 10am | Case study, embed guide, code reminder | Social proof + feature education |
| 4 | What 500+ integrations means for you | 10am | Integration examples by business type | Feature awareness |
| 5 | Your workshop discount expires tomorrow | 10am | Urgency, step-by-step to upgrade | Conversion push |
| 7 | Last call (+ a free alternative) | 10am | Three options: free, community, Pro | Final offer + no-pressure alternative |
| 10 | Quick question (not selling anything) | 10am | "How's your agent doing?" Ask for feedback | Re-engagement + testimonial collection |
| 14 | What other people built this month | 10am | 3 short case studies from other attendees | Social proof + inspiration |
| 17 | The one feature most people miss | 2pm | Highlight an underused feature (knowledge bases or missions) | Feature discovery |
| 21 | Free AI Office Hours this [Day] | 10am | Invite to monthly group Q&A session (Zoom, free) | Community building + re-engagement |
| 25 | Your agent after 25 days — a check-in | 10am | "Are you still using Charlie?" Three options: (1) Yes, tell me more, (2) No, here's why, (3) What agent? Quick win suggestion. | Win-back or upsell |
| 30 | One last thing + a gift | 10am | "Here's a free [resource: checklist, template, or mini-guide]. Whether you use Teach Charlie or not, this will help your business with AI." Soft CTA to upgrade. | Goodwill close + long-term relationship |

---

### Detailed Content for Later Emails

**Day 14 — "What other people built this month"**

Subject: What other people built this month

> Hi [First Name],
>
> I love seeing what people build after workshops. Here are three from this month:
>
> **1. Lisa — Wedding Planner** — Built an agent that answers venue questions for couples browsing her website. She said: "I used to spend 2 hours every evening replying to the same 10 questions. Charlie handles them now."
>
> **2. Marcus — IT Consultant** — Built an internal FAQ agent for his team of 6. New hires can ask Charlie about company policies, tool setup, and procedures. "It's like having an onboarding buddy that never gets tired."
>
> **3. Priya — Etsy Shop Owner** — Built a product recommendation agent. Customers describe what they're looking for and Charlie suggests items from her catalog. "My conversion rate went up because people find what they want faster."
>
> What could YOU build next? Log in and try: [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> [Your Name]

---

**Day 17 — "The one feature most people miss"**

Subject: The one feature most people miss

> Hi [First Name],
>
> Most people build their agent, test it in the playground, and stop there. But there's a feature that makes Charlie 10x more useful: **Knowledge Sources**.
>
> Here's the idea: instead of typing rules one by one, you can upload an entire document — your FAQ page, your product catalog, your employee handbook — and Charlie instantly knows everything in it.
>
> How to do it:
> 1. Log in → Open your agent → Click "Edit"
> 2. Scroll to "Knowledge Sources"
> 3. Paste text, upload a file, or enter a URL
> 4. Save → Test in the playground
>
> The difference is dramatic. An agent with a good knowledge base can answer questions you never even thought to program.
>
> Try it this week: [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> [Your Name]

---

**Day 21 — "Free AI Office Hours"**

Subject: Free AI Office Hours this [Day] — you're invited

> Hi [First Name],
>
> I'm hosting a free, 45-minute "AI Office Hours" session on [Date] at [Time] via Zoom.
>
> It's open to anyone who's attended a workshop. Bring your questions, your agent, or just your curiosity. I'll be there to help, demo new features, and answer anything.
>
> **Register here**: [Luma/Zoom link]
>
> Last month we had 12 people and covered everything from "How do I make Charlie stop being too formal?" to "Can I connect Charlie to my CRM?" Great energy.
>
> Hope to see you there!
>
> [Your Name]

*Why this matters*: Monthly Office Hours is the lowest-effort community-building activity you can run. 45 minutes on Zoom, no slides needed, just answer questions. It re-engages dormant users, surfaces product feedback, and creates a sense of belonging that reduces churn.

---

**Day 25 — "Your agent after 25 days"**

Subject: Your agent after 25 days — a check-in

> Hi [First Name],
>
> It's been 25 days since you built your first AI agent. I'm curious where things stand.
>
> **Option A**: "I'm using Charlie regularly and want to do more" → [Reply "MORE" and I'll send you advanced tips]
>
> **Option B**: "I haven't logged in since the workshop" → [Reply "STUCK" and I'll help you get unstuck — no judgment]
>
> **Option C**: "What agent?" → [Reply "REMIND ME" and I'll send you a quick recap + your login link]
>
> No wrong answers. Just trying to be helpful.
>
> [Your Name]

*Why three options work*: People are more likely to respond when given structured choices. Each response tells you something: "MORE" people are upsell candidates, "STUCK" people need onboarding help (product issue), "REMIND ME" people may need a different nurture approach.

---

**Day 30 — "One last thing + a gift"**

Subject: One last thing (+ a free gift)

> Hi [First Name],
>
> This is my last scheduled email from the workshop series. (You'll still get our monthly newsletter if you want it — unsubscribe anytime.)
>
> I wanted to leave you with something useful regardless of whether you use Teach Charlie:
>
> **Free Download: "The Small Business AI Starter Kit"**
> → [Link to PDF/Google Doc]
>
> It includes:
> - 20 AI use cases for small businesses (with examples)
> - A "Which AI tool should I use?" decision tree
> - 10 prompts that actually work (tested, not generic)
> - A 30-day AI adoption plan
>
> This took me weeks to put together. It's free. No strings.
>
> If you ever want to come back to Teach Charlie, your agent is still there waiting: [app.teachcharlie.ai](https://app.teachcharlie.ai)
>
> It's been a pleasure. Talk soon.
>
> [Your Name]

*Why end with a gift*: Reciprocity is the most powerful conversion tool. Giving something valuable with no strings makes people feel indebted. Some will come back and upgrade months later because of this email. The "AI Starter Kit" also positions you as a thought leader, not just a product vendor.

---

## RISK MITIGATION

### Risk: Nobody Shows Up

**Prevention**:
- Confirm registrations 48 hours before with email/SMS
- Over-register by 40% (if you want 15 attendees, accept 25 registrations)
- For free events, expect 60-70% show rate. For paid, 80-90%.
- Post on social media 7 days, 3 days, and day-of
- Ask venue to promote to their community (libraries and coworking spaces have email lists)

**If it happens**:
- 5-8 people: Run the workshop. Smaller groups often have better energy and deeper conversations. Adjust — skip the show-and-tell, go deeper on individual help.
- 2-4 people: Run it as an informal session. Drop the slides, go conversational. "Since it's a small group, let's make this a hands-on working session."
- 0-1 people: Cancel gracefully. Email registrants: "We're rescheduling to [date] to ensure a great group experience." Do NOT feel demoralized — this happens to everyone, including professional speakers.

### Risk: Conversion Rate is Below 5%

**Diagnosis**:
1. Are people signing up in the room? If no → fix the live signup process (QR code too small? Wi-Fi broken? Clerk signup broken?)
2. Are people activating (using the playground)? If no → product onboarding is broken. Watch someone try to use the product for the first time and note every confusion point.
3. Are activated users upgrading? If no → free plan may be too generous, or Pro value prop is not compelling enough, or follow-up emails are not reaching them.

**Fixes in order of impact**:
1. Add a "pair exercise" where attendees test each other's agents — this doubles engagement and activation.
2. Offer a 14-day Pro trial instead of a discount code — people who experience Pro features are more likely to stay.
3. Extend the follow-up sequence from 7 days to 30 days (already covered above).
4. Add a post-workshop "Quick Win" challenge: "Embed your agent on your website this week and send me a screenshot — I'll feature you in our newsletter."

### Risk: Venue Says No

**Response**: "Thank you — I completely understand. Would you be open to me reaching out again in [3 months/next quarter]? And if you know of any other venues in the area that host community programs, I'd appreciate any referrals."

Never burn bridges. Libraries and coworking spaces have staff turnover. The person who says no today may be replaced by someone who says yes in 6 months. Keep a CRM spreadsheet of all venue contacts, their response, and the follow-up date.

### Risk: Technical Failure During Live Demo

**Prevention**:
- Test app.teachcharlie.ai 2 hours before every workshop
- Have a screen recording of the demo saved as an MP4 on your desktop
- Have a backup hotspot for Wi-Fi
- Have a second browser tab with the playground already open and working

**If it happens**:
- Switch to the backup video: "Let me show you a recording I made — same thing, just recorded earlier when the Wi-Fi was cooperating." Smile. Keep going.
- If the whole platform is down: pivot to a whiteboard/slideshow walkthrough of the concept, collect emails, and email everyone a "try it now" link the next day. "The AI gods are testing us today — but here's the good news: you'll all get a free Pro trial as an apology."

### Risk: Burnout at 4+ Workshops/Month

**Prevention**:
- Block one week per month as "no workshops" for prep, admin, and rest
- Systemize everything: templates for emails, checklists for setup, automated follow-up sequences
- Batch content creation: record one virtual workshop and repurpose for 4 weeks of social content
- Hire a VA for $500/month by month 6 to handle registration, email entry, and follow-up admin (consider international VAs on Belay or Time Etc for $15-25/hour)

**If it happens**:
- Cut back to 2 workshops/month. Revenue will dip but sustainability matters more.
- Accelerate the train-the-trainer program.
- Shift more effort to virtual (lower energy cost than in-person travel + setup).

---

## BUDGET SUMMARY

### Monthly Workshop Budget (First 6 Months)

| Item | Cost | Notes |
|------|------|-------|
| Zoom Pro | $13/mo | Virtual workshops |
| ConvertKit | $29/mo | Email sequences (free tier works for <500 contacts) |
| Printing (handouts, workbooks) | $30-$60/mo | Staples/FedEx, depends on volume |
| Snacks (intensives only) | $0-$45/mo | Only for premium workshops |
| Travel | $20-$40/mo | Gas, parking |
| Descript (optional) | $24/mo | Video editing for repurposing |
| **Total** | **$116-$211/mo** | Within $100-$500 budget |

### One-Time Purchases

| Item | Cost |
|------|------|
| HDMI/USB-C adapter | $15 |
| Bluetooth presenter/clicker | $20 |
| Extension cord + power strip | $25 |
| QR code stand (acrylic) | $12 |
| Business cards (250) | $20 |
| Portable Wi-Fi hotspot | $35 (first month; $35/mo after — cancel when not needed) |
| **Total** | **$127** |

### Revenue Targets by Month

| Month | Workshops | Type Mix | Workshop Rev | New MRR Added | Cumulative MRR |
|-------|-----------|----------|--------------|---------------|----------------|
| 1 | 2 | 2 free | $0 | $49 | $49 |
| 2 | 3 | 2 free + 1 paid ($49) | $588 | $98 | $147 |
| 3 | 3 | 1 free + 2 paid | $1,176 | $147 | $294 |
| 4 | 4 | 1 free + 3 paid | $1,764 | $196 | $490 |
| 5 | 4 | 1 free + 3 paid | $1,764 | $196 | $686 |
| 6 | 5 | 1 free + 3 paid + 1 intensive ($99) | $3,249 | $294 | $980 |
| 7 | 5 | Same | $3,249 | $294 | $1,274 |
| 8 | 6 | 1 free + 3 paid + 1 intensive + 1 virtual | $3,837 | $343 | $1,617 |
| 9 | 6 | Same + 1 corporate ($1,000) | $4,837 | $392 | $2,009 |
| 10 | 7 | 1 free + 4 paid + 1 intensive + 1 virtual | $4,425 | $441 | $2,450 |
| 11 | 7 | Same + 1 corporate ($1,500) | $5,925 | $490 | $2,940 |
| 12 | 8 | Full mix + 1 corporate | $6,513 | $539 | $3,479 |

**Year 1 Totals (Conservative)**:
- Workshop ticket revenue: ~$37,327
- Cumulative SaaS MRR at month 12: ~$3,479/month
- Total workshops delivered: ~60
- Total attendees (20 avg): ~1,200
- Total email list: ~1,000+ (including registrants who did not attend)

**Year 1 Totals (Optimistic — higher conversion, organic growth, referrals)**:
- Workshop ticket revenue: ~$45,000
- Cumulative SaaS MRR at month 12: ~$5,000-$7,000/month
- Hit $5K MRR target by month 10-12

---

## EXECUTIVE SUMMARY: YOUR FIRST 90 DAYS

**Days 1-30: Foundation**
- Finalize the 60-minute curriculum (practice 3 times at home with a timer)
- Book 2 library workshops for Month 2
- Book 1 coworking space workshop for Month 2
- Set up ConvertKit with the 30-day email sequence
- Print first batch of handouts
- Create the registration form (Luma or Eventbrite)
- Record backup demo video

**Days 31-60: First Workshops**
- Deliver first 2-3 workshops
- Collect feedback after each (verbal + email survey: "What was most valuable? What was confusing? Would you recommend this to a friend?")
- Iterate the deck based on feedback
- Book 3-4 workshops for Month 3
- Start the 90-minute format at a coworking space
- Post about each workshop on LinkedIn (photo + 3 key takeaways)

**Days 61-90: Optimization**
- Analyze conversion data: how many attendees signed up? How many activated? How many upgraded?
- Refine follow-up email sequence based on open/click rates
- Approach 2-3 Chambers of Commerce about the intensive format
- Run first virtual workshop (test the format)
- Start collecting testimonials (ask your best attendees for a 2-sentence quote)
- Create "Book a Private Workshop" page on your website

**By Day 90, you should have**:
- 5-8 workshops completed
- 75-150 email addresses collected
- 30-60 free account signups
- 3-8 paid subscribers ($147-$392 MRR)
- 2-3 venue partnerships established
- A repeatable, improving system

This is the engine that drives everything else. Build it first, build it right, and it will compound for years.

---

# Teach Charlie AI — Pricing & Monetization Strategy

## Executive Summary

After analyzing the current pricing structure, competitive landscape, infrastructure economics, and target market, the single biggest finding is this: **the current $19/mo price point is strategically dangerous**. It sits in the "uncanny valley" of SaaS pricing — too close to ChatGPT Plus ($20/mo) to feel differentiated, yet positioned against a product with fundamentally different value delivery. The core recommendation is to restructure around a $29/mo anchor price, introduce a concrete $49/mo Pro tier (replacing the vague "Custom" Business tier), and simplify the credit system dramatically.

The single biggest pricing risk: **the credit system's complexity will suppress conversion among the exact non-technical audience you are targeting.** Every additional cognitive step between "I want this" and "I'm paying for this" reduces conversion by 5-15% for non-technical buyers.

---

## 1. Current Pricing Analysis

### 1.1 Free Tier Assessment

**Current Free Tier**: 1 agent, 1K test runs/mo, preview canvas, 5 knowledge files, 3 starter missions.

**Verdict: Slightly too generous on runs, slightly too restrictive on agents.**

The 1K test runs per month is a meaningful allocation. At roughly 1 credit per message exchange, a user can have approximately 33 conversations of 30 messages each — enough to build a legitimately useful agent and show it to others. This is good for demonstrating value but creates a problem: many small business owners with light usage will never hit the ceiling.

The 1-agent limit is the correct primary gate. However, 5 knowledge files is generous enough that a user can build a reasonably capable RAG agent without paying. The 3 starter missions is well-calibrated — it teaches enough to create desire for more.

**Benchmark Comparison**:

| Platform | Free Tier | Primary Gate |
|----------|-----------|--------------|
| Botpress | 5 bots, 2K messages/mo | Message volume |
| Voiceflow | 2 projects, limited | Feature depth |
| Zapier | 5 zaps, 100 tasks/mo | Task volume |
| Teach Charlie (current) | 1 agent, 1K runs | Agent count + volume |
| **Teach Charlie (recommended)** | **2 agents, 500 runs** | **Volume (tighter)** |

**Recommendation**: Change the Free tier to **2 agents, 500 test runs/mo, 3 knowledge files, 3 missions, watermarked embed only**.

**Why 2 agents instead of 1**: Non-technical users need to experiment. The first agent is often a throwaway learning exercise. The second is the one they actually care about. If they only get one, they either (a) feel stuck with a bad first attempt, or (b) delete and recreate, losing confidence. Two agents lets them feel the platform's value while still gating scale.

**Why 500 runs instead of 1,000**: 500 runs is still enough to build and demonstrate an agent (16-17 conversations of 30 messages). But it creates a tighter window. A user running a workshop demo or showing their agent to 5 colleagues will burn through 500 runs in 2-3 days of active use, creating natural upgrade pressure.

**Why 3 knowledge files instead of 5**: Three files is enough for a proof of concept but not enough for a production agent. This creates the precise moment of friction where the user thinks "I need to add my FAQ document too" and hits the wall.

**Risk if wrong**: If the free tier is too restrictive, top-of-funnel volume collapses. Workshop attendees who cannot meaningfully use the product after a session will churn before converting. The 2-agent / 500-run configuration preserves the workshop use case while tightening the upgrade path.

### 1.2 The $19/mo Problem

**Current**: $19/mo for Individual tier.

**Verdict: This price should be $29/mo.** Here is why:

**Problem 1 — ChatGPT Plus Anchoring**: At $19/mo, the buyer's brain immediately compares to ChatGPT Plus at $20/mo. This is catastrophic because:
- ChatGPT is a known brand with massive trust
- The $1 difference feels negligible, so the comparison becomes pure feature-vs-feature
- ChatGPT Plus gives access to GPT-4, DALL-E, browsing, plugins — a breadth of capability that makes any vertical tool feel narrow by comparison
- The buyer thinks: "For $1 more I get ChatGPT, which does everything"

**Problem 2 — Value Perception**: Pricing research (Van Westendorp, Gabor-Granger) consistently shows that for B2B-adjacent tools, prices below $25/mo signal "toy" or "side project." The target audience — small business owners — is accustomed to paying $29-$99/mo for business tools (Mailchimp, Canva Pro, Squarespace). A $19 price point signals consumer-grade, not business-grade.

**Problem 3 — Revenue Math**: At $19/mo, you need 263 paying users to hit $5K MRR. At $29/mo, you need 173. That is 90 fewer users — a 34% reduction in the sales/marketing burden on a solo founder.

**Comparable Pricing Evolution**:

| Company | Initial Price | Adjusted To | Rationale |
|---------|-------------|-------------|-----------|
| Jasper AI | $29/mo | $49/mo | Moved upmarket, signaled professional tool |
| Canva | $12.99/mo | $14.99/mo | Gradual increases with feature additions |
| Notion | $4/mo | $10/mo | Doubled price, added team features |
| Carrd | $19/yr | $49/yr | Added Pro tiers, kept entry low |

**Recommendation**: Price the Individual tier at **$29/mo ($276/yr at 20% discount = $228/yr)**.

**Positioning Copy**: "Less than $1/day to have an AI agent working for your business 24/7." At $29/mo, you are at $0.97/day — you can legitimately use the "less than a dollar a day" framing that performs well with SMB buyers.

**Risk if wrong**: Some price-sensitive users (particularly workshop attendees in lower-income markets) may balk at $29. Mitigation: offer a 14-day free trial of the paid tier, and use workshop-specific discount codes ($19/mo for first 3 months) to bridge the gap.

### 1.3 Business Tier: Kill "Custom," Ship Concrete Pricing

**Current**: "Custom pricing" for Business tier.

**Verdict: "Custom" is wrong for this stage.** Here is the reasoning:

At fewer than 500 users, you do not have:
- A sales team to handle custom pricing conversations
- The operational bandwidth for bespoke negotiations
- Enough data to know what enterprise features are worth
- The brand credibility to command enterprise pricing

"Custom" pricing on a bootstrapped product's pricing page signals one of two things to buyers: (a) "this is going to be expensive" or (b) "this company is too small to have figured out pricing." Neither helps.

**Recommendation**: Replace with a concrete **Pro tier at $49/mo** and an **Enterprise tier at $149/mo**.

**Recommended Tier Structure**:

| Feature | Free | Builder ($29/mo) | Pro ($49/mo) | Enterprise ($149/mo) |
|---------|------|-------------------|--------------|----------------------|
| Agents | 2 | 10 | Unlimited | Unlimited |
| Test runs/mo | 500 | 5,000 | 25,000 | 100,000 |
| Knowledge files | 3 | 50 | 200 | Unlimited |
| Missions | 3 starter | Full library | Full library | Full + custom |
| Canvas editor | Preview only | Full editor | Full editor | Full editor |
| Embed widget | Watermarked | Branded | White-label | White-label |
| Team members | 1 | 1 | 5 | Unlimited |
| API access | No | Limited | Full | Full |
| Priority support | No | Email | Email + chat | Dedicated |
| SSO/SAML | No | No | No | Yes |
| Audit logs | No | No | Basic | Full |
| Custom domain | No | No | Yes | Yes |
| Monthly credits included | 500 | 2,000 | 10,000 | 50,000 |

**Why $49/mo for Pro**: This captures the small agency or power user who needs team features and higher volume but is not an enterprise. The jump from $29 to $49 is psychologically easy (it is "only $20 more" for 5x the runs and team seats). This tier will likely become the revenue workhorse.

**Why $149/mo for Enterprise**: This replaces "Custom" with a concrete number. $149/mo is low enough that a department head can expense it without procurement approval at most companies (the typical "no-approval-needed" threshold is $150-$500/mo). It is high enough to signal professional-grade. If actual enterprise customers need more, you can negotiate from $149 upward — a much better position than negotiating from "Custom" into a void.

**Risk if wrong**: The $149 Enterprise tier may be too low if you attract genuine enterprise customers early. Mitigation: position it as "Early Adopter Enterprise Pricing" and reserve the right to increase for new customers after the first 50 sign-ups.

### 1.4 Gap Analysis Summary

**Before (current)**:
```
Free → $19/mo → ??? Custom
Gap: $0 to $19 (small), $19 to ??? (infinite)
```

**After (recommended)**:
```
Free → $29/mo → $49/mo → $149/mo
Gap: $0 to $29 (reasonable), $29 to $49 (easy upsell), $49 to $149 (enterprise signal)
```

The recommended structure creates a natural **escalation ladder** where each step up is justified by a concrete capability unlock (team seats, white-label, SSO) rather than abstract "more of the same."

---

## 2. Credit System Optimization

### 2.1 Complexity Assessment

**Current credit packs**: 2,000/$10, 5,500/$25, 12,500/$50.

**Verdict: The dual subscription + credits model is too complex for this audience.** Here is the evidence:

The target user is a non-technical small business owner or marketer. This person's mental model of software pricing is:
- "I pay $X/month and I get the thing" (Netflix model)
- "I pay per use" (AWS model, but they do not like it)
- They do NOT naturally understand "I pay $X/month AND I buy credit packs AND I can bring my own API key as an alternative"

Every SaaS that has tried hybrid subscription + credits with non-technical users has either:
1. Simplified to pure subscription (Jasper, Copy.ai)
2. Simplified to pure usage (OpenAI API)
3. Kept both but buried credits behind the subscription (Midjourney)

**The cognitive load calculation**: To understand Teach Charlie's current pricing, a user must comprehend:
- What a "test run" is and how many they need
- That runs are included in subscription but can also be bought
- What credits are and how they differ from runs
- That BYO API key changes the economics
- Credit pack volume discounts

That is 5 distinct concepts. Research from the Ehrenberg-Bass Institute shows that non-expert buyers can hold 2-3 pricing concepts before experiencing decision fatigue and abandoning.

### 2.2 Credit-to-Cost Mapping

Let us examine the actual economics. Based on current LLM API pricing (as of early 2026):

**OpenAI GPT-4o** (most likely model for agent builders):
- Input: ~$2.50 per 1M tokens
- Output: ~$10.00 per 1M tokens
- Average conversation turn: ~500 input tokens + ~300 output tokens
- Cost per turn: ~$0.00425
- Cost per 30-turn conversation: ~$0.128

**Anthropic Claude 3.5 Sonnet**:
- Input: ~$3.00 per 1M tokens
- Output: ~$15.00 per 1M tokens
- Average conversation turn: ~500 input + ~300 output
- Cost per turn: ~$0.006
- Cost per 30-turn conversation: ~$0.18

**Credit Pack Margin Analysis** (assuming 1 credit = 1 message/turn):

| Pack | Price | Credits | Cost/Credit | Actual LLM Cost/Credit (GPT-4o) | Gross Margin |
|------|-------|---------|-------------|----------------------------------|-------------|
| Small | $10 | 2,000 | $0.005 | ~$0.00425 | 15% |
| Medium | $25 | 5,500 | $0.00455 | ~$0.00425 | 6% |
| Large | $50 | 12,500 | $0.004 | ~$0.00425 | **-6%** |

**Critical finding**: The large credit pack is priced BELOW cost for GPT-4o usage. At $0.004/credit with a $0.00425 actual cost, you are losing $0.00025 per credit — which is $3.13 loss per large pack sold. If users choose Claude 3.5 Sonnet, the loss is even worse ($0.006 actual cost vs $0.004 revenue = $0.002 loss per credit = $25 loss per pack).

The medium pack has razor-thin margins that disappear entirely once you factor in Stripe's 2.9% + $0.30 per transaction:
- $25 pack → $24.28 after Stripe → 5,500 credits at $0.00425 cost = $23.38 cost → $0.90 gross profit (3.6% margin)

**The small pack is the only one with defensible margins**, and even those are thin.

### 2.3 BYO API Key vs Platform Credits: Margin Analysis

**BYO API Key Economics**:
- User pays their own LLM costs directly to OpenAI/Anthropic
- Teach Charlie bears $0 in LLM costs
- User pays subscription only
- Teach Charlie margin on subscription: ~85% (after Stripe + infrastructure)

**Platform Credits Economics**:
- Teach Charlie bears full LLM cost
- Credit revenue must cover LLM cost + margin
- As shown above, margins are 6-15% on small packs, negative on large packs
- Teach Charlie effective margin: 0-15%

**The math is unambiguous**: BYO API key is 5-10x more profitable per user than platform credits.

**However**, there is a strategic tension:
- BYO key requires the user to have an OpenAI/Anthropic account, understand API keys, and manage billing in two places — this is hostile to non-technical users
- Platform credits are simple: "buy credits, use credits" — this is friendly to non-technical users
- The platform credit model creates lock-in; BYO key reduces switching costs

### 2.4 Recommendation: Simplify to Included Credits + Overage

**Kill the separate credit pack store.** Instead:

1. **Each subscription tier includes a monthly credit allocation** (see tier table above: 500/2,000/10,000/50,000)
2. **Overage is billed automatically** at $0.008/credit (which provides ~47% margin on GPT-4o, ~25% margin on Claude)
3. **Users can set a monthly overage cap** ($0, $10, $25, $50, $100) to prevent bill shock
4. **BYO API key is available on Pro and Enterprise tiers** as a "power user" option, with a clear explanation: "Bring your own key to get unlimited usage at your own API cost"

**Why this is better**:
- One concept to understand: "Your plan includes X credits. If you use more, it costs $0.008 each, up to the cap you set."
- No separate credit pack purchasing flow
- Overage pricing provides healthy margins
- BYO key is positioned as an advanced feature, not a default

**Overage pricing justification**: At $0.008/credit, the user pays approximately double the raw LLM cost. This is standard for "managed AI" platforms — Zapier, Relevance AI, and Stack AI all charge 2-3x raw API cost for the convenience of not managing keys.

**Credit visibility best practices**:
- Show remaining credits in the dashboard header (always visible)
- Send email at 80% and 95% consumption
- Show a gentle in-app banner at 90%: "Charlie's been busy this month! You've used 90% of your included credits."
- Never hard-stop a user mid-conversation — allow overage and bill afterward (up to cap)

**Credit rollover**: No rollover. Unused credits expire monthly. This is industry standard (Jasper, Copy.ai, Writesonic all do this). Rollover creates accounting complexity and reduces upgrade urgency.

**Risk if wrong**: Some users may prefer buying credits a la carte. However, the overwhelming evidence from SaaS pricing research is that subscription-included allocations with overage outperform a la carte purchasing for retention and LTV. The rare user who wants a la carte is better served by the BYO key option.

---

## 3. Annual Pricing Strategy

### 3.1 Current Annual Pricing Assessment

**Current**: $180/yr for Individual ($15/mo effective, 21% discount from $19/mo).

**Verdict: The discount percentage is reasonable but the framing is weak, and it should adjust with the new price point.**

Industry benchmarks for annual discount:

| Company | Monthly | Annual | Discount |
|---------|---------|--------|----------|
| Notion | $10/mo | $96/yr ($8/mo) | 20% |
| Canva Pro | $14.99/mo | $119.99/yr ($10/mo) | 33% |
| Jasper | $49/mo | $468/yr ($39/mo) | 20% |
| Grammarly | $30/mo | $144/yr ($12/mo) | 60% |
| Ahrefs | $99/mo | $990/yr ($82.50/mo) | 17% |
| **Average** | | | **25-30%** |

### 3.2 Recommended Annual Pricing

With the new tier structure:

| Tier | Monthly | Annual | Effective Monthly | Discount |
|------|---------|--------|-------------------|----------|
| Builder | $29/mo | $261/yr | $21.75/mo | 25% |
| Pro | $49/mo | $441/yr | $36.75/mo | 25% |
| Enterprise | $149/mo | $1,341/yr | $111.75/mo | 25% |

**Why 25%**: A 25% annual discount is the sweet spot for early-stage SaaS:
- Below 20%: not compelling enough to change behavior (users just pay monthly)
- Above 33%: you are giving away too much cash flow when you need it most
- 25% translates to "get 3 months free" which is a proven framing: **"Pay for 9 months, get 12"**

**Round the annual prices for simplicity**:
- Builder: $261 → **$249/yr** ("Save $99/yr" — round numbers are more memorable)
- Pro: $441 → **$429/yr** ("Save $159/yr")
- Enterprise: $1,341 → **$1,299/yr** ("Save $489/yr")

### 3.3 When to Push Annual

**Do NOT push annual on sign-up.** Here is the lifecycle-optimized approach:

| Stage | Timing | Action |
|-------|--------|--------|
| Sign-up | Day 0 | Show monthly price only. Reduce friction. |
| First value moment | Day 1-7 | Still monthly only. Let them experience the product. |
| Habit formation | Day 14-30 | First mention of annual: "Save 25% — switch to annual?" |
| Renewal approaching | Day 25-28 | Email: "Your first month is almost up. Lock in annual pricing?" |
| Second month | Day 30-60 | In-app banner: "You've been building with Charlie for a month! Go annual and save $99." |
| Ongoing | Monthly | Annual option visible on billing page, not pushed aggressively |

**Behavioral signals that predict annual conversion**:
- User has created 3+ agents (invested in the platform)
- User has connected a knowledge source (deeper integration)
- User has shared an embed link (using it for real work)
- User has logged in on 15+ distinct days in the first month

When these signals fire, trigger an annual pricing offer via in-app notification.

**Risk if wrong**: Pushing annual too early reduces monthly trial starts (users see a bigger number and hesitate). Pushing too late means users who would have committed are already month-to-month by habit.

---

## 4. Upsell Triggers & Upgrade Psychology

### 4.1 Behavioral Triggers That Predict Conversion

Based on analysis of SaaS conversion patterns for tools with similar freemium structures, ranked by predictive power:

**Tier 1 — Strong Conversion Signals (80%+ correlation with upgrade)**:

| Signal | Trigger | Action |
|--------|---------|--------|
| Agent limit hit | User tries to create 3rd agent on Free | Hard gate + upgrade prompt |
| Credit exhaustion | User hits 500 run limit mid-month | Soft gate (show remaining, offer upgrade) |
| Knowledge file limit | User tries to upload 4th file on Free | Hard gate + upgrade prompt |
| Embed sharing | User copies embed code | Upgrade prompt for white-label |

**Tier 2 — Moderate Conversion Signals (50-70% correlation)**:

| Signal | Trigger | Action |
|--------|---------|--------|
| Mission completion | User completes all 3 free missions | Show "Unlock 20+ missions" prompt |
| High engagement | 5+ sessions in 7 days | Subtle annual pricing nudge |
| Agent publishing | User publishes first agent | "Go Pro to remove watermark" prompt |
| Team sharing attempt | User tries to invite a colleague | Gate to Pro tier |

**Tier 3 — Early Intent Signals (30-50% correlation)**:

| Signal | Trigger | Action |
|--------|---------|--------|
| Canvas exploration | User opens full canvas editor | Educational nudge about Pro features |
| API key interest | User views BYO key docs | Route toward Pro tier |
| Export attempt | User tries to export agent config | Gate to Builder tier |

### 4.2 Upgrade Prompt Copy (Actual Notification Text)

**Hard Gate — Agent Limit (Free → Builder)**:

> **Charlie wants to learn new tricks!**
>
> You've built 2 agents on the Free plan — nice work! To create more agents and unlock the full canvas editor, upgrade to Builder.
>
> **Builder — $29/mo**
> - 10 agents
> - 5,000 runs/month
> - 50 knowledge files
> - Full mission library
>
> [Upgrade to Builder] [Maybe Later]

**Soft Gate — Credit Exhaustion (any tier)**:

> **Charlie's been working hard!**
>
> You've used 450 of your 500 included credits this month. When credits run out, Charlie takes a nap until next month.
>
> Want more? Upgrade to Builder for 2,000 monthly credits, or set an overage cap so Charlie never stops working.
>
> [Upgrade Plan] [Set Overage Cap] [I'll Wait]

**Embed Watermark Upsell (Builder → Pro)**:

> **Your agent is live — great work!**
>
> Right now, embedded agents show "Powered by Teach Charlie." Upgrade to Pro to white-label your agent with your own branding.
>
> [Go Pro — $49/mo] [Keep Current Branding]

**Mission Completion Upsell (Free → Builder)**:

> **You've completed all 3 starter missions!**
>
> You've learned the basics of training Charlie. Ready for advanced tricks? The full mission library includes:
> - Building RAG agents with your own documents
> - Connecting to 500+ apps with integrations
> - Creating multi-step workflows
> - Advanced prompt engineering techniques
>
> [Unlock All Missions — $29/mo] [Browse Mission Previews]

**Annual Conversion (Month 2+ of monthly billing)**:

> **You've been building with Charlie for 30 days!**
>
> Switch to annual billing and save $99/year. That's 3 months free.
>
> Monthly: $29/mo ($348/yr)
> Annual: $249/yr ($20.75/mo)
>
> [Switch to Annual] [Stay Monthly]

### 4.3 Soft Paywall vs Hard Paywall Strategy

| Feature | Gate Type | Rationale |
|---------|-----------|-----------|
| Agent creation beyond limit | **Hard** | Primary monetization lever; must convert |
| Knowledge file upload beyond limit | **Hard** | Core feature gate |
| Team member invitation | **Hard** | Clear tier differentiator |
| SSO/SAML | **Hard** | Enterprise-only, high value |
| Credit overage | **Soft** (with cap) | Never interrupt a conversation mid-stream |
| Canvas editor (basic) | **Soft** (preview mode on Free) | Let users see the value before gating |
| Mission library | **Soft** (show locked missions) | Create desire through visibility |
| Embed widget | **Soft** (watermarked on Free/Builder) | Let users share, but brand it |
| Export/import | **Hard** | Prevents "build on free, run elsewhere" |
| API access | **Hard** | Developer feature, high value |
| Analytics dashboard | **Soft** (basic on Free, detailed on paid) | Show the value of data |
| Priority support | **Hard** | Low-cost differentiator |

### 4.4 "Aha Moment" Identification

The "aha moment" is the specific in-product experience after which retention dramatically increases. For agent-builder platforms, based on comparable products:

**Hypothesized Aha Moment**: "The user asks their agent a question using their own uploaded knowledge, and gets a correct, specific answer."

This is the moment where the abstract concept of "AI agent" becomes tangibly valuable. It is no longer a chatbot giving generic responses — it is a chatbot that knows the user's specific business information.

**How to measure**: Track the event `knowledge_query_success` — a chat message that triggers a RAG retrieval and returns a response that the user does NOT regenerate or give negative feedback on.

**How to optimize for it**:
- During onboarding, the 3-step wizard should end with a prompt: "Now upload a document and ask Charlie about it."
- The first mission should guide users through uploading a knowledge file and querying it.
- If a user has created an agent but not uploaded knowledge after 3 days, send an email: "Charlie's ready to learn about your business. Upload your first document."

**Time-to-Aha targets**:
- Goal: User reaches aha moment within first session (< 30 minutes)
- Current estimate: ~15-20 minutes (3-step wizard + knowledge upload + first query)
- If time-to-aha exceeds 45 minutes, conversion will suffer significantly

---

## 5. Revenue Modeling

### 5.1 Assumptions

| Variable | Value | Source |
|----------|-------|--------|
| Free → Paid conversion rate | 3-5% | Industry avg for dev tools (Lenny Rachitsky data) |
| Monthly churn (paid) | 5-8% | Early-stage SaaS norm |
| Monthly churn (annual) | 0.5-1% | Committed users churn less |
| ARPU (blended, monthly payers) | $32-38 | Weighted average across tiers |
| ARPU (blended, all payers incl annual) | $28-35 | Annual discount pulls average down |
| Workshop conversion to Free signup | 60-80% | Captive audience, guided signup |
| Workshop conversion to Paid | 10-20% | Within 30 days of workshop |
| Average credit overage per paying user | $3-8/mo | Based on Jasper/Copy.ai patterns |
| Stripe effective fee | 3.2% | 2.9% + $0.30 on average transaction |

### 5.2 Path to $5K MRR (Pessimistic — Month 8-12)

**Scenario**: Slow organic growth, workshops are primary acquisition channel, word-of-mouth is minimal.

| Metric | Month 1 | Month 3 | Month 6 | Month 9 | Month 12 |
|--------|---------|---------|---------|---------|----------|
| Total free users | 50 | 150 | 350 | 550 | 800 |
| New free users/mo | 50 | 40 | 50 | 60 | 70 |
| Free → Paid conversion | 3% | 3% | 3.5% | 3.5% | 4% |
| New paid users/mo | 2 | 4 | 6 | 7 | 8 |
| Cumulative paid users | 2 | 10 | 28 | 46 | 62 |
| Monthly churn (paid) | 8% | 7% | 6% | 6% | 5% |
| Active paid users (after churn) | 2 | 9 | 24 | 38 | 52 |
| Tier mix: Builder ($29) | 80% | 75% | 70% | 65% | 60% |
| Tier mix: Pro ($49) | 20% | 20% | 25% | 30% | 30% |
| Tier mix: Enterprise ($149) | 0% | 5% | 5% | 5% | 10% |
| Blended ARPU | $33 | $36 | $38 | $40 | $44 |
| **Subscription MRR** | **$66** | **$324** | **$912** | **$1,520** | **$2,288** |
| Credit overage MRR | $6 | $27 | $96 | $190 | $312 |
| Workshop revenue/mo | $0 | $500 | $800 | $1,000 | $1,200 |
| Consulting revenue/mo | $0 | $0 | $500 | $800 | $1,200 |
| **Total MRR** | **$72** | **$851** | **$2,308** | **$3,510** | **$5,000** |

**$5K MRR is reached at approximately Month 12** in the pessimistic scenario, assuming workshops and consulting supplement subscription revenue. Pure subscription MRR does not reach $5K until approximately Month 18.

**Key levers in this scenario**: Workshop frequency (2-3/month), consulting pipeline development, and steady improvement in free-to-paid conversion from 3% to 4%.

### 5.3 Path to $10K MRR (Realistic — Month 9-14)

**Scenario**: Moderate growth with some content marketing, workshop referrals create flywheel, one or two corporate training deals.

| Metric | Month 1 | Month 3 | Month 6 | Month 9 | Month 12 |
|--------|---------|---------|---------|---------|----------|
| Total free users | 80 | 300 | 750 | 1,200 | 1,800 |
| New free users/mo | 80 | 80 | 120 | 150 | 180 |
| Free → Paid conversion | 4% | 4.5% | 5% | 5.5% | 6% |
| New paid users/mo | 3 | 8 | 12 | 15 | 18 |
| Cumulative paid users | 3 | 18 | 55 | 95 | 140 |
| Monthly churn (paid) | 7% | 6% | 5% | 5% | 4.5% |
| Active paid users (after churn) | 3 | 16 | 46 | 78 | 115 |
| Annual subscribers (% of paid) | 0% | 10% | 20% | 25% | 30% |
| Blended ARPU | $33 | $37 | $40 | $42 | $44 |
| **Subscription MRR** | **$99** | **$592** | **$1,840** | **$3,276** | **$5,060** |
| Credit overage MRR | $9 | $48 | $184 | $390 | $690 |
| Workshop revenue/mo | $200 | $1,000 | $1,500 | $2,000 | $2,500 |
| Consulting revenue/mo | $0 | $0 | $800 | $1,500 | $2,000 |
| **Total MRR** | **$308** | **$1,640** | **$4,324** | **$7,166** | **$10,250** |

**$10K MRR is reached at approximately Month 12** in the realistic scenario. Pure subscription MRR (without workshops/consulting) reaches $5K at Month 12 and would reach $10K at approximately Month 18-20.

**Key levers**: Increasing free-to-paid conversion from 4% to 6% (through better onboarding, mission system, and aha moment optimization), growing workshops to 4-5/month, and landing 1-2 corporate training deals.

### 5.4 Path to $25K MRR (Optimistic — Month 12-18)

**Scenario**: Strong product-market fit signal, content marketing hits, workshop waitlists, multiple corporate deals, potential partnership or marketplace listing.

| Metric | Month 1 | Month 3 | Month 6 | Month 9 | Month 12 | Month 18 |
|--------|---------|---------|---------|---------|----------|----------|
| Total free users | 120 | 500 | 1,500 | 3,000 | 5,000 | 10,000 |
| New free users/mo | 120 | 150 | 300 | 450 | 600 | 800 |
| Free → Paid conversion | 5% | 5.5% | 6% | 7% | 7% | 8% |
| Active paid users | 6 | 30 | 90 | 175 | 280 | 500 |
| Blended ARPU | $35 | $39 | $43 | $46 | $48 | $50 |
| **Subscription MRR** | **$210** | **$1,170** | **$3,870** | **$8,050** | **$13,440** | **$25,000** |
| Credit overage MRR | $18 | $120 | $450 | $1,050 | $2,100 | $4,000 |
| Workshop revenue/mo | $500 | $2,000 | $3,000 | $4,000 | $5,000 | $5,000 |
| Consulting revenue/mo | $0 | $500 | $2,000 | $3,000 | $4,000 | $5,000 |
| **Total MRR** | **$728** | **$3,790** | **$9,320** | **$16,100** | **$24,540** | **$39,000** |

**$25K MRR is reached at approximately Month 12** in the optimistic scenario, but this requires aggressive free user acquisition (5,000 total by Month 12) and a 7% conversion rate — both at the high end of reasonable.

**What makes the optimistic scenario possible**:
- A viral content piece or Product Hunt launch drives 1,000+ sign-ups in a single month
- Corporate training deals at $2,000-$5,000 each (2-3 per quarter)
- Workshop waitlists create urgency and social proof
- Partnership with a no-code education platform (Maven, Reforge, etc.)

### 5.5 Revenue Composition at $10K MRR (Realistic)

```
Subscription Revenue:    $5,060  (49%)
Credit Overage:           $690  ( 7%)
Workshops:              $2,500  (24%)
Consulting:             $2,000  (20%)
                       -------
Total MRR:             $10,250  (100%)
```

**Key insight**: In the realistic scenario, pure SaaS subscription revenue is about half of total MRR at the $10K mark. Workshops and consulting are not distractions — they are essential revenue components for a bootstrapped solo founder in Year 1. They also serve as the primary customer acquisition channel, making them doubly valuable.

### 5.6 Infrastructure Cost at Scale

| MRR Level | Estimated Users (Free+Paid) | DigitalOcean | Stripe Fees | Clerk | LLM Costs | Total Infra | Net Margin |
|-----------|---------------------------|-------------|-------------|-------|-----------|-------------|------------|
| $1K | 200 | $75 | $32 | $25 | $80 | $212 | 79% |
| $5K | 800 | $100 | $160 | $35 | $300 | $595 | 88% |
| $10K | 1,800 | $150 | $320 | $50 | $600 | $1,120 | 89% |
| $25K | 5,000 | $300 | $800 | $100 | $1,500 | $2,700 | 89% |

Note: LLM costs assume a blend of platform-served credits and BYO key users. As BYO key adoption increases at higher tiers, LLM cost as a percentage of revenue decreases. SaaS gross margins of 85-90% are excellent and typical for the category.

---

## 6. Workshop Revenue Stream

### 6.1 Workshop Pricing Framework

Workshops serve three functions: (1) direct revenue, (2) customer acquisition, (3) market validation. The pricing should reflect which function is primary at each stage.

**Workshop Types and Pricing**:

| Workshop Type | Duration | Price/Person | Target Size | Revenue | Primary Function |
|--------------|----------|-------------|-------------|---------|------------------|
| Free Intro Webinar | 45 min | $0 | 50-200 | $0 | Lead generation |
| Beginner Workshop | 2 hours | $29-$49 | 15-30 | $435-$1,470 | Acquisition + Revenue |
| Builder Workshop | Half day (4hr) | $99-$149 | 10-20 | $990-$2,980 | Revenue |
| Intensive Bootcamp | Full day (8hr) | $199-$299 | 8-15 | $1,592-$4,485 | Revenue |
| Corporate Training | Custom (4-8hr) | $1,500-$5,000 flat | 5-50 | $1,500-$5,000 | Revenue |
| Train-the-Trainer | 2 days | $2,500-$5,000 | 3-8 | $7,500-$40,000 | Revenue (high margin) |

### 6.2 Standalone Workshop Revenue Math

**Scenario A — Solo founder running 2 workshops/month**:

| Month | Workshops | Avg Revenue/Workshop | Monthly Revenue | Annual Revenue |
|-------|-----------|---------------------|-----------------|----------------|
| 1-3 | 2/mo | $500 (beginner, small groups) | $1,000 | — |
| 4-6 | 3/mo | $800 (mix of beginner + builder) | $2,400 | — |
| 7-12 | 4/mo | $1,200 (builder + corporate) | $4,800 | — |
| **Year 1 Total** | | | | **$33,600** |

**Scenario B — With workshop assistant/contractor**:

| Month | Workshops | Avg Revenue/Workshop | Monthly Revenue | Annual Revenue |
|-------|-----------|---------------------|-----------------|----------------|
| 1-6 | 4/mo | $800 | $3,200 | — |
| 7-12 | 8/mo | $1,500 | $12,000 | — |
| **Year 1 Total** | | | | **$91,200** |

Contractor cost estimate: $500-$1,000/mo for a part-time workshop facilitator.

### 6.3 Loss Leader Math (Free Workshops → SaaS Conversion)

**Free Intro Webinar Funnel**:
```
100 webinar attendees
  → 60% sign up for free account (60 users)
    → 40% complete onboarding (24 users)
      → 15% convert to paid within 30 days (3.6 users)
        → Average ARPU $35/mo
        → LTV at 12-month retention: $420/user

Value per webinar: 3.6 users × $420 LTV = $1,512 lifetime value generated
Cost per webinar: ~$0 (your time only, Zoom is free, product is the demo)
```

**Paid Workshop Funnel**:
```
20 workshop attendees at $49/person = $980 direct revenue
  → 90% sign up for free account (18 users)
    → 70% complete onboarding (12.6 users, guided during workshop)
      → 30% convert to paid within 30 days (3.78 users)
        → Average ARPU $35/mo
        → LTV at 12-month retention: $420/user

Value per workshop:
  Direct revenue: $980
  LTV from conversions: 3.78 × $420 = $1,588
  Total value: $2,568
```

### 6.4 Hybrid Model Recommendation

**Recommended workshop strategy by stage**:

**Months 1-3 (Validation)**:
- Run 2 free webinars/month (lead gen, validate messaging)
- Run 1 paid beginner workshop/month ($29-$49/person, validate willingness to pay)
- Total investment: your time only
- Expected monthly workshop revenue: $500-$1,000 direct + SaaS conversion value

**Months 4-6 (Optimization)**:
- Run 1 free webinar/month (ongoing lead gen)
- Run 2-3 paid workshops/month (mix of beginner and builder)
- Begin corporate outreach (target 1 corporate training/quarter)
- Expected monthly workshop revenue: $1,500-$3,000

**Months 7-12 (Scale)**:
- Run 1 free webinar/month
- Run 3-4 paid workshops/month
- Land 1-2 corporate training deals/quarter ($1,500-$5,000 each)
- Consider hiring a workshop assistant
- Expected monthly workshop revenue: $3,000-$6,000

**Workshop Pricing Psychology**: The $29 workshop price mirrors the SaaS subscription price. This is intentional — a workshop attendee who paid $29 for a session and found it valuable has already mentally committed to "this is worth $29/mo." The price anchoring makes SaaS conversion nearly frictionless.

### 6.5 Corporate Training Deep Dive

**Corporate training is the highest-margin workshop format**. Pricing framework:

| Company Size | Training Type | Suggested Price | Includes |
|-------------|--------------|----------------|----------|
| Small (5-20 employees) | Half-day workshop | $1,500 | Training + 3mo Pro subscriptions for attendees |
| Medium (20-50 employees) | Full-day workshop | $3,000 | Training + 6mo Pro subscriptions + 1hr follow-up |
| Large (50+ employees) | Multi-day program | $5,000-$15,000 | Custom curriculum + Enterprise subscription + ongoing support |

**Why bundle subscriptions with corporate training**: The subscription becomes a line item in the training budget, which is typically easier to expense than a SaaS subscription. A $3,000 training invoice that "includes 6 months of platform access for all attendees" is an easier purchase than a $49/mo/seat SaaS subscription that requires procurement approval.

---

## 7. Professional Services Revenue

### 7.1 "Done For You" Agent Setup

**When to offer**: Only after you have built 10+ agents for customers and have a repeatable process. Offering too early creates bespoke consulting work that does not scale.

**Recommended pricing**:

| Service | Price | Deliverable | Time Investment |
|---------|-------|-------------|-----------------|
| Agent Audit | $99 (one-time) | Review existing agent, provide optimization recommendations | 1 hour |
| Basic Agent Build | $299 (one-time) | 1 custom agent with knowledge base setup, tested and deployed | 3-4 hours |
| Advanced Agent Build | $799 (one-time) | 1 agent with integrations, custom workflows, training session | 8-10 hours |
| Agent Suite | $1,999 (one-time) | 3-5 agents for different use cases, full deployment | 20-25 hours |

**Effective hourly rate**: $75-$100/hr, which is reasonable for AI consulting but not so high that it prices out SMBs.

### 7.2 Ongoing Management Retainers

| Tier | Monthly Price | Includes |
|------|-------------|----------|
| Monitoring | $99/mo | Monthly performance report, basic optimization, email support |
| Active Management | $299/mo | Weekly optimization, knowledge base updates, priority support |
| Strategic Partner | $799/mo | Dedicated agent optimization, new agent development, strategy sessions |

**Validation signal for offering retainers**: When 3+ customers independently ask "can you just manage this for me?" — that is the signal. Do not offer proactively until then.

### 7.3 When Professional Services Help vs Hurt

**Professional services HELP when**:
- They generate revenue that funds product development
- They provide deep customer insight (you see exactly how customers use the product)
- They create case studies and testimonials
- Customer acquisition cost through services is lower than through marketing

**Professional services HURT when**:
- They consume more than 30% of your time (you are now a consultant, not a product founder)
- Each engagement is fully bespoke (no repeatable process)
- Revenue from services exceeds revenue from SaaS (misaligned incentives)
- You cannot say "no" to a services request because you need the revenue

**Recommendation for Year 1**: Cap professional services at 20% of total revenue and 15 hours/week of time. If demand exceeds this, raise prices until demand matches supply — do not hire to scale a services business.

---

## Summary: Recommended Pricing Architecture

### Final Pricing Table

| | Free | Builder | Pro | Enterprise |
|---|---|---|---|---|
| **Price** | $0 | **$29/mo** ($249/yr) | **$49/mo** ($429/yr) | **$149/mo** ($1,299/yr) |
| Agents | 2 | 10 | Unlimited | Unlimited |
| Monthly credits | 500 | 2,000 | 10,000 | 50,000 |
| Overage rate | N/A (hard cap) | $0.008/credit | $0.008/credit | $0.006/credit |
| Overage cap options | N/A | $10/$25/$50 | $25/$50/$100 | Custom |
| Knowledge files | 3 | 50 | 200 | Unlimited |
| Missions | 3 starter | Full library | Full library | Full + custom |
| Canvas editor | Preview | Full | Full | Full |
| Embed | Watermarked | Branded | White-label | White-label |
| Team members | 1 | 1 | 5 | Unlimited |
| BYO API key | No | No | Yes | Yes |
| API access | No | Limited | Full | Full |
| SSO/SAML | No | No | No | Yes |
| Support | Community | Email | Email + chat | Dedicated |

### Top 5 Pricing Actions (Priority Order)

1. **Raise Individual to $29/mo and rename to "Builder"** — Immediate revenue impact, better positioning vs ChatGPT Plus. Implementation: 1 day.

2. **Replace "Custom" Business tier with concrete $49 Pro and $149 Enterprise** — Removes friction for mid-market buyers. Implementation: 1 day.

3. **Simplify credit system to included monthly allocation + overage** — Reduces cognitive load for non-technical users, fixes negative-margin credit packs. Implementation: 3-5 days (backend changes needed).

4. **Tighten Free tier to 2 agents / 500 runs / 3 knowledge files** — Creates stronger upgrade pressure without killing top-of-funnel. Implementation: 1 day.

5. **Implement behavioral upgrade triggers** — Agent limit hit, credit exhaustion, and mission completion are the three highest-value triggers to build first. Implementation: 1-2 weeks.

### The Single Biggest Pricing Risk

**The credit system complexity will suppress conversion.** Every analysis in this document points back to the same issue: the target audience is non-technical users, and the current pricing requires understanding subscriptions, credit packs, credit-to-run ratios, and BYO API keys simultaneously. Simplifying to "your plan includes X credits, overage costs Y each" is the single highest-impact change you can make to improve conversion rate. If you do nothing else from this document, do that.

---

### Comparable Company Pricing Trajectories

**Jasper AI** (AI writing tool, similar non-technical audience):
- 2021 launch: $29/mo for Creator, $59/mo for Teams
- 2022: Raised to $49/mo Creator, $125/mo Teams
- 2023: Added Enterprise tier at custom pricing
- Lesson: Started with concrete tiers, raised prices as value was proven, only added "Custom" after reaching scale

**Carrd** (simple website builder, solo founder, similar market position):
- 2016 launch: $19/yr Pro tier
- 2019: Added $49/yr Pro Plus tier
- 2022: Added $99/yr Pro Max tier
- Lesson: Started cheap, added tiers upward over time, never lowered prices. Annual-first pricing worked because the product is "set and forget."

**Typedream** (no-code website builder, bootstrapped):
- Launch: Free + $15/mo Pro
- 6 months: Free + $29/mo Pro + $49/mo Business
- 12 months: Free + $29/mo + $49/mo + $99/mo Enterprise
- Lesson: Near-identical trajectory to what is recommended here. The "missing middle tier" was the biggest conversion unlocked.

---

# Teach Charlie AI: Content & SEO Strategy

## A Launch Playbook Section for a Solo Founder

---

## Executive Summary

This strategy is designed for a solo, non-technical founder with approximately 20 hours per week of non-technical work capacity and a total budget of $100-$500/month. The core insight driving every recommendation below: **you cannot outproduce OpenAI, Botpress, or Voiceflow on content volume. You win by being the most relatable, accessible, and education-focused voice in a space that talks over its audience's head.**

The entire strategy is built around one principle: **Workshop-First Content.** Every piece of content should either come from a workshop, lead to a workshop, or simulate the workshop experience. This is your unfair advantage — you actually teach people face-to-face, and that lived experience produces content that no AI-content-farm competitor can replicate.

**Projected timeline to meaningful organic traffic**: 6-9 months for long-tail keywords, 12-18 months for moderate-volume terms. Content compounds. The first 3 months will feel like shouting into the void. That is normal.

**Recommended content budget allocation** (within $100-$500/mo total):
- SEO tools: $0-$50/mo (free tiers first, upgrade when traffic justifies it)
- Video production: $0-$30/mo (Descript free tier, Canva free tier)
- Content assistance: $0-$100/mo (Claude/ChatGPT for drafts you heavily edit with your voice)
- Everything else goes to ads, hosting, and tools from other playbook sections

---

## 1. Content Pillars & Topic Clusters

### Pillar Architecture

You need exactly **5 content pillars**. Each pillar maps to a core audience pain point and has a dedicated "pillar page" (a comprehensive 3,000+ word guide) with 10-15 "cluster articles" (800-1,500 words each) that link back to it. This hub-and-spoke model is how small sites build topical authority that Google rewards.

**Why 5 pillars, not more?** A solo founder producing 2-3 articles per month needs focus. Five pillars give you enough breadth to capture different search intents while keeping the site topically coherent.

---

### PILLAR 1: "AI for Non-Technical People" (Awareness)

**Pillar Page**: "The Non-Technical Person's Complete Guide to AI Agents in 2026" (3,500 words)
**Target Keyword**: "AI agents explained simply"
**Persona Focus**: All three personas — this is your top-of-funnel magnet

| # | Article Title | Target Keyword | Est. Monthly Volume | Difficulty | Word Count | Primary Persona |
|---|--------------|----------------|---------------------|------------|------------|-----------------|
| 1 | "What Is an AI Agent? A Plain-English Explanation for Business Owners" | "what is an AI agent" | 5K-10K | High | 1,800 | Sarah (SMB) |
| 2 | "AI Chatbot vs AI Agent: What's the Difference and Why Should You Care?" | "AI chatbot vs AI agent" | 1K-5K | Medium | 1,200 | Sarah / Mike (Marketing) |
| 3 | "I'm Not Technical — Can I Really Build an AI Agent? (Yes, Here's How)" | "build AI agent no coding" | 500-1K | Low | 1,500 | Sarah |
| 4 | "The 5 AI Terms Every Small Business Owner Needs to Know (and Nothing Else)" | "AI terminology for beginners" | 200-500 | Low | 1,000 | Sarah / Workshop attendees |
| 5 | "What Can an AI Agent Actually Do for My Business? 12 Real Examples" | "AI agent use cases small business" | 500-1K | Medium | 2,000 | Sarah |
| 6 | "Why Most People Fail at Using AI (and How to Think About It Differently)" | "why AI is hard to use" | 200-500 | Low | 1,200 | All |
| 7 | "The 'Dog Trainer' Approach to AI: Why Teaching Beats Programming" | "teach AI like training a dog" | 0-100 | Very Low | 1,500 | All (brand-building) |
| 8 | "AI Agents in 2026: What's Changed and What Actually Matters for Your Business" | "AI agents 2026" | 1K-5K | Medium | 2,000 | Sarah / Mike |
| 9 | "RAG Explained Like You're 10: How AI Agents Learn From Your Documents" | "RAG explained simply" | 500-1K | Medium | 1,200 | Mike |
| 10 | "How to Talk to Your AI Agent: Prompt Writing for Normal People" | "how to write AI prompts for beginners" | 1K-5K | Medium | 1,500 | All |
| 11 | "AI Agent vs Hiring a Virtual Assistant: Cost, Speed, and Quality Compared" | "AI agent vs virtual assistant" | 500-1K | Low-Medium | 1,500 | Sarah |
| 12 | "The Honest Truth About AI Agents: What They're Great At and Where They Still Fail" | "AI agent limitations" | 500-1K | Medium | 1,800 | All |

**Priority order** (produce these first): Articles 1, 3, 5, 10, 7 — these have the best ratio of traffic potential to conversion potential for your specific audience.

---

### PILLAR 2: "AI for Small Business Operations" (Consideration)

**Pillar Page**: "How Small Businesses Are Using AI Agents to Save 10+ Hours Per Week" (3,000 words)
**Target Keyword**: "AI for small business"
**Persona Focus**: Sarah (SMB owner, 35-50)

| # | Article Title | Target Keyword | Est. Monthly Volume | Difficulty | Word Count | Primary Persona |
|---|--------------|----------------|---------------------|------------|------------|-----------------|
| 1 | "How a Bakery Owner Built an AI Customer Support Agent in 15 Minutes" | "AI chatbot for small business" | 1K-5K | Medium-High | 1,500 | Sarah |
| 2 | "Automating Your FAQ: How to Build an AI Agent That Answers Customer Questions 24/7" | "automate FAQ with AI" | 500-1K | Low-Medium | 1,500 | Sarah |
| 3 | "AI for Real Estate Agents: Automate Lead Follow-Up Without Losing the Personal Touch" | "AI for real estate agents" | 500-1K | Medium | 1,500 | Sarah |
| 4 | "How to Create an AI Onboarding Assistant for New Employees" | "AI employee onboarding" | 200-500 | Low | 1,200 | Sarah |
| 5 | "AI for Consultants: Build an Agent That Pre-Qualifies Leads While You Sleep" | "AI for consultants" | 200-500 | Low | 1,500 | Sarah |
| 6 | "How to Build an AI Agent That Knows Your Product Catalog" | "AI product knowledge base" | 200-500 | Low | 1,500 | Sarah |
| 7 | "5 AI Agents Every Service Business Should Build (With Templates)" | "AI agents for service businesses" | 200-500 | Low | 2,000 | Sarah |
| 8 | "How to Make Your AI Agent Sound Like Your Brand (Not Like a Robot)" | "customize AI chatbot personality" | 500-1K | Medium | 1,200 | Sarah / Mike |
| 9 | "AI for Coaches and Course Creators: Build an Agent That Teaches Like You Do" | "AI for coaches" | 200-500 | Low | 1,500 | Sarah |
| 10 | "How a Dog Groomer Uses AI to Handle 200 Booking Requests a Month" | "AI booking assistant small business" | 200-500 | Low | 1,200 | Sarah |
| 11 | "The $0 AI Customer Service Setup: Build It This Weekend" | "free AI customer service tool" | 500-1K | Medium | 1,500 | Sarah |
| 12 | "How to Train Your AI Agent on Your Business's Specific Knowledge" | "train AI on business data" | 500-1K | Medium | 1,500 | Sarah |

**Priority order**: Articles 2, 12, 1, 8, 7 — FAQ automation and knowledge training are the highest-intent topics for your audience.

---

### PILLAR 3: "AI Agent Builder Comparisons" (Decision)

**Pillar Page**: "AI Agent Builders Compared: A Non-Technical Buyer's Guide for 2026" (4,000 words)
**Target Keyword**: "best AI agent builder"
**Persona Focus**: Sarah and Mike — people actively evaluating tools

| # | Article Title | Target Keyword | Est. Monthly Volume | Difficulty | Word Count | Primary Persona |
|---|--------------|----------------|---------------------|------------|------------|-----------------|
| 1 | "Teach Charlie vs ChatGPT GPTs: Which Is Better for Business Automation?" | "ChatGPT GPTs alternatives" | 1K-5K | Medium | 2,000 | Sarah / Mike |
| 2 | "Teach Charlie vs Botpress: The Non-Technical Comparison" | "Botpress alternatives" | 500-1K | Medium | 2,000 | Mike |
| 3 | "Teach Charlie vs Voiceflow: Which AI Builder Is Easier to Learn?" | "Voiceflow alternatives" | 500-1K | Medium | 2,000 | Mike |
| 4 | "7 Best No-Code AI Agent Builders for Non-Technical Founders (2026)" | "no-code AI agent builder" | 500-1K | Medium | 2,500 | Sarah |
| 5 | "Teach Charlie vs Zapier AI: Automation With Intelligence vs Intelligence With Automation" | "Zapier AI alternatives" | 200-500 | Low-Medium | 1,500 | Sarah |
| 6 | "Why We Built Teach Charlie on Top of Langflow (and What That Means for You)" | "Langflow for business" | 200-500 | Low | 1,500 | Mike |
| 7 | "ChatGPT Custom GPTs vs Dedicated AI Agent Builders: What Business Owners Need to Know" | "custom GPTs vs AI agent builder" | 500-1K | Medium | 2,000 | Sarah |
| 8 | "Best AI Chatbot for Small Business in 2026: 5 Options Under $50/Month" | "best AI chatbot small business 2026" | 500-1K | Medium | 2,500 | Sarah |
| 9 | "Teach Charlie vs Building It Yourself: The True Cost of DIY AI Agents" | "build your own AI agent cost" | 200-500 | Low | 1,500 | Sarah |
| 10 | "Do You Actually Need an AI Agent Builder? A Decision Framework" | "do I need AI agent builder" | 100-200 | Very Low | 1,500 | Sarah |

**Priority order**: Articles 1, 4, 8, 7, 2 — comparison with ChatGPT GPTs is the highest-leverage piece because that is where most of your audience currently lives.

---

### PILLAR 4: "AI Workshops & Learning" (Retention + Community)

**Pillar Page**: "Learn AI by Building: The Workshop-Based Approach to AI Literacy" (3,000 words)
**Target Keyword**: "learn AI for business"
**Persona Focus**: Workshop attendees (22-60) and anyone considering attending

| # | Article Title | Target Keyword | Est. Monthly Volume | Difficulty | Word Count | Primary Persona |
|---|--------------|----------------|---------------------|------------|------------|-----------------|
| 1 | "What Happens at an AI Workshop? A Complete First-Timer's Guide" | "AI workshop for beginners" | 200-500 | Low | 1,500 | Workshop attendees |
| 2 | "How to Host an AI Workshop for Your Team (Even If You're Not Technical)" | "how to run AI workshop" | 200-500 | Low | 2,000 | Sarah / Mike |
| 3 | "10 Things People Build at Their First AI Workshop (With Screenshots)" | "AI workshop projects" | 100-200 | Very Low | 1,500 | Workshop attendees |
| 4 | "AI Literacy for Business Teams: A 2-Hour Learning Plan" | "AI literacy for business" | 200-500 | Low-Medium | 1,800 | Mike |
| 5 | "Why 'Learning AI' Doesn't Mean 'Learning to Code'" | "learn AI without coding" | 500-1K | Medium | 1,200 | All |
| 6 | "The 3 AI Skills Every Employee Needs by 2027 (None of Them Are Programming)" | "AI skills for employees" | 500-1K | Medium | 1,500 | Mike |
| 7 | "Workshop Recap: Building AI Agents at [City Name] Small Business Meetup" | "AI workshop [city]" | 50-100 each | Very Low | 800 | Local attendees |
| 8 | "From Workshop Attendee to AI Power User: 5 Success Stories" | "AI workshop success stories" | 50-100 | Very Low | 1,500 | Workshop attendees |
| 9 | "How to Keep Learning AI After Your First Workshop" | "continue learning AI" | 200-500 | Low | 1,200 | Workshop attendees |
| 10 | "The Best Free AI Learning Resources for Non-Technical People (2026)" | "free AI learning resources" | 1K-5K | Medium-High | 2,000 | All |

**Priority order**: Articles 5, 1, 6, 3, 7 — article 5 is a potential breakout piece because it reframes the entire conversation around AI learning.

---

### PILLAR 5: "AI Marketing & Customer Experience" (Consideration)

**Pillar Page**: "How to Use AI Agents in Your Marketing Without Being Annoying" (3,000 words)
**Target Keyword**: "AI agents for marketing"
**Persona Focus**: Mike (Marketing Manager, 28-40)

| # | Article Title | Target Keyword | Est. Monthly Volume | Difficulty | Word Count | Primary Persona |
|---|--------------|----------------|---------------------|------------|------------|-----------------|
| 1 | "How to Build an AI Agent That Actually Sounds Like Your Brand" | "AI brand voice chatbot" | 200-500 | Low | 1,500 | Mike |
| 2 | "AI-Powered Lead Qualification: How to Build an Agent That Asks the Right Questions" | "AI lead qualification" | 500-1K | Medium | 1,500 | Mike |
| 3 | "Embedding an AI Agent on Your Website: A Non-Developer's Guide" | "embed AI chatbot on website" | 500-1K | Medium | 1,500 | Mike |
| 4 | "How to Use AI Agents for Customer Onboarding (With Templates)" | "AI customer onboarding" | 200-500 | Low | 1,500 | Mike |
| 5 | "AI for Email Marketing: Build an Agent That Writes Like Your Best Copywriter" | "AI email marketing agent" | 500-1K | Medium | 1,500 | Mike |
| 6 | "The Marketing Manager's Guide to AI Agents: What to Build First" | "AI agents marketing guide" | 200-500 | Low | 2,000 | Mike |
| 7 | "How to Measure ROI on Your AI Agent (Simple Metrics That Actually Matter)" | "AI chatbot ROI" | 200-500 | Low-Medium | 1,500 | Mike / Sarah |
| 8 | "AI Agent for Social Media: Automate Responses Without Losing Authenticity" | "AI social media automation" | 500-1K | Medium | 1,500 | Mike |
| 9 | "How to Build an AI Product Recommendation Agent for Your E-Commerce Store" | "AI product recommendation chatbot" | 200-500 | Low-Medium | 1,500 | Mike |
| 10 | "Why Your AI Agent Needs Personality (and How to Give It One)" | "AI chatbot personality" | 500-1K | Medium | 1,200 | Mike |

**Priority order**: Articles 3, 1, 2, 7, 6 — embedding the agent on a website is the highest commercial-intent topic here.

---

### Content Production Calendar (First 6 Months)

At 2-3 articles per month, here is the recommended sequence. The logic: start with comparison and high-intent articles (they convert), then build out educational content (it ranks over time).

| Month | Article 1 | Article 2 | Article 3 (if time) |
|-------|-----------|-----------|---------------------|
| **1** | P3-1: Teach Charlie vs ChatGPT GPTs | P2-2: Automating Your FAQ | P1-3: I'm Not Technical — Can I Build an AI Agent? |
| **2** | P3-4: 7 Best No-Code AI Agent Builders | P2-12: Train AI on Business Data | P1-1: What Is an AI Agent? |
| **3** | P3-8: Best AI Chatbot for Small Business | P5-3: Embedding AI on Your Website | P4-5: Learning AI Doesn't Mean Learning to Code |
| **4** | P1-5: 12 Real AI Agent Examples | P2-8: Make AI Sound Like Your Brand | P4-1: What Happens at an AI Workshop? |
| **5** | P3-7: Custom GPTs vs AI Agent Builders | P5-2: AI Lead Qualification | P1-10: Prompt Writing for Normal People |
| **6** | P2-7: 5 AI Agents for Service Businesses | P5-7: How to Measure AI Agent ROI | P4-7: Workshop Recap: [City] |

**Why this order**: Months 1-2 prioritize comparison content (captures people actively evaluating tools) and high-intent how-to content (captures people ready to act). Months 3-4 broaden the funnel. Months 5-6 deepen topical authority.

---

## 2. YouTube Strategy

### The Honest Assessment

YouTube is extremely high-effort for a solo founder. A single "good" video takes 4-8 hours (scripting, recording, editing, thumbnail, upload optimization). At 20 hours/week of non-technical time, that is 20-40% of your available time for one video.

**Recommendation: Do NOT start a regular YouTube cadence until Month 4-6, after you have validated demand through workshops and have at least 10 published blog articles driving organic traffic.** The exception: record every workshop from Day 1 and publish lightly edited versions. This is nearly free content.

### When to Start and What to Prioritize

**Phase 1 (Months 1-3): Workshop Recordings Only**
- Record every workshop with screen capture + room audio
- Upload with minimal editing (just trim start/end, add intro card)
- Time investment: 1-2 hours per workshop recording (uploading + basic metadata)
- This builds a library of authentic, long-form content

**Phase 2 (Months 4-6): Add 2 Videos Per Month**
- One tutorial/walkthrough per month (screen recording + voiceover)
- One "watch me build" per month (screen recording, talking through decisions)
- Time investment: 6-10 hours per month total

**Phase 3 (Months 7+): Scale to Weekly If Metrics Justify**
- Only increase frequency if videos from Phase 2 show traction (>500 views average)
- Add comparison videos and reaction/commentary content
- Consider hiring a video editor ($200-400/month on Fiverr or Upwork)

### Video Formats Ranked by ROI for a Solo Founder

1. **Workshop recordings** (highest ROI — content you already produce)
2. **Screen recording tutorials** ("How to build X in 15 minutes") — high search value, easy to produce
3. **"Watch me build" walkthroughs** — authentic, shows the product in action, builds trust
4. **Comparison reviews** ("Teach Charlie vs ChatGPT GPTs") — captures high-intent search traffic
5. **Talking head explainers** — lowest priority; requires more production skill and comfort on camera

### Specific Video Titles (25 titles, organized by format)

**Tutorial/Walkthrough Videos (Screen Recording)**
1. "Build Your First AI Agent in Under 15 Minutes — No Coding Required"
2. "How to Train an AI Agent on Your Business FAQ (Step-by-Step)"
3. "How to Embed an AI Chat Agent on Your Website (Teach Charlie Tutorial)"
4. "Building an AI Customer Support Agent for a Small Business"
5. "How to Give Your AI Agent a Personality That Matches Your Brand"
6. "3-Step AI Agent Setup: The Dog Trainer Method Explained"
7. "How to Upload Documents and Teach Your AI Agent Your Business Knowledge"
8. "Building an AI Lead Qualification Agent from Scratch"

**"Watch Me Build" Videos**
9. "Building a Real Estate AI Agent — Live Build in 20 Minutes"
10. "Watch Me Build: AI Agent for a Coffee Shop's Customer Questions"
11. "Watch Me Build: An AI Agent That Handles Appointment Booking Questions"
12. "Building an AI Agent for a Marketing Agency — Full Walkthrough"
13. "From Zero to Working AI Agent: A Non-Technical Founder's Live Build"

**Comparison/Review Videos**
14. "Teach Charlie vs ChatGPT Custom GPTs: Honest Comparison for Business Owners"
15. "I Tested 5 No-Code AI Agent Builders So You Don't Have To"
16. "Botpress vs Teach Charlie: Which Is Easier for Non-Technical Users?"
17. "Do You Need an AI Agent Builder or Is ChatGPT Enough?"

**Educational/Explainer Videos**
18. "What Is an AI Agent? Explained for Business Owners (Not Engineers)"
19. "The 3 Things Your AI Agent Needs to Be Useful (Most People Skip #2)"
20. "Why Most AI Chatbots Sound Terrible (and How to Fix Yours)"
21. "AI Agents in 2026: What Actually Changed and What Matters for Your Business"

**Workshop Recordings**
22. "[City] AI Workshop: 20 People Build Their First AI Agent"
23. "Full Workshop Recording: AI Agents for Small Business"
24. "Live Q&A: Business Owners Ask Their Biggest AI Questions"
25. "Workshop Highlights: The Best AI Agents People Built in 60 Minutes"

### Production Setup (Minimal Budget)

| Tool | Purpose | Cost | Notes |
|------|---------|------|-------|
| **OBS Studio** | Screen recording | Free | Record screen + webcam simultaneously |
| **Descript** | Editing, transcription, filler word removal | Free tier (10 hrs/mo) | Best solo-founder editing tool; edit video like a document |
| **Canva** | Thumbnails, intro/outro cards | Free tier | YouTube thumbnail templates available |
| **Loom** (alternative) | Quick screen recordings | Free tier (25 videos) | Easier than OBS for simple tutorials |
| **Rode USB-C Mini** or **Blue Yeti** | Audio quality | $60-$130 one-time | Audio quality matters more than video quality |

**Total ongoing cost: $0-$30/month** (Descript paid tier only needed after exceeding free hours)

### YouTube SEO Basics for AI Content

**Titles**: Front-load the keyword. Use numbers. Signal simplicity.
- Good: "Build an AI Agent in 15 Minutes — No Coding Required"
- Bad: "Teach Charlie AI Platform Tutorial and Review"

**Descriptions**: First 2 lines appear in search results. Include:
- Line 1: Benefit statement with primary keyword
- Line 2: Call to action (link to free trial)
- Lines 3-10: Detailed description with secondary keywords
- Bottom: Links to related videos, social media, timestamps

**Tags** (still marginally useful): Include exact match keyword + variations + competitor names
- Example for a comparison video: "teach charlie ai", "chatgpt custom gpts", "ai agent builder", "no code ai", "ai chatbot for business", "botpress alternative"

**Thumbnails**: The single biggest factor in click-through rate.
- Use bold text (3-5 words max)
- Show before/after or a surprising result
- Use contrasting colors (yellow text on dark background performs well in tech)
- Include your face if you are comfortable on camera (builds trust)
- Use Canva's YouTube thumbnail templates as a starting point

**Chapters/Timestamps**: Always add manual timestamps. Google uses these for search features.

---

## 3. SEO Keyword Strategy

### The Competitive Reality

Let me be blunt: you will not rank for "AI chatbot" (volume: 50K+, difficulty: 95/100) or "AI agent" (volume: 30K+, difficulty: 90/100) in 2026. These terms are dominated by OpenAI, Google, IBM, and venture-backed companies with dedicated SEO teams and domains with 90+ Domain Authority.

Your strategy must be: **own the long tail, dominate niche intersections, and build topical authority in the "non-technical AI user" space that the big players ignore.**

### Keyword Categories (with specific examples)

#### Category A: Long-Tail "How To" Keywords (Easiest to Rank)
These are your bread and butter. Low volume individually, but they compound and they convert.

| Keyword | Est. Monthly Volume | Difficulty | Priority |
|---------|---------------------|------------|----------|
| "how to build an AI agent without coding" | 200-500 | Low | Very High |
| "how to automate customer support without coding" | 200-500 | Low | Very High |
| "how to create an AI chatbot for my small business" | 500-1K | Medium | High |
| "how to train AI on my business data" | 200-500 | Low-Medium | Very High |
| "how to embed AI chat on website no code" | 100-200 | Low | High |
| "how to make AI chatbot sound natural" | 200-500 | Low | Medium |
| "how to build AI FAQ bot" | 200-500 | Low | High |
| "how to use AI for small business customer service" | 200-500 | Low-Medium | High |
| "how to teach AI about my company" | 100-200 | Low | Very High |
| "how to set up AI lead qualification" | 100-200 | Low | Medium |

**Why these matter**: Someone searching "how to build an AI agent without coding" is your exact target user, actively looking for a solution. Even at 200 monthly searches, a 5% click-through rate at a 3% conversion rate generates steady signups.

#### Category B: "Best/Top" Listicle Keywords (Medium Difficulty)

| Keyword | Est. Monthly Volume | Difficulty | Priority |
|---------|---------------------|------------|----------|
| "best no-code AI agent builder" | 500-1K | Medium | Very High |
| "best AI chatbot for small business" | 1K-5K | Medium-High | High |
| "best AI chatbot builder for beginners" | 200-500 | Medium | High |
| "best alternatives to ChatGPT for business" | 1K-5K | High | Medium |
| "best AI tools for non-technical people" | 200-500 | Low-Medium | High |
| "best AI agent builder 2026" | 500-1K | Medium | High |
| "best AI platforms for small business owners" | 200-500 | Medium | Medium |
| "top AI chatbot builders under $50" | 100-200 | Low | High |

**Why these matter**: "Best X" keywords have extremely high commercial intent. The searcher is ready to buy — they just need to pick which tool.

#### Category C: Problem-Aware Keywords (High Conversion)

| Keyword | Est. Monthly Volume | Difficulty | Priority |
|---------|---------------------|------------|----------|
| "automate customer questions AI" | 100-200 | Low | Very High |
| "AI chatbot that learns from my documents" | 200-500 | Low-Medium | Very High |
| "create FAQ bot for website" | 500-1K | Medium | High |
| "AI assistant for booking appointments" | 200-500 | Medium | Medium |
| "make AI respond like my brand" | 100-200 | Low | High |
| "AI agent to handle leads while I sleep" | 50-100 | Very Low | Medium |
| "reduce customer support time with AI" | 100-200 | Low | Medium |
| "no code chatbot builder for website" | 500-1K | Medium | High |

**Why these matter**: These people have a problem and are looking for a solution — they have not yet decided what category of tool they need. You can introduce them to the concept of AI agents through their specific pain point.

#### Category D: Competitor Brand Keywords (Handle with Care)

| Keyword | Est. Monthly Volume | Difficulty | Notes |
|---------|---------------------|------------|-------|
| "Botpress alternative" | 500-1K | Medium | Good target — Botpress is technical |
| "Voiceflow alternative" | 200-500 | Medium | Good target — Voiceflow is complex |
| "ChatGPT GPTs for business" | 1K-5K | High | Write comparison, not "alternative" |
| "Chatbase alternative" | 200-500 | Medium | Similar audience to yours |
| "Crisp chat alternative" | 200-500 | Medium | Different category but overlapping users |
| "Langflow tutorial" | 200-500 | Low | You literally run on Langflow — own this |
| "Zapier AI chatbot" | 200-500 | Medium | Differentiate: Zapier automates workflows, you build agents |

**Important**: Do NOT create comparison pages for every competitor. Focus on the 4-5 where you have a genuine differentiation story. Skip competitors that serve a fundamentally different audience (e.g., enterprise-only platforms like IBM Watson).

#### Category E: Local SEO Keywords (If Workshops Are a Channel)

| Keyword | Est. Monthly Volume | Difficulty | Notes |
|---------|---------------------|------------|-------|
| "AI workshop [your city]" | 50-200 | Very Low | Create a page for every city you present in |
| "learn AI [your city]" | 100-500 | Low | City-specific landing pages |
| "AI training for businesses [your city]" | 50-100 | Very Low | Hyper-local, low competition |
| "small business AI meetup [your city]" | 0-50 | Very Low | May not have volume yet — own it early |

**Why this matters**: Local SEO is dramatically less competitive. If you run workshops in 3-4 cities, create a landing page for each with unique content (workshop recap, photos, testimonials from attendees). These pages can rank within weeks, not months.

**Implementation**: Create a Google Business Profile if you have any physical presence. Add "AI Workshop" and "AI Training" to your business categories. Encourage workshop attendees to leave Google reviews.

### Keyword Research Tools (Budget-Friendly)

| Tool | Cost | Best For | Notes |
|------|------|----------|-------|
| **Google Search Console** | Free | Your own site's keywords | Install on day 1. Shows what you actually rank for. |
| **Google Keyword Planner** | Free (with Google Ads account) | Volume estimates | Requires a Google Ads account but you don't need to run ads |
| **Ubersuggest** | Free (3 searches/day) or $29/mo | Keyword ideas + difficulty | Good enough for your scale. Free tier is workable. |
| **AnswerThePublic** | Free (limited) | Question-based keywords | Great for blog topic ideation |
| **AlsoAsked.com** | Free (limited) | "People Also Ask" clusters | Maps related questions — goldmine for cluster articles |
| **Ahrefs Free Webmaster Tools** | Free | Backlink analysis + basic keywords | Limited but useful for checking competitor keywords |
| **Google Trends** | Free | Trending topics, seasonality | Check if "AI agent builder" is trending up or plateauing |

**Recommendation**: Start with Google Search Console + Google Keyword Planner + Ubersuggest free tier. That is $0/month and sufficient for 6+ months. Upgrade to Ubersuggest paid ($29/mo) or Ahrefs Lite ($99/mo) only when you have 50+ published pages and need to track rankings at scale.

### Realistic Timeline for Organic Traffic

| Timeframe | What to Expect | Monthly Organic Sessions |
|-----------|---------------|------------------------|
| Months 1-3 | Mostly zero organic traffic. Google is indexing your content. | 0-100 |
| Months 4-6 | Long-tail keywords start ranking (positions 10-30). A few articles get clicks. | 100-500 |
| Months 7-9 | Best articles break into top 10. Compound effect kicks in. | 500-2,000 |
| Months 10-12 | Topical authority builds. Multiple articles in top 5 for long-tail terms. | 2,000-5,000 |
| Year 2 | If consistent, 50+ articles create a flywheel. Some moderate-volume terms rank. | 5,000-15,000 |

**The critical insight**: Most solo founders quit content marketing at month 3-4 because they see no results. The ones who persist to month 8-10 see compounding returns. Set expectations accordingly.

---

## 4. Content Repurposing Workflow

This is your highest-leverage system. One 60-90 minute workshop should produce 5-8 pieces of content with an additional 3-5 hours of work.

### The Workshop-to-Content Pipeline

```
WORKSHOP (60-90 min)
    |
    ├── [1] Full Recording → YouTube (long-form)
    |       Time: 1-2 hrs (trim + upload)
    |
    ├── [2] Workshop Recap Blog Post
    |       Time: 2-3 hrs (write from notes + recording)
    |
    ├── [3] 3-5 Short Video Clips → LinkedIn, TikTok, YouTube Shorts
    |       Time: 1-2 hrs (extract + format)
    |
    ├── [4] Key Takeaways → Twitter/X Thread
    |       Time: 30 min
    |
    ├── [5] Email Newsletter → Workshop highlights + "Build your own" CTA
    |       Time: 30-45 min
    |
    ├── [6] Documentation Update → Add FAQ or guide based on common questions
    |       Time: 1-2 hrs
    |
    └── [7] Social Media Posts → 3-5 posts across platforms
            Time: 30-45 min
```

**Total additional time**: 6-10 hours per workshop (spread across 1-2 weeks)
**Total content pieces**: 7+ items from one event

### Step-by-Step with Tools

#### Step 1: Record the Workshop
- **Tool**: OBS Studio (free) for screen + webcam, or a simple external camera/phone on a tripod for the room view
- **Audio**: Rode USB-C Mini or Blue Yeti ($60-$130 one-time) — audio quality is non-negotiable
- **Backup**: Record with phone as backup (in case primary recording fails)
- **Time**: 0 additional hours (you are already giving the workshop)

#### Step 2: Full Video Upload to YouTube
- **Tool**: Descript (free tier for first 10 hrs/mo) — import recording, auto-transcribe, cut dead air and filler words, export
- **Process**: Import to Descript, remove the first/last 5 minutes (setup/teardown), add a 5-second branded intro card (Canva template), export, upload to YouTube with optimized title/description/tags
- **Time**: 1-2 hours
- **Quality bar**: Does not need to be polished. Workshop recordings are valued for authenticity, not production quality.

#### Step 3: Blog Post from Workshop Content
- **Tool**: Use the Descript transcript as your first draft. Feed it into Claude/ChatGPT with the prompt: "Turn this workshop transcript into a 1,200-word blog post. Keep the conversational tone. Structure it with subheadings. Include actionable takeaways."
- **Process**: Edit the AI draft heavily — add your specific examples, remove generic advice, add screenshots from the workshop, add a CTA to try Teach Charlie
- **Time**: 2-3 hours
- **Quality bar**: Must include at least one original insight or story from the actual workshop that an AI could not have generated.

#### Step 4: Short Video Clips (3-5 clips, 30-90 seconds each)
- **Tool**: Descript (clip directly from the full video), Opus Clip (free tier — AI-selected highlights), or manual selection
- **Process**: Identify 3-5 moments that are: funny, insightful, surprising, or show a "before/after" moment. Export as vertical video (9:16) for LinkedIn, TikTok, YouTube Shorts.
- **Time**: 1-2 hours
- **Quality bar**: Each clip must be independently interesting — someone who did not attend the workshop should understand and enjoy it.

#### Step 5: Twitter/X Thread
- **Tool**: Your keyboard. Optionally use Typefully (free tier) for scheduling.
- **Process**: Pull 5-7 key takeaways from the workshop. Write them as a numbered thread. First tweet should be a hook: "I just taught 20 small business owners to build their first AI agent. Here's what surprised me:" End with a CTA to the full blog post or video.
- **Time**: 30 minutes
- **Quality bar**: Each tweet should stand alone. No fluff.

#### Step 6: Email Newsletter
- **Tool**: ConvertKit/Beehiiv free tier, or whatever you already use
- **Process**: 300-500 word email with: 1 key insight from the workshop, 1 screenshot or quote from an attendee, 1 CTA (either "try Teach Charlie" or "attend the next workshop")
- **Time**: 30-45 minutes
- **Quality bar**: Must feel personal, not like marketing. Write it like you are texting a friend about what happened.

#### Step 7: Documentation Update
- **Process**: Review questions people asked during the workshop. If any question came up more than once, it reveals a gap in your documentation. Write or update a doc page that answers it.
- **Time**: 1-2 hours (only if a genuine gap exists)
- **Quality bar**: The doc page should be SEO-optimized (title with keyword, proper heading structure, internal links).

### Content Repurposing Calendar (Week After Workshop)

| Day | Task | Time | Output |
|-----|------|------|--------|
| Day 1 (same day) | Upload raw recording to Descript for transcription | 15 min | Transcript |
| Day 2 | Edit and upload full video to YouTube | 1.5 hrs | YouTube video |
| Day 2 | Post 1 social media announcement about the recording | 15 min | Social post |
| Day 3 | Write blog post from transcript | 2.5 hrs | Blog post |
| Day 3 | Extract 3 short clips from recording | 1 hr | 3 short videos |
| Day 4 | Write and send email newsletter | 45 min | Newsletter |
| Day 4 | Write Twitter/X thread | 30 min | Thread |
| Day 5 | Post 1 short clip to LinkedIn + TikTok/YouTube Shorts | 30 min | Social video |
| Day 6 | Post 1 more short clip | 15 min | Social video |
| Day 7 | Update documentation if needed | 1-2 hrs | Doc page |

**Total time over the week**: 7-9 hours
**Total content pieces**: 8-10 items

---

## 5. Comparison Content Strategy

### Which Competitors to Target (and Why)

| Competitor | Create Page? | Reasoning |
|-----------|-------------|-----------|
| **ChatGPT Custom GPTs** | YES (top priority) | Your #1 competitor by user overlap. Most of your target audience tries GPTs first. You need to articulate why a dedicated builder is different. |
| **Botpress** | YES | Strong brand in chatbot space. They are technical — you can win on "easier for non-technical users." |
| **Voiceflow** | YES | Well-known, good docs. Position as "simpler alternative for people who don't need enterprise features." |
| **Chatbase** | YES | Direct competitor in "simple chatbot builder" space. Similar audience. |
| **Zapier AI/Chatbots** | YES | Many of your users already use Zapier. Important to differentiate "automation" vs "AI agent." |
| **Langflow** | YES (different angle) | Not "vs" — instead "Teach Charlie: Langflow Made Easy for Business Users." You are built on Langflow, so this is a "we make it accessible" story. |
| **Intercom/Drift/Zendesk AI** | NO | Different category (customer support platforms with AI features). Your audience is not cross-shopping these. |
| **IBM Watson** | NO | Enterprise-only. Your audience cannot afford it and is not looking at it. |
| **Microsoft Copilot Studio** | MAYBE later | Growing, but currently enterprise-focused. Revisit in 6 months. |
| **Bland AI / Vapi** | NO | Voice AI — different product category. |

### Comparison Page Template

Every comparison page should follow this exact structure. This structure is optimized for both SEO (Google rewards comprehensive, structured comparisons) and conversion (the reader should conclude that Teach Charlie is the right choice for their specific situation).

```
URL: /compare/teach-charlie-vs-[competitor]

TITLE: "Teach Charlie vs [Competitor]: Which AI Agent Builder Is Right for You?"

SECTION 1: The Quick Answer (50 words)
- For people who just want the bottom line
- "If you [specific situation], choose Teach Charlie. If you [different situation], 
  [Competitor] might be better."

SECTION 2: Who Is This Comparison For? (100 words)
- "This comparison is written for non-technical business owners and marketers..."
- Sets the frame: we are comparing from YOUR perspective, not a developer's

SECTION 3: Overview Table
| Feature | Teach Charlie | [Competitor] |
|---------|--------------:|-------------:|
| Best for | Non-technical users | [Their audience] |
| Learning curve | 15 minutes | [Their estimate] |
| Starting price | Free tier | [Their price] |
| No-code? | Yes | [Yes/Partially/No] |
| Custom knowledge | Yes (text, files, URLs) | [Their approach] |
| Embed on website | Yes | [Yes/No] |
| Workshop/training | Yes (live workshops) | [Docs only / etc.] |

SECTION 4: Detailed Comparison (800-1,200 words)
- 4-5 subsections comparing specific dimensions
- Use screenshots from both products
- Be HONEST about where the competitor is better

SECTION 5: When to Choose [Competitor] Instead (Critical for credibility)
- "Choose [Competitor] if you need [specific thing we don't do well]"
- This section builds trust and improves SEO (Google rewards balanced comparisons)

SECTION 6: When to Choose Teach Charlie
- "Choose Teach Charlie if you want to learn AI, not just use a tool"
- Tie back to your differentiation: education-first, non-technical, workshop support

SECTION 7: Try It Yourself (CTA)
- "The best way to decide? Try both. Teach Charlie has a free tier — 
  build your first agent in 15 minutes."
- Link to sign up
```

### SEO Considerations for Comparison Pages

1. **Competitor brand names as keywords are fair game** — Google explicitly allows comparison content. Use the competitor's name in the title, URL, H1, and meta description.

2. **Do NOT run Google Ads on competitor brand names** unless you have budget for the legal nuisance. Bidding on "Botpress" as a keyword is legal but can trigger aggressive responses from well-funded competitors. Organic comparison pages are safer and more sustainable.

3. **Schema markup**: Use FAQ schema on comparison pages (with 3-5 questions like "Is Teach Charlie easier than Botpress?" or "Can Teach Charlie do everything ChatGPT GPTs can?"). This increases the chance of appearing in featured snippets.

4. **Update quarterly**: Comparison pages go stale fast in AI. Set a calendar reminder to update each page every 3 months with the latest features from both products.

### Tone Guidelines

- **Never be negative about the competitor.** "Botpress is a powerful tool designed for developers" — not "Botpress is too complicated."
- **Acknowledge their strengths genuinely.** "Voiceflow has excellent documentation and a strong community." This builds trust with readers and protects you from looking petty.
- **Focus on fit, not superiority.** "Teach Charlie is designed for people who want to learn AI as they build, not just deploy a chatbot" — this is a positioning statement, not a put-down.
- **Use the phrase "right for you" frequently.** This signals to Google and readers that you are providing helpful, unbiased comparison content.

---

## 6. Educational Content Funnel

### Mapping Content to Buyer Journey Stages

```
AWARENESS                    CONSIDERATION                 DECISION                    RETENTION
"I need to learn about AI"   "I need to pick a tool"      "I'm ready to try/buy"     "I want to get better"
         |                          |                            |                          |
    Blog posts                Comparison pages              Case studies              Advanced tutorials
    YouTube explainers        "How to choose" guides        Free trial CTAs           Tips & tricks
    Workshop promos           Feature deep-dives            Pricing page              Community content
    Social media content      Webinar recordings            Demo videos               Missions/gamification
    "What is X?" articles     Integration guides            Workshop sign-up          Monthly newsletter
```

### Awareness Stage Content (Top of Funnel)

**Goal**: Attract people who do not yet know Teach Charlie exists. They are searching for information, not tools.

| Content Type | Example | CTA | Conversion Goal |
|-------------|---------|-----|-----------------|
| Blog: "What Is an AI Agent?" | Pillar 1, Article 1 | "Want to build one? Try Teach Charlie free" | Email signup or free trial |
| YouTube: "AI Explained for Business Owners" | Video #18 from strategy | Link in description to blog | YouTube subscriber |
| Social: "3 AI myths that waste small business owners' time" | LinkedIn post | Link to blog post | Website visit |
| Workshop promo: "Free AI Workshop This Saturday" | Local Facebook group post, Meetup event | Workshop registration | Attendee |
| Blog: "Why Learning AI Doesn't Mean Learning to Code" | Pillar 4, Article 5 | "See how easy it is — try Teach Charlie" | Free trial |

**Key metric**: Website sessions, email list growth, YouTube views
**Expected conversion rate to next stage**: 2-5% of visitors

### Consideration Stage Content (Middle of Funnel)

**Goal**: Help people who know they want an AI tool decide if Teach Charlie is the right one.

| Content Type | Example | CTA | Conversion Goal |
|-------------|---------|-----|-----------------|
| Comparison: "Teach Charlie vs ChatGPT GPTs" | Pillar 3, Article 1 | "Try both — Teach Charlie is free to start" | Free trial signup |
| Blog: "7 Best No-Code AI Agent Builders" | Pillar 3, Article 4 | "Start building with Teach Charlie" | Free trial signup |
| YouTube: "I Tested 5 AI Agent Builders" | Video #15 | Link to free trial | Free trial signup |
| Webinar: "How to Choose the Right AI Agent Builder" | Live or recorded | Register for next workshop | Workshop registration |
| Guide: "How to Train AI on Your Business Data" | Pillar 2, Article 12 | In-article product screenshots + CTA | Free trial signup |

**Key metric**: Free trial signups, workshop registrations, time-on-page
**Expected conversion rate to next stage**: 5-15% of consideration-stage visitors

### Decision Stage Content (Bottom of Funnel)

**Goal**: Remove the last objections and get the person to sign up, attend a workshop, or upgrade.

| Content Type | Example | CTA | Conversion Goal |
|-------------|---------|-----|-----------------|
| Case study: "How [Business] Built an AI Agent in 1 Workshop" | Written story + video testimonial | "Build yours — start free" | Paid conversion |
| Demo video: "See Teach Charlie in Action (3-Minute Tour)" | Screen recording walkthrough | Direct sign-up link | Free trial signup |
| Pricing page | Clear comparison of Free/Pro/Team | "Start Free" button | Paid conversion |
| Free trial email sequence | 5-email onboarding drip | "Build your first agent" | Activation (first agent built) |
| Workshop attendee follow-up | "Here's what you built — keep going!" | Login link + upgrade CTA | Paid conversion |

**Key metric**: Signups, paid conversions, workshop attendance
**Expected conversion rate**: 10-25% of decision-stage visitors

### Retention Stage Content (Post-Purchase)

**Goal**: Keep users engaged, reduce churn, create advocates who refer others.

| Content Type | Example | CTA | Conversion Goal |
|-------------|---------|-----|-----------------|
| Advanced tutorial: "5 Advanced Tricks for Your AI Agent" | Blog + video | "Try this in your agent" | Feature adoption |
| Monthly newsletter: "What's New + Tips" | Email newsletter | "Log in and try it" | Re-engagement |
| Missions/gamification | In-app guided challenges | Complete a mission | Feature discovery |
| Community: "Share Your Agent" Showcase | Social media feature or forum | "Share yours for a chance to be featured" | Advocacy/UGC |
| Tips email series: "AI Agent Tips of the Week" | 12-week drip campaign | One tip + one product feature per email | Retention |

**Key metric**: Monthly active users, feature adoption, NPS, referrals

### Content Funnel Allocation (Where to Spend Your Limited Time)

| Funnel Stage | % of Content Time | Reasoning |
|-------------|-------------------|-----------|
| Awareness | 30% | Fills the top of funnel. Without awareness, nothing else works. |
| Consideration | 35% | This is where your differentiation shines. Comparison content converts well. |
| Decision | 15% | Fewer pieces needed, but each one is high-impact. Case studies + demos. |
| Retention | 20% | Neglected by most startups. Retention content reduces churn, which is more efficient than acquisition. |

---

## 7. Documentation as Marketing

You already have 20 public doc pages (10 user guides + 10 developer docs). This is a meaningful SEO asset that most competitors neglect.

### Why Documentation Matters for SEO

1. **Google loves comprehensive, well-structured documentation.** It signals topical expertise (E-E-A-T).
2. **Documentation pages capture long-tail search traffic** from people searching for specific solutions.
3. **Documentation reduces support burden** — fewer "how do I...?" emails means more time for content creation.
4. **Documentation builds trust** — a well-documented product signals a serious, reliable company.

### Optimization Checklist for Existing 20 Pages

Apply these optimizations to every existing doc page:

#### On-Page SEO
- [ ] **Title tag**: Include primary keyword + brand. Example: "How to Build Your First AI Agent | Teach Charlie Docs"
- [ ] **Meta description**: 150-160 characters, include keyword, include a benefit statement
- [ ] **H1**: One per page, matches the title tag (or close to it)
- [ ] **H2/H3 hierarchy**: Proper nesting, include secondary keywords in subheadings
- [ ] **Internal links**: Every doc page should link to 2-3 other doc pages and 1-2 blog posts
- [ ] **External links**: Link to 1-2 authoritative sources (Google AI docs, Wikipedia for technical terms)
- [ ] **Images**: Add alt text with descriptive keywords. Screenshots should have captions.
- [ ] **URL structure**: Clean, keyword-rich URLs. `/docs/build-first-ai-agent` not `/docs/page-7`

#### Content Enhancements
- [ ] **FAQ section at the bottom**: Add 3-5 FAQs to each doc page. Use FAQ schema markup. These FAQs can rank in Google's "People Also Ask" boxes.
- [ ] **"Next Steps" section**: At the bottom of every page, suggest the logical next action. "Now that you have built your first agent, learn how to train it on your business data."
- [ ] **Difficulty indicator**: Add a "Beginner / Intermediate / Advanced" badge to each doc page. This helps users self-select and signals to Google that you serve multiple skill levels.
- [ ] **Estimated time**: "This guide takes approximately 10 minutes." Reduces bounce rate because users know what they are committing to.
- [ ] **Video embed**: Where possible, embed a corresponding YouTube tutorial. This increases time-on-page (good for SEO) and gives users a choice of learning format.

### New Documentation Pages to Create (Prioritized)

| Page | Target Keyword | SEO Value | Priority |
|------|---------------|-----------|----------|
| "Glossary: AI Terms Explained for Business Users" | "AI glossary for beginners" | High (FAQ-rich, long-tail magnet) | Very High |
| "Troubleshooting: Common Issues and Fixes" | "AI chatbot not working" + specific errors | Medium (captures frustrated users of any tool) | High |
| "Getting Started: Build Your First Agent in 15 Minutes" | "build AI agent tutorial" | High (captures high-intent traffic) | Very High |
| "API Reference for Embed Widget" | "embed AI chatbot API" | Medium (developer-adjacent traffic) | Medium |
| "Integration Guides" (one page per major integration) | "[integration] AI agent" | Medium each, high aggregate | High |
| "Templates Gallery" | "AI agent templates" | High (people search for templates) | Very High |
| "Pricing & Plans Explained" | "Teach Charlie pricing" | Medium (bottom-funnel) | High |
| "Security & Privacy FAQ" | "AI chatbot security" | Medium (trust-building) | Medium |
| "Workshop Materials: Build Along at Home" | "AI workshop materials free" | Medium (captures workshop-adjacent searches) | Medium |
| "Changelog: What's New in Teach Charlie" | Brand searches | Low direct SEO, high trust signal | Low |

### Internal Linking Strategy

**Hub-and-Spoke Model**: Your documentation should have a central "Getting Started" page that links to every other doc page. Every doc page should link back to "Getting Started" and to 2-3 related doc pages.

**Blog-to-Docs Links**: Every blog post that mentions a feature should link to the corresponding doc page. This passes "link juice" from your content-marketing pages to your documentation.

**Docs-to-Blog Links**: Each doc page should link to 1-2 relevant blog posts in a "Learn More" section. This keeps documentation visitors in your ecosystem and exposes them to conversion-oriented content.

**Anchor Text**: Use descriptive, keyword-rich anchor text. "Learn how to train your AI agent on your business documents" — not "click here."

```
                    [Getting Started Guide]
                    /    |    |    |    \
                   /     |    |    |     \
            [Build   [Train  [Embed [Customize [Templates
            Agent]   Agent]  Widget] Personality] Gallery]
               \       |       |       |        /
                \      |       |       |       /
                 [Blog: "How to Build an AI FAQ Bot"]
                 [Blog: "Make Your AI Sound Like Your Brand"]
```

---

## 8. Social Media Strategy

### Platform Selection (Where Your Users Actually Are)

| Platform | Target User Presence | Content Type | Priority | Time Investment |
|----------|---------------------|-------------|----------|-----------------|
| **LinkedIn** | HIGH — SMB owners, marketing managers, professional learners | Text posts, articles, short video, carousels | #1 Priority | 3-4 hrs/week |
| **YouTube** | MEDIUM — tutorial seekers, workshop audience | Long-form tutorials, workshop recordings, comparisons | #2 Priority | 2-4 hrs/week (Phase 2+) |
| **Twitter/X** | MEDIUM — AI enthusiasts, tech-adjacent professionals | Threads, quick tips, engagement with AI conversations | #3 Priority | 1-2 hrs/week |
| **TikTok** | LOW-MEDIUM — younger workshop attendees, viral potential | Short demos, "I built this in 60 seconds" clips | #4 Priority | 1 hr/week (repurposed clips) |
| **Instagram** | LOW — some SMB owners, workshop photos | Stories, reels (repurposed from TikTok), behind-the-scenes | #5 Priority | 30 min/week (repurposed) |
| **Facebook** | MEDIUM for local — local business groups, event promotion | Workshop announcements, group participation | Situational | 1 hr/week (event-driven) |

### LinkedIn Strategy (Your Primary Platform)

**Why LinkedIn is #1**: Your target users (SMB owners 35-50, marketing managers 28-40) are on LinkedIn daily. LinkedIn's algorithm heavily favors text posts from personal accounts (not company pages). The AI conversation is extremely active on LinkedIn. You can build a meaningful following with 3-5 posts per week.

**Posting Frequency**: 4-5 times per week (Monday through Friday)
**Time Investment**: 30-45 minutes per post (including engagement with comments)
**Total weekly time**: 3-4 hours

**Content Mix** (weekly):
- 2x Educational/insight posts (AI tips, lessons from workshops, debunking myths)
- 1x Personal story or behind-the-scenes (building Teach Charlie, workshop moments)
- 1x Promotional (workshop announcement, feature update, blog post link)
- 1x Engagement post (question, poll, "what would you build?")

**LinkedIn Post Templates**:

**Template 1: The Workshop Insight**
```
Last week I taught 15 small business owners to build AI agents.

The #1 thing that surprised them?

[Specific insight from the workshop]

Here's what they learned:

1. [Lesson 1]
2. [Lesson 2]  
3. [Lesson 3]

The agent that impressed me most: [brief description].

If you want to try building your own, link in comments.

#AIforBusiness #SmallBusiness #NoCode
```

**Template 2: The Myth Buster**
```
"You need to know how to code to use AI in your business."

I hear this at every workshop. It's wrong.

Here's what you ACTUALLY need:

→ A clear idea of what questions your customers ask
→ 15 minutes
→ That's it

[Brief description of how Teach Charlie makes this possible]

What's the biggest myth about AI you've heard?
```

**Template 3: The Before/After**
```
Before the workshop: "AI is for big tech companies"
After the workshop: "Wait, I just built a working AI agent for my [business type]?"

This happens every single time.

[Photo or screenshot from workshop]

Next workshop: [Date/Location]. Link in comments.
```

### Twitter/X Strategy

**Why Twitter/X matters**: The AI conversation is extremely active on Twitter/X. AI influencers, founders, and early adopters are here. It is a good place to build credibility and connect with potential partners/advocates.

**Posting Frequency**: 1-2 posts per day (use a scheduling tool)
**Time Investment**: 1-2 hours per week (mostly repurposed content)

**What works on Twitter/X for AI content**:
- Threads (5-10 tweets) that teach something specific
- Quick tips or surprising facts about AI
- Screenshots of AI agents doing interesting things
- Engaging with larger AI accounts (reply thoughtfully to AI influencers — this gets you visibility)
- "Build in public" updates (what you are working on, what you learned)

**What does NOT work**:
- Direct product promotion (will be ignored)
- Long-form content (save that for LinkedIn or blog)
- Being negative about competitors (toxic on Twitter/X)

### TikTok Strategy (Low-Effort, High-Optional-Upside)

**Why consider TikTok**: "Build an AI agent in 60 seconds" videos have viral potential. The effort is minimal if you are already creating workshop clips and screen recordings.

**Posting Frequency**: 2-3 times per week (all repurposed content)
**Time Investment**: 1 hour per week maximum (just reformatting existing clips)

**What works**:
- 30-60 second screen recordings showing the "build" process sped up
- "I built an AI [job] in 60 seconds" format
- Workshop moments where someone reacts to their AI working
- Quick tips with text overlay

**Do NOT create original content for TikTok.** Only post content that was already created for another platform, reformatted to vertical video.

### Social Media Tools (Budget-Friendly)

| Tool | Purpose | Cost | Notes |
|------|---------|------|-------|
| **Buffer** | Scheduling posts across platforms | Free (3 channels) or $6/mo | Simple, reliable, sufficient |
| **Canva** | Graphics, carousels, thumbnails | Free tier | Essential for LinkedIn carousels |
| **Later** | Instagram/TikTok scheduling | Free tier | Only needed if actively posting to these |
| **Typefully** | Twitter/X thread writing + scheduling | Free tier | Clean interface for drafting threads |
| **LinkedIn native** | LinkedIn posting | Free | LinkedIn penalizes posts with external links in the body — put links in comments |

**Recommended stack**: Buffer free tier + Canva free tier = $0/month

### Monthly Social Media Calendar (Example)

| Week | Monday | Tuesday | Wednesday | Thursday | Friday |
|------|--------|---------|-----------|----------|--------|
| 1 | LinkedIn: Workshop insight | Twitter: AI tip | LinkedIn: Blog post promo | Twitter: Thread on topic | LinkedIn: Question/poll |
| 2 | LinkedIn: Behind-the-scenes | Twitter: AI tip | LinkedIn: Carousel (5 tips) | Twitter: Build-in-public update | LinkedIn: Personal story |
| 3 | LinkedIn: Myth buster | Twitter: AI tip | LinkedIn: Feature announcement | Twitter: Thread on topic | LinkedIn: Before/after |
| 4 | LinkedIn: Workshop promo | Twitter: AI tip | LinkedIn: Case study/testimonial | Twitter: Engagement post | LinkedIn: Week recap |

**TikTok/YouTube Shorts**: Post 2-3 repurposed clips throughout the month, whenever you have them ready. No strict schedule needed.

---

## Appendix A: Content Creation Workflow for a Solo Founder

### The "2-Hour Content Block" System

Since you have approximately 20 hours per week for non-technical work, and content is one of several priorities (alongside sales, workshops, operations), you can realistically dedicate 4-6 hours per week to content creation.

**Recommended weekly schedule**:

| Day | Time Block | Activity | Output |
|-----|-----------|----------|--------|
| Monday | 30 min | Write LinkedIn post + schedule week's social media | 5 social posts scheduled |
| Tuesday | 2 hrs | Write/edit 1 blog article | Blog post (or half of one if longer) |
| Wednesday | 30 min | LinkedIn engagement (comment on others' posts) | Visibility + relationships |
| Thursday | 1.5 hrs | Video recording OR blog editing | 1 video or 1 polished article |
| Friday | 30 min | Newsletter draft or doc update | 1 newsletter or 1 doc improvement |

**Total**: ~5 hours/week on content
**Monthly output**: 2-3 blog articles, 1-2 videos, 20 social posts, 2 newsletters

### Quality vs. Quantity Decision Framework

For every piece of content, ask:

1. **Does this teach something my audience cannot easily learn elsewhere?** If no, skip it.
2. **Would I be proud to share this with a workshop attendee?** If no, improve it.
3. **Does this naturally lead to trying Teach Charlie?** If no, add a bridge.
4. **Can I create this in under 3 hours?** If no, simplify or break it into parts.

**The rule**: One excellent article per month outperforms four mediocre articles per month. Your audience is non-technical people who are already overwhelmed by AI content. They need clarity and trust, not volume.

---

## Appendix B: Key Performance Indicators (KPIs) to Track

### Monthly Dashboard (Keep It Simple)

| Metric | Tool | Target (Month 6) | Target (Month 12) |
|--------|------|-------------------|---------------------|
| Organic website sessions | Google Analytics / Search Console | 500 | 3,000 |
| Blog articles published (cumulative) | Manual count | 15 | 30 |
| Email list size | Email tool dashboard | 500 | 2,000 |
| LinkedIn followers | LinkedIn | 1,000 | 3,000 |
| YouTube subscribers | YouTube Studio | 200 | 1,000 |
| Free trial signups from content | UTM tracking | 50/mo | 200/mo |
| Top 10 Google rankings | Google Search Console | 10 keywords | 40 keywords |
| Workshop registrations from content | UTM tracking | 10/mo | 30/mo |

**Do NOT track more than these 8-10 metrics.** More metrics means more time dashboarding and less time creating. Review monthly, not daily.

---

## Appendix C: The First 30 Days Action Plan

If you can only do one thing from each section, do these:

| Week | Action | Time | Output |
|------|--------|------|--------|
| Week 1 | Install Google Search Console on your docs site. Write and publish "Teach Charlie vs ChatGPT GPTs" comparison article. | 4 hrs | 1 article + analytics setup |
| Week 2 | Write and publish "How to Build an AI Agent Without Coding" blog post. Start posting on LinkedIn (3 posts this week). | 5 hrs | 1 article + 3 social posts |
| Week 3 | Record your next workshop. Optimize 5 existing doc pages (title tags, meta descriptions, internal links, FAQ sections). | 4 hrs | 1 recording + 5 optimized pages |
| Week 4 | Upload workshop recording to YouTube. Write recap blog post. Send first newsletter to your email list. | 5 hrs | 1 video + 1 article + 1 newsletter |

**Total time over 30 days**: ~18 hours (spread across the month)
**Total output**: 3 blog articles, 1 YouTube video, 5 optimized doc pages, 12+ social posts, 1 newsletter, analytics tracking installed

This 30-day sprint creates the foundation. Everything after this is maintenance and iteration on a system that compounds.

---

## Final Note: The 80/20 of This Entire Strategy

If you read nothing else, remember these five things:

1. **Record every workshop.** It is the single highest-ROI content activity you can do. Everything else flows from it.

2. **Write comparison content first.** "Teach Charlie vs ChatGPT GPTs" and "Best No-Code AI Agent Builders" will drive more signups than any educational article, because the reader is already looking for a tool.

3. **LinkedIn is your platform.** Your audience is there. The algorithm rewards personal-account text posts. You do not need to be on every platform — be excellent on one.

4. **Long-tail keywords are your path to organic traffic.** You cannot compete with OpenAI for "AI chatbot." You can absolutely own "how to build an AI agent without coding for small business."

5. **Consistency beats brilliance.** Two solid articles per month for 12 months will outperform a burst of 10 articles in month 1 followed by silence. Set a sustainable pace and maintain it.

---

# COMMUNITY BUILDING PLAYBOOK FOR TEACH CHARLIE AI

## Comprehensive Strategy for a Solo Bootstrapped Founder

---

## 1. PLATFORM SELECTION

### Detailed Comparison

#### Discord

| Factor | Assessment |
|--------|-----------|
| **Cost** | Free (Nitro boosts optional) |
| **Audience fit** | POOR for primary demographic. Discord's interface is confusing for non-technical users aged 35-50. The channel/server/role hierarchy creates cognitive overload. Business owners associate Discord with gaming communities, not professional tools. |
| **Onboarding friction** | HIGH. Requires account creation, app download recommended, verification steps. Many in your audience will not have Discord accounts. |
| **Search/discoverability** | POOR. Conversations disappear in real-time chat. No threaded discussions by default. Knowledge gets buried. |
| **Async-friendly** | NO. Discord rewards real-time presence. Your audience has businesses to run; they check communities once a day, not every hour. |
| **Moderation tools** | Good bots ecosystem, but requires technical setup. |
| **Content organization** | Channels only. No built-in courses, no content library. |
| **Why this matters** | Your audience is small business owners who use email, Facebook, and maybe Slack. Asking them to learn Discord adds friction to an already-intimidating AI learning journey. |

**Verdict: REJECT.** The demographic mismatch is disqualifying.

#### Slack

| Factor | Assessment |
|--------|-----------|
| **Cost** | Free tier: 90 days message history, 10 integrations. Pro: $8.75/user/month. |
| **Audience fit** | MODERATE. Business-familiar, but many small business owners (especially solopreneurs) do not use Slack daily. Marketing managers know it well. |
| **Onboarding friction** | MODERATE. Email invite, workspace join. Most know the interface. |
| **Search/discoverability** | Good with Pro plan, crippled on Free (90-day history means your knowledge base evaporates). |
| **Async-friendly** | YES. Threads work well. Channels organize topics. |
| **Moderation tools** | Basic. No built-in community features. |
| **Content organization** | Channels + pinned messages + canvas (new). No courses. |
| **Scaling cost** | PROBLEM. At 200 members on Pro: $1,750/month. Unsustainable. Free tier's 90-day limit destroys institutional knowledge. |
| **Why this matters** | Slack is great for teams, mediocre for communities. The free tier's limitations mean your best content disappears after 90 days, which defeats the purpose of building a knowledge base. |

**Verdict: REJECT for primary community.** Consider a small Slack for a paid-users-only inner circle later (under 20 people, free tier works).

#### Circle

| Factor | Assessment |
|--------|-----------|
| **Cost** | Basic: $89/month. Professional: $199/month. Business: $360/month. |
| **Audience fit** | GOOD. Clean, modern interface. Feels professional, not gamer-ish. Familiar web-based experience (no app required). |
| **Onboarding friction** | LOW. Email invite, browser-based. Intuitive UI. |
| **Search/discoverability** | EXCELLENT. Threaded discussions, search, content spaces, pinned resources. |
| **Async-friendly** | YES. Built for async communities. Email digests bring people back. |
| **Moderation tools** | Good. Member roles, content moderation, reporting. |
| **Content organization** | Spaces (channels), events, courses (on Professional plan), member directory. |
| **Integrations** | Zapier, webhooks, SSO on higher plans. |
| **Why this matters** | Purpose-built for exactly what you need. But $89/month is 18-89% of your total budget. The Professional plan ($199/month) adds courses, which overlap with your gamified missions feature. |

**Verdict: STRONG CANDIDATE but expensive for Phase 1.** Ideal for month 6+ when you have 50+ active members and revenue to justify the cost.

#### Facebook Groups

| Factor | Assessment |
|--------|-----------|
| **Cost** | Free. |
| **Audience fit** | EXCELLENT. Your 35-50 year old business owners are already on Facebook daily. Zero new platform to learn. They are already in other business-oriented Facebook Groups. |
| **Onboarding friction** | LOWEST POSSIBLE. They already have accounts. One click to join. |
| **Search/discoverability** | MODERATE. Facebook search is mediocre, but the algorithm surfaces popular posts. |
| **Async-friendly** | YES. Notification system brings people back. Email digests available. |
| **Moderation tools** | Good. Membership questions, post approval, admin tools, member badges. |
| **Content organization** | POOR. Linear feed, no channels/spaces. Units feature exists but limited. Guides can pin collections of posts. |
| **Algorithm risk** | Facebook controls visibility. Your posts may not reach all members. |
| **Professionalism** | CONCERN. Facebook feels casual. Some users may not take it seriously for a paid product community. |
| **Data ownership** | NONE. Facebook owns everything. You cannot export member data or content. |
| **Why this matters** | The "meet your users where they are" principle is powerful. Your audience is already scrolling Facebook. But the lack of content organization and zero data ownership are serious long-term risks. |

**Verdict: STRONG CANDIDATE for Phase 1** (free, audience is already there), but plan to migrate to an owned platform by month 6-9.

#### Skool

| Factor | Assessment |
|--------|-----------|
| **Cost** | $99/month. |
| **Audience fit** | EXCELLENT. Designed for course creators and community builders. Clean, simple interface. Your audience will have seen Skool communities from other business educators. |
| **Onboarding friction** | LOW. Email signup, browser-based. Very intuitive. |
| **Search/discoverability** | GOOD. Threaded discussions, categories, search. |
| **Async-friendly** | YES. Email notifications, digest emails. |
| **Moderation tools** | Good. Leaderboard gamification built in. |
| **Content organization** | GOOD. Community feed + Classroom (courses) + Calendar (events) + Leaderboard. |
| **Gamification** | BUILT-IN. Points, levels, leaderboard. Aligns perfectly with your "missions" and "gamified learning" features. |
| **Course hosting** | YES. You can host workshop replays, tutorials, onboarding content directly in Skool. |
| **Discovery** | Skool has a built-in discovery marketplace. People browsing Skool can find your community organically. |
| **Why this matters** | Skool was built for exactly your use case: community + education + gamification for a non-technical audience. The built-in leaderboard reinforces your "Dog Trainer" achievement metaphor. The course section can host workshop recordings and tutorials. At $99/month, it is $10 more than Circle's basic plan but includes courses and gamification that Circle charges $199/month for. |

**Verdict: STRONGEST CANDIDATE overall.** But $99/month may be premature when you have fewer than 20 members.

---

### RECOMMENDATION: Phased Platform Strategy

**Phase 1 (Months 1-3): Facebook Group — $0/month**

Start with a free Facebook Group called **"Teach Charlie AI Community — Build Your First AI Agent"** for the following reasons:

1. Your workshop attendees are already on Facebook. After a workshop, saying "Join our Facebook Group" gets 60-80% conversion. Saying "Sign up for Skool" gets 20-30%.
2. Zero cost lets you validate community demand before investing.
3. You need to learn community management rhythms before paying for a platform.
4. Facebook Groups support live video (for mini-workshops), polls (for engagement), and events (for scheduling).

**Phase 2 (Months 4-6): Migrate to Skool — $99/month**

When you hit 40+ active members and have at least $500/month in subscription revenue, migrate to Skool:

1. Announce migration 3 weeks in advance.
2. Offer a "founding member" badge to everyone who migrates in the first week.
3. Keep the Facebook Group open as a "lobby" that points to Skool.
4. Use Skool's classroom feature to host workshop recordings and tutorials.
5. Leverage Skool's built-in gamification to reinforce the "Dog Trainer" achievement system.

**Phase 3 (Month 9+): Evaluate Circle if you need custom branding or API access.**

**Total community platform budget: $0 for months 1-3, $99/month for months 4+.**

---

## 2. COMMUNITY-LED GROWTH PLAYBOOK

### 2A. Ambassador/Champion Program: "Charlie's Pack Leaders"

**Why this matters:** Ambassadors multiply your reach without multiplying your time. One ambassador running a local meetup or answering questions in the community saves you 3-5 hours per week. At your 20 hours/week budget, this is critical.

**Program Name:** "Pack Leaders" (extending the dog metaphor)

**Structure:**

| Level | Title | Requirements | Perks |
|-------|-------|-------------|-------|
| 1 | **Pack Member** | Join community, introduce yourself, build 1 agent | Welcome badge, name in member directory |
| 2 | **Pack Helper** | Answer 10 community questions, share 1 agent showcase | Free month of Individual plan |
| 3 | **Pack Leader** | Host 1 community event OR write 3 tutorials, help 25 members | Free Individual plan (ongoing), "Pack Leader" badge, early access to new features, quarterly 1:1 with founder |
| 4 | **Alpha** (invite-only) | Sustained leadership over 3+ months, measurable impact | Free Team plan, co-create features, speak at workshops, affiliate revenue share (20%) |

**Application Process for Pack Leader (Level 3):**

Post this in the community quarterly:

> **Pack Leader Applications Open**
>
> Want to help shape the future of Teach Charlie AI? We are looking for 3-5 Pack Leaders to join our leadership team.
>
> **What Pack Leaders do:**
> - Answer questions from new members (2-3 per week)
> - Share what you have built (1 showcase per month)
> - Host or co-host 1 community event per quarter (can be a simple 30-min Zoom show-and-tell)
>
> **What you get:**
> - Free Individual plan ($29/month value)
> - "Pack Leader" badge in community and on the platform
> - Early access to every new feature before public launch
> - Quarterly 30-minute 1:1 call with the founder to share feedback
> - Your name on the Teach Charlie website's "Community Leaders" page
>
> **To apply, answer these 3 questions:**
> 1. What have you built with Teach Charlie? (Share a link or screenshot)
> 2. What is one thing you would teach a brand-new member?
> 3. How many hours per week could you contribute? (Be honest — even 1-2 hours helps)
>
> Reply to this post with your answers. We will announce new Pack Leaders next Friday.

**Expectations document (send after acceptance):**

> Welcome to the Pack Leader team! Here is what we expect:
>
> - **Time commitment**: 2-3 hours per week (flexible, not scheduled)
> - **Response time**: Try to respond to member questions within 24 hours (weekdays)
> - **Tone**: Friendly, patient, encouraging. Remember that every member was a beginner once. Use the "Dog Trainer" language — "teach Charlie," "new trick," not "configure the LLM."
> - **Escalation**: If a question is technical or about billing, tag @founder. Do not guess.
> - **Content**: Share at least 1 post per month (agent showcase, tip, tutorial, or success story)
> - **Meetings**: Optional monthly 30-min Pack Leader sync (recorded if you cannot attend)
> - **Duration**: 3-month commitment, renewable. No hard feelings if life gets busy — just let us know.

**Why "Pack Leader" and not "Ambassador":** The word "ambassador" sounds corporate and formal. "Pack Leader" extends your dog metaphor, feels fun, and creates identity. Members will proudly say "I'm a Pack Leader" in their bios.

**Budget: $0-$145/month** (3-5 free Individual plans at $29/month each).

---

### 2B. User-Generated Content Strategy

#### Agent Showcase Gallery: "The Dog Park"

**Why this matters:** Seeing what others have built is the single most powerful motivator for non-technical users. It proves "someone like me did this" and provides templates they can copy.

**Implementation:**

Create a pinned post / dedicated space called **"The Dog Park — Show Off Your Agent"** with this template:

> **Agent Showcase Template**
>
> **Agent Name:** [What did you name your Charlie?]
> **Agent Job:** [What does it do? e.g., "Answers customer FAQs for my bakery"]
> **Industry:** [e.g., Real Estate, Marketing, Education]
> **How I built it:** [Beginner mode? Unlocked the flow? Used a preset?]
> **Coolest thing it does:** [What surprised you?]
> **Screenshot/link:** [Optional — share a screenshot of your agent in action]
> **Time to build:** [How long did it take?]
> **Difficulty (1-5 dog bones):** [1 = puppy easy, 5 = advanced tricks]
>
> Bonus: Tag someone who should try building this!

**Template Sharing Marketplace:**

Until you build a proper in-app marketplace, use the community as the template exchange:

- Create a "Template Exchange" category/channel.
- Users export their agent configuration and share it as a post.
- Other users can import it.
- Tag templates by industry: #realestate #marketing #education #ecommerce #coaching.
- Highlight the most-shared templates monthly.

**Success Story Submissions:**

Create a monthly prompt:

> **Win of the Month**
>
> Tell us about a win you had with your AI agent this month. Big or small — we celebrate everything.
>
> Did your agent:
> - Save you time?
> - Impress a client?
> - Handle something you used to do manually?
> - Teach you something about AI?
>
> Share your win below. Best story gets featured in our newsletter and earns 50 bonus XP.

---

### 2C. Community Challenges

**Why this matters:** Challenges create urgency, provide structure, and give members a reason to log in. They transform passive lurkers into active builders.

**Weekly Mini-Challenge: "Trick of the Week"**

Every Monday, post a challenge that can be completed in 15-30 minutes:

| Week | Challenge | Difficulty |
|------|-----------|-----------|
| 1 | Build an agent that introduces itself in a funny way | Beginner |
| 2 | Create a FAQ agent for your business (at least 5 Q&As) | Beginner |
| 3 | Build an agent that uses a specific persona (pirate, professor, chef) | Beginner |
| 4 | Create an agent that summarizes long text (paste in an article) | Intermediate |
| 5 | Build a customer service agent that handles complaints gracefully | Intermediate |
| 6 | Connect your agent to a knowledge source (upload a document) | Intermediate |
| 7 | Create a "meeting prep" agent that takes notes and suggests questions | Advanced |
| 8 | Build an agent that uses tools (Composio integration) | Advanced |

**Post template:**

> **Trick of the Week #3: The Persona Challenge**
>
> This week, teach Charlie a fun persona. Make your agent respond as a pirate, a 1920s detective, a medieval knight, a surfer — whatever makes you smile.
>
> **How to participate:**
> 1. Go to app.teachcharlie.ai
> 2. Create a new agent (or edit an existing one)
> 3. In Step 1, describe the persona
> 4. In Step 2, give Charlie rules for staying in character
> 5. Test it in the Playground
> 6. Share a screenshot of a funny conversation below
>
> **Prize:** Most creative persona gets "Trick Master" badge and a shoutout in Friday's roundup.
>
> **Deadline:** Friday at 5 PM
>
> Tag someone who would have fun with this!

**Monthly Build Challenge: "Agent of the Month"**

First Monday of each month, announce a themed challenge:

- Month 1: "The Customer Whisperer" — best customer service agent
- Month 2: "The Knowledge Keeper" — best RAG-powered agent
- Month 3: "The Marketing Machine" — best marketing/content agent
- Month 4: "The Team Player" — best agent that uses integrations
- Month 5: "The Educator" — best agent that teaches something
- Month 6: "The Wildcard" — most creative/unexpected agent

**Prizes:**
- Winner: Featured on the Teach Charlie website, 1 month free upgrade, "Agent of the Month" badge
- Runner-up: Shoutout in community + newsletter
- All participants: 25 XP

**Budget: $0-$29/month** (one free month of Individual plan for the winner).

---

### 2D. Peer Support Model

**Why this matters:** At 20 hours/week, you cannot answer every question. By month 3, if you have 50+ members, you will drown in support requests. Peer support is not optional; it is a survival strategy.

**Structure: "Ask the Pack First"**

1. **New member onboarding message** (see Section 7) explicitly says: "Post your question in the community. Our Pack Leaders and experienced members usually respond within a few hours."

2. **Question posting template** (pin this):

> **Asking a Great Question**
>
> Help us help you! When you post a question, include:
> - **What are you trying to do?** (e.g., "I want my agent to answer questions about my PDF")
> - **What happened?** (e.g., "Charlie just says 'I don't know' to everything")
> - **What have you tried?** (e.g., "I uploaded the PDF and set the knowledge source")
> - **Screenshot** (optional but super helpful)
>
> The more detail you share, the faster we can help!

3. **Incentivize helpers:**
   - "Helpful answer" reactions/upvotes earn XP
   - Monthly "Most Helpful Member" recognition
   - Pack Leader pathway (answering questions is a requirement)

4. **Founder's role shifts over time:**
   - Months 1-2: Answer 80% of questions yourself (you are building culture)
   - Months 3-4: Answer 50%, tag Pack Leaders for the rest
   - Months 5-6: Answer 20%, focus on hard/technical questions only
   - Month 7+: Answer 10%, focus on strategy and relationship building

---

### 2E. Community Content Calendar

**Why this matters:** Consistency builds habit. If members know "Monday is challenge day" and "Friday is showcase day," they build a routine of checking in. Inconsistent posting kills communities faster than bad content.

**Weekly Schedule (3-4 posts per week minimum):**

| Day | Post Type | Time | Example |
|-----|-----------|------|---------|
| **Monday** | Trick of the Week challenge | 9 AM local | "This week's challenge: Build a FAQ agent!" |
| **Wednesday** | Educational content / tip | 12 PM local | "Did you know Charlie can remember previous conversations? Here's how to enable memory..." |
| **Friday** | Community spotlight / roundup | 3 PM local | "This week's challenge winners + best community moments" |
| **1st of month** | Monthly challenge launch | 9 AM local | "Agent of the Month: The Customer Whisperer" |
| **15th of month** | Success story feature | 12 PM local | "How Sarah built an AI agent for her real estate business in 20 minutes" |

**Content bank (prepare 20 of these in advance before launching):**

**Educational posts (rotate these):**
1. "3 things most people get wrong when writing Charlie's Job Description"
2. "The secret to making Charlie sound natural (hint: it is not about being formal)"
3. "How to test your agent like a real customer would"
4. "When to use beginner mode vs. unlocking the flow"
5. "5 agent ideas you had not thought of for [industry]"
6. "What 'creativity' (temperature) actually does — and when to turn it up"
7. "How to teach Charlie about YOUR business using knowledge sources"
8. "The difference between a good agent and a great agent (with examples)"
9. "Quick tip: Use Step 2 rules to prevent Charlie from going off-topic"
10. "Real talk: What AI agents can and cannot do (setting realistic expectations)"

**Engagement posts (rotate these):**
1. "What was the first agent you built? Drop a screenshot!"
2. "If you could teach Charlie ANY skill, what would it be?"
3. "What is the funniest thing Charlie has said to you?"
4. "Poll: What industry are you in? Let's find your AI-building tribe!"
5. "Unpopular opinion: You do NOT need to be technical to build useful AI agents. Agree or disagree?"
6. "Tag someone who would love to build an AI agent but thinks they 'can't do tech'"
7. "What is your biggest AI fear? Let's bust some myths."
8. "Show us your workspace! Where do you build your agents?"
9. "One word to describe your experience building your first agent: GO"
10. "If your AI agent had a personality, what would it be? Mine would be a golden retriever — enthusiastic about everything"

**Time investment: 2-3 hours/week** for content creation (batch-create monthly).

---

## 3. SUPPORT DEFLECTION

### 3A. FAQ/Knowledge Base Strategy Within Community

**Why this matters:** Every question you answer twice is wasted time. A living FAQ inside your community turns past answers into permanent assets.

**Implementation:**

**Pinned FAQ Post (update monthly):**

> **Frequently Asked Questions — Start Here**
>
> *Last updated: [date]*
>
> **Getting Started**
> Q: How do I create my first agent?
> A: Go to app.teachcharlie.ai → Click "Create Agent" → Follow the 3-step wizard. [Link to tutorial post]
>
> Q: What is the "Dog Trainer" thing about?
> A: We use a fun metaphor: you are the trainer, Charlie (your AI agent) is the dog learning tricks. "Teaching Charlie" = building your agent. "Tricks" = capabilities. It makes AI less intimidating!
>
> Q: Is this free?
> A: Yes! The Free plan lets you build 1 agent with 50 messages/month. Upgrade to Individual ($29/month) for 5 agents and 500 messages.
>
> **Building Agents**
> Q: My agent is not answering correctly. What do I do?
> A: 90% of the time, this is a Job Description issue. Go to Edit Agent → Step 2 and add more specific rules. [Link to "writing great rules" post]
>
> Q: How do I upload documents for my agent to reference?
> A: Go to Edit Agent → Knowledge Sources → Add Text/File/URL. [Link to tutorial]
>
> Q: What is "Unlock Flow" and should I use it?
> A: Unlock Flow shows the advanced node editor (Langflow). Most users never need this. Start with beginner mode. Only unlock if you want to customize connections between components.
>
> **Account & Billing**
> Q: How do I upgrade my plan?
> A: Go to Settings → Billing → Choose your plan. [Link]
>
> Q: Can I cancel anytime?
> A: Yes. No contracts, no cancellation fees. Your agents stay active until the end of your billing period.
>
> **Troubleshooting**
> Q: Charlie stopped responding / I see an error message.
> A: Try refreshing the page first. If the issue persists, check our [status page] or post in the Help channel with a screenshot.
>
> Q: I lost my agent / my changes disappeared.
> A: Your agents auto-save. Check the Workflows tab to see all your agents. If something is missing, post in Help and we will investigate.
>
> **Did not find your answer?** Post in the Help channel! Our Pack Leaders and community usually respond within a few hours.

---

### 3B. "Ask the Community First" Flow

**Why this matters:** Training users to ask the community instead of emailing you directly is the single most important support scaling decision you will make.

**Implementation:**

1. **Remove or de-emphasize direct email support for Free users.** Your support page should say:

> **Need help?**
>
> **Step 1:** Check our [FAQ] — most questions are answered there.
> **Step 2:** Search the [community] — someone probably asked this before.
> **Step 3:** Post in the community's Help channel — our Pack Leaders respond within a few hours.
> **Step 4:** (Individual/Team plans) Email support@teachcharlie.ai for account or billing issues.

2. **Auto-reply for support emails:**

> Thanks for reaching out!
>
> For the fastest help, post your question in our community: [link]. Our Pack Leaders and experienced builders usually respond within a few hours, and you will often get multiple perspectives.
>
> If this is a billing or account issue, I will personally respond within 24 hours.
>
> — [Your name], Founder of Teach Charlie AI

3. **In-app support prompt (future feature):** When users click "Help" in the app, show community link before contact form.

---

### 3C. Community Moderator Recruitment and Training

**Who to recruit:** Your first 2-3 Pack Leaders who consistently answer questions well. Do not recruit moderators who are merely active posters — you need people who are patient, accurate, and kind.

**Moderator guidelines document:**

> **Pack Leader Moderation Guidelines**
>
> **Your role:** Help members get answers. You are not tech support — you are a helpful neighbor who knows the tool well.
>
> **Do:**
> - Respond to questions within 24 hours (weekdays)
> - Use friendly, encouraging language
> - Share screenshots when explaining steps
> - Tag other Pack Leaders if you are unsure
> - Celebrate wins ("Great job! That agent looks amazing!")
> - Redirect off-topic conversations gently
>
> **Do not:**
> - Guess at technical answers you are unsure of (tag @founder instead)
> - Promise features or timelines ("I'll let the founder know about your idea!")
> - Share private member information
> - Delete posts unless they violate community rules (spam, abuse)
> - Get into arguments
>
> **Escalate to founder (@founder) when:**
> - Bug reports (something is broken in the app)
> - Billing issues
> - Feature requests that need a response
> - Negative/frustrated members who need personal attention
> - Any situation where you are unsure

---

### 3D. When Community Support Breaks Down

Community support has limits. You need a direct support channel when:

| Situation | Why Community Cannot Handle It | Solution |
|-----------|-------------------------------|----------|
| Billing disputes | Privacy, sensitive financial info | Email support (founder handles personally) |
| Account access issues | Requires backend database access | Email support |
| Data loss / bugs | Requires technical investigation | Email + bug report form |
| Frustrated/angry users | Public venting damages community tone | DM the user privately, resolve 1:1 |
| Security/privacy concerns | Must not be discussed publicly | Private email, immediate response |
| Enterprise/custom requests | Complex needs beyond community scope | Schedule a call |

**Threshold for adding ticketed support:** When you consistently receive more than 10 support emails per week that the community cannot handle, evaluate a tool like Crisp (free for 2 seats) or HelpScout ($25/month).

---

## 4. GRADUATION PSYCHOLOGY

### 4A. Gamification Mechanics

**Why this matters:** Your product already has gamified missions. The community should extend this gamification so that upgrading feels like unlocking a new level in a game, not hitting a paywall.

**XP and Level System (integrated between app and community):**

| Level | Title | XP Required | How to Earn |
|-------|-------|-------------|-------------|
| 1 | **Puppy** | 0 | Sign up |
| 2 | **Good Boy/Girl** | 50 | Complete first agent, join community |
| 3 | **Fetcher** | 150 | Complete 3 missions, help 1 member |
| 4 | **Trick Dog** | 300 | Build 3 agents, share 1 showcase |
| 5 | **Top Dog** | 500 | Complete all beginner missions, help 5 members |
| 6 | **Pack Leader** | 1000 | Sustained contribution, community leadership |

**XP earning activities:**

| Activity | XP | Frequency |
|----------|-----|-----------|
| Create an agent | 25 | Per agent (max 5) |
| Complete a mission | 15 | Per mission |
| Send 10 chat messages | 10 | Per 10 messages |
| Share agent showcase | 20 | Per post |
| Answer a community question | 10 | Per answer |
| Get "helpful" reaction on answer | 5 | Per reaction |
| Complete weekly challenge | 15 | Per challenge |
| Win monthly challenge | 50 | Per win |
| Refer a new member | 30 | Per referral |
| Attend a workshop | 25 | Per workshop |

**Badge System: "Tricks Charlie Learned"**

| Badge | Trigger | Copy |
|-------|---------|------|
| First Steps | Create first agent | "Charlie's first day of training!" |
| Quick Learner | Complete onboarding in under 5 min | "Charlie picked that up fast!" |
| Conversationalist | 50 chat messages | "Charlie loves to talk!" |
| Knowledge Keeper | Upload first knowledge source | "Charlie learned to read!" |
| Trick Master | Complete 5 weekly challenges | "Charlie knows ALL the tricks!" |
| Social Butterfly | Help 10 community members | "Charlie made friends at the dog park!" |
| Builder | Create 5 agents | "Charlie's got a whole pack!" |
| Integrator | Connect first Composio tool | "Charlie learned to fetch from other apps!" |

---

### 4B. Social Proof Within Community

**Showcase paid users organically (never call them "paid users"):**

- When someone on an Individual plan shares an agent showcase, their post gets a "Individual Plan" badge next to their name. This is not a callout — it is a subtle status indicator.
- Monthly "What I built this month" posts from paid users (they can do more, so their showcases are naturally more impressive).
- Pack Leaders are on free Individual plans, which means they demonstrate the value of paid features by using them publicly.

---

### 4C. "Unlock" Language vs. "Upgrade" Language

**Why this matters:** The word "upgrade" implies "you are on the inferior version." The word "unlock" implies "you have earned access to something new." This is not semantics — it changes how users feel about paying.

**Language substitution table:**

| DO NOT say | DO say |
|-----------|--------|
| "Upgrade to Pro" | "Unlock more tricks for Charlie" |
| "Your free plan is limited" | "Charlie's ready to learn more!" |
| "You've hit your limit" | "Charlie's had a busy day! Unlock more conversations" |
| "Buy the premium plan" | "Ready for the next level? Unlock Individual" |
| "Free trial expired" | "Your training session was great! Keep going?" |
| "Pricing page" | "Choose Charlie's training plan" |
| "Downgrade" | "Adjust your training plan" |

---

### 4D. The IKEA Effect

**Why this matters:** Research (Norton, Mochon, Ariely, 2012) shows that people value things more when they helped create them. A user who spent 45 minutes in your workshop building an agent will pay to keep it alive. This is your most powerful conversion mechanism.

**How to exploit this in workshops:**

1. **Every workshop participant builds a working agent during the session.** Not a demo. Their own agent, for their own business. They name it, they test it, they see it work.

2. **At the end of the workshop, say:** "The agent you just built is saved to your free account. You can keep using it. If you want to build more agents or teach Charlie advanced tricks, you can unlock the Individual plan — and because you came to the workshop, you get 20% off your first 3 months."

3. **Follow up 48 hours later:**

> Subject: Charlie is waiting for you!
>
> Hey [name],
>
> Remember the agent you built at [workshop name]? Charlie's been practicing — and your agent is ready to go at app.teachcharlie.ai.
>
> A few people from the workshop have already started building their second agent. [Name] built a [type of agent] and said "[short quote]."
>
> If you want to keep building, your workshop discount (20% off Individual for 3 months) is active for the next 5 days.
>
> Teach Charlie a new trick: [link to app]
>
> — [Your name]

**Conversion target:** 15-25% of free workshop attendees convert to paid within 30 days when they have built something during the workshop.

---

### 4E. Specific Upgrade Prompt Copy

**In-app upgrade prompts (when user hits a limit):**

**Agent limit hit:**
> "Charlie's got a full class! You've built your first agent — nice work. Ready to expand the pack? Unlock Individual to train up to 5 Charlies."
> [Unlock Individual — $29/month] [Maybe later]

**Message limit hit:**
> "Charlie's had a great training day! You've used all 50 conversations this month. Want to keep the momentum going? Individual members get 500 conversations per month."
> [Keep training — Unlock Individual] [I'll wait until next month]

**Knowledge source limit hit:**
> "Charlie just learned to read! Want to teach Charlie even more? Individual members can upload unlimited knowledge sources — PDFs, websites, notes, you name it."
> [Teach Charlie more] [Not right now]

**Feature gating (Composio tools):**
> "Charlie's ready to learn some advanced tricks! Connect to 500+ apps like Gmail, Slack, and Google Sheets. This is where things get really fun."
> [Unlock integrations] [Tell me more first]

**Key principles in all copy:**
- Celebrate what they have already accomplished before mentioning the limit.
- Frame the paid plan as the "next step in Charlie's training," not a paywall.
- Always offer a low-pressure exit ("maybe later," "not right now").
- Never use urgency or guilt.

---

## 5. USER STORIES AND CASE STUDIES

### 5A. How to Ask for Case Studies

**When to ask:** After a user has been active for 30+ days, has built 2+ agents, and has said something positive in the community or in a support interaction. Do not ask cold.

**Email template:**

> Subject: Would you be up for sharing your Teach Charlie story?
>
> Hey [name],
>
> I noticed you have been building some really cool agents — especially [specific agent they built]. That is exactly the kind of thing other [their industry] professionals would love to see.
>
> Would you be open to a quick 20-minute chat about your experience? I would love to feature your story in our community and on our website.
>
> Here is what is in it for you:
> - Your business gets featured on our website (with a link to your site)
> - You get a "Featured Builder" badge in the community
> - I will send you a $25 Amazon gift card as a thank-you
> - If you are on the Individual plan, I will extend it by 1 free month
>
> No pressure at all — just reply "sure" and I will send a few time options.
>
> Thanks for being part of the Teach Charlie community!
>
> — [Your name]

**Response rate expectation:** 30-40% of users you ask will say yes if you have a genuine relationship. Do not mass-email this.

---

### 5B. Case Study Interview Questions (10 Questions)

Use these in a 20-minute Zoom call. Record with permission.

1. "Tell me about your business. What do you do and who do you serve?"
2. "Before Teach Charlie, how were you handling [the task the agent now does]? What was that like?"
3. "What made you try Teach Charlie? Was there a specific moment or frustration?"
4. "Walk me through building your first agent. What was that experience like?"
5. "Was there a moment where you thought 'wow, this actually works'? What happened?"
6. "How are you using your agent now? Walk me through a typical day."
7. "What has the impact been? Time saved? Clients impressed? Revenue affected?"
8. "What would you tell someone who thinks they are 'not technical enough' to build an AI agent?"
9. "Is there anything you wish the product did differently?"
10. "If I could wave a magic wand and add one feature, what would it be?"

**Follow-up prompt for specific numbers:** "You mentioned it saves you time. Can you estimate how many hours per week? Even a rough guess helps."

---

### 5C. Case Study Template

> **TITLE: How [Name] Built an AI [Agent Type] for [Their Business] in [Time]**
>
> **THE CHALLENGE**
> [2-3 sentences about their situation before Teach Charlie. What was the pain? What were they doing manually?]
>
> **THE SOLUTION**
> [2-3 sentences about how they used Teach Charlie. Which features? How long did it take to build? Did they use beginner mode or unlock the flow?]
>
> **THE RESULTS**
> - [Specific metric: hours saved, response time improved, clients served]
> - [Specific metric: revenue impact, cost savings, efficiency gain]
> - [Qualitative: how they feel, client feedback, confidence level]
>
> **IN THEIR WORDS**
> "[A compelling direct quote from the interview — ideally something emotional or surprising]"
>
> **ABOUT [NAME]**
> [1 sentence about them, their business, link to their website]

**Length:** 300-500 words. Shorter is better. Include a photo of the person (with permission) and a screenshot of their agent.

---

### 5D. Where to Publish

| Channel | Format | Frequency |
|---------|--------|-----------|
| Community | Full case study post + discussion | Every case study (ongoing) |
| Website (/stories) | Formatted page with photo | Every case study |
| Newsletter | Summary + link to full story | 1 per month |
| Social media | Quote card + link | 1-2 per week (rotate stories) |
| Workshop slides | 1-slide summary as social proof | Every workshop |
| App onboarding | "People like you are building..." | Rotate 3 featured stories |

---

### 5E. Incentives for Participation

| Incentive | Cost | Effectiveness |
|-----------|------|---------------|
| $25 Amazon gift card | $25 | High — tangible and immediate |
| 1 free month of Individual | $0 (forgone revenue) | High for existing paid users |
| "Featured Builder" badge | $0 | Moderate — appeals to community-active users |
| Backlink to their website | $0 | High for business owners (SEO value) |
| Social media shoutout | $0 | Moderate — depends on your following size |

**Budget: $25-$75/month** for 1-3 case studies per month.

---

### 5F. How Many You Need at Each Stage

| Stage | Case Studies Needed | Why |
|-------|-------------------|-----|
| **Launch (Month 1)** | 3-5 | Enough to show variety. Get these from workshop beta participants before public launch. |
| **Month 3** | 10+ | Cover 3-4 different industries. Start including specific metrics. |
| **Month 6** | 20+ | Full library. Segment by industry, use case, and user type. Begin video testimonials. |
| **Month 12** | 30+ | Comprehensive library. Start featuring "year in review" stories from long-term users. |

**Critical:** Get your first 3 case studies BEFORE launching the community. Pre-populate the community with these stories so new members immediately see social proof.

---

## 6. COMMUNITY METRICS

### What to Measure and What "Good" Looks Like

**Why this matters:** Without metrics, you are flying blind. You will not know if your community is thriving or dying until it is too late. These numbers tell you where to focus your limited time.

#### Primary Metrics

| Metric | Definition | Month 1 Target | Month 3 Target | Month 6 Target | "Healthy" Benchmark |
|--------|-----------|----------------|----------------|----------------|-------------------|
| **Total members** | People who joined the community | 20-30 | 75-100 | 200-300 | Growing 15-25% month-over-month |
| **DAU/MAU ratio** | Daily active users / Monthly active users | 10-15% | 15-20% | 20-30% | 20%+ is excellent for a niche community |
| **Posts per week** | New posts (excluding founder) | 5-10 | 20-40 | 50-100 | 1-2 posts per active member per month |
| **Response time** | Time to first reply on a question | <24 hours | <12 hours | <6 hours | Under 4 hours is excellent |
| **Member-to-member help ratio** | % of questions answered by non-founder members | 10-20% | 40-50% | 60-70% | 70%+ means your community is self-sustaining |
| **Weekly active members** | Members who posted or reacted in last 7 days | 30-40% of total | 30-40% | 25-35% | 30%+ is healthy |

#### Conversion Metrics

| Metric | Definition | Target | Why It Matters |
|--------|-----------|--------|---------------|
| **Community → Free signup** | Members who create a Teach Charlie account | 80%+ | Community should drive product usage |
| **Community → Paid conversion** | Members who upgrade to Individual | 5-10% within 60 days | Community should drive revenue |
| **Workshop → Community join** | Workshop attendees who join community | 50-70% | Measure workshop-to-community pipeline |
| **Community-attributed NPS** | NPS of community members vs. non-members | Members 15+ points higher | Proves community adds value |

#### Health Indicators (Red Flags)

| Red Flag | Threshold | Action |
|----------|-----------|--------|
| DAU/MAU drops below 10% | 2 consecutive weeks | Increase challenge frequency, DM inactive members |
| No member-to-member replies | More than 3 unanswered questions | Personally tag Pack Leaders, answer yourself |
| Founder posts > 60% of content | After month 2 | Run engagement campaign, recruit more contributors |
| New member intro rate drops | Below 50% of joins | Simplify onboarding, improve welcome message |
| Negative sentiment spike | 3+ complaints in a week | Address publicly, reach out to frustrated users 1:1 |

**Tracking tools:**
- Facebook Groups: Built-in analytics (free) — shows active members, engagement, top contributors
- Skool: Built-in analytics — shows activity, leaderboard, member engagement
- Google Sheets: Manual tracking of conversion metrics (community member → signup → paid). 15 minutes per week.

---

## 7. COMMUNITY LAUNCH PLAN: Week-by-Week for First 8 Weeks

### Pre-Launch (2 Weeks Before)

**Week -2: Seed Content and Infrastructure**

| Task | Time | Details |
|------|------|---------|
| Create Facebook Group | 30 min | Name: "Teach Charlie AI Community — Build Your First AI Agent." Set to Private (visible, approval required). Add cover photo with dog/AI branding. |
| Write community rules | 1 hour | See below |
| Write welcome message | 30 min | See below |
| Create 5 seed posts | 2 hours | 2 educational, 1 showcase, 1 challenge, 1 introduction from founder |
| Post 3 case studies | 1 hour | From beta/workshop participants |
| Set up membership questions | 15 min | See below |
| Create pinned FAQ post | 1 hour | See Section 3A |
| Invite 10-15 beta testers | 30 min | Personal DMs to workshop attendees, beta users |

**Community Rules:**

> **Community Guidelines**
>
> Welcome to the Teach Charlie AI Community! This is a space for people learning to build AI agents — no matter your technical level.
>
> **Be kind.** Everyone here was a beginner once. Encourage, do not judge.
>
> **Be helpful.** If you know the answer, share it. If you do not, someone else will.
>
> **Share what you build.** Showcases inspire everyone. Do not be shy — even a simple agent is worth celebrating.
>
> **Stay on topic.** This community is about building AI agents with Teach Charlie. General AI news, politics, and unrelated promotions belong elsewhere.
>
> **No spam or self-promotion.** Sharing your business in context ("I built an agent for my bakery") is great. Dropping links to sell your services is not.
>
> **Ask great questions.** Include what you are trying to do, what happened, and what you have tried. Screenshots help!
>
> **Respect privacy.** Do not share screenshots that include other people's data, API keys, or personal information.
>
> **Have fun.** We are teaching a digital dog new tricks. Enjoy the journey.

**Membership questions (Facebook Group):**

1. "What is your name and what do you do? (e.g., 'Sarah, real estate agent in Austin')"
2. "How did you hear about Teach Charlie AI?"
3. "What is one thing you would love an AI agent to help you with?"

These questions serve dual purposes: they filter spam and give you data on who is joining and why.

**Welcome message (sent to every new member, or pinned as first post in onboarding):**

> **Welcome to the Pack!**
>
> Hey [name], so glad you are here!
>
> You just joined a community of [number] people who are learning to build AI agents — no coding required. Whether you are a total beginner or you have been tinkering with AI for months, you belong here.
>
> **Here is how to get started:**
>
> 1. **Introduce yourself** in the comments below. Tell us your name, what you do, and what you would love to teach Charlie to do. (Even if you are not sure yet — that is okay!)
>
> 2. **Build your first agent** at app.teachcharlie.ai (it is free). It takes about 5 minutes. Then come back and show us what you built!
>
> 3. **Check out the FAQ** [pinned post] if you have questions. Or just ask — our community is incredibly helpful.
>
> 4. **Join this week's challenge** [link to current challenge] for a fun way to learn.
>
> **A few tips:**
> - There are no dumb questions here. Seriously.
> - Use the "Dog Trainer" language — you are the trainer, Charlie is learning tricks.
> - The most common question is "what should I build?" Answer: something for YOUR business. Your first agent should solve a real problem you have.
>
> Welcome to the pack. Let's teach Charlie some tricks!
>
> — [Your name], Founder

---

### Week 1: Soft Launch

**Goal:** 15-25 members. Establish culture and posting rhythm.

| Day | Action | Time | Details |
|-----|--------|------|---------|
| Mon | Official welcome post | 30 min | Post your founder story: why you built this, what you believe, what this community is for |
| Mon | Invite first 15 members | 1 hour | Personal DMs to: 5 workshop attendees, 5 beta users, 3-5 friends/colleagues who fit the audience. Personal invitation, not mass message. |
| Tue | First educational post | 30 min | "5 agent ideas for small business owners (with examples)" |
| Wed | First challenge | 30 min | "Build an agent that introduces your business. Share a screenshot!" |
| Thu | Engage with every reply | 1 hour | Like, comment on, and respond to every single post and comment. This is how you build culture. |
| Fri | First roundup | 30 min | "Week 1 recap: [number] members, [number] agents built, here's what people are saying..." |
| Sat/Sun | Rest | 0 | Engage only if someone asks a question |

**Critical week 1 behavior:** You personally respond to every single post. Every introduction gets a thoughtful reply. Every question gets an answer within 4 hours. This sets the expectation that this community is alive, responsive, and cared for.

---

### Week 2: Build Momentum

**Goal:** 25-40 members. First member-to-member interactions.

| Day | Action | Details |
|-----|--------|---------|
| Mon | New challenge + invite 10 more people | "This week: build a customer FAQ agent" |
| Tue | Share first case study | Feature a beta user's success story |
| Wed | Educational post | "How to write Charlie's Job Description like a pro" |
| Thu | Tag-a-friend post | "Tag someone who runs a small business and would love this" |
| Fri | Spotlight a member | "Shoutout to [name] who built [agent] this week!" |

**Week 2 tactic: Manufacture conversations.** If nobody is posting, DM 3 active members and say: "Hey, would you mind sharing what you built this week? I think it would inspire others." Most people will say yes — they just need permission and a prompt.

---

### Week 3: Introduce Structure

**Goal:** 40-50 members. Establish regular rhythms.

| Day | Action | Details |
|-----|--------|---------|
| Mon | Trick of the Week (make it weekly from now on) | Clear template, clear deadline, clear prize |
| Tue | "Ask Me Anything" post | "I'm the founder. Ask me anything about AI agents, the product, or what's coming next" |
| Wed | User tip post | Ask a member to write a tip (DM them first, offer to ghostwrite if needed) |
| Thu | Poll | "What should next week's challenge be? Vote!" |
| Fri | Weekly roundup + challenge winner | Make it a ritual |

**Week 3 tactic: Recruit first Pack Leader candidate.** Identify the 1-2 members who have been most active and helpful. DM them:

> "Hey [name], I have noticed you have been incredibly helpful in the community — especially [specific example]. I am starting a 'Pack Leader' program for our most active members. Would you be interested? It comes with a free Individual plan and early access to new features."

---

### Week 4: Amplify

**Goal:** 50-60 members. Community starts generating its own content.

| Day | Action | Details |
|-----|--------|---------|
| Mon | Launch Monthly Challenge: "Agent of the Month" | Bigger prize, month-long timeline |
| Tue | Cross-promote: post in 2-3 adjacent Facebook groups | Share a valuable tip (not a promo) with a link to your community in the comments |
| Wed | Educational series: "Agent Building 101 — Part 1" | Start a 4-part series to create return visits |
| Thu | Celebrate community milestone | "We hit 50 members! Here's what this community has built so far..." |
| Fri | Announce Pack Leader program publicly | See application template in Section 2A |

---

### Week 5: Deepen Engagement

**Goal:** 60-80 members. Member-to-member help ratio hits 30%.

| Day | Action | Details |
|-----|--------|---------|
| Mon | Weekly challenge continues | |
| Tue | Feature Pack Leader introductions | Let new Pack Leaders introduce themselves |
| Wed | "Agent Building 101 — Part 2" | |
| Thu | Live Q&A session (Facebook Live or Zoom) | 30 min, casual, answer questions in real-time |
| Fri | Roundup + Agent of the Month update | |

**Week 5 tactic: First live event.** Even if only 5 people show up, a live session creates energy and deepens relationships. Record it and post the replay.

---

### Week 6: Scale Content

**Goal:** 80-100 members. Start reducing your content creation burden.

| Day | Action | Details |
|-----|--------|---------|
| Mon | Pack Leaders post the weekly challenge (not you) | Train them by writing it together the first time |
| Tue | Member-contributed tutorial | Ask a power user to write "How I built [specific agent]" |
| Wed | "Agent Building 101 — Part 3" | |
| Thu | Template exchange launch | "Share your agent configs! Import others' templates!" |
| Fri | Pack Leader posts the weekly roundup | Start delegating rituals |

---

### Week 7: Community Identity

**Goal:** 100+ members. Community develops its own personality and inside jokes.

| Day | Action | Details |
|-----|--------|---------|
| Mon | "Community Awards" thread | "Nominate someone for Most Helpful, Best Agent, Funniest Charlie Moment" |
| Tue | Cross-promotion push | Post in 5 adjacent Facebook groups (with permission) |
| Wed | "Agent Building 101 — Part 4 (Final)" | |
| Thu | Fun/culture post | "If your AI agent were a dog breed, what would it be and why?" |
| Fri | First monthly awards ceremony | Announce winners, give badges |

---

### Week 8: Evaluate and Plan

**Goal:** Review metrics, decide on Skool migration timeline.

| Task | Details |
|------|---------|
| Review all metrics | Member count, DAU/MAU, posts/week, response time, member-to-member ratio |
| Survey members | "What do you love about this community? What is missing?" |
| Evaluate Skool migration | If 50+ active members and $500+/month revenue, begin planning migration |
| Plan Month 3 content calendar | Based on what worked in Weeks 1-8 |
| Recruit 2 more Pack Leaders | Based on Week 1-8 activity |
| Document what worked and what did not | Be honest. Kill what is not working. Double down on what is. |

---

### Avoiding the "Dead Community" Problem

The number one killer of communities is the silence spiral: nobody posts → nobody checks → nobody posts. Here is how to prevent it.

**Pre-emptive measures:**

1. **Never launch to zero.** Have 10-15 members and 5-10 posts before any public announcement. A new member should walk into a living room, not an empty warehouse.

2. **Seed 2-3 conversations per day for the first 30 days.** If nobody posted today, you post. If nobody replied to a question, you reply. Never let a question go unanswered for more than 8 hours.

3. **DM lurkers.** After someone joins but does not post for 5 days, send a personal DM:
> "Hey [name], welcome to the community! I saw you are interested in [answer from their membership question]. Have you had a chance to build your first agent yet? Happy to help if you are stuck on anything."

4. **Make posting easy.** Templates, fill-in-the-blank prompts, polls, and reaction-based posts (agree/disagree, this-or-that) lower the barrier to participation.

5. **Celebrate everything.** First post? Celebrate. First agent? Celebrate. First question? Celebrate. Built something basic? Celebrate. This trains the behavior you want to see.

6. **Create obligations.** Weekly challenges with deadlines create social pressure to participate. "Everyone is sharing their agents this week" makes lurking feel like missing out.

7. **Share your own journey.** Post your own struggles, learnings, and behind-the-scenes moments. Vulnerability from the founder gives others permission to be imperfect.

---

## BUDGET SUMMARY

| Item | Monthly Cost | Priority |
|------|-------------|----------|
| Facebook Group (Phase 1) | $0 | Required |
| Skool (Phase 2, month 4+) | $99 | Required when ready |
| Pack Leader free plans (3-5 people) | $0-$145 (forgone revenue) | Required by month 2 |
| Case study gift cards (1-3/month) | $25-$75 | Required by month 2 |
| Monthly challenge prizes | $0-$29 (free plan month) | Nice to have |
| **TOTAL (Phase 1)** | **$25-$249/month** | |
| **TOTAL (Phase 2)** | **$124-$348/month** | |

---

## THE NUMBER ONE RISK

**The number one risk for community building as a solo founder is founder burnout from trying to be everywhere at once.**

You have 20 hours per week. Community management can easily consume 10-15 of those hours if you are not disciplined. Here is the mitigation plan:

1. **Time-box community work to 5 hours per week maximum.** Monday: 1 hour (challenge post + engagement). Wednesday: 1 hour (educational post + engagement). Friday: 1 hour (roundup + engagement). Remaining 2 hours: DMs, moderation, Pack Leader coordination.

2. **Batch-create content monthly.** Spend one 3-hour session per month creating all posts for the next 4 weeks. Schedule them using Facebook's built-in scheduler or a free tool like Buffer (free for 3 channels).

3. **Recruit Pack Leaders by month 2, not month 6.** The sooner you have 2-3 reliable community helpers, the sooner you can step back from answering every question.

4. **Accept imperfection.** A community with 50 engaged members and some unanswered questions is better than a perfect community with 10 members and a burned-out founder. Good enough is good enough.

5. **Protect your building time.** If community management is eating into your product development, workshop prep, or sales time, something is wrong. Community should amplify your work, not replace it.

---

This playbook gives you a complete, budget-conscious, solo-founder-realistic community building strategy. The phased approach (Facebook free, then Skool paid) matches your budget. The Pack Leader program scales your support capacity. The gamification and graduation psychology turn free users into paid advocates. And the week-by-week launch plan eliminates the guesswork from your first two months.

Execute this sequentially. Do not try to do everything at once. Week 1 is about 15 people and showing up every day. Everything else follows from that foundation.

---

# GROWTH LOOPS & VIRAL MECHANICS — Teach Charlie AI Launch Playbook

---

## Executive Summary

This section maps every viable growth loop for Teach Charlie AI, ranked by a solo bootstrapped founder's most constrained resources: time, money, and technical capacity. The core thesis is that **the embed widget is your single highest-leverage growth channel** because it turns every customer's website into a billboard, and the workshop loop is your highest-converting acquisition channel because it delivers activated users, not just signups.

The recommended sequencing:

| Quarter | Primary Loop | Secondary Loop | Investment |
|---------|-------------|----------------|------------|
| Q1 (Launch) | Workshop loop | Embed badge loop | 15 dev days + $200/mo |
| Q2 | Embed badge loop | Content/SEO loop | 10 dev days + $300/mo |
| Q3 | Referral program | Template marketplace | 12 dev days + $400/mo |
| Q4 | Partner/affiliate program | Community loop | 8 dev days + $500/mo |

**Do not try to build all six loops simultaneously.** A solo founder running all loops at once will execute none of them well. The playbook below is ordered by recommended build sequence.

---

## 1. Product-Led Growth Features to Prioritize Building

### Priority Matrix

Each feature is scored on two axes:
- **Growth Impact** (1-10): How many new users this feature can generate per month at steady state
- **Dev Effort** (days): Calendar days for AI-assisted development (Claude Code), assuming 4-6 productive hours/day

The priority score is `Impact / Effort`, producing a bang-for-buck ranking.

---

### Rank 1: "Powered by Teach Charlie" Badge on Embedded Widgets

**Feature Description**: Every agent deployed via the embed widget displays a small, tasteful badge in the bottom corner reading "Powered by Teach Charlie" with a clickable link to a dedicated signup landing page (`https://teachcharlie.ai/from-widget?ref={user_id}`). The badge is always present on the Free plan, optionally removable on Pro ($49/mo) and always removable on Team ($99/mo).

**Development Effort**: 3-4 days
- Day 1: Design and implement badge component in the embed widget (HTML/CSS overlay positioned in the widget footer)
- Day 2: Build the dedicated landing page at `/from-widget` with referral attribution tracking (UTM params + `ref` user ID)
- Day 3: Add badge visibility toggle to Pro/Team billing tiers; update embed snippet generation to include user ID
- Day 4: Analytics tracking (badge impressions, clicks, signups attributed)

**Expected Growth Impact**: 8/10

This is the single highest-leverage feature because it scales with your customers' traffic, not yours. If 50 users deploy widgets that collectively serve 100,000 pageviews/month, even a 0.1% click-through rate yields 100 qualified visitors/month to your signup page. These visitors are pre-qualified: they have already interacted with an AI agent and understand the value.

**Benchmark Data**:
- Intercom's "Powered by" badge generates approximately program generated 30-40% of their early signups (per their S-1 filing context)
- Typeform's badge drives an estimated 15-20% of new signups
- Drift attributed approximately 25% of inbound signups to their chat widget badge in their first 2 years
- For a smaller product, expect 5-15% of total signups to come from this channel within 6 months

**Priority Score**: 8 / 3.5 = **2.29 (HIGHEST)**

**Why This Matters**: This is the only growth feature that generates compounding returns with zero marginal cost per impression. Every customer who deploys a widget becomes an unpaid distribution channel. The economics improve as your customer base grows.

---

### Rank 2: Social Sharing of Agent Achievements / Missions Completed

**Feature Description**: When a user completes a mission milestone (first agent built, first 100 conversations, first integration connected), display a celebration modal with a pre-composed social share. The share includes a visual card (OG image) showing the achievement, the user's agent name, and a link to Teach Charlie.

Example share text: *"I just trained my first AI agent, Charlie, to handle customer support for my business! Built in 20 minutes with @TeachCharlieAI. No code required. Try it free: teachcharlie.ai/start"*

**Development Effort**: 5-6 days
- Day 1-2: Build OG image generation service (use a template with dynamic text overlay; can use Satori/`@vercel/og` or a simple Cloudinary URL-based approach)
- Day 3: Build share modal component triggered on mission completion events
- Day 4: Implement share targets (Twitter/X, LinkedIn, copy-to-clipboard, email)
- Day 5: Build public achievement page at `/achievements/{user_id}/{mission_id}` that renders the OG card and a CTA to sign up
- Day 6: Analytics tracking and A/B test different share copy variants

**Expected Growth Impact**: 6/10

Social sharing works best when the thing being shared is genuinely impressive or novel. "I built an AI agent" is currently a strong social signal because it is perceived as technically sophisticated. This window will narrow as AI agents become commoditized, so capturing this social proof early (2026) is time-sensitive.

**Benchmark Data**:
- Canva's "I made this" sharing drives approximately 7-12% of new signups
- Duolingo's streak sharing generates approximately 5-8% of reactivations
- For a niche B2B tool, expect 2-5% of users to share, with each share generating 0.5-2 clicks on average

**Priority Score**: 6 / 5.5 = **1.09**

**Why This Matters**: Social sharing generates trust signals (social proof from peers) that paid advertising cannot replicate. A small business owner seeing their peer share "I built an AI agent" is far more persuasive than any ad.

---

### Rank 3: Agent Template Marketplace / Gallery

**Feature Description**: A public-facing gallery at `teachcharlie.ai/templates` where users can browse, preview, and one-click clone agent templates. Initially seeded with 15-20 templates created by the founder (customer support agent, appointment booker, FAQ bot, lead qualifier, etc.). Later, allow users to publish their own templates (with approval moderation).

**Development Effort**: 8-10 days
- Day 1-2: Build public gallery page with search/filter (by industry, use case, integration type)
- Day 3: Build template detail page with live preview (simulated chat conversation showing the agent in action)
- Day 4: Implement "Use This Template" flow: click → signup (if not logged in) → template auto-loaded into the 3-step Q&A wizard with pre-filled answers
- Day 5-6: Build template submission flow for existing users (publish button on agent detail page, admin approval queue)
- Day 7: SEO optimization (each template page is a landing page targeting "[industry] AI agent template" keywords)
- Day 8-9: Template rating/review system (simple thumbs up/down + usage count)
- Day 10: Analytics and iteration

**Expected Growth Impact**: 7/10

Template galleries serve dual purposes: SEO (long-tail keyword landing pages) and activation (reduce time-to-value for new signups). Each template page targets a keyword like "AI customer support agent template" or "real estate AI assistant template," which can rank in search within 3-6 months.

**Benchmark Data**:
- Notion's template gallery is their #1 organic growth channel, driving approximately 35% of organic signups
- Zapier's integration pages generate approximately 40% of their organic traffic
- For a new product, expect template pages to generate 10-30 organic visits/day within 6 months if well-SEO'd

**Priority Score**: 7 / 9 = **0.78**

**Why This Matters**: Templates reduce the blank-canvas problem. Non-technical users freeze when asked to create something from scratch. A template gallery converts "I don't know where to start" into "I'll customize this one." This directly improves activation rates.

---

### Rank 4: Public Agent Profiles / Portfolios

**Feature Description**: Each user gets a public profile page at `teachcharlie.ai/@{username}` showing their published agents, mission badges, and a brief bio. Agents on the profile can be interacted with via a live demo (limited to 5 messages for non-authenticated visitors).

**Development Effort**: 7-8 days
- Day 1-2: Build public profile page with agent cards, bio, avatar, mission badges
- Day 3-4: Implement limited public agent interaction (5-message trial, then "Sign up to build your own" CTA)
- Day 5: Build profile settings page (username, bio, which agents to make public)
- Day 6: SEO optimization (structured data for person + software application schema)
- Day 7-8: Social sharing integration (share profile link on LinkedIn, Twitter/X)

**Expected Growth Impact**: 5/10

Public profiles create a network effect where users promote the platform by promoting themselves. Consultants and freelancers will share their profile to demonstrate AI expertise to clients.

**Priority Score**: 5 / 7.5 = **0.67**

**Why This Matters**: This transforms Teach Charlie from a tool into a platform. Users who invest in building a public profile have significantly higher retention (they have identity invested in the platform).

---

### Rank 5: Team / Workspace Invites

**Feature Description**: Allow users to invite team members to a shared workspace where they can collaborate on agents. The inviter gets credit for bringing new users. Team workspaces share agents, knowledge sources, and conversation history.

**Development Effort**: 12-15 days
- Day 1-3: Data model changes (workspace model, membership roles, invitation system)
- Day 4-6: Invitation flow (email invitations via Clerk, invitation acceptance, workspace switching)
- Day 7-9: Permission system (owner, editor, viewer roles)
- Day 10-12: Shared resource scoping (agents, knowledge sources, conversations scoped to workspace)
- Day 13-15: Billing integration (team plan pricing, per-seat billing)

**Expected Growth Impact**: 6/10

Team invites create organic expansion within organizations. One champion signs up, builds an agent, then invites colleagues. This is the classic "land and expand" motion.

**Benchmark Data**:
- Slack's viral coefficient from team invites was approximately 1.7x in early days
- For a B2B tool, expect each team creator to invite 2-4 members on average
- Team accounts have 3-5x higher retention than individual accounts

**Priority Score**: 6 / 13.5 = **0.44**

**Why This Matters**: Teams are critical for revenue expansion (higher ARPU) but are complex to build correctly. Defer to Q3-Q4 when you have validated that teams actually want to collaborate (not just individuals using the tool solo).

---

### Rank 6: API / Webhook Integrations Creating Network Effects

**Feature Description**: Expose webhooks and API endpoints that allow agents to be triggered by external events (new form submission, calendar booking, CRM update). Each integration creates a reason for adjacent tool users to discover Teach Charlie.

**Development Effort**: 10-12 days
- Day 1-3: Webhook receiving infrastructure (endpoint registration, event validation, agent triggering)
- Day 4-6: Outbound webhook system (agent events → external tools)
- Day 7-8: Integration listing page on website ("Teach Charlie + Calendly," "Teach Charlie + HubSpot")
- Day 9-10: Integration-specific landing pages for SEO
- Day 11-12: Documentation and developer experience

**Expected Growth Impact**: 4/10

API/webhook integrations create network effects primarily through listing pages that appear in integration marketplaces (e.g., Zapier's app directory). The direct growth impact is moderate but compounds over time.

**Priority Score**: 4 / 11 = **0.36**

**Why This Matters**: Integrations are a long-term SEO and partnership play. Each integration page is a landing page that targets "[tool name] AI agent integration" keywords. However, the development effort is high relative to early-stage growth needs.

---

### Summary Priority Matrix

| Rank | Feature | Impact | Effort (days) | Score | Build When |
|------|---------|--------|---------------|-------|------------|
| 1 | Powered by badge | 8 | 3-4 | 2.29 | Week 1 |
| 2 | Social sharing of achievements | 6 | 5-6 | 1.09 | Month 2 |
| 3 | Template marketplace | 7 | 8-10 | 0.78 | Month 3-4 |
| 4 | Public agent profiles | 5 | 7-8 | 0.67 | Month 5-6 |
| 5 | Team/workspace invites | 6 | 12-15 | 0.44 | Month 7-9 |
| 6 | API/webhook integrations | 4 | 10-12 | 0.36 | Month 9-12 |

---

## 2. Referral Program Design

### When to Launch

**Do NOT launch a referral program on Day 1.** Referral programs amplify existing satisfaction; they do not create it. Launching a referral program before product-market fit is like putting a megaphone on an empty stage.

**Launch Trigger**: When you have:
- At least 50 active users (users who have built and deployed at least one agent)
- An NPS score above 40 (survey your users)
- At least 5 organic referrals already happening (people telling friends without incentive)
- A clear activation metric (e.g., "users who deploy an embed widget within 7 days retain at 60%+")

**Estimated timeline**: Month 4-6 post-launch (Q3 2026).

---

### Incentive Structure

**Model: Two-Sided Credit System**

The incentive must be valuable enough to motivate action but cheap enough to not drain your budget. Credits (platform currency) are ideal because they have a high perceived value but low marginal cost.

| Party | Incentive | Value | Why This Works |
|-------|-----------|-------|----------------|
| Referrer | 1 free month of Pro ($49 value) per successful referral, up to 6 months/year | $49 perceived, ~$5 actual cost | Pro plan costs are mostly marginal (LLM API calls); giving away access costs little |
| Referee | Extended trial: 30 days of Pro instead of 14 days Free | $49 perceived, ~$5 actual cost | Longer trial increases activation; referee gets real value |

**Alternative for early stage (pre-revenue)**:

| Party | Incentive | Value |
|-------|-----------|-------|
| Referrer | 500 bonus message credits (on top of plan limit) | ~$2.50 actual cost |
| Referee | 500 bonus message credits + Pro trial extension to 30 days | ~$2.50 actual cost |

**Why credits over discounts**: A 20% discount on a $49/mo plan saves $9.80/mo. That is not motivating. A free month ($49 value) feels like a gift. Credits feel like abundance. Discounts feel like math.

**Cap referral rewards**: Maximum 6 free months per year per referrer. This prevents abuse while still being generous. A user who refers 6 paying customers in a year has generated $3,528 in annual revenue (6 x $49 x 12) — giving them $294 in free service is a 92% margin.

---

### Mechanics: How the Referral System Works

**Referral Link Format**:
```
https://teachcharlie.ai/signup?ref={USER_ID}&utm_source=referral&utm_medium=share_link
```

**Shortened for sharing**:
```
https://tchrl.ai/r/{SHORT_CODE}
```
(Register the `tchrl.ai` domain for approximately $12/year, or use a path on the main domain: `teachcharlie.ai/r/{code}`)

**Attribution Logic**:
1. Referral link sets a first-party cookie (`tc_ref={user_id}`) with 30-day expiration
2. Also stored in `localStorage` as backup
3. On signup, check cookie → localStorage → URL param (in that order)
4. Attribute referral to the referrer's account
5. Referral is "successful" when the referee completes activation (builds first agent AND has at least one conversation — not just signup)
6. This prevents gaming with throwaway signups

**Data Model Addition** (for the backend):
```python
class Referral(Base):
    __tablename__ = "referrals"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    referrer_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    referee_user_id = Column(String, ForeignKey("users.id"), nullable=True)  # null until signup
    referral_code = Column(String(12), unique=True, nullable=False)
    status = Column(String, default="pending")  # pending, signed_up, activated, rewarded, expired
    clicked_at = Column(DateTime, nullable=True)
    signed_up_at = Column(DateTime, nullable=True)
    activated_at = Column(DateTime, nullable=True)  # built first agent + first conversation
    rewarded_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    expires_at = Column(DateTime)  # 30 days from creation
```

---

### Where to Surface the Referral Prompt

Timing is everything. Referral prompts shown at the wrong moment are ignored or resented. Show them at moments of peak satisfaction.

**Placement 1 — Post-First-Success Modal (Highest Converting)**

Trigger: User's agent successfully handles its first real conversation (not a test message).

```
---------------------------------------------------------
|  🎉 Charlie just had his first conversation!          |
|                                                        |
|  Your AI agent is live and helping people.             |
|  Know someone who could use this?                      |
|                                                        |
|  [Share & Get 1 Month Free]    [Maybe Later]           |
|                                                        |
|  Give a friend 30 days of Pro.                         |
|  You get a free month when they build their            |
|  first agent.                                          |
---------------------------------------------------------
```

Expected interaction rate: 15-25% click "Share," 3-7% actually send to someone.

**Placement 2 — Settings > Referrals Tab (Always Accessible)**

A dedicated tab in the user's settings showing:
- Their unique referral link (with one-click copy)
- Referral stats (link shares, signups, activations, rewards earned)
- Share buttons (email, Twitter/X, LinkedIn, WhatsApp, copy link)
- Reward history (which months were credited)

**Placement 3 — Mission Completion Celebration**

After completing any mission milestone, include a share prompt as part of the celebration:

```
---------------------------------------------------------
|  Mission Complete: "Deploy Your First Widget"          |
|  +150 XP earned!                                       |
|                                                        |
|  Share your progress:                                  |
|  [Tweet It]  [Share on LinkedIn]  [Copy Link]          |
|                                                        |
|  Or invite a friend to build alongside you:            |
|  [Send Referral Link]                                  |
---------------------------------------------------------
```

**Placement 4 — Billing Page (High Intent)**

On the billing/subscription page, show:

```
---------------------------------------------------------
|  Want to pay less?                                     |
|                                                        |
|  Refer friends and earn free months.                   |
|  You've earned: 0 free months so far.                  |
|  [Get Your Referral Link]                              |
---------------------------------------------------------
```

**Placement 5 — Email Sequences (Drip Campaign)**

- **Day 7 email**: "Your agent just hit 50 conversations! Share the love" (include referral link)
- **Day 14 email**: "One week into your trial — know someone who'd love this?" (include referral link)
- **Day 30 email**: Monthly summary email with referral CTA at bottom

---

### Expected Referral Rates

| Metric | Benchmark (B2B SaaS) | Conservative Estimate for Teach Charlie |
|--------|----------------------|---------------------------------------|
| % of users who share referral link | 8-15% | 5-10% |
| % of shared links that get clicked | 20-35% | 15-25% |
| % of clicks that convert to signup | 10-25% | 8-15% |
| % of signups that activate (build agent) | 30-50% | 25-40% |
| Overall: referrals per 100 active users per month | 2-5 | 1-3 |
| Viral coefficient (k-factor) | 0.15-0.40 | 0.08-0.20 |

**What these numbers mean in practice**: With 200 active users and a referral rate of 2 per 100, you get 4 new activated users per month from referrals alone. This is modest but meaningful — it is essentially free acquisition that compounds.

**A k-factor below 1.0 means the product is not truly viral** (each user brings in less than one new user). That is normal and expected for B2B SaaS. Referrals are a supplementary channel, not the primary growth engine. Your primary engine is workshops + content + embed badges.

---

### Referral Copy

**Email Template (for referrer to send)**:

Subject: "You should try this — I built an AI agent in 20 minutes"

Body:
> Hey [Name],
>
> I've been using this tool called Teach Charlie to build AI agents for my business. I just set up a customer support agent that handles FAQs automatically — took me about 20 minutes, no coding.
>
> I thought you might find it useful for [their business]. You get 30 days of the Pro plan for free with my link:
>
> [REFERRAL LINK]
>
> Let me know if you try it — happy to show you how I set mine up.
>
> [Referrer Name]

**Social Share Templates**:

Twitter/X: *"Just built an AI customer support agent for my business with @TeachCharlieAI. No coding, took 20 min. If you want to try it, here's 30 days free: [LINK]"*

LinkedIn: *"As a small business owner, I'm always looking for ways to do more with less. I just built an AI agent that handles customer questions 24/7 using Teach Charlie AI. No technical skills needed — their 3-step wizard makes it surprisingly simple. If you're curious, you can try it free for 30 days with my link: [LINK] #SmallBusiness #AI #Automation"*

---

### Anti-Abuse Measures

1. **Activation requirement**: Rewards only trigger when the referee builds an agent AND has at least one real conversation. Signup alone does not count.
2. **Same-IP detection**: Flag referrals where referrer and referee share the same IP address. Do not auto-reject (shared offices are legitimate) but flag for manual review.
3. **Email domain matching**: Flag if referrer and referee share the same email domain (could be self-referral with aliases).
4. **Rate limit**: Maximum 10 referral link generations per day per user.
5. **Reward cap**: Maximum 6 free months per referrer per calendar year.
6. **Disposable email blocking**: Reject signups from known disposable email domains (mailinator, guerrillamail, etc.).
7. **Manual review threshold**: Any user with more than 3 successful referrals in a single week gets flagged for manual review.

---

## 3. Embed Widget as Growth Channel

This is the most important growth channel for Teach Charlie AI. The embed widget turns every customer's website into a distribution channel.

### "Powered by Teach Charlie" Badge Design

**Visual Specification**:

```
┌─────────────────────────────────┐
│                                 │
│    [Chat conversation area]     │
│                                 │
│                                 │
├─────────────────────────────────┤
│  [Message input field]  [Send]  │
├─────────────────────────────────┤
│  🐕 Powered by Teach Charlie    │  ← Badge: 12px font, muted gray, left-aligned
└─────────────────────────────────┘
```

**Badge specifications**:
- Font size: 12px, color: `#9CA3AF` (muted gray)
- Background: matches widget theme (not a contrasting banner)
- Positioning: Bottom of widget, below the input area, inside the widget container
- Icon: Small Charlie dog icon (16x16px) to the left of text
- Clickable: Entire badge is a link to `https://teachcharlie.ai/from-widget?ref={owner_user_id}`
- Link opens in new tab (`target="_blank"`)
- Animation: None (static, not flashy — tasteful, not annoying)

**Why this design works**: It follows the Intercom/Crisp/Tawk.to convention that users are accustomed to. It does not interfere with the chat experience. It signals legitimacy ("this is professional software") rather than being perceived as advertising.

**Tier-Based Visibility**:

| Plan | Badge Behavior | Rationale |
|------|---------------|-----------|
| Free | Always visible, not removable | This IS the payment for the free plan |
| Pro ($49/mo) | Visible by default, removable via toggle in settings | Flexibility as a paid perk |
| Team ($99/mo) | Hidden by default, can be enabled voluntarily | White-label experience for agencies |

---

### Click-Through Signup Landing Page

When a visitor on a customer's website clicks the "Powered by Teach Charlie" badge, they land on a dedicated page optimized for this specific funnel.

**URL**: `https://teachcharlie.ai/from-widget?ref={user_id}`

**Page Structure**:

```
HEADLINE: "That AI agent? You can build one too."
SUBHEAD: "Teach Charlie lets anyone create AI assistants — no coding, no tech skills. Just answer 3 questions."

[HERO: Animated GIF showing the 3-step wizard in action, 8 seconds]

SOCIAL PROOF: "Join 200+ small businesses using Teach Charlie to automate customer support."

[3 value props with icons]:
  1. "Build in 20 minutes" — Answer 3 simple questions, get a working AI agent
  2. "Deploy anywhere" — Add to your website with one line of code
  3. "500+ integrations" — Connect to the tools you already use

[CTA BUTTON]: "Build Your First Agent — Free" → links to /signup with ref attribution

[BELOW FOLD: Template gallery preview showing 6 popular templates]
  "Start with a template:"
  - Customer Support Agent
  - Appointment Booking Agent
  - Lead Qualification Agent
  - FAQ Bot
  - Product Recommendation Agent
  - Onboarding Guide

[FOOTER: Minimal — links to pricing, docs, privacy policy]
```

**Technical Implementation Notes**:
- The `ref` parameter is stored in a cookie and localStorage on page load
- Pre-populate the OG meta tags for social sharing (in case the visitor shares the page)
- Include schema.org SoftwareApplication structured data for SEO
- Track: badge impressions (via pixel in widget), badge clicks, page views, signups, activations

---

### Conversion Funnel Estimates

| Stage | Metric | Conservative | Moderate | Optimistic |
|-------|--------|-------------|----------|------------|
| Widget impressions → badge noticed | Attention rate | 5% | 10% | 15% |
| Badge noticed → badge clicked | CTR | 0.5% | 1.0% | 2.0% |
| Badge clicked → page viewed | Load rate | 85% | 90% | 95% |
| Page viewed → signup started | Signup rate | 8% | 15% | 25% |
| Signup started → signup completed | Completion rate | 60% | 70% | 80% |
| Signup completed → agent built | Activation rate | 25% | 40% | 55% |

**Compound conversion (impression to activated user)**:
- Conservative: 0.05 x 0.005 x 0.85 x 0.08 x 0.60 x 0.25 = **0.00026%** (2.6 per million impressions)
- Moderate: 0.10 x 0.01 x 0.90 x 0.15 x 0.70 x 0.40 = **0.0038%** (38 per million impressions)
- Optimistic: 0.15 x 0.02 x 0.95 x 0.25 x 0.80 x 0.55 = **0.031%** (313 per million impressions)

**What this means in practice**: If your customers' websites collectively generate 500,000 pageviews per month where the widget is visible:
- Conservative: ~1.3 new activated users/month
- Moderate: ~19 new activated users/month
- Optimistic: ~157 new activated users/month

The moderate scenario is the most realistic target. At 50 deployed widgets averaging 10,000 pageviews each, you can expect approximately 15-20 new activated users per month from the embed channel alone.

**The key lever is total widget impressions.** This is why driving widget deployment is critical. Every feature that makes the widget more useful (better chat quality, more integrations, better design) increases both deployment rate and impression volume.

---

### Making the Badge Valuable (Not Annoying)

The badge must feel like a quality signal, not spam. Here is how:

1. **Professional design**: Match the visual quality of Intercom's badge. If it looks cheap, it reflects poorly on your customer's website and they will remove it (or churn).

2. **Subtle positioning**: Bottom of widget, below the input area. Not overlaid on top of conversations. Not animated. Not flashy.

3. **Useful destination**: The landing page must deliver genuine value (not just a hard sell). Include the template gallery and a free tier that is genuinely useful.

4. **Customer benefit framing**: Position the badge as a trust signal for the customer: "The 'Powered by Teach Charlie' badge tells your visitors this is professional AI-powered support, not a cheap chatbot." Some customers will voluntarily keep the badge even on paid plans.

5. **A/B test badge copy**:
   - "Powered by Teach Charlie" (standard)
   - "Built with Teach Charlie AI" (emphasizes the customer built it)
   - "AI Agent by Teach Charlie" (emphasizes AI capability)
   - Test which generates the highest click-through without the highest removal rate

---

### Legal Considerations

1. **Disclosure**: The badge must be clearly identifiable as a link to a third-party service. Do not disguise it as part of the customer's website.

2. **Referral tracking disclosure**: Your privacy policy must disclose that you use cookies for referral attribution. Update the privacy policy at `teachcharlie.ai/privacy` to include referral tracking.

3. **GDPR compliance**: The referral cookie is a functional cookie (not marketing), but to be safe, ensure the landing page has a cookie consent banner for EU visitors.

4. **Customer consent**: Your terms of service must clearly state that the Free plan includes the "Powered by" badge. Customers agree to this when they sign up.

5. **Do not set third-party cookies on the customer's domain.** The badge is a simple HTML link. All tracking happens on your domain after the click. This avoids all third-party cookie issues.

---

## 4. "Built with Teach Charlie" Strategy

### Social Media Sharing Mechanics

**Auto-Generated Share Cards**

When a user publishes an agent or completes a milestone, generate a visual share card using dynamic OG images.

**Card Template**:
```
┌─────────────────────────────────────┐
│  [Charlie dog mascot illustration]  │
│                                     │
│  "I just built an AI agent!"        │
│                                     │
│  Agent: Customer Support Charlie    │
│  Type: Customer Support             │
│  Skills: FAQ, Appointment Booking   │
│                                     │
│  teachcharlie.ai                    │
│  ─────────────────────────         │
│  Build your own AI agent. Free.     │
└─────────────────────────────────────┘
```

**Implementation**: Use Vercel OG Image Generation (`@vercel/og`) or Cloudinary's URL-based image transformation. Both allow dynamic text on a template image via URL parameters, requiring no server-side rendering infrastructure.

**Pre-Written Share Copy** (presented as options in the share modal):

**For Twitter/X**:
- Option A: *"I just trained my first AI agent with @TeachCharlieAI! It handles customer questions 24/7. No coding needed. #AI #SmallBusiness"*
- Option B: *"Meet [Agent Name], my new AI assistant built with @TeachCharlieAI. Took 20 minutes, zero code. teachcharlie.ai"*
- Option C: *"Small business owners: you can build your own AI agent now. I just did it with @TeachCharlieAI. The future is here."*

**For LinkedIn**:
- *"Excited to share that I just built my first AI agent using Teach Charlie AI. It handles [use case] for my business automatically, 24/7. The most impressive part? I set it up in 20 minutes with zero coding — just answered three questions about what I needed. If you're a small business owner looking to automate customer interactions, I'd highly recommend checking it out: teachcharlie.ai"*

---

### Agent Showcase Gallery

**URL**: `teachcharlie.ai/showcase`

A public gallery of user-submitted agents that visitors can interact with (limited demo mode: 5 messages).

**Gallery Card Format**:
```
┌─────────────────────────┐
│  [Agent Avatar]          │
│  Agent Name              │
│  by @username            │
│                          │
│  "Handles customer       │
│   support for my         │
│   photography business"  │
│                          │
│  Type: Customer Support  │
│  ★★★★☆ (4.2/5)          │
│  1,234 conversations     │
│                          │
│  [Try It]  [Use Template]│
└─────────────────────────┘
```

**Submission Flow**:
1. User clicks "Showcase My Agent" on their agent detail page
2. They write a short description (required, 50-200 characters)
3. They select a category (Customer Support, Sales, Education, Marketing, Operations, Other)
4. Submission goes into a moderation queue (founder reviews)
5. Approved agents appear on the public gallery

**Moderation Criteria**:
- Agent must have had at least 50 conversations (proves it is actually used)
- Description must be clear and professional
- No offensive or inappropriate content
- Agent must function correctly in demo mode

**SEO Value**: Each showcase page is a long-tail landing page. "AI customer support agent for photography business" is a highly specific keyword that can rank quickly.

---

### "Certified by Teach Charlie" Workshop Badges

**Purpose**: Workshop graduates receive a digital badge they can add to their LinkedIn profile, email signature, and website.

**Badge Tiers**:

| Badge | Requirement | Visual |
|-------|-------------|--------|
| Charlie Trainer | Complete first workshop, build 1 agent | Bronze paw print badge |
| Charlie Expert | Build 3+ agents, complete all beginner missions | Silver paw print badge |
| Charlie Master | Build 5+ agents, deploy embed widget, connect 3+ integrations | Gold paw print badge |

**Implementation**:
1. **Visual badge**: SVG/PNG image that can be downloaded and added to websites, email signatures
2. **Verification page**: Each badge has a unique URL (`teachcharlie.ai/verify/{badge_id}`) that confirms the certification is real
3. **LinkedIn integration**: Use LinkedIn's "Add to Profile" API to allow one-click addition of the certification to LinkedIn profiles. This requires using LinkedIn's certification URL scheme:
   ```
   https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME
   &name=Teach%20Charlie%20AI%20-%20Charlie%20Trainer
   &organizationId={YOUR_LINKEDIN_ORG_ID}
   &issueYear=2026
   &issueMonth=2
   &certUrl=https://teachcharlie.ai/verify/{badge_id}
   ```
4. **Email signature snippet**: Provide an HTML snippet users can paste into their email signature:
   ```html
   <a href="https://teachcharlie.ai/verify/{badge_id}">
     <img src="https://teachcharlie.ai/badges/trainer.png" 
          alt="Certified Charlie Trainer" width="120" height="40">
   </a>
   ```

**Development Effort**: 4-5 days (badge generation, verification page, LinkedIn deep link, email snippet generator)

**Why This Matters**: Badges exploit the "completion effect" — people who earn a credential want to display it, which creates organic impressions. LinkedIn is particularly powerful because it surfaces to professional networks who are the exact target audience (small business owners, marketing managers).

---

### User Portfolio Pages

Each user gets: `teachcharlie.ai/@{username}`

**Portfolio Page Content**:
- Profile photo and bio
- List of published agents (with "Try It" buttons for live demo)
- Earned badges and certifications
- Stats: total agents built, total conversations handled, integrations connected
- "Build your own agents" CTA for visitors

**SEO metadata**: Each portfolio page gets:
- Title: "{Name} — AI Agent Portfolio | Teach Charlie"
- Description: "{Name} has built {N} AI agents with Teach Charlie AI, including {agent names}."
- Schema.org: Person + CreativeWork structured data

**Privacy**: Users opt-in to having a public profile. Profiles are not public by default. All agent visibility is individually toggled.

---

## 5. Partner / Affiliate Program

### When to Launch

**Do NOT launch a partner program before you have**:
- At least 100 active users (proves the product works)
- A documented onboarding process that works without your personal involvement
- At least 3 successful workshops delivered by you personally
- Clear unit economics (know your CAC, LTV, churn rate)
- A scalable support system (documentation, FAQ, help center)

**Estimated timeline**: Month 6-9 post-launch (Q4 2026 or Q1 2027).

**Why wait**: A partner program with bad onboarding, broken features, or unclear value proposition will burn partner relationships permanently. Partners amplify your reputation — both positive and negative.

---

### Commission Structure

**Model: Recurring Revenue Share + One-Time Activation Bonus**

| Component | Amount | Trigger | Duration |
|-----------|--------|---------|----------|
| Recurring commission | 20% of subscription revenue | When referred user pays | 12 months from first payment |
| Activation bonus | $25 one-time | When referred user deploys first embed widget | One-time |
| Workshop bonus | $10 per attendee who signs up | When workshop attendee creates account within 30 days | One-time |

**Revenue Examples**:

| Scenario | Monthly Revenue per Referral | Annual Revenue per Referral |
|----------|-----------------------------|-----------------------------|
| Refer 1 Pro user ($49/mo) | $9.80/mo commission | $117.60/year |
| Refer 1 Team user ($99/mo) | $19.80/mo commission | $237.60/year |
| Run 1 workshop (20 attendees, 8 convert) | $80 workshop bonus + $78.40/mo ongoing | $80 + $940.80/year |

**Why 20% and 12 months**: Industry standard for B2B SaaS affiliate programs is 15-30% for 6-24 months. 20% for 12 months is competitive enough to attract partners while protecting your margins. After 12 months, the referred customer relationship is yours (they stay because of the product, not the partner).

**Minimum payout threshold**: $50 (to avoid processing micro-payments). Payouts monthly via PayPal or Stripe Connect.

---

### Partner Tiers

**Tier 1: Affiliate (Link Sharing)**
- **Requirements**: Sign up, agree to affiliate terms
- **Capabilities**: Unique referral link, basic tracking dashboard
- **Commission**: 20% recurring for 12 months
- **Support**: Self-service docs, email support
- **Typical partner**: Blogger, social media influencer, newsletter author

**Tier 2: Instructor (Teaches Workshops)**
- **Requirements**: Complete the Teach Charlie instructor certification (take the course, pass a quiz, deliver one demo workshop reviewed by the founder)
- **Capabilities**: Everything in Affiliate plus: co-branded workshop materials (slide decks, handouts), instructor badge on profile, listed on "Find a Workshop" page, priority support
- **Commission**: 20% recurring for 12 months + $10/attendee workshop bonus
- **Support**: Dedicated Slack channel, monthly partner call
- **Typical partner**: Freelance trainer, business coach, community organizer, co-working space operator

**Tier 3: Agency (Resells)**
- **Requirements**: Refer 10+ paying customers, maintain 80%+ customer satisfaction, sign agency agreement
- **Capabilities**: Everything in Instructor plus: white-label option (remove Teach Charlie branding), bulk pricing (20% discount for 10+ seats), dedicated account manager, early access to new features, co-marketing opportunities
- **Commission**: 25% recurring for 24 months (higher because they provide ongoing customer support)
- **Support**: Priority Slack, quarterly business review, marketing development funds ($500/quarter after 25 referred customers)
- **Typical partner**: Digital marketing agency, AI consulting firm, IT service provider

---

### Partner Portal Requirements

**MVP Partner Portal** (build when launching the program):

1. **Dashboard**: Referral link, click/signup/activation stats, commission history, payout status
2. **Marketing assets**: Downloadable logos, banner images, email templates, social share copy
3. **Tracking**: UTM-parameter-based tracking with real-time reporting
4. **Payout management**: Monthly commission statements, payout history, tax form collection (W-9/W-8BEN)

**Technology**: Do not build a custom portal. Use a partner management platform:
- **Rewardful** ($49/mo): Stripe-integrated, built for SaaS. Handles tracking, payouts, partner management. This is the recommended option.
- **PartnerStack** (custom pricing): More enterprise, overkill for early stage.
- **FirstPromoter** ($49/mo): Similar to Rewardful, slightly different UX.

**Development effort**: 2-3 days to integrate Rewardful or similar platform (Stripe webhook integration + embed partner portal widget).

---

### Affiliate Agreement Essentials

The affiliate agreement must include these clauses (consult a lawyer for your jurisdiction, but these are the essentials):

1. **Commission structure and payment terms**: Exact percentages, payment schedule (monthly), minimum payout ($50), payment method (PayPal/Stripe)
2. **Attribution window**: 30-day cookie window from click to signup
3. **Prohibited activities**: No spam, no misleading claims, no bidding on "Teach Charlie" branded keywords in paid search, no fake reviews
4. **Termination**: Either party can terminate with 30 days notice; commissions earned before termination are still paid out
5. **Intellectual property**: Partners can use Teach Charlie logos/assets only as provided in the partner portal; no modifications
6. **Indemnification**: Partners are responsible for their own marketing claims and compliance with local laws
7. **Non-exclusivity**: Partners can promote competing products
8. **Commission clawback**: If a referred customer gets a refund within 30 days, the commission is reversed
9. **Tax responsibility**: Partners are responsible for their own tax obligations; Teach Charlie provides 1099-MISC (US) or equivalent documentation

---

### Recruitment Strategy

**Where to Find Partners**:

| Channel | Approach | Expected Yield |
|---------|----------|----------------|
| Workshop attendees | At end of every workshop, announce partner program: "Want to teach this workshop yourself?" | 5-10% of attendees express interest |
| LinkedIn outreach | Search for "business coach," "AI trainer," "digital marketing consultant" — send personalized messages | 2-5% response rate |
| Podcast appearances | Mention the partner program when you appear as a guest on small business / AI podcasts | 1-3 inquiries per appearance |
| Existing users | Email to active users: "Love Teach Charlie? Earn money sharing it." | 3-8% of active users sign up |
| Facebook/LinkedIn groups | Post in groups for business coaches, freelance trainers, small business communities | 1-2 inquiries per post |
| Indie hacker communities | Post on IndieHackers, ProductHunt discussions, Hacker News "Show HN" | Variable, high quality leads |

**Outreach Pitch Template (for cold LinkedIn messages)**:

> Hi [Name],
>
> I noticed you help small businesses with [their specialty]. I'm the founder of Teach Charlie AI — we help non-technical business owners build AI agents (like chatbots and assistants) in 20 minutes, no code.
>
> We're launching a partner program for educators and consultants. If you teach workshops or consult with small businesses, you could:
> - Offer "Build Your Own AI Agent" workshops using our platform and materials
> - Earn 20% recurring commission on every customer you refer
> - Get co-branded marketing materials and instructor certification
>
> Would you be open to a 15-minute call to explore if this could be a fit? Happy to show you the platform.
>
> Best,
> [Your name]

---

## 6. Growth Loop Architecture

### Loop 1: Workshop Loop (PRIMARY — Invest First)

```
WORKSHOP
  │
  ├──► Attendees sign up during workshop
  │         │
  │         ├──► Build first agent (guided, 90%+ completion rate in-workshop)
  │         │         │
  │         │         ├──► Deploy embed widget (encouraged during workshop)
  │         │         │         │
  │         │         │         └──► Widget generates badge impressions
  │         │         │                   │
  │         │         │                   └──► New visitors sign up ──► [EMBED LOOP]
  │         │         │
  │         │         ├──► Share achievement on social media
  │         │         │         │
  │         │         │         └──► Social connections see post ──► [CONTENT LOOP]
  │         │         │
  │         │         └──► Tell colleagues / word of mouth
  │         │                   │
  │         │                   └──► New workshop attendees
  │         │
  │         └──► Become partner / instructor
  │                   │
  │                   └──► Run their own workshops ──► [BACK TO TOP]
  │
  └──► Content generated from workshop (recordings, testimonials, social posts)
            │
            └──► Drives more workshop registrations ──► [BACK TO TOP]
```

**Weakest Link**: Workshop attendees signing up but NOT deploying the embed widget.

**How to Strengthen**: Make widget deployment part of the workshop curriculum. The last 10 minutes of every workshop should be: "Now let's deploy your agent to your website." Provide step-by-step instructions. Offer a "Deploy Challenge" — attendees who deploy within 48 hours get a bonus template pack.

**Metrics to Track**:
- Workshop → signup conversion rate (target: 80%+)
- Signup → agent built conversion rate (target: 90%+ in-workshop)
- Agent built → widget deployed conversion rate (target: 40%+)
- Widget deployed → generates 1+ click on badge (target: 60% within 30 days)
- Attendee → partner conversion rate (target: 5%)

**Capacity Required**: 1 workshop per week (2-3 hours including prep). Can be delegated to partners once you have 3+ trained instructors.

---

### Loop 2: Embed Badge Loop (SECONDARY — Build Immediately, Compounds Over Time)

```
USER DEPLOYS EMBED WIDGET
  │
  ├──► Widget appears on their website
  │         │
  │         ├──► End users interact with the AI agent
  │         │         │
  │         │         └──► Some notice "Powered by Teach Charlie" badge
  │         │                   │
  │         │                   ├──► Click badge ──► Land on /from-widget page
  │         │                   │         │
  │         │                   │         ├──► Sign up ──► Build agent ──► Deploy widget ──► [BACK TO TOP]
  │         │                   │         │
  │         │                   │         └──► Don't sign up (but now aware of Teach Charlie)
  │         │                   │                   │
  │         │                   │                   └──► May return later via direct / search
  │         │                   │
  │         │                   └──► Don't click (but subconscious brand impression)
  │         │
  │         └──► End users have positive experience with AI agent
  │                   │
  │                   └──► Word of mouth: "This business has a great AI assistant"
  │                             │
  │                             └──► Indirect brand awareness
  │
  └──► User sees value from widget ──► Upgrades to paid plan ──► Revenue
```

**Weakest Link**: Badge click-through rate (CTR). Most visitors will not click the badge.

**How to Strengthen**:
1. **A/B test badge copy and design** relentlessly. Even a 0.1% improvement in CTR matters at scale.
2. **Make the landing page exceptional**. The /from-widget page must load in under 2 seconds and immediately communicate value.
3. **Retargeting pixel**: Place a Meta/Google retargeting pixel on the /from-widget page. Visitors who clicked but did not sign up can be retargeted with ads later. (Budget: $50-$100/mo for retargeting only — extremely efficient because these are pre-qualified visitors.)
4. **Seasonal badge variants**: During product launches or special events, update the badge copy to "AI-Powered by Teach Charlie — Build yours free" to increase curiosity.

**Metrics to Track**:
- Total badge impressions per month
- Badge CTR (target: 0.5-1.0%)
- /from-widget page → signup conversion rate (target: 10-15%)
- Signup → agent deployed (activation) rate (target: 30-40%)
- Total new users per month from embed channel

---

### Loop 3: Content Loop (TERTIARY — Build Gradually Through Q2-Q3)

```
CREATE CONTENT (blog, video, social, template page)
  │
  ├──► SEO: content ranks for long-tail keywords
  │         │
  │         └──► Organic visitor finds content ──► Signs up ──► Builds agent ──► Shares result
  │                                                                                    │
  │                                                                                    └──► [SOCIAL SHARING LOOP]
  │
  ├──► Social: content shared on Twitter/X, LinkedIn, communities
  │         │
  │         └──► Social visitor clicks through ──► Signs up ──► Builds agent
  │                                                                    │
  │                                                                    └──► Deploys widget ──► [EMBED LOOP]
  │
  └──► Email: content sent to subscriber list
            │
            └──► Subscriber engages ──► Refers friend ──► [REFERRAL LOOP]
```

**Weakest Link**: Content creation velocity. A solo founder can realistically produce 1-2 high-quality pieces per week.

**How to Strengthen**:
1. **User-generated content**: Encourage users to write "How I built my AI agent" posts. Feature them on your blog. Provide a writing template:
   - Problem I was solving
   - How I set up the agent (with screenshots)
   - Results after 30 days
   - Link to try Teach Charlie (with their referral link)
2. **Template pages as content**: Each template in the gallery is a landing page. 20 templates = 20 SEO-optimized landing pages targeting "[industry] AI agent."
3. **Workshop recordings**: Record every workshop. Edit into 5-10 minute "how to" videos. Publish on YouTube. Each video targets a specific keyword.
4. **AI-assisted content creation**: Use Claude to draft blog posts, then edit for authenticity. This multiplies content velocity 3-5x.

**Metrics to Track**:
- Organic traffic per month (target: 500 visits/month by month 6, 2000 by month 12)
- Content → signup conversion rate (target: 2-5%)
- Content pieces published per week (target: 2)
- Domain authority growth (track monthly)

---

### Loop 4: Community Loop (LONG-TERM — Start Seeding Now, Formalize in Q3)

```
USER JOINS COMMUNITY (Discord, Slack, or Circle)
  │
  ├──► Gets help building their agent
  │         │
  │         ├──► Successful outcome ──► Shares success story in community
  │         │         │
  │         │         └──► Other members see success ──► Motivated to build / share
  │         │
  │         └──► Becomes helper for other members
  │                   │
  │                   └──► Social investment increases retention
  │
  ├──► Invites peers to community
  │         │
  │         └──► New member joins ──► Signs up for Teach Charlie ──► [BACK TO TOP]
  │
  └──► Contributes templates / knowledge
            │
            └──► Templates appear in gallery ──► SEO value + new user activation
```

**Weakest Link**: Getting the community to critical mass (>50 active members). Below that, the community feels dead and new members leave immediately.

**How to Strengthen**:
1. **Do not launch a public community until you have 50+ active users.** Before that, use a private group (WhatsApp or Slack) with workshop graduates only.
2. **Seed the community yourself**: Be the most active member. Answer every question within 4 hours. Share your own wins and struggles.
3. **Weekly "Agent of the Week" spotlight**: Feature one community member's agent every week. This creates aspirational content and gives members a reason to check in.
4. **Office hours**: Weekly 30-minute live Q&A (Zoom/Google Meet). Creates a recurring appointment that builds habit.
5. **Community-exclusive templates**: Release some templates only in the community. This creates a reason to join beyond general help.

**Platform recommendation**: Start with a free Slack workspace or Discord server. Do not pay for Circle ($39+/mo) until you have 100+ community members.

---

## Implementation Timeline

### Month 1: Foundation (Week 1-4)
- **Build**: "Powered by Teach Charlie" badge on embed widget (3-4 days)
- **Build**: `/from-widget` landing page with referral attribution (2 days)
- **Build**: Badge impression and click tracking analytics (1 day)
- **Action**: Run first 2 workshops, drive widget deployment
- **Action**: Set up basic analytics (Plausible or PostHog, not Google Analytics — simpler)
- **Total dev effort**: ~7 days
- **Cost**: $0-50 (analytics tool)

### Month 2: Social Proof (Week 5-8)
- **Build**: Social sharing on mission completion (5-6 days)
- **Build**: OG image generation for share cards (2 days)
- **Action**: Run 4 workshops, collect first testimonials
- **Action**: Start blog with 2 posts/week (use AI assistance for drafts)
- **Total dev effort**: ~8 days
- **Cost**: $50-100 (Cloudinary for OG images, or free with Vercel)

### Month 3-4: Templates + SEO (Week 9-16)
- **Build**: Template marketplace/gallery with SEO-optimized pages (8-10 days)
- **Build**: Workshop certification badges + LinkedIn integration (4-5 days)
- **Action**: Create 15-20 templates covering major use cases
- **Action**: Launch "Certified by Teach Charlie" for workshop graduates
- **Total dev effort**: ~14 days
- **Cost**: $100-200 (may need a simple badge/certificate design)

### Month 5-6: Referral Program (Week 17-24)
- **Build**: Referral system with tracking, attribution, and rewards (8-10 days)
- **Build**: Public agent profiles/portfolios (7-8 days)
- **Action**: Launch referral program to existing user base
- **Action**: Begin agent showcase gallery with first 10 submitted agents
- **Total dev effort**: ~17 days
- **Cost**: $100-200

### Month 7-9: Partner Program (Week 25-36)
- **Build**: Integrate Rewardful or similar partner management tool (2-3 days)
- **Build**: Team/workspace invites (12-15 days)
- **Action**: Launch partner program, recruit first 5 instructors
- **Action**: Provide partner onboarding materials and co-branded decks
- **Total dev effort**: ~16 days
- **Cost**: $200-300 (Rewardful subscription + partner materials)

### Month 10-12: Scale + Optimize (Week 37-52)
- **Build**: API/webhook integrations (10-12 days)
- **Optimize**: A/B test every growth loop touchpoint
- **Action**: Scale workshops via partners (target: 4+ workshops/month run by partners)
- **Action**: Formalize community with dedicated platform
- **Total dev effort**: ~12 days
- **Cost**: $300-500

---

## Key Metrics Dashboard

Track these numbers weekly. Build a simple dashboard (even a Google Sheet is fine for Year 1).

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|--------|---------------|----------------|-----------------|
| Total signups | 75 | 250 | 700 |
| Activated users (built 1+ agent) | 40 | 150 | 400 |
| Deployed embed widgets | 15 | 60 | 200 |
| Total badge impressions/month | 50K | 300K | 1M+ |
| Badge → signup conversions/month | 3 | 20 | 75 |
| Referral signups/month | 0 (not launched) | 8 | 30 |
| Workshop attendees/month | 30 | 80 | 200 |
| Partner-run workshops/month | 0 | 1 | 4 |
| MRR | $500 | $3,000 | $12,000 |

---

## Final Note: What NOT to Do

1. **Do not build a complex community platform before you have 50 active users.** Use WhatsApp or a simple Slack workspace. The tool does not matter; the engagement does.

2. **Do not launch a referral program before Month 4.** You need activated, satisfied users first. A referral program that sends friends to a buggy product is worse than no referral program.

3. **Do not pursue API/webhook integrations before Month 9.** They are high effort, low immediate impact, and complex to maintain. Focus on the widget and workshops first.

4. **Do not spend money on paid acquisition in Year 1** (except small retargeting budgets of $50-100/mo on the /from-widget page). Your organic channels (workshops, embed badge, content, referrals) are more efficient at this stage. Paid acquisition makes sense when you have optimized your funnel and know your LTV:CAC ratio.

5. **Do not try to be on every social platform.** Pick two: LinkedIn (for professional audience) and Twitter/X (for tech-adjacent audience). Post 3-5 times per week on each. Ignore TikTok, Instagram, Facebook, and YouTube Shorts for now.

6. **Do not over-engineer growth features.** The "Powered by" badge is HTML and a link. The referral system is a database table and a cookie. The share cards are URL-parameterized images. Keep the implementation simple and iterate based on data.

The single most important thing you can do for growth in Year 1 is **run workshops and ensure every attendee deploys a widget.** Everything else is optimization on top of that core motion.

---

Now I have a thorough understanding of the entire codebase, infrastructure, billing model, security posture, and technical debt. Let me produce the exhaustive playbook section.

---

# TECHNICAL PRIORITIES FOR BUSINESS GROWTH

## Teach Charlie AI -- Launch Playbook Section

**Prepared**: 2026-02-15
**Scope**: Actionable engineering roadmap for a solo, non-technical founder targeting $5K-$25K MRR in Year 1 with 100-500 users
**Ground Truth**: Based on full codebase audit of 29,603 lines frontend TypeScript, 27,226 lines backend Python, 28 E2E test files (551 cases), 3 frontend unit test files, 37 backend unit tests, production deployment on single DigitalOcean droplet

---

## THE SINGLE BIGGEST TECHNICAL RISK TO THE BUSINESS

**Langflow version lock at 1.7.3 on a single $24/mo droplet running six Docker containers.**

Your entire product -- every agent, every workflow, every chat session -- routes through a single Langflow container (`langflowai/langflow:1.7.3`) that shares memory with PostgreSQL, Redis, nginx, the React frontend, and the FastAPI backend on one machine. If Langflow crashes or leaks memory (which Java/Python flow engines do under load), every user loses access simultaneously. You have no horizontal scaling path, no container orchestration, and no automated recovery beyond Docker's `restart: always`. At approximately 15-25 concurrent users sending chat messages, this architecture will begin experiencing request timeouts and OOM kills. This is not a theoretical risk -- it is a certainty given the memory footprint of Langflow (~800MB idle, 1.5-2GB under moderate load) combined with PostgreSQL (~200-400MB), Redis (~50MB), and your frontend/backend containers.

**Why this matters**: Your revenue model depends on real-time chat responses. A 5-second timeout in the playground or embed widget is a lost customer. A 30-minute outage during a live workshop destroys credibility with the exact audience you are trying to convert.

**Mitigation priority**: Implement health monitoring (Section 4) before scaling features (Section 1). Instrument everything before you build anything new.

---

## 1. FEATURES TO BUILD NEXT (Ranked by Revenue Impact)

### Priority Scoring Methodology

Each feature is scored on three dimensions:
- **Revenue Impact** (1-10): How directly does this drive new subscriptions or reduce churn?
- **Effort** (1-10): How many AI-assisted dev days? Lower = faster to ship.
- **Dependency Risk** (1-10): How many external dependencies or infrastructure changes? Lower = safer.

**Priority Score** = (Revenue Impact x 2) + (10 - Effort) + (10 - Dependency Risk)

---

### Rank 1: Workshop Self-Service Onboarding Flow

**Feature**: A dedicated `/workshop/{code}` route where workshop attendees enter a code Adam provides during live sessions. Pre-populates their account with a specific agent preset, skips the generic signup friction, and drops them directly into the playground with a guided first message.

**Business Case**: Your primary acquisition channel is live workshops. Currently, attendees sign up through the generic Clerk flow, land on a dashboard, and must navigate to "Create Agent" on their own. Every friction point in this handoff loses attendees. Workshop-specific onboarding could increase conversion from "attended workshop" to "created first agent" from an estimated 40-50% to 70-80%.

**Estimated Effort**: 3 days. New API endpoint `POST /api/v1/workshops/join` that creates user + preset agent + workflow in one transaction. Frontend: single new page component (~200 LOC). Database: one new `workshop_codes` table.

**Dependencies**: Clerk (existing), agent presets system (existing), workflow creation (existing). No new external services.

**Priority Score**: (9 x 2) + (10 - 3) + (10 - 1) = 18 + 7 + 9 = **34**

**File to modify**: `/Users/adamcognigy/LangflowSaaS/src/backend/app/api/agent_components.py` (extend create-from-qa to accept workshop_code parameter), plus one new frontend page.

---

### Rank 2: Email Onboarding Drip Sequence (Webhook-Based)

**Feature**: Stripe + Clerk webhook listener that triggers email sequences via Resend or SendGrid free tier. Three emails: (1) "Your agent is ready to test" (sent 1 hour after signup), (2) "3 things to try in the playground" (sent 24 hours later), (3) "Unlock the canvas -- see how your agent works" (sent 72 hours later, links to upgrade for Individual plan).

**Business Case**: Your current product has zero automated touchpoints after signup. Users who do not return within 72 hours almost never come back. Email drip is the single highest-ROI retention mechanism for early-stage SaaS. At 100 users, even a 10% reactivation rate = 10 users who might convert to $19/mo.

**Estimated Effort**: 4 days. Backend: new `email_service.py` (~200 LOC), webhook handler additions to existing Clerk webhook endpoint. Use Resend ($0 for first 100 emails/day, then $20/mo for 50K). No frontend changes.

**Dependencies**: Resend API (new, free tier), Clerk webhooks (existing infrastructure).

**Priority Score**: (10 x 2) + (10 - 4) + (10 - 2) = 20 + 6 + 8 = **34**

---

### Rank 3: Template Marketplace (Community Agents)

**Feature**: Allow users to share their agent configurations publicly. A `/marketplace` page showing community-created agents with preview, "Use This Template" button (clones to user's account), and rating/usage counts. Start by seeding with 15-20 templates Adam creates.

**Business Case**: Templates solve the "blank canvas" problem -- the number one killer of activation for no-code tools. Users who start from a template are 3-5x more likely to complete setup than those starting from scratch. This also creates a viral loop: users share agents, their contacts discover Teach Charlie. This is the feature that turns your 8 presets into a network effect.

**Estimated Effort**: 6 days. Backend: new `template_marketplace` router (~400 LOC), new `public_templates` table. Frontend: new `MarketplacePage.tsx` (~600 LOC), template cards component. Leverages existing agent export/import JSON format.

**Dependencies**: Existing agent export format, existing agent presets system.

**Priority Score**: (9 x 2) + (10 - 6) + (10 - 2) = 18 + 4 + 8 = **30**

---

### Rank 4: Custom Domain for Embed Widget

**Feature**: Allow Individual/Business plan users to serve the embed widget from their own domain (e.g., `chat.mybusiness.com`) instead of `app.teachcharlie.ai`. Implemented via CNAME record + Let's Encrypt wildcard or per-domain cert.

**Business Case**: The embed widget (file: `/Users/adamcognigy/LangflowSaaS/src/backend/app/api/embed.py`) is your most direct path to business-plan revenue. Small businesses embedding chat on their websites will not accept a third-party domain visible to their customers. Custom domains are table-stakes for B2B embed products and justify the jump from $19/mo Individual to a $49-99/mo Business plan. This is the feature that makes the Business tier sellable.

**Estimated Effort**: 5 days. Backend: domain verification endpoint, nginx dynamic SSL generation (use Caddy or lua-resty-auto-ssl). Infrastructure: separate Caddy container for custom domain proxying. Database: add `custom_domain` column to `agent_components` table.

**Dependencies**: DNS verification system, automated SSL (Caddy reverse proxy). Moderate infrastructure change.

**Priority Score**: (8 x 2) + (10 - 5) + (10 - 5) = 16 + 5 + 5 = **26**

---

### Rank 5: Agent Versioning with Rollback

**Feature**: Every save of an agent configuration creates a version snapshot. Users can view version history, diff changes, and roll back to any previous version with one click.

**Business Case**: Non-technical users are terrified of breaking things. Version history is a safety net that encourages experimentation. It also reduces support burden ("I broke my agent" becomes "click Revert"). This directly improves retention because users who feel safe experimenting use the product more.

**Estimated Effort**: 4 days. Backend: new `agent_versions` table storing JSON snapshots, new API endpoints for list/diff/revert. Frontend: version history sidebar in EditAgentPage (~300 LOC).

**Dependencies**: Existing agent JSON export format. No external services.

**Priority Score**: (7 x 2) + (10 - 4) + (10 - 1) = 14 + 6 + 9 = **29**

---

### Rank 6: Conversation Analytics for Embed Widget

**Feature**: Dashboard showing embed widget performance: total conversations, messages per session, top questions asked, user satisfaction (thumbs up/down on responses), geographic distribution. Accessible from the agent's "Analytics" tab.

**Business Case**: Business users embedding agents on their websites need to justify ROI. "Your Charlie handled 247 customer questions this week, with 89% satisfaction" is the metric that prevents churn. Without analytics, embed users have no way to measure value and will cancel.

**Estimated Effort**: 5 days. Backend: extend existing `analytics_daily` table, add thumbs-up/down endpoint to embed chat. Frontend: new analytics panel in `EditAgentPage.tsx` (~400 LOC).

**Dependencies**: Existing analytics infrastructure, existing embed widget.

**Priority Score**: (8 x 2) + (10 - 5) + (10 - 2) = 16 + 5 + 8 = **29**

---

### Rank 7: Team Workspaces (2-5 Seats)

**Feature**: Allow a Business plan subscriber to invite 2-5 team members who share access to the same project, agents, and workflows. Not full multi-tenancy -- just shared project access with basic roles (owner, editor).

**Business Case**: Team features are the primary differentiator between Individual ($19/mo) and Business (custom pricing). Your current `plans.py` already gates `team_collaboration` to Business tier. Even a simple implementation (shared project via invite link, all members see same agents) unlocks $49-99/mo pricing. At 10 team accounts x $49/mo = $490/mo MRR -- nearly your Year 1 minimum.

**Estimated Effort**: 8 days. Backend: new `team_memberships` table, modify all queries to support team-level access (add `OR project.team_id IN (user's teams)` to existing `user_id` filters). Frontend: team invite modal, member list in settings. Clerk organizations API for user management.

**Dependencies**: Clerk Organizations (existing capability, not yet used). Moderate query changes across 10+ services.

**Priority Score**: (9 x 2) + (10 - 8) + (10 - 5) = 18 + 2 + 5 = **25**

---

### Rank 8: Webhook Notifications

**Feature**: Allow users to configure webhooks that fire when specific events occur: new embed conversation started, credit balance low, agent error rate spike. Standard POST with JSON payload to user-specified URL.

**Business Case**: Webhook notifications are the gateway to "integration stickiness." Once a customer connects Teach Charlie to their Slack via webhook (new conversation notification -> Slack channel), they are significantly less likely to churn. This also supports the "500+ integrations" positioning by making your platform the event source, not just the consumer.

**Estimated Effort**: 4 days. Backend: new `webhooks` table, webhook delivery service with retry logic (~300 LOC), add webhook triggers to existing chat and billing endpoints. No frontend needed initially (configure via API), but add UI later.

**Dependencies**: None. Pure backend implementation.

**Priority Score**: (6 x 2) + (10 - 4) + (10 - 1) = 12 + 6 + 9 = **27**

---

### Rank 9: API Access (Programmatic Agent Interaction)

**Feature**: REST API with API key authentication that allows developers to interact with agents programmatically. Endpoint: `POST /api/v1/external/{api_key}/chat`. Enables customers to integrate Charlie into their own applications, scripts, and workflows.

**Business Case**: API access is gated to Business tier in your current `plans.py` (`"api_access": ["business"]`). This is a high-value feature for technical buyers who want to embed agent logic into existing systems. It also positions Teach Charlie as a platform, not just a tool.

**Estimated Effort**: 3 days. Backend: new `api_keys` table, API key generation endpoint, new auth middleware for API key validation. The chat endpoint already exists -- this just adds an alternative auth path. No frontend changes initially.

**Dependencies**: None. Extend existing auth middleware.

**Priority Score**: (7 x 2) + (10 - 3) + (10 - 1) = 14 + 7 + 9 = **30**

---

### Rank 10: Multi-Language Support (Agent Responses)

**Feature**: Allow agents to respond in the user's language by adding a "Language" setting to the agent configuration. Implemented by appending language instructions to the system prompt (e.g., "Always respond in Spanish").

**Business Case**: English-only limits your addressable market. Workshop attendees in multilingual communities (libraries, community centers) need agents that speak their language. This is a simple system prompt modification, not a UI translation effort.

**Estimated Effort**: 1 day. Backend: add `response_language` field to `agent_components` table, modify `template_mapping.py` to append language instruction to system prompt. Frontend: language dropdown in agent settings.

**Dependencies**: None.

**Priority Score**: (5 x 2) + (10 - 1) + (10 - 1) = 10 + 9 + 9 = **28**

---

### Feature Priority Matrix (Impact vs. Effort)

```
HIGH IMPACT    |                                                    
               |  [Workshop Flow]  [Email Drip]                    
               |     (3 days)        (4 days)                      
               |                                                    
               |  [API Access]   [Marketplace]   [Team Workspaces] 
               |   (3 days)       (6 days)         (8 days)        
               |                                                    
               |  [Versioning]  [Embed Analytics] [Custom Domain]  
               |   (4 days)       (5 days)          (5 days)       
               |                                                    
               |  [Multi-Lang]   [Webhooks]                        
               |   (1 day)        (4 days)                         
               |                                                    
LOW IMPACT     |__________________________________________________ 
               LOW EFFORT                           HIGH EFFORT     
```

**Recommended Build Order** (first 90 days):
1. Workshop Self-Service Flow (3 days) -- unlocks immediate workshop revenue
2. Email Drip (4 days) -- starts working for you while you sleep
3. Multi-Language Agent Responses (1 day) -- quick win, expands market
4. Agent Versioning (4 days) -- reduces support burden, improves retention
5. Template Marketplace (6 days) -- activation multiplier

---

## 2. FEATURES NOT TO BUILD

### Anti-Feature 1: Mobile App or Mobile-Responsive UI

**Why it is tempting**: "Everyone uses their phone." You will feel pressure from users who try to access the platform on mobile.

**Why it is a trap**: Your core interaction is a flow canvas built on React Flow. React Flow is fundamentally a desktop interaction (drag nodes, connect wires, pan/zoom). Making this work on mobile is a 3-6 month engineering project that would require a completely different interaction model. Your target users (workshop attendees, small business owners) will always build agents at a desk. The embed widget (which their customers use) already works on mobile.

**What to do instead**: Add a simple mobile-responsive landing page and a "Come back on desktop to build your agent" message for mobile visitors. Ensure the embed widget chat (which is already responsive at 380px width per your `embed.py`) works well on mobile.

---

### Anti-Feature 2: Advanced Admin Panel

**Why it is tempting**: You want to see what users are doing, manage accounts, moderate content.

**Why it is a trap**: At 100 users, you do not need an admin panel. You need a PostgreSQL client (like TablePlus or pgAdmin). Building a custom admin panel is 5-10 days of work that serves one user (you) instead of building features for paying customers.

**What to do instead**: SSH into your droplet and query the database directly. Use `psql` or connect remotely via an SSH tunnel. Create a few saved SQL queries for common tasks: active users this week, agents created, revenue metrics. Save these as a `.sql` file in your repo.

---

### Anti-Feature 3: Multi-Tenancy / Organization Hierarchy Before 100 Users

**Why it is tempting**: Enterprise buyers ask for it. Your `plans.py` already has "business" tier with team features listed.

**Why it is a trap**: Multi-tenancy requires modifying every database query in every service (20+ services) to add org-level filtering. It requires new middleware, new test coverage, new edge cases around data isolation. The audit found your `user_id` filtering is already inconsistent in some places. Adding org-level filtering on top of that is a recipe for data leaks and security incidents.

**What to do instead**: Implement the lightweight "Team Workspaces" feature from Rank 7 above. This gives team access without true multi-tenancy. Shared project access (not org isolation) is sufficient until you have 50+ business accounts.

---

### Anti-Feature 4: AI-Generated Flows

**Why it is tempting**: "Describe what you want and AI builds the flow." This sounds like magic and would be an amazing demo.

**Why it is a trap**: Your CLAUDE.md explicitly warns against this: "DO NOT use AI to generate flows - Use rule-based template mapping (simpler, more reliable)." LLM-generated Langflow JSON is fragile -- one wrong node connection and the entire flow breaks silently. Your template mapping engine (`/Users/adamcognigy/LangflowSaaS/src/backend/app/services/template_mapping.py`, 1,141 lines) works reliably because it uses deterministic rules, not probabilistic generation.

**What to do instead**: Expand your template library from 8 presets to 25+ presets covering more use cases. Each preset is guaranteed to work. Template marketplace (Rank 3) solves the same "I don't know what to build" problem without the fragility of AI generation.

---

### Anti-Feature 5: Complex RBAC (Role-Based Access Control)

**Why it is tempting**: Business customers ask for "admin vs. editor vs. viewer" roles.

**Why it is a trap**: RBAC is a minimum 10-day engineering project that touches every endpoint (140+ endpoints across 21 routers). It requires new middleware, new database tables, new UI for role management, and extensive testing. At your user count, you will spend more time building RBAC than any customer will spend using it.

**What to do instead**: Two roles only: "owner" and "member." Owner can delete agents and manage billing. Member can create and edit agents. This covers 95% of team use cases and can be implemented in 2 days.

---

### Anti-Feature 6: Custom LLM Fine-Tuning

**Why it is tempting**: "Fine-tuned models give better responses." Technical users will ask for this.

**Why it is a trap**: Fine-tuning requires: (1) training data collection UI, (2) data validation pipeline, (3) OpenAI fine-tuning API integration, (4) model versioning, (5) cost management (fine-tuning is expensive). This is a 20+ day project that serves a tiny percentage of power users. Most users get excellent results from good system prompts, which your 3-step wizard already handles.

**What to do instead**: Improve your system prompt templates. Add a "prompt tips" section to the wizard that teaches users how to write better instructions. Consider adding example conversations that demonstrate good vs. bad agent behavior.

---

### Anti-Feature 7: Advanced Analytics Dashboard

**Why it is tempting**: Your existing analytics endpoint (`/api/v1/analytics`) returns basic counts. You want graphs, trends, cohort analysis.

**Why it is a trap**: Beautiful dashboards take 10+ days to build properly (charting libraries, date range pickers, data aggregation, export). At 100 users, your analytics needs are: "How many users signed up this week? How many are paying?" These are SQL queries, not dashboard features.

**What to do instead**: Use PostHog free tier (1M events/month free). Instrument key events (signup, agent_created, chat_sent, plan_upgraded) and let PostHog handle visualization. This gives you better analytics than anything you could build in 10 days, for $0.

---

### Anti-Feature 8: Native Integrations (Building Your Own OAuth Connectors)

**Why it is tempting**: "We should integrate directly with Gmail/Slack/Notion instead of depending on Composio."

**Why it is a trap**: You already have 500+ integrations via Composio (`/Users/adamcognigy/LangflowSaaS/src/backend/app/services/composio_connection_service.py`). Building even one native OAuth integration (e.g., Gmail) takes 3-5 days including OAuth flow, token refresh, scope management, and error handling. Building 10 would consume your entire quarter.

**What to do instead**: Keep using Composio. If a specific integration breaks or is missing, file a Composio support ticket. Their business model depends on integration coverage. Focus your engineering time on features unique to Teach Charlie.

---

### Anti-Feature 9: A/B Testing for Agents

**Why it is tempting**: "Let users test two versions of their agent and see which performs better."

**Why it is a trap**: A/B testing requires: statistical significance calculation, traffic splitting, metric collection over time, and a results dashboard. This is a 15+ day project that assumes users have enough traffic to generate statistically valid results. At early stage, most agents will have 10-50 conversations per week -- far too few for meaningful A/B tests.

**What to do instead**: Agent versioning (Rank 5) lets users manually compare versions. Add a "test this change" button that opens a side-by-side playground where users can chat with the old and new version simultaneously. This takes 3 days instead of 15.

---

### Anti-Feature 10: White-Label / Resell Platform

**Why it is tempting**: "Agencies could resell Teach Charlie under their own brand." This sounds like a revenue multiplier.

**Why it is a trap**: White-labeling requires: custom branding per tenant, custom domains, isolated data, separate billing, and an agency management portal. This is a 30+ day project that fundamentally changes your product from B2C/B2SMB to B2B2C. It also splits your attention between two very different customer types.

**What to do instead**: Offer a "Powered by Teach Charlie" embed widget with customizable branding (colors, logo). This gives agencies 80% of what they want with 5% of the effort. The embed widget customization is already partially built (`EmbedConfig` in your `embed.py` supports `theme`, `primary_color`, `show_branding`).

---

## 3. INFRASTRUCTURE & COST OPTIMIZATION

### Current Architecture: Where It Breaks

**Your production stack** (from `/Users/adamcognigy/LangflowSaaS/docker-compose.prod.yml`):

```
DigitalOcean Droplet (likely 4GB RAM, 2 vCPU, $24/mo)
 |
 +-- nginx (alpine, ~20MB RAM)
 +-- frontend (React static build via nginx, ~50MB RAM)
 +-- backend (FastAPI + uvicorn, ~200MB RAM)
 +-- langflow (Python + Java, ~800-1500MB RAM)
 +-- postgres (PostgreSQL 16, ~200-400MB RAM)
 +-- redis (alpine, ~50MB RAM)
```

**Total memory at idle**: ~1.3-2.2GB
**Available for burst**: 1.8-2.7GB on a 4GB droplet

**Breaking Points by Concurrent Users**:

| Concurrent Users | Bottleneck | Symptom | When |
|---|---|---|---|
| 1-10 | None | Everything works | Now |
| 10-25 | Langflow memory | Slow LLM responses (>5s) | 50-100 total users |
| 25-50 | PostgreSQL connections | Connection pool exhaustion | 200-300 total users |
| 50-100 | Droplet RAM | OOM kills (containers restart) | 500+ total users |
| 100+ | Single CPU | Everything queues | 1,000+ total users |

**Critical insight**: "Concurrent users" means users actively sending chat messages at the same moment. With 100 total registered users, you might have 5-10 concurrent at peak. You are safe to ~200-300 registered users on current infrastructure.

### Cost Breakdown and Optimization

**Current Monthly Costs (estimated)**:

| Service | Cost | Notes |
|---|---|---|
| DigitalOcean Droplet (4GB/2CPU) | $24/mo | Production server |
| DigitalOcean Droplet (domain/SSL only) | $0 | Using Let's Encrypt |
| Clerk (Auth) | $0 | Free to 10,000 MAU |
| Stripe | 2.9% + $0.30/txn | Only on actual revenue |
| OpenAI API (platform key) | $5-50/mo | Depends on usage, most users BYO key |
| Domain (teachcharlie.ai) | ~$1/mo | Annual registration amortized |
| GitHub | $0 | Free for public/private repos |
| **TOTAL** | **~$30-75/mo** | Well within $100-$500 budget |

**Cost Per User Calculation**:

At 100 users (assuming 60% free, 30% Individual, 10% inactive):
- Infrastructure: $30/mo / 100 users = **$0.30/user/month**
- LLM costs (platform-provided credits): ~$0.10/active user/month (assuming 500 credits = ~$0.50 in actual API costs, 60 active users)
- Total cost per user: **~$0.40/user/month**
- Revenue per user: (30 users x $19) / 100 = **$5.70/user/month**
- **Gross margin: ~93%** -- excellent for SaaS

**Optimization Recommendations (in order)**:

**1. Add Cloudflare Free Tier (Day 1, $0/mo, 2 hours)**

Why: Your nginx serves the React build (static JS/CSS/HTML) from the same droplet that runs Langflow. Cloudflare's free tier CDN caches static assets at 200+ edge locations, reducing droplet bandwidth by ~70% and improving first-load times by 50-300ms globally.

How: Point `teachcharlie.ai` nameservers to Cloudflare. Enable "Full (Strict)" SSL mode. Enable Auto Minify for JS/CSS/HTML. This also gives you free DDoS protection and a web application firewall.

Cost/time: $0, 2 hours to configure DNS and Cloudflare settings.

**2. DigitalOcean Reserved Instance (Day 1, saves ~$7/mo)**

Why: You are paying $24/mo for on-demand pricing. Reserved instances (1-year commitment) save ~30%.

How: In DigitalOcean dashboard: Droplets -> your droplet -> Convert to Reserved IP. For a 4GB/2CPU droplet, this saves ~$7/mo (~$84/year).

Cost/time: $0 upfront (monthly billing), 5 minutes.

**3. Upgrade to 8GB RAM Droplet Before 200 Users ($48/mo instead of $24/mo)**

Why: At 200 registered users (~10-15 concurrent at peak), Langflow will start competing with PostgreSQL for RAM. The 8GB droplet doubles your headroom and adds 2 more CPU cores (4 total), letting you set `LANGFLOW_WORKERS: 4` instead of 2.

When: When you hit 150 registered users OR when you see `container killed` messages in Docker logs.

Cost: $48/mo (or ~$34/mo with reserved pricing). Still well within budget.

**4. LLM Cost Management Strategy**

Your `plans.py` already implements the right architecture: credits system with BYO API key. Here is how to optimize further:

- **Default to GPT-4o-mini for all free-tier users**: At 0.5 credits/1K input tokens vs. 5 credits/1K for GPT-4o, this is 10x cheaper per conversation. Free users will not notice the quality difference for simple Q&A agents. File to modify: `/Users/adamcognigy/LangflowSaaS/src/backend/app/services/template_mapping.py` -- change default model in template generation.

- **Implement response caching**: For embed widgets, many conversations start with the same questions ("What are your hours?", "How do I return an item?"). Cache responses for identical (agent_id, message_hash) pairs for 1 hour. Redis is already running. Estimated savings: 20-40% of embed widget LLM costs.

- **Add token counting to the frontend**: Show users how many credits each message costs in real-time. This creates awareness and encourages efficient prompt writing. Display: "This message used 3 credits (2,847 tokens)."

**5. Database Optimization (Before 500 Users)**

Your PostgreSQL runs inside Docker with default configuration. Before 500 users:

- **Connection pooling**: Add PgBouncer container between backend/Langflow and PostgreSQL. Default PostgreSQL max_connections is 100. With async SQLAlchemy + Langflow both connecting, you will exhaust this around 300 users. PgBouncer ($0, one container, 30 minutes to configure) multiplexes connections and supports 1,000+ client connections to 25 actual database connections.

- **Your composite indexes are already good**: The migration `20260124_0001` added 11 composite indexes covering the hot query paths. No immediate action needed.

- **When to add read replicas**: Not before 2,000 users. PostgreSQL 16 handles read-heavy workloads well with proper indexing.

### Scaling Plan

| Milestone | Users | Infrastructure Change | Monthly Cost |
|---|---|---|---|
| Launch | 0-100 | Current 4GB droplet + Cloudflare free | $24 |
| Growth | 100-300 | Upgrade to 8GB droplet | $48 |
| Traction | 300-1,000 | Add PgBouncer, increase LANGFLOW_WORKERS to 4 | $48 |
| Scale | 1,000-3,000 | Move to 16GB droplet OR split into 2 droplets (app + database) | $96-$144 |
| Serious Scale | 3,000-5,000 | DigitalOcean Managed Postgres ($15/mo) + App Platform or Kubernetes | $200-$400 |

**Key insight**: You do not need Kubernetes, managed databases, or multi-region deployment until $10K+ MRR. By the time you need those things, you can afford them.

---

## 4. MONITORING & ALERTING FOR SOLO FOUNDER

### The "3 AM Rule"

As a solo founder, monitoring must answer one question: **"Is the thing making money still working?"** Everything else can wait until morning.

### Tier 1: Wake You Up at 3 AM (Implement Day 1)

**UptimeRobot Free Tier ($0, 15 minutes to set up)**

Configure these monitors:
1. **HTTPS check**: `https://app.teachcharlie.ai/health` -- expected: 200 OK -- check every 5 minutes
2. **Keyword check**: `https://app.teachcharlie.ai` -- expected: contains "Teach Charlie" -- check every 5 minutes
3. **API check**: `https://app.teachcharlie.ai/api/v1/health` -- expected: 200 OK -- check every 5 minutes

Alert routing: Email + SMS (UptimeRobot free supports both). Set 2 consecutive failures before alerting to avoid false positives.

Why these three: Monitor 1 catches nginx/container crashes. Monitor 2 catches frontend build failures. Monitor 3 catches backend/database failures.

**Stripe Webhook Monitor (built-in, $0)**

In Stripe Dashboard -> Developers -> Webhooks -> your endpoint: Enable email notifications for webhook failures. If Stripe cannot reach your webhook endpoint, you are not processing payments.

Why this matters: A missed webhook means a customer pays but their plan does not upgrade. This is the fastest way to lose trust.

### Tier 2: Check Every Morning (Implement Week 1)

**Sentry Free Tier ($0, 5,000 events/month)**

Your `docker-compose.prod.yml` already has `SENTRY_DSN` configured as an environment variable, and `config.py` has `sentry_dsn` and `sentry_traces_sample_rate` fields. You just need to:

1. Create a Sentry project at sentry.io
2. Set the `SENTRY_DSN` environment variable on your production droplet
3. Install `sentry-sdk[fastapi]` in your backend requirements (if not already present)

Configure: Alert on all unhandled exceptions. Group by endpoint. Ignore 404s (they are noise). Daily email digest at 8 AM.

Why this matters: Your backend currently has 17 exception types (per audit). Without Sentry, errors happen silently. The 138 `.catch(() => {})` in the frontend (audit finding) means errors are being swallowed in production right now.

**Health Check Endpoints to Build (4 hours)**

Your existing `/health` endpoint returns a simple "healthy" string from nginx. Build a comprehensive health check:

```
GET /api/v1/health/detailed
Response:
{
  "status": "healthy",
  "timestamp": "2026-02-15T10:00:00Z",
  "services": {
    "database": {"status": "connected", "latency_ms": 2},
    "redis": {"status": "connected", "latency_ms": 1},
    "langflow": {"status": "connected", "latency_ms": 45},
    "stripe": {"status": "configured", "webhook_secret": true}
  },
  "metrics": {
    "active_users_24h": 12,
    "chat_messages_24h": 47,
    "error_rate_1h": 0.02,
    "avg_response_time_ms": 1200
  }
}
```

This endpoint serves three purposes: (1) monitoring tools can check service health, (2) you can SSH in and `curl localhost:8000/api/v1/health/detailed` to diagnose issues, (3) it surfaces metrics without needing a dashboard.

### Tier 3: Weekly Review (Implement Month 1)

**PostHog Free Tier ($0, 1M events/month)**

Instrument these events:
- `user_signed_up` -- with source (workshop, organic, referral)
- `agent_created` -- with preset_used, has_knowledge_sources
- `chat_message_sent` -- with agent_id, is_embed, response_time_ms
- `plan_upgraded` -- with from_plan, to_plan
- `plan_canceled` -- with reason (if captured)
- `credit_purchased` -- with pack_id, amount
- `embed_widget_loaded` -- with domain, agent_id

Weekly review: Open PostHog every Monday morning. Check: (1) signups trend, (2) activation rate (signups who create agent within 24h), (3) conversion rate (free to paid), (4) churn events.

### Tier 4: Nice to Have (Implement When Profitable)

**Grafana Cloud Free Tier ($0, 10K metrics)**

Connect to your PostgreSQL for database metrics. Monitor: connection count, query latency p95, disk usage. Set alert at 80% disk usage.

**Log Management**: Use `docker compose logs` piped to a file for now. At 500+ users, consider Loki (free with Grafana Cloud) or Papertrail ($7/mo for 50MB/day).

### Cost Summary for Full Monitoring Stack

| Tool | Cost | Purpose |
|---|---|---|
| UptimeRobot | $0 | Uptime + 3AM alerts |
| Sentry | $0 | Error tracking |
| PostHog | $0 | Product analytics |
| Grafana Cloud | $0 | Infrastructure metrics (later) |
| **Total** | **$0** | |

---

## 5. SECURITY PRIORITIES

### Risk x Effort Matrix

Each finding is scored:
- **Risk** (1-5): Likelihood x impact if exploited
- **Effort** (1-5): Days to fix with AI-assisted development
- **Priority** = Risk / Effort (higher = fix first)

| Issue | Risk | Effort | Priority | Fix By |
|---|---|---|---|---|
| Hardcoded secrets in git history | 5 | 3 | 1.67 | Week 1 |
| unsafe-eval in production CSP | 4 | 4 | 1.00 | Month 1 |
| No 404 catch-all route | 2 | 0.5 | 4.00 | Day 1 |
| TypeScript strict: false | 3 | 20+ | 0.15 | Ongoing |
| 179 waitForTimeout in E2E tests | 2 | 5 | 0.40 | Month 2 |
| 4 silent .catch in frontend | 2 | 0.5 | 4.00 | Day 1 |
| 0 frontend unit tests | 2 | 10 | 0.20 | Month 3 |
| MCPServerModal 976 LOC | 1 | 3 | 0.33 | Backlog |
| workflows.py 1,592 LOC | 1 | 4 | 0.25 | Backlog |

---

### Priority 1: Add 404 Catch-All Route (2 hours, fix today)

**File**: `/Users/adamcognigy/LangflowSaaS/src/frontend/src/App.tsx`

Add a `<Route path="*" element={<NotFoundPage />} />` as the last route in your router. Without this, users who mistype a URL see a blank white page, which looks like the app is broken. This is a 2-hour fix including the `NotFoundPage.tsx` component (show Charlie mascot + "Oops! This page doesn't exist" + link to dashboard).

**Why this matters**: Every blank-screen experience increases perceived instability. Non-technical users do not know to check the URL -- they assume the product is broken.

### Priority 2: Fix Silent .catch Errors in Frontend (2 hours)

**File**: `/Users/adamcognigy/LangflowSaaS/src/frontend/src/lib/api.ts` (4 occurrences)

The audit found 4 instances of `.catch(() => {})` in `api.ts`. These silently swallow API errors, meaning network failures, auth failures, and server errors are invisible to users. Replace each with `.catch((error) => { console.error('API call failed:', error); throw error; })` or better, show a toast notification.

**Why this matters**: When a user clicks "Save" and the API call fails silently, they think their changes are saved. When they return and find them gone, they blame the product.

### Priority 3: Remediate Hardcoded Secrets in Git History (3 days)

**The problem**: The audit found OpenAI, Anthropic, and Composio API keys committed to git history. Even though they are removed from current files, they exist in old commits.

**Remediation plan**:

Step 1 (30 minutes): **Rotate all keys immediately.** Generate new API keys for: OpenAI, Anthropic, Composio, Stripe (if committed), Clerk (if committed), Langflow API key, encryption key. Update production `.env` on the droplet.

Step 2 (2 hours): **Run BFG Repo-Cleaner.** This tool rewrites git history to remove sensitive strings. Commands:
```bash
# On local machine, not production
java -jar bfg.jar --replace-text passwords.txt LangflowSaaS.git
cd LangflowSaaS.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```
Where `passwords.txt` contains each leaked key, one per line.

Step 3 (1 hour): **Add pre-commit hook.** Install `gitleaks` as a pre-commit hook to prevent future secret commits. Add to `.pre-commit-config.yaml`.

Step 4 (30 minutes): **Verify.** Search the entire repo with `git log -p --all -S 'sk-'` and `git log -p --all -S 'sk_live'` to confirm no secrets remain.

**Why this matters**: Leaked API keys can be used to make API calls on your account. OpenAI keys found in public repos are exploited within minutes by automated scanners. Even in a private repo, any collaborator or compromised CI system has access to the full history.

**Cost/time**: 3 days including testing that nothing breaks after force-push.

### Priority 4: Remove unsafe-eval from CSP (4 days)

**File**: `/Users/adamcognigy/LangflowSaaS/nginx/nginx.prod.conf`, line 119

Your CSP currently includes `'unsafe-eval'` in the `script-src` directive:
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.clerk.com ...
```

**Why this is here**: Langflow's frontend likely uses `eval()` or `new Function()` for dynamic code execution in its flow engine. Clerk.js may also require it for their JavaScript SDK.

**Removal path**:
1. Remove `'unsafe-eval'` from CSP
2. Test: Does Langflow canvas still work? (likely no)
3. If Langflow breaks: Since Langflow is served on port 7861 with its own CSP (`frame-ancestors` only), the `unsafe-eval` only affects the main app. Move all Langflow interaction to the iframe (port 7861) and remove `unsafe-eval` from the main app's CSP.
4. Test: Does Clerk.js still work? (likely yes -- modern Clerk SDKs don't require eval)
5. If needed, add `'wasm-unsafe-eval'` (less dangerous than `'unsafe-eval'`) as a fallback for specific WASM-based features.

**Why this matters**: `unsafe-eval` allows XSS attacks to execute arbitrary JavaScript. If an attacker can inject HTML into any page (e.g., via a stored XSS in agent names), `unsafe-eval` lets them run arbitrary code.

**Acceptable risk assessment**: Because Langflow runs in an isolated iframe on port 7861 with its own CSP, and your main app input fields are sanitized (Fix 1 from audit was input validation), the actual attack surface is limited. This is a **Month 1** priority, not a Day 1 emergency.

### Priority 5: TypeScript Strict Mode Migration (Ongoing, 20+ days total)

**File**: `/Users/adamcognigy/LangflowSaaS/src/frontend/tsconfig.app.json`

Current state:
```json
"strict": false,
"noUnusedLocals": false,
"noUnusedParameters": false,
"noImplicitAny": false
```

**Why this is the biggest frontend stability risk**: Without strict mode, TypeScript allows `null` and `undefined` to flow through your code unchecked. This means runtime crashes like "Cannot read property 'name' of undefined" that strict mode would catch at compile time. Your 29,603 lines of frontend TypeScript are essentially running with the safety off.

**Incremental migration path** (do NOT enable strict mode all at once):

Phase 1 (2 days): Enable `noImplicitAny: true`. Fix the 50-200 errors this produces by adding type annotations. This is the highest-value strict mode flag.

Phase 2 (3 days): Enable `strictNullChecks: true`. This is the hardest flag -- it will produce 200-500 errors. Fix file by file, starting with `api.ts` (1,362 lines) and `types/index.ts` (1,339 lines).

Phase 3 (2 days): Enable `noUnusedLocals: true` and `noUnusedParameters: true`. Clean up dead code.

Phase 4 (1 day): Enable `strict: true` (which enables all strict flags). At this point, most issues should already be fixed.

**Why this is "Ongoing" not "Week 1"**: Enabling strict mode in a 29K-line codebase produces hundreds of compiler errors. Fixing them all at once is a multi-week project that blocks all other development. The incremental approach lets you fix one flag at a time while continuing to ship features.

### Priority 6: Rate Limiting Hardening (2 days)

Your nginx already has rate limiting zones (`api_limit: 30r/s`, `general_limit: 100r/s`) and your backend has Redis-based rate limiting via `redis_rate_limit.py`. The key gap is:

**Embed widget has no rate limiting.** The public embed chat endpoint (`POST /api/v1/embed/{token}/chat`) is unauthenticated and has no rate limit. An attacker could send thousands of requests per second, consuming your LLM credits.

**Fix**: Add per-token rate limiting in the embed chat endpoint. 10 messages per minute per conversation_id. 100 messages per hour per embed_token. This prevents abuse while allowing legitimate usage.

**File to modify**: `/Users/adamcognigy/LangflowSaaS/src/backend/app/api/embed.py`, `embed_chat` function.

### What is Acceptable Risk at This Stage

The following issues from the audit are **acceptable risk** at <500 users and can be deferred:

- **179 waitForTimeout in E2E tests**: Makes tests flaky and slow but does not affect production. Fix gradually as you touch each test file.
- **0 frontend unit tests**: E2E tests provide sufficient coverage for now. Add unit tests when you refactor large components (MCPServerModal, PlaygroundPage).
- **Large file sizes** (workflows.py at 1,592 LOC, MCPServerModal at 976 LOC): Technical debt that slows development but does not cause user-facing issues.

---

## 6. WHEN TO HIRE TECHNICAL HELP

### Decision Framework: The Three Triggers

**Trigger 1: Revenue Exceeds Time (Hire at $3K+ MRR)**

When you are spending 20 hours/week on development and earning $3K/month, your effective hourly rate is ~$37/hr. A contractor at $75/hr who can do the work in 10 hours saves you 10 hours to spend on sales, workshops, and marketing -- where your marginal value is highest.

**Trigger 2: Blocked for >48 Hours (Hire Immediately)**

If Claude Code cannot solve a problem (e.g., Langflow upgrade breaks your integration, PostgreSQL performance issue you cannot diagnose, SSL certificate issue), hire a contractor for a 4-8 hour engagement. Do not spend a week debugging infrastructure when a DevOps contractor can fix it in half a day.

**Trigger 3: Security Incident (Hire Immediately)**

If you discover a data breach, unauthorized access, or leaked credentials being exploited, hire a security consultant immediately. This is not the time for AI-assisted debugging.

### First Hire Decision Tree

```
Q: Are you blocked on infrastructure/DevOps?
  YES -> Hire DevOps contractor (4-8 hour engagement)
  NO  -> Continue

Q: Is your MRR > $3K?
  YES -> Hire part-time frontend developer (10 hrs/week)
  NO  -> Continue using Claude Code

Q: Do you have >10 support tickets/week?
  YES -> Hire part-time support + QA person
  NO  -> Handle support yourself
```

### What to Outsource First (Ranked)

**1. DevOps / Infrastructure (first outsource)**

Why: This is the area where Claude Code is weakest and where mistakes are most costly. A misconfigured nginx proxy, a database migration gone wrong, or an SSL certificate expiration can take your product offline.

What to hire for:
- Set up automated SSL renewal (Let's Encrypt + certbot)
- Configure automated database backups with off-site storage
- Set up monitoring stack (Sentry, UptimeRobot, log rotation)
- Review and harden Docker Compose production configuration
- Set up CI/CD pipeline in GitHub Actions

Budget: $75-$100/hr, 8-16 hours = $600-$1,600 one-time engagement.

Where to find: Toptal (vetted, expensive at $100-$150/hr), Upwork (variable quality, $50-$100/hr), or post in the DigitalOcean community forum.

**2. E2E Test Stabilization (second outsource)**

Why: Your 179 `waitForTimeout` calls make tests flaky and slow. A QA engineer can replace them with proper Playwright `waitFor` patterns in 2-3 days, making your test suite reliable enough to run in CI without false failures.

Budget: $50-$75/hr, 16-24 hours = $800-$1,800 one-time engagement.

**3. Feature Development (third outsource, at $5K+ MRR)**

Why: Only outsource feature development after infrastructure and testing are solid. A feature developer working on an unstable codebase creates more problems than they solve.

What to hire for: Template marketplace, team workspaces, or embed analytics (the features from Section 1 ranked 3-7).

Budget: $75-$125/hr, 20-40 hours/month = $1,500-$5,000/month.

### How to Find AI-Savvy Contractors

Your codebase is built entirely by Claude Code. A contractor needs to understand this and be comfortable working alongside AI-generated code. Look for:

1. **Post in AI development communities**: Claude Discord, r/ClaudeAI, AI-native development Slack groups. Many developers now work alongside AI tools and understand the patterns.

2. **Screen for "AI pair programming" experience**: Ask candidates: "Have you used Claude Code, Cursor, or Copilot to build production features? Show me an example." If they have not, they will struggle with your codebase patterns.

3. **Give a paid test task**: Pay for a 4-hour test engagement. Task: "Using Claude Code, add a 404 catch-all page to the frontend. Write a Playwright E2E test for it. Submit a PR." This tests: ability to navigate the codebase, comfort with AI tools, code quality, PR hygiene.

4. **Where to look specifically**:
   - Upwork: Search "FastAPI + React" or "full-stack + AI tools" -- rates: $50-$100/hr
   - Toptal: Search for "AI-native developer" -- rates: $100-$150/hr
   - Gun.io: Pre-vetted freelancers -- rates: $75-$125/hr
   - Twitter/X: Post "Looking for a developer comfortable working with Claude Code on a live SaaS product" -- you will get DMs

### How to Manage a Contractor When You Are Non-Technical

**1. Use the Claude Code workflow**: Have the contractor work in the same CLAUDE.md-guided, AI-assisted pattern you use. They should be committing through PRs that Claude AI reviews (your `ai-review.yml` workflow already does this).

**2. Define acceptance criteria, not implementation details**: Instead of "Add a REST endpoint with SQLAlchemy model," say "Users should be able to see how many messages their embedded agent handled this week."

**3. Require PRs, never direct commits to main**: Your `.github/workflows/test.yml` already runs on PRs. Make sure the contractor's code passes all checks before merging.

**4. Weekly 30-minute call**: One sync per week to review progress, unblock issues, and align on priorities. Async communication via GitHub issues or Slack for everything else.

**5. Budget buffer**: Always budget 20% more than the contractor's estimate. In a codebase maintained by AI, there are always surprising edge cases that take extra time.

---

### Summary: 90-Day Technical Roadmap

| Week | Action | Cost | Expected Impact |
|---|---|---|---|
| 1 | Cloudflare + UptimeRobot + 404 page + fix silent catches | $0 | Stability baseline |
| 1-2 | Workshop onboarding flow + Sentry setup | $0 | Workshop conversion +30% |
| 2-3 | Email drip sequence + PostHog instrumentation | $0-$20 | Retention +15% |
| 3-4 | Rotate leaked secrets + BFG repo clean | $0 | Security remediation |
| 4-5 | Multi-language agent responses + agent versioning | $0 | Market expansion |
| 5-7 | Template marketplace (community agents) | $0 | Activation multiplier |
| 7-8 | Embed widget rate limiting + analytics | $0 | Embed revenue enablement |
| 8-10 | API access for Business tier | $0 | B2B revenue |
| 10-12 | Team workspaces (lightweight) | $0 | Team plan revenue |
| 12 | DevOps contractor engagement | $600-$1,600 | Infrastructure hardening |

**Total 90-day investment**: $600-$1,620 in contractor costs + $0 in tooling
**Expected outcome**: Infrastructure hardened, 5 new revenue-driving features shipped, monitoring in place, security remediated

---

# FINANCIAL PLANNING — Teach Charlie AI Launch Playbook

---

## Preamble: Key Assumptions & Methodology

Every number in this document is derived from explicitly stated assumptions. Where I use industry benchmarks, I cite the source category (e.g., "B2B SaaS median" or "developer tool average"). All dollar amounts are USD. All months are calendar months starting from launch month (Month 1 = first month with paying customers live).

**Pricing structure used throughout:**
- Free tier: $0/mo (limited usage)
- Individual plan: $19/mo ($190/yr if annual = ~17% discount)
- Business plan: Custom, modeled at $99/mo average
- Credit packs: $10 / $25 / $50 (modeled at 40% gross margin after LLM API costs)
- Workshops: $0 (free intros) / $49 (basics) / $99 (intermediate) / $199 (advanced)

---

## 1. Month-by-Month P&L Projection (Year 1)

### 1.1 Shared Assumptions (All Scenarios)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Launch month | Month 1 | Product is live, payment processing active |
| Free-to-paid conversion | Varies by scenario | Industry range: 2-5% for freemium SaaS |
| Monthly logo churn (paid) | Varies by scenario | SMB SaaS median: 5-8%/mo |
| Stripe fee | 2.9% + $0.30/txn | Standard Stripe pricing |
| Annual subscription discount | 17% (~$190/yr vs $228/yr) | Standard SaaS annual discount |
| Annual subscriber mix | 20% annual / 80% monthly in M1, trending to 40/60 by M12 | Typical early-stage mix |
| Credit pack attach rate | Varies by scenario | % of paid subscribers who buy credits monthly |
| Credit pack avg purchase | $22 | Weighted average of $10/$25/$50 packs |
| Credit gross margin | 40% | After LLM API costs (OpenAI/Anthropic) |
| Workshop capacity | 15-30 people depending on format | Solo instructor constraint |
| Workshop COGS | ~$50/workshop (Zoom Pro, materials, time) | Minimal direct costs |

### 1.2 PESSIMISTIC SCENARIO — "Slow Grind"

**Scenario assumptions:**
- User acquisition: 30 free signups/mo Month 1, growing 15%/mo
- Free-to-paid conversion: 2%
- Monthly churn (paid): 8%
- Credit pack attach rate: 10% of paid users
- Workshops: 1 every other month, avg 8 attendees, avg $79/ticket
- No Business plan customers until Month 9
- Marketing spend: $50-150/mo (content tools, occasional small ad tests)

| Month | Free Users (cum.) | New Paid | Churned | Active Paid | Sub Rev | Credit Rev | Workshop Rev | **Total Rev** | Infra | Tools/SaaS | Marketing | Stripe Fees | LLM Margin Loss | **Total Costs** | **Net** | **Cumulative** |
|-------|-------------------|----------|---------|-------------|---------|------------|--------------|---------------|-------|------------|-----------|-------------|-----------------|-----------------|---------|----------------|
| 1 | 30 | 1 | 0 | 1 | $19 | $2 | $0 | **$21** | $60 | $15 | $50 | $1 | $1 | $127 | -$106 | -$106 |
| 2 | 65 | 1 | 0 | 2 | $38 | $4 | $632 | **$674** | $60 | $15 | $50 | $21 | $3 | $149 | +$525 | +$419 |
| 3 | 104 | 1 | 0 | 3 | $57 | $7 | $0 | **$64** | $60 | $15 | $75 | $3 | $4 | $157 | -$93 | +$326 |
| 4 | 150 | 1 | 0 | 4 | $76 | $9 | $632 | **$717** | $60 | $15 | $75 | $22 | $5 | $177 | +$540 | +$866 |
| 5 | 202 | 2 | 0 | 6 | $114 | $13 | $0 | **$127** | $60 | $15 | $100 | $5 | $8 | $188 | -$61 | +$805 |
| 6 | 263 | 2 | 0 | 8 | $152 | $18 | $632 | **$802** | $60 | $25 | $100 | $25 | $11 | $221 | +$581 | +$1,386 |
| 7 | 333 | 2 | 1 | 9 | $171 | $20 | $0 | **$191** | $60 | $25 | $100 | $7 | $12 | $204 | -$13 | +$1,373 |
| 8 | 415 | 3 | 1 | 11 | $209 | $24 | $632 | **$865** | $60 | $25 | $125 | $27 | $15 | $252 | +$613 | +$1,986 |
| 9 | 510 | 4 | 1 | 14 | $365 | $31 | $0 | **$396** | $72 | $25 | $125 | $13 | $19 | $254 | +$142 | +$2,128 |
| 10 | 621 | 5 | 1 | 18 | $441 | $40 | $632 | **$1,113** | $72 | $25 | $150 | $35 | $24 | $306 | +$807 | +$2,935 |
| 11 | 750 | 6 | 1 | 23 | $536 | $51 | $0 | **$587** | $72 | $25 | $150 | $19 | $30 | $296 | +$291 | +$3,226 |
| 12 | 901 | 7 | 2 | 28 | $631 | $62 | $632 | **$1,325** | $72 | $25 | $150 | $41 | $37 | $325 | +$1,000 | +$4,226 |

**Notes on Month 9**: First Business plan customer added ($99/mo), hence jump in sub revenue.
**Workshop calculation**: 8 attendees x $79 avg = $632 per workshop, held in even months.

**Pessimistic Year 1 Summary:**
| Metric | Value |
|--------|-------|
| Total Revenue | ~$6,882 |
| Total Costs | ~$2,656 |
| Net Profit | ~$4,226 |
| Month 12 MRR | ~$693 (subs only) |
| Month 12 MRR incl. credits | ~$755 |
| End-of-year paid users | 28 |
| **Distance from $5K MRR goal** | **$4,245 short** |

---

### 1.3 REALISTIC SCENARIO — "Steady Build"

**Scenario assumptions:**
- User acquisition: 60 free signups/mo Month 1, growing 20%/mo
- Free-to-paid conversion: 3.5%
- Monthly churn (paid): 6%
- Credit pack attach rate: 20% of paid users
- Workshops: 2/month starting Month 2, avg 12 attendees, avg $99/ticket
- First Business plan customer Month 5, growing to 5 by Month 12
- Marketing spend: $100-300/mo (content, community, small ad experiments)
- One annual plan conversion event (Black Friday or similar) in Month 9

| Month | Free Users (cum.) | New Paid | Churned | Active Paid (Ind.) | Active Paid (Biz) | Sub Rev | Credit Rev | Workshop Rev | **Total Rev** | Infra | Tools/SaaS | Marketing | Stripe Fees | LLM/COGS | **Total Costs** | **Net** | **Cumulative** |
|-------|-------------------|----------|---------|---------------------|-------------------|---------|------------|--------------|---------------|-------|------------|-----------|-------------|----------|-----------------|---------|----------------|
| 1 | 60 | 2 | 0 | 2 | 0 | $38 | $10 | $0 | **$48** | $60 | $15 | $100 | $2 | $6 | $183 | -$135 | -$135 |
| 2 | 132 | 3 | 0 | 5 | 0 | $95 | $22 | $2,376 | **$2,493** | $60 | $15 | $100 | $75 | $13 | $263 | +$2,230 | +$2,095 |
| 3 | 218 | 4 | 0 | 9 | 0 | $171 | $40 | $2,376 | **$2,587** | $60 | $25 | $150 | $78 | $24 | $337 | +$2,250 | +$4,345 |
| 4 | 322 | 5 | 1 | 13 | 0 | $247 | $57 | $2,376 | **$2,680** | $60 | $25 | $150 | $81 | $34 | $350 | +$2,330 | +$6,675 |
| 5 | 446 | 6 | 1 | 18 | 1 | $441 | $84 | $2,376 | **$2,901** | $72 | $25 | $200 | $88 | $50 | $435 | +$2,466 | +$9,141 |
| 6 | 595 | 8 | 1 | 25 | 1 | $574 | $114 | $2,376 | **$3,064** | $72 | $25 | $200 | $93 | $69 | $459 | +$2,605 | +$11,746 |
| 7 | 774 | 10 | 2 | 33 | 2 | $825 | $154 | $2,376 | **$3,355** | $72 | $40 | $250 | $102 | $92 | $556 | +$2,799 | +$14,545 |
| 8 | 989 | 13 | 2 | 44 | 2 | $1,034 | $202 | $2,376 | **$3,612** | $96 | $40 | $250 | $110 | $121 | $617 | +$2,995 | +$17,540 |
| 9 | 1,247 | 17 | 3 | 58 | 3 | $1,399 | $268 | $2,376 | **$4,043** | $96 | $40 | $300 | $123 | $161 | $720 | +$3,323 | +$20,863 |
| 10 | 1,557 | 21 | 4 | 75 | 4 | $1,821 | $348 | $2,376 | **$4,545** | $96 | $40 | $300 | $139 | $209 | $784 | +$3,761 | +$24,624 |
| 11 | 1,928 | 26 | 5 | 96 | 4 | $2,220 | $440 | $2,376 | **$5,036** | $96 | $40 | $300 | $154 | $264 | $854 | +$4,182 | +$28,806 |
| 12 | 2,374 | 32 | 6 | 122 | 5 | $2,813 | $559 | $2,376 | **$5,748** | $96 | $50 | $300 | $176 | $335 | $957 | +$4,791 | +$33,597 |

**Notes**: 
- Workshop revenue = 2 workshops/mo x 12 attendees x $99 = $2,376/mo
- Business plan enters at $99/mo starting Month 5
- Month 9 includes annual plan conversion push (not shown as separate line; captured in higher sub rev retention)
- Infrastructure scales to $96/mo at Month 8 (upgrade to 8GB droplet or add second droplet)

**Realistic Year 1 Summary:**
| Metric | Value |
|--------|-------|
| Total Revenue | ~$40,112 |
| Total Costs | ~$6,515 |
| Net Profit | ~$33,597 |
| Month 12 MRR (subs) | ~$2,813 |
| Month 12 MRR (subs + credits) | ~$3,372 |
| Month 12 total rev (incl. workshops) | ~$5,748 |
| End-of-year paid users | 127 (122 Individual + 5 Business) |
| **Distance from $5K MRR goal** | **$1,628 short on subs; achieved on total rev** |

---

### 1.4 OPTIMISTIC SCENARIO — "Workshop Flywheel Takes Off"

**Scenario assumptions:**
- User acquisition: 100 free signups/mo Month 1, growing 30%/mo (viral workshops, content)
- Free-to-paid conversion: 5%
- Monthly churn (paid): 4% (strong product-market fit)
- Credit pack attach rate: 30% of paid users
- Workshops: 4/month by Month 3 (2 free intro + 2 paid), avg 20 attendees on paid, avg $129/ticket
- Business plan customers from Month 3, growing aggressively
- Marketing spend: $200-500/mo
- Partnership with 1-2 bootcamps/communities starting Month 6

| Month | Free (cum.) | Paid Ind. | Paid Biz | Sub Rev | Credit Rev | Workshop Rev | **Total Rev** | **Total Costs** | **Net** | **Cumulative** |
|-------|-------------|-----------|----------|---------|------------|--------------|---------------|-----------------|---------|----------------|
| 1 | 100 | 5 | 0 | $95 | $33 | $0 | **$128** | $200 | -$72 | -$72 |
| 2 | 230 | 12 | 0 | $228 | $79 | $5,160 | **$5,467** | $350 | +$5,117 | +$5,045 |
| 3 | 399 | 22 | 1 | $517 | $152 | $5,160 | **$5,829** | $420 | +$5,409 | +$10,454 |
| 4 | 619 | 36 | 2 | $882 | $251 | $5,160 | **$6,293** | $510 | +$5,783 | +$16,237 |
| 5 | 905 | 55 | 3 | $1,342 | $383 | $5,160 | **$6,885** | $610 | +$6,275 | +$22,512 |
| 6 | 1,277 | 80 | 5 | $2,015 | $561 | $5,160 | **$7,736** | $740 | +$6,996 | +$29,508 |
| 7 | 1,760 | 112 | 7 | $2,821 | $784 | $5,160 | **$8,765** | $880 | +$7,885 | +$37,393 |
| 8 | 2,388 | 152 | 10 | $3,878 | $1,069 | $5,160 | **$10,107** | $1,050 | +$9,057 | +$46,450 |
| 9 | 3,204 | 203 | 14 | $5,243 | $1,432 | $5,160 | **$11,835** | $1,280 | +$10,555 | +$57,005 |
| 10 | 4,265 | 266 | 18 | $6,834 | $1,873 | $5,160 | **$13,867** | $1,520 | +$12,347 | +$69,352 |
| 11 | 5,645 | 344 | 23 | $8,813 | $2,420 | $5,160 | **$16,393** | $1,800 | +$14,593 | +$83,945 |
| 12 | 7,439 | 440 | 29 | $11,321 | $3,092 | $5,160 | **$19,573** | $2,150 | +$17,423 | +$101,368 |

**Notes**:
- Workshop revenue = 2 paid workshops/mo x 20 attendees x $129 = $5,160/mo
- Costs escalate to include contractor help ($500/mo from Month 8), upgraded infra, community tools
- Business plans grow through workshop funnel to corporate buyers

**Optimistic Year 1 Summary:**
| Metric | Value |
|--------|-------|
| Total Revenue | ~$112,878 |
| Total Costs | ~$11,510 |
| Net Profit | ~$101,368 |
| Month 12 MRR (subs) | ~$11,321 |
| Month 12 MRR (subs + credits) | ~$14,413 |
| Month 12 total rev (incl. workshops) | ~$19,573 |
| End-of-year paid users | 469 (440 Individual + 29 Business) |
| **$5K MRR goal** | **Achieved Month 9** |
| **$15K MRR goal** | **Nearly achieved Month 12** |

---

### 1.5 THREE ASSUMPTIONS MOST LIKELY TO BE WRONG

These are the inputs that carry the highest uncertainty and the highest impact on outcomes:

**1. Free-to-Paid Conversion Rate (modeled at 2-5%)**
- **Why it could be wrong**: The product targets non-technical users building AI agents. This audience may have high curiosity but low willingness to pay. Alternatively, if workshops create strong "aha moments," conversion could exceed 5%.
- **Sensitivity**: If conversion is 1% instead of 3.5% in the realistic scenario, Month 12 paid users drop from 127 to ~36, and MRR drops from $2,813 to ~$800. If conversion is 7%, Month 12 paid users rise to ~254 and MRR to ~$5,600.
- **Mitigation**: Track conversion weekly. If below 2% by Month 3, revisit pricing (lower entry tier at $9/mo?) or product (is the free tier too generous?).

**2. Workshop Attendance and Frequency**
- **Why it could be wrong**: Workshops require the founder's time, which is the scarcest resource. Attendee acquisition for paid workshops is a separate marketing challenge. Free workshops may cannibalize paid. Audience fatigue is real.
- **Sensitivity**: In the realistic scenario, workshops are $2,376/mo. If workshops only happen monthly with 8 attendees at $79 average, that is $632/mo — a $20,928/year revenue reduction. This alone turns the realistic scenario much closer to pessimistic.
- **Mitigation**: Develop a self-serve workshop recording/course product by Month 4 to decouple revenue from founder time. Pre-sell workshop seats to validate demand before investing time.

**3. Monthly Churn Rate (modeled at 4-8%)**
- **Why it could be wrong**: Educational tools have notoriously high churn once users feel they have "learned enough." The AI agent builder space is also moving fast — new free alternatives could emerge. Conversely, if users build agents that serve their businesses, switching costs are high and churn could be very low.
- **Sensitivity**: In the realistic scenario at 6% churn, Month 12 has 127 paid users. At 10% churn, that drops to ~78. At 3% churn, it rises to ~185. This is a 2.4x range.
- **Mitigation**: Implement usage-based stickiness features (agents that serve real traffic for users' businesses), track cohort retention by acquisition channel, and run churn surveys from Month 2 onward.

---

## 2. Break-Even Analysis

### 2.1 Fixed Costs (Monthly Baseline)

| Cost Category | Month 1-4 | Month 5-8 | Month 9-12 | Notes |
|---------------|-----------|-----------|------------|-------|
| DigitalOcean (infra) | $60 | $72 | $96 | Scale with users |
| Domain/DNS | $1.25 | $1.25 | $1.25 | $15/yr amortized |
| Clerk (auth) | $0 | $0 | $25 | Free until ~1,000 MAU |
| Email service | $0 | $0 | $20 | Free tier → paid at scale |
| Monitoring tools | $0 | $0 | $10 | Free tiers initially |
| GitHub | $0 | $0 | $0 | Free |
| SSL/Cloudflare | $0 | $0 | $0 | Free |
| **Total Fixed** | **$61** | **$73** | **$152** | |

### 2.2 Variable Costs Per Paid User Per Month

| Cost Component | Amount | Calculation |
|----------------|--------|-------------|
| Stripe fee on $19/mo | $0.85 | 2.9% x $19 + $0.30 |
| LLM API costs (free tier usage) | $0.50 | ~25 basic requests/mo at $0.02 avg |
| LLM API costs (paid tier, net of credit margin) | $0 | Credits are pre-purchased; margin covers cost |
| Incremental infra per user | $0.05 | Negligible until 500+ users |
| Support time (founder hours) | $0 | Not counted as cash cost at this stage |
| **Total variable/paid user/mo** | **~$1.35** | |

### 2.3 Break-Even Calculations

**Contribution margin per Individual subscriber:**
- Revenue: $19.00
- Stripe fee: -$0.85
- LLM overhead: -$0.50
- **Contribution margin: $17.65/user/mo (92.9%)**

**Contribution margin per Business subscriber:**
- Revenue: $99.00
- Stripe fee: -$3.17
- LLM overhead: -$2.00
- **Contribution margin: $93.83/user/mo (94.8%)**

**Break-even on fixed costs alone (SaaS only, no workshops):**

| Scenario | Fixed Costs/Mo | Break-Even Users (Individual @ $17.65 CM) | Break-Even Users (Mixed) |
|----------|---------------|-------------------------------------------|--------------------------|
| Early (M1-4) | $61 | 4 users | 3 users |
| Mid (M5-8) | $73 | 5 users | 4 users |
| Late (M9-12) | $152 | 9 users | 7 users |

**Including marketing spend:**

| Scenario | Total Costs/Mo (incl. marketing) | Break-Even Users |
|----------|----------------------------------|------------------|
| Pessimistic ($61 + $75 mkt) | $136 | 8 Individual users |
| Realistic ($73 + $200 mkt) | $273 | 16 Individual users |
| Optimistic ($96 + $400 mkt) | $496 | 29 Individual users |

**Key insight**: The break-even point is remarkably low because of minimal infrastructure costs and high gross margins. This is the advantage of a software wrapper with near-zero marginal costs. Even in the pessimistic scenario, the business becomes cash-flow positive from Month 2 (workshop month) and stays positive on a cumulative basis.

### 2.4 Break-Even Timeline

| Scenario | Month First Cash-Positive | Month Sustainably Positive | Month to Recover All Losses |
|----------|--------------------------|---------------------------|----------------------------|
| Pessimistic | Month 2 (workshop) | Month 10 | Month 2 |
| Realistic | Month 2 (workshop) | Month 2 | Month 1-2 |
| Optimistic | Month 2 (workshop) | Month 2 | Month 1-2 |

### 2.5 Sensitivity Analysis

**What if churn is 2x expected?**

| Scenario | Base Churn | 2x Churn | M12 Paid Users (Base) | M12 Paid Users (2x Churn) | M12 MRR Impact |
|----------|-----------|----------|----------------------|--------------------------|----------------|
| Pessimistic | 8% | 16% | 28 | 14 | -$266/mo (-50%) |
| Realistic | 6% | 12% | 127 | 68 | -$1,121/mo (-40%) |
| Optimistic | 4% | 8% | 469 | 271 | -$3,762/mo (-33%) |

**What if conversion is 0.5x expected?**

| Scenario | Base Conv. | 0.5x Conv. | M12 Paid Users (Base) | M12 Paid Users (0.5x) | M12 MRR Impact |
|----------|-----------|------------|----------------------|----------------------|----------------|
| Pessimistic | 2% | 1% | 28 | 14 | -$266/mo (-50%) |
| Realistic | 3.5% | 1.75% | 127 | 64 | -$1,197/mo (-43%) |
| Optimistic | 5% | 2.5% | 469 | 235 | -$4,453/mo (-39%) |

**Combined worst case (2x churn AND 0.5x conversion):**
In the realistic scenario, Month 12 paid users would be approximately 34 (down from 127), MRR would be approximately $700 (down from $2,813), and Year 1 total revenue would be approximately $16,000 (down from $40,000). The business would still be profitable due to workshop revenue, but SaaS growth would be concerning.

**Action triggers:**
- If Month 3 conversion < 1.5%: Redesign onboarding, consider lower price tier
- If Month 3 churn > 10%: Conduct exit interviews, add engagement features
- If both: Fundamental product-market fit question — pivot workshop model to primary revenue

---

## 3. Cash Flow Management

### 3.1 Business Bank Account

**Set up immediately (before Month 1):**

1. **Open a business checking account.** Recommended: Mercury (free, built for startups, integrates with Stripe) or Relay (free, supports multiple accounts for categorization). Avoid traditional banks with monthly fees.
2. **Separate all business transactions.** Every business expense (infra, tools, domains) goes through this account. Every revenue dollar deposits here. This is non-negotiable for tax purposes and financial clarity.
3. **Get a business debit card** from the same provider. Use it exclusively for business expenses.
4. **Set up a second savings sub-account** labeled "Tax Reserve" and automatically move 25-30% of net revenue into it monthly.

### 3.2 Cash Reserve Recommendation

| Phase | Recommended Reserve | Dollar Amount | Rationale |
|-------|---------------------|---------------|-----------|
| Pre-launch | 3 months of costs | $500-$750 | Covers infra + tools if revenue is zero |
| Month 1-3 | 2 months of total costs | $400-$600 | Workshop revenue provides buffer |
| Month 4-6 | 1 month of total costs | $300-$500 | Revenue should cover costs by now |
| Month 7-12 | 2 months of total costs + tax reserve | $800-$2,000 | Increasing costs + quarterly tax |

**Rule of thumb**: Never let the business account drop below $500 in Year 1. If it does, reduce marketing spend before reducing infrastructure.

### 3.3 Stripe Payout Timing

- **Default Stripe payout**: Rolling 2-business-day schedule to your bank account
- **Recommendation**: Switch to **weekly payouts on Friday**. This simplifies bookkeeping and smooths cash flow.
- **Subscription billing**: Stripe charges customers on their anniversary date, not all on the 1st. Revenue flows in throughout the month.
- **Workshop payments**: Collect via Stripe at time of purchase (not at event time). This means you get cash weeks before delivering the workshop — excellent for cash flow.
- **Annual subscriptions**: These create a large upfront cash inflow. **Do not count the full amount as "revenue" in the month received.** Mentally (and for tax purposes) spread it over 12 months. But for cash flow, this is a powerful accelerator.
- **Credit pack purchases**: Immediate cash inflow, deferred cost (LLM usage happens later). This is net positive for cash flow timing.
- **Refund policy**: Set a clear 14-day refund policy for subscriptions. Budget for 2-5% refund rate in early months. Stripe refunds take 5-10 business days. Stripe does NOT refund its processing fee on refunds — budget $0.30-$0.85 lost per refund.

### 3.4 Tax Considerations

**Quarterly estimated taxes (critical):**
- As a sole proprietor or single-member LLC, business profit is taxed as personal income.
- **Federal**: ~22-32% marginal rate depending on total income. Self-employment tax adds 15.3% on net earnings up to the Social Security cap.
- **State**: Varies (0-13%). Factor your state.
- **Total effective rate on business profit**: Plan for **30% combined** as a safe estimate.
- **Quarterly payment schedule**: April 15, June 15, September 15, January 15 (for prior year Q4).
- **Action**: Set up IRS EFTPS account (Electronic Federal Tax Payment System) now. Make quarterly payments based on 30% of cumulative net profit.

**LLC vs S-Corp timing:**
- **Now (Month 1-6)**: Operate as sole proprietor or single-member LLC. Formation cost: $50-$500 depending on state. Recommended to form LLC for liability protection.
- **At $50K-$75K/year net profit**: Evaluate S-Corp election. An S-Corp allows you to pay yourself a "reasonable salary" and take remaining profit as distributions, avoiding self-employment tax on the distribution portion. Savings are meaningful once profit exceeds ~$40K/year.
- **S-Corp conversion cost**: ~$500-$2,000 (accountant + filing). Payroll service: ~$50-$100/mo (Gusto, Rippling).
- **Recommendation**: Do NOT elect S-Corp until consistent monthly profit exceeds $4,000/mo for 3+ months. Too early and the payroll overhead exceeds the tax savings.

**Deductible business expenses (track these):**
- All infrastructure costs (DigitalOcean, domains, etc.)
- Software subscriptions (Clerk, tools, etc.)
- Marketing spend
- Home office deduction (simplified: $5/sq ft up to 300 sq ft = $1,500/yr)
- Computer/equipment (Section 179 deduction)
- Workshop-related travel (if applicable)
- Professional development (courses, books on AI/SaaS)
- Health insurance premiums (self-employed health insurance deduction)

### 3.5 Annual vs Monthly Subscription Cash Flow Impact

| Metric | Monthly Only | 30% Annual Mix | 50% Annual Mix |
|--------|-------------|----------------|----------------|
| M1 cash from 10 new users | $190 | $190 + $570 = $760 | $190 + $950 = $1,140 |
| Average monthly cash from those users | $190 | $190 | $190 |
| Cash flow advantage in M1 | Baseline | +$570 | +$950 |
| Risk: annual refunds/churn | None | 30% of annual prepayment | 50% of annual prepayment |

**Recommendation**: Aggressively promote annual plans once you have evidence of low churn (Month 4+). The cash flow benefit compounds significantly. Offer 2-month-free discount ($190/yr vs $228/yr). Consider a "founding member" annual deal in Month 1-2 at $149/yr to build committed base.

### 3.6 When to Reinvest vs Take Profit

| Cumulative Net Profit | Action |
|----------------------|--------|
| $0-$2,000 | 100% reinvest (build tax reserve + cash cushion) |
| $2,000-$5,000 | 80% reinvest, 20% founder draw |
| $5,000-$15,000 | 60% reinvest, 40% founder draw |
| $15,000-$50,000 | 50% reinvest, 50% founder draw |
| $50,000+ | 40% reinvest, 30% founder draw, 30% tax reserve |

**Reinvestment priorities** (in order): Infrastructure scaling, marketing experiments, contractor help, tools/automation.

**Founder draw**: Pay yourself consistently, even if modestly. This maintains motivation and establishes the business as a real income source. Even $500/mo starting at $5K cumulative profit is psychologically important.

---

## 4. Spending Priorities (Ranked)

### Tier 1 — Essential, Spend Now ($60-$100/mo)

| Item | Monthly Cost | Purpose | Specific Recommendation |
|------|-------------|---------|------------------------|
| DigitalOcean droplet | $48-$96 | Production hosting | Current setup; upgrade to 8GB when >200 concurrent users |
| Domain + DNS | ~$1.25 | Brand presence | Already have teachcharlie.ai |
| Stripe | Variable (2.9%+$0.30) | Payment processing | Already integrated |
| Zoom Pro | $13.33/mo | Workshops | Essential if running live workshops |
| Google Workspace or equivalent | $6/mo | Professional email @teachcharlie.ai | Builds credibility for workshops and sales |
| **Tier 1 Total** | **~$70-$120/mo** | | |

### Tier 2 — Invest When Validated (~Month 2-4, $100-$250/mo additional)

*"Validated" means: 10+ paid users AND positive workshop feedback AND clear growth trend.*

| Item | Monthly Cost | Purpose | Specific Recommendation |
|------|-------------|---------|------------------------|
| Email marketing | $0-$20 | Nurture workshop attendees, free users | Resend ($0 to 3K contacts), then Loops.so ($49/mo) or ConvertKit ($29/mo) |
| Community platform | $0-$25 | User engagement, reduce churn | Discord (free) or Circle ($39/mo at scale) |
| Analytics | $0-$20 | Track conversion funnel | PostHog (free self-hosted or $0 cloud to 1M events), Mixpanel ($0 to 10K MTU) |
| Social scheduling | $0-$18 | Content marketing | Buffer ($6/mo) or Typefully ($12/mo for Twitter/X) |
| Loom/Screen recording | $0-$12.50 | Tutorial content, async workshop content | Loom free tier (25 videos) then $12.50/mo |
| **Tier 2 Total** | **~$6-$95/mo** | | |

### Tier 3 — Invest at $3K-$5K MRR (~Month 6-9, $300-$800/mo additional)

*"$5K MRR" includes subscription + credit revenue, not workshops.*

| Item | Monthly Cost | Purpose | Specific Recommendation |
|------|-------------|---------|------------------------|
| Paid advertising | $200-$500 | Scale user acquisition | Start with $100/mo LinkedIn ads targeting educators. Test Google Ads on "AI agent builder" keywords ($2-5/click). Facebook/Instagram for workshop promotion. |
| Contractor (part-time) | $500-$1,500 | Content writing, customer support, video editing | Upwork/Fiverr for specific deliverables. ~$25-$50/hr for quality content writers. |
| Premium analytics | $0-$50 | Deeper funnel analysis | PostHog paid, or Amplitude startup plan |
| Customer support tool | $0-$25 | Ticket management | Crisp (free to 2 operators) then Intercom starter ($74/mo) |
| Course platform | $0-$39 | Productize workshops | Teachable ($39/mo) or Gumroad ($0 + 10% fee) |
| **Tier 3 Total** | **~$700-$2,100/mo** | | |

### Tier 4 — Invest at $15K+ MRR (~Month 10-14)

| Item | Monthly Cost | Purpose | Specific Recommendation |
|------|-------------|---------|------------------------|
| First employee/contractor (full-time) | $3,000-$6,000 | Customer success + community management | Hire for non-technical work first; founder stays on product |
| Infrastructure upgrade | $200-$500 | Dedicated DB, CDN, multi-region | Move to managed Kubernetes or Railway/Render |
| Premium tools stack | $200-$400 | CRM, advanced email, helpdesk | HubSpot CRM (free), Intercom ($74+), better monitoring |
| Legal | $500-$1,000 (one-time) | Terms of service, privacy policy, contracts | Use Clerky or hire SaaS-focused attorney |
| Accounting | $200-$400 | Bookkeeping, tax prep | Bench ($299/mo) or Pilot ($400/mo). Alternatively, local CPA at $200-$300/mo |
| **Tier 4 Total** | **~$4,100-$8,300/mo** | | |

### What to NEVER Spend On At This Stage

| Item | Why Not | When It Becomes Relevant |
|------|---------|------------------------|
| Conferences/events (as attendee) | $500-$2,000+ for questionable ROI. You are the draw, not the attendee | >$25K MRR when brand awareness matters |
| Swag/merchandise | Vanity spend. Zero acquisition impact | >$50K MRR for customer retention |
| PR agency | $5K-$15K/mo. Overkill for pre-PMF stage | >$50K MRR or fundraise |
| Fancy office/coworking | $200-$500/mo. Work from home | When you hire employees |
| Premium design tools (Figma paid) | Free tier is sufficient for one person | When you hire a designer |
| Multiple SaaS tools that overlap | Tool sprawl kills focus | Never — always consolidate |
| Expensive CRM (Salesforce) | Massive overkill. Spreadsheet or free HubSpot | >$100K MRR |
| Custom branded hardware | Zero ROI at any early stage | Probably never for this business |
| Sponsorships | Low conversion, high cost | >$25K MRR, and only relevant newsletters |
| Early hiring for "future needs" | Cash drain with no immediate payoff | Only hire for proven bottlenecks |

---

## 5. Funding Decision Framework

### 5.1 The Default Position: DO NOT RAISE

**For Teach Charlie AI, bootstrapping is almost certainly the correct path.** Here is why:

1. **Unit economics are already favorable.** Gross margins above 90%, break-even at fewer than 10 users, infrastructure costs under $200/month. There is no capital-intensive problem to solve.

2. **The founder's competitive advantage is domain expertise and community, not speed.** Raising money to "go faster" means hiring people to build a product that the founder understands better than anyone. The workshop-to-SaaS flywheel requires the founder's personal touch.

3. **The market is large but not winner-take-all.** AI education is not a market where the first to $10M in funding wins everything. It is a market where authentic expertise and community trust win. Funding does not buy trust.

4. **Dilution at this stage would be catastrophic.** A pre-revenue/early-revenue SaaS would raise at a $500K-$2M valuation. Giving up 10-20% equity for $50K-$200K in capital that is not needed is value destruction.

5. **Revenue covers costs from Month 1-2.** The founder does not need outside money to survive. Workshop revenue alone can fund business operations.

### 5.2 Exception Scenarios — When to Consider Funding

| Trigger | Funding Type | Amount | Use of Funds |
|---------|-------------|--------|--------------|
| Workshop demand exceeds founder capacity AND you have proven conversion to SaaS | Revenue-based financing or angel | $25K-$50K | Hire workshop instructor + content creator |
| Corporate customer wants enterprise features you cannot build alone (SSO, audit logs, etc.) | Angel or customer prepayment | $50K-$100K | Hire contractor to build enterprise features |
| Clear product-market fit (>$15K MRR, <5% churn, 6+ months of data) AND desire to grow 10x faster | Accelerator or seed round | $100K-$500K | Team of 3-4, marketing, infrastructure |
| Competitive threat from well-funded player entering your exact niche | Angel/seed (defensive) | $100K-$250K | Speed up product development, lock in community |

### 5.3 Funding Type Comparison

| Type | Pros | Cons | Best When |
|------|------|------|-----------|
| **Bootstrap** (current) | Full ownership, full control, forces discipline | Slower growth, founder does everything | Unit economics work, market is not winner-take-all |
| **Revenue-based financing** (Pipe, Clearco, Capchase) | No equity dilution, fast, data-driven | Requires 6+ months of revenue data, takes % of revenue, rates can be high (10-20% annual) | $5K+ MRR for 6+ months, need capital for specific growth investment |
| **Angel investors** | Small check ($10K-$50K), often add expertise/network, flexible terms | Dilution, managing investor relationships, pressure to grow | Need expertise more than capital, specific strategic angel in EdTech/AI |
| **Accelerator** (YC, Techstars) | $125K-$500K, network, credibility, mentorship | 7% equity (YC), 3-month intensive commitment, pressure to become VC-scale | Want to build a $100M+ company, not a lifestyle business |
| **Seed VC** | $500K-$2M, full support for scaling | 15-25% dilution, board seats, pressure for 10x growth, misalignment with lifestyle business | Only if the vision is a $100M+ company AND you want that life |

### 5.4 Specific Programs to Consider (IF you decide to raise)

**AI-specific accelerators:**
- **Y Combinator** — $500K for 7% equity. Apply if you have $10K+ MRR and want to build a venture-scale company. Application at ycombinator.com, batches in winter and summer.
- **Techstars** — $120K for ~6% equity. Various programs including AI-focused. More mentorship-heavy.
- **AI Grant** — Non-dilutive grants of $5K-$250K for AI projects. Worth applying with zero downside.
- **Mozilla Builders** — Grants for ethical AI projects. Educational angle fits well.

**Revenue-based financing (when ready):**
- **Pipe** — Turns recurring revenue into upfront capital. Requires 6+ months of MRR data. Typical advance: 5-10x monthly revenue.
- **Clearco** — Similar to Pipe, focuses on marketing spend financing.
- **Capchase** — Specifically for SaaS companies. Minimum $100K ARR typically required.

### 5.5 What Funding Should NOT Be Used For

- Founder salary (this should come from revenue)
- Premium office space
- Large marketing campaigns without proven CAC
- Building features that are not validated by customer demand
- Hiring people to do work the founder has not yet done manually
- Any expense that does not directly drive revenue or reduce churn

---

## 6. Unit Economics

### 6.1 Customer Acquisition Cost (CAC) by Channel

| Channel | Est. Cost to Acquire 1 Paid Customer | Assumptions | Confidence |
|---------|---------------------------------------|-------------|------------|
| **Free workshops** | $15-$30 | 20 attendees, 2-3 convert to free, 1 becomes paid. Cost = Zoom ($13) + 2 hrs founder time (valued at $0 cash cost) | Medium |
| **Paid workshops** | $0 (negative CAC) | Workshop itself is profitable. Conversions to SaaS are gravy. | High |
| **Organic content** (blog, Twitter, LinkedIn) | $5-$15 | 4 hrs/week of content creation, generates 20-40 signups/mo, 3.5% convert. Cash cost ~$0, but time cost is real. | Low-Medium |
| **Referral/word-of-mouth** | $0-$5 | If implementing referral program: 1 month free for referrer = $19 cost, but referred user LTV > $19. Net positive. | Medium |
| **Paid ads (LinkedIn)** | $80-$200 | $3-$8 CPC, 2% landing page conversion, 3.5% free-to-paid. Funnel: 1000 clicks ($5K) → 20 signups → 0.7 paid = ~$7,000/customer. NOT recommended early. | High (that it will be expensive) |
| **Paid ads (Google)** | $50-$150 | "AI agent builder" keywords $2-$5 CPC, higher intent. 5% landing page conversion, 5% free-to-paid. 1000 clicks ($3.5K) → 50 signups → 2.5 paid = ~$1,400/customer. Still expensive but more viable. | Medium |
| **Community partnerships** | $10-$30 | Co-host workshop with coding bootcamp or AI community. Split attendees, your conversion rate. Cost = time + revenue share. | Medium |

**Blended CAC target**: $15-$40 in Year 1, driven primarily by workshops and organic content. Paid acquisition should be under 20% of total acquisition budget until you have proven CAC < $50 on paid channels.

### 6.2 Lifetime Value (LTV) Calculation

**Individual Plan ($19/mo):**

| Metric | Pessimistic | Realistic | Optimistic |
|--------|-------------|-----------|------------|
| Monthly churn | 8% | 6% | 4% |
| Average lifespan (1/churn) | 12.5 months | 16.7 months | 25 months |
| Subscription LTV | $237.50 | $317.30 | $475.00 |
| Credit purchases (lifetime) | $22 x 10% x lifespan = $27.50 | $22 x 20% x lifespan = $73.33 | $22 x 30% x lifespan = $165.00 |
| **Total LTV** | **$265.00** | **$390.63** | **$640.00** |

**Business Plan ($99/mo):**

| Metric | Pessimistic | Realistic | Optimistic |
|--------|-------------|-----------|------------|
| Monthly churn | 5% | 3% | 2% |
| Average lifespan | 20 months | 33.3 months | 50 months |
| Subscription LTV | $1,980 | $3,297 | $4,950 |
| Credit purchases (lifetime) | $50 x 20% x lifespan = $200 | $50 x 30% x lifespan = $500 | $50 x 40% x lifespan = $1,000 |
| **Total LTV** | **$2,180** | **$3,797** | **$5,950** |

### 6.3 LTV:CAC Ratios

| Channel | CAC | Individual LTV (Realistic) | Ratio | Verdict |
|---------|-----|---------------------------|-------|---------|
| Paid workshops | -$99 to $0 | $390.63 | Infinite | Exceptional; primary channel |
| Free workshops | $15-$30 | $390.63 | 13:1 to 26:1 | Excellent |
| Organic content | $5-$15 | $390.63 | 26:1 to 78:1 | Excellent |
| Referral | $0-$5 | $390.63 | 78:1+ | Excellent |
| Community partnerships | $10-$30 | $390.63 | 13:1 to 39:1 | Excellent |
| Google Ads | $50-$150 | $390.63 | 2.6:1 to 7.8:1 | Borderline to acceptable |
| LinkedIn Ads | $80-$200 | $390.63 | 2.0:1 to 4.9:1 | Below target; avoid until optimized |

**Target**: Maintain blended LTV:CAC > 5:1. At this ratio, growth is capital-efficient and does not require outside funding.

### 6.4 Payback Period by Channel

| Channel | CAC | Monthly Contribution Margin | Payback Period | Cash Flow Friendly? |
|---------|-----|-----------------------------|----------------|---------------------|
| Paid workshops | $0 | $17.65 | 0 months (instant) | Yes — workshops generate cash before conversion |
| Free workshops | $22 | $17.65 | 1.2 months | Yes |
| Organic content | $10 | $17.65 | 0.6 months | Yes |
| Referral | $2.50 | $17.65 | 0.1 months | Yes |
| Google Ads | $100 | $17.65 | 5.7 months | Acceptable |
| LinkedIn Ads | $140 | $17.65 | 7.9 months | Risky — churn may negate |

**Target payback period**: Under 3 months. Any channel above 6 months is a cash flow risk for a bootstrapped business.

### 6.5 Gross Margin Analysis

**Subscription Revenue Gross Margin:**

| Revenue Component | Revenue | COGS | Gross Profit | Gross Margin |
|-------------------|---------|------|--------------|--------------|
| Individual sub ($19/mo) | $19.00 | Stripe $0.85 + LLM $0.50 + Infra $0.05 = $1.40 | $17.60 | 92.6% |
| Business sub ($99/mo) | $99.00 | Stripe $3.17 + LLM $2.00 + Infra $0.10 = $5.27 | $93.73 | 94.7% |
| Annual Individual ($190/yr) | $15.83/mo | Stripe $0.76 + LLM $0.50 + Infra $0.05 = $1.31 | $14.52 | 91.7% |

**Credit Pack Gross Margin:**

| Pack | Revenue | LLM API Cost (60%) | Stripe Fee | Gross Profit | Gross Margin |
|------|---------|---------------------|------------|--------------|--------------|
| $10 | $10.00 | $6.00 | $0.59 | $3.41 | 34.1% |
| $25 | $25.00 | $15.00 | $1.03 | $8.97 | 35.9% |
| $50 | $50.00 | $30.00 | $1.75 | $18.25 | 36.5% |

**Workshop Gross Margin:**

| Workshop Type | Revenue (12 attendees) | COGS | Gross Profit | Gross Margin |
|---------------|----------------------|------|--------------|--------------|
| Free intro | $0 | $13 (Zoom) | -$13 | N/A (marketing cost) |
| $49 basics | $588 | $50 | $538 | 91.5% |
| $99 intermediate | $1,188 | $50 | $1,138 | 95.8% |
| $199 advanced | $2,388 | $75 | $2,313 | 96.9% |

**Blended Gross Margin Target (Year 1):**

| Revenue Mix | Weight | Margin | Contribution |
|-------------|--------|--------|--------------|
| Subscriptions | 50% | 93% | 46.5% |
| Credit packs | 15% | 35% | 5.3% |
| Workshops | 35% | 94% | 32.9% |
| **Blended** | **100%** | | **84.7%** |

**An 85% blended gross margin is excellent** for a bootstrapped SaaS and puts the business in the top quartile of software companies. The primary drag is credit packs at 35% margin. Consider raising the LLM markup to 50% (currently modeled at 40%) — most users will not comparison-shop API pricing.

---

## Summary: The Financial Dashboard

Track these 10 numbers weekly/monthly. They are the vital signs of the business:

| # | Metric | Target by M6 | Target by M12 | Measurement Frequency |
|---|--------|-------------|---------------|----------------------|
| 1 | Monthly Recurring Revenue (MRR) | $500+ | $2,500+ | Weekly |
| 2 | Paid subscriber count | 25+ | 100+ | Weekly |
| 3 | Free-to-paid conversion rate | >3% | >4% | Monthly |
| 4 | Monthly logo churn | <7% | <5% | Monthly |
| 5 | Blended CAC | <$30 | <$40 | Monthly |
| 6 | LTV:CAC ratio | >5:1 | >8:1 | Quarterly |
| 7 | Cash in business account | >$1,000 | >$5,000 | Weekly |
| 8 | Workshop revenue/month | >$1,000 | >$2,000 | Monthly |
| 9 | Blended gross margin | >80% | >85% | Monthly |
| 10 | Net burn rate | <$200/mo | $0 (profitable) | Monthly |

### The Three Scenarios, Year 1 at a Glance

| Metric | Pessimistic | Realistic | Optimistic |
|--------|-------------|-----------|------------|
| Year 1 total revenue | $6,882 | $40,112 | $112,878 |
| Year 1 total costs | $2,656 | $6,515 | $11,510 |
| Year 1 net profit | $4,226 | $33,597 | $101,368 |
| Month 12 MRR | $693 | $2,813 | $11,321 |
| Month 12 total monthly rev | $1,325 | $5,748 | $19,573 |
| Paid users at M12 | 28 | 127 | 469 |
| Break-even month | Month 2 | Month 2 | Month 2 |
| Funding needed? | No | No | No |

**The bottom line**: All three scenarios are cash-flow positive from Month 2 thanks to workshop revenue. Even the pessimistic scenario generates over $4,000 in net profit in Year 1. The business does not need outside funding under any modeled scenario. The founder's primary financial risk is not business failure — it is underinvestment in growth due to being too conservative with reinvestment. The workshops-to-SaaS flywheel is the critical engine. Protect workshop quality and frequency above all else.

---

# METRICS & DECISION FRAMEWORK

## Teach Charlie AI — Operational Playbook for Data-Driven Decision Making

---

## 1. THE 6 METRICS THAT ACTUALLY MATTER

After evaluating all candidate metrics against your stage (pre-scale, solo founder, bootstrapped, workshop-driven), these are the six that will drive every decision you make. Each one earns its place because it directly connects to survival, growth, or sustainability.

---

### METRIC 1: Monthly Recurring Revenue (MRR)

**Why this matters.** MRR is the single number that tells you whether you have a business or a hobby. Everything else is commentary.

**Exact definition:**
- MRR = (Number of Individual subscribers x $19) + (Sum of all Business custom contracts / 12 if annual, or monthly amount if monthly) + (Recurring workshop subscriptions if any)
- Credit pack purchases are NOT MRR. They are one-time revenue. Track them separately as "Non-Recurring Revenue."
- Count MRR on the last day of each month. A subscriber who signs up on the 28th counts for that month.

**MRR sub-components to track:**
- New MRR: revenue from first-time subscribers this month
- Expansion MRR: upgrades from Free to Individual, or Individual to Business
- Contraction MRR: downgrades
- Churned MRR: revenue lost from cancellations
- Net New MRR = New + Expansion - Contraction - Churned

**Targets:**

| Timeframe | Target | Red (Danger) | Yellow (Watch) | Green (Healthy) |
|-----------|--------|-------------|----------------|-----------------|
| Month 1 | $100 | $0 | $19-$95 | $100+ |
| Month 3 | $500 | <$200 | $200-$475 | $500+ |
| Month 6 | $2,000 | <$800 | $800-$1,900 | $2,000+ |
| Month 12 | $8,000 | <$3,000 | $3,000-$7,500 | $8,000+ |

**How to measure it:** Stripe Dashboard > Overview. Filter by recurring. For precise sub-component tracking, use Stripe's built-in MRR chart under Billing > Overview. Export monthly to your tracking spreadsheet.

**Stripe query shortcut:** In Stripe Dashboard, go to Billing > Subscriptions > Export. Filter by status = active. Sum the `plan.amount` column.

**If RED — Action plan:**
1. Immediately survey your last 10 signups: "What would make you upgrade to paid?" (use a 2-question Typeform)
2. Review your Free tier limits — if people can do everything they need for free, the free tier is too generous
3. Test a limited-time offer: first month at $9 instead of $19 for the next 10 signups
4. Double workshop frequency for the next 30 days — workshops are your proven conversion channel

---

### METRIC 2: Activation Rate

**Why this matters.** A user who never experiences the "aha moment" will never pay you. Activation rate measures the percentage of signups who actually get value from Teach Charlie. This is the metric most early-stage founders neglect, and it costs them everything.

**Exact definition — The Activation Event:**
After analyzing your product, the activation event is: **User creates an agent AND sends at least 3 chat messages in the Playground within 7 days of signup.**

Why this specific definition:
- Creating an agent alone is not enough (they might abandon it)
- Sending 1 message is not enough (they are just testing)
- 3 messages means they had a real conversation and saw the agent work
- 7-day window because longer than that means they have already mentally churned

**Calculation:** Activation Rate = (Users who hit activation event within 7 days of signup) / (Total signups in that period) x 100

**Targets:**

| Timeframe | Target | Red | Yellow | Green |
|-----------|--------|-----|--------|-------|
| Month 1 | 50% | <30% | 30-49% | 50%+ |
| Month 3 | 60% | <40% | 40-59% | 60%+ |
| Month 6 | 70% | <50% | 50-69% | 70%+ |
| Month 12 | 75% | <55% | 55-74% | 75%+ |

**How to measure it:** Your backend already has the data. Run this query against PostgreSQL monthly:

```sql
-- Activation rate for signups in a given month
WITH signups AS (
  SELECT id, created_at
  FROM users
  WHERE created_at >= '2026-02-01' AND created_at < '2026-03-01'
),
activated AS (
  SELECT DISTINCT s.id
  FROM signups s
  JOIN agents a ON a.user_id = s.id
  JOIN conversations c ON c.agent_id = a.id
  WHERE a.created_at <= s.created_at + INTERVAL '7 days'
  GROUP BY s.id
  HAVING COUNT(c.id) >= 3
)
SELECT
  (SELECT COUNT(*) FROM signups) AS total_signups,
  (SELECT COUNT(*) FROM activated) AS activated_users,
  ROUND((SELECT COUNT(*) FROM activated)::numeric / NULLIF((SELECT COUNT(*) FROM signups), 0) * 100, 1) AS activation_rate;
```

Adapt column and table names to match your actual schema. The key tables are `users`, `agents` (or `agent_components`), and `conversations` or `chat_messages`.

**If RED — Action plan:**
1. Check WHERE users drop off: Do they create an account but never create an agent? (Onboarding friction.) Do they create an agent but never chat? (Playground is confusing or broken.)
2. Add an automated email or in-app prompt 24 hours after signup if no agent created: "Charlie is waiting for his first job! Create your first AI agent in 2 minutes."
3. Simplify the 3-step Q&A wizard — if users are dropping off at step 2, the questions are too hard
4. Add a "Try a Demo Agent" button on the dashboard that pre-loads a working agent so users see value immediately before building their own

---

### METRIC 3: Workshop-to-Paid Conversion Rate

**Why this matters.** Workshops are your primary growth channel. If workshops do not convert attendees to paid users, your entire go-to-market strategy fails. This is the metric that tells you whether your workshop strategy is a business or just education.

**Exact definition:**
- Workshop-to-Paid = (Workshop attendees who become paid subscribers within 30 days of attending) / (Total workshop attendees) x 100
- "Attendees" means people who actually showed up, not registrants
- "Paid" means they start a paid Stripe subscription (Individual or Business), OR purchase a credit pack of $25+

**Targets:**

| Timeframe | Target | Red | Yellow | Green |
|-----------|--------|-----|--------|-------|
| Month 1 | 10% | <5% | 5-9% | 10%+ |
| Month 3 | 15% | <8% | 8-14% | 15%+ |
| Month 6 | 20% | <10% | 10-19% | 20%+ |
| Month 12 | 25% | <12% | 12-24% | 25%+ |

**How to measure it:** Manual tracking in a Google Sheet. For each workshop:

| Column | Data |
|--------|------|
| Workshop date | 2026-02-20 |
| Workshop name | "Build Your First AI Agent" |
| Workshop price | $49 |
| Registrants | 25 |
| Attendees (showed up) | 18 |
| Show-up rate | 72% |
| Signed up for TC within 7 days | 12 |
| Became paid within 30 days | 3 |
| Workshop-to-signup rate | 67% |
| Workshop-to-paid rate | 17% |
| Revenue from this cohort (Month 1) | $57 |

Tag each user in your system with their acquisition source. Add a `source` or `acquisition_channel` field to your users table if it does not exist, and populate it during signup with a UTM parameter from your workshop registration link (e.g., `?utm_source=workshop&utm_campaign=feb2026`).

**If RED — Action plan:**
1. Survey workshop attendees who did NOT sign up: "What held you back?" (Send within 48 hours)
2. Add a live demo of Teach Charlie during the workshop — do not just teach concepts, show the product
3. Offer workshop-exclusive pricing: "Sign up in the next 48 hours for 50% off your first month"
4. Test different workshop formats: shorter (60 min vs 120 min), different topics, different audiences
5. If show-up rate is also low (<50%), the problem is pre-workshop — improve reminder emails

---

### METRIC 4: Monthly Logo Churn Rate

**Why this matters.** Acquiring a new customer costs 5-7x more than retaining an existing one. For a solo bootstrapped founder, every churned user represents wasted effort you cannot afford. Logo churn (counting customers, not dollars) matters more than revenue churn at your stage because you do not have enough customers for revenue churn to be statistically meaningful.

**Exact definition:**
- Logo Churn Rate = (Paid subscribers who cancelled this month) / (Total paid subscribers at the start of this month) x 100
- A "cancellation" means their Stripe subscription status changed to `canceled` or `past_due` for 7+ days
- Do NOT count Free tier users churning — only paid subscribers
- Do NOT count downgrades from Business to Individual as churn (that is contraction, tracked in MRR)

**Targets:**

| Timeframe | Target | Red | Yellow | Green |
|-----------|--------|-----|--------|-------|
| Month 1-3 | <15% | >20% | 15-20% | <15% |
| Month 4-6 | <10% | >15% | 10-15% | <10% |
| Month 7-9 | <8% | >12% | 8-12% | <8% |
| Month 10-12 | <6% | >10% | 6-10% | <6% |

Note: Early-stage churn will be naturally high because your first users are experimenters. The targets above account for this. Industry benchmark for SMB SaaS is 3-7% monthly; you are targeting higher because your user base is small and experimental.

**How to measure it:** Stripe Dashboard > Billing > Subscriptions > Filter by "Canceled" in date range. Or:

```sql
-- Monthly churn calculation
WITH month_start AS (
  SELECT COUNT(*) AS starting_subscribers
  FROM subscriptions
  WHERE status = 'active'
  AND created_at < '2026-03-01'
),
churned AS (
  SELECT COUNT(*) AS churned_subscribers
  FROM subscriptions
  WHERE status IN ('canceled', 'past_due')
  AND canceled_at >= '2026-03-01' AND canceled_at < '2026-04-01'
)
SELECT
  ms.starting_subscribers,
  c.churned_subscribers,
  ROUND(c.churned_subscribers::numeric / NULLIF(ms.starting_subscribers, 0) * 100, 1) AS churn_rate
FROM month_start ms, churned c;
```

**If RED — Action plan:**
1. Email every churned user within 24 hours: "We noticed you cancelled. Can I ask what went wrong? I am the founder and I read every reply." (Personal, not automated-feeling)
2. Categorize churn reasons: (a) price too high, (b) not enough value, (c) found alternative, (d) no longer need it, (e) technical issues
3. If >40% say "price": test a $9/mo tier or extend free trial
4. If >40% say "not enough value": your activation flow is broken — go back to Metric 2
5. If >40% say "technical issues": fix bugs immediately, this is an emergency
6. Implement a cancellation flow that offers alternatives: pause subscription, downgrade, or extended trial

---

### METRIC 5: Time to Value (TTV)

**Why this matters.** TTV measures how long it takes from signup to the activation event. Shorter TTV = higher activation rate = higher conversion = lower churn. This is the metric you can most directly improve through product changes, and it has a multiplier effect on every other metric.

**Exact definition:**
- TTV = Median time (in minutes) from account creation to sending the 3rd chat message to any agent
- Use median, not mean, because outliers (people who sign up and come back 2 weeks later) will skew the average
- Measure in minutes for the first session, hours for the first week

**Targets:**

| Timeframe | Target (Median) | Red | Yellow | Green |
|-----------|-----------------|-----|--------|-------|
| Month 1 | <30 min | >60 min | 30-60 min | <30 min |
| Month 3 | <20 min | >45 min | 20-45 min | <20 min |
| Month 6 | <15 min | >30 min | 15-30 min | <15 min |
| Month 12 | <10 min | >20 min | 10-20 min | <10 min |

**How to measure it:**

```sql
-- Time to Value: median minutes from signup to 3rd chat message
WITH user_ttv AS (
  SELECT
    u.id,
    u.created_at AS signup_time,
    (
      SELECT cm.created_at
      FROM chat_messages cm
      JOIN conversations c ON c.id = cm.conversation_id
      JOIN agents a ON a.id = c.agent_id
      WHERE a.user_id = u.id
      AND cm.role = 'user'
      ORDER BY cm.created_at
      OFFSET 2 LIMIT 1
    ) AS third_message_time
  FROM users u
  WHERE u.created_at >= '2026-02-01' AND u.created_at < '2026-03-01'
)
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY EXTRACT(EPOCH FROM (third_message_time - signup_time)) / 60
  ) AS median_ttv_minutes
FROM user_ttv
WHERE third_message_time IS NOT NULL;
```

Adapt to your actual schema. The critical join path is users -> agents -> conversations -> chat_messages.

**If RED — Action plan:**
1. Map the exact user journey from signup to value: Clerk auth -> Dashboard -> Create Agent -> Q&A Wizard -> Playground -> Chat. Time each step.
2. Identify the biggest time sink. Common culprits: (a) Confusing dashboard with no clear CTA, (b) Q&A wizard questions too open-ended, (c) Agent takes too long to build/deploy, (d) Playground does not auto-open after agent creation
3. Add a "Quick Start" path: one-click template agent that is pre-configured and ready to chat
4. Auto-redirect to Playground immediately after agent creation — do not send them back to the dashboard
5. Reduce Q&A wizard to essentials only — every additional question adds ~2 minutes to TTV

---

### METRIC 6: Net Promoter Score (NPS)

**Why this matters.** NPS measures whether your users would recommend Teach Charlie to others. For a workshop-driven business, word-of-mouth is your most scalable and cheapest growth channel. NPS predicts organic growth velocity.

**Exact definition:**
- Single question: "On a scale of 0-10, how likely are you to recommend Teach Charlie to a colleague?"
- Promoters: 9-10. Passives: 7-8. Detractors: 0-6.
- NPS = % Promoters - % Detractors (range: -100 to +100)
- Ask at two trigger points: (a) 14 days after signup, (b) after every workshop

**Targets:**

| Timeframe | Target | Red | Yellow | Green |
|-----------|--------|-----|--------|-------|
| Month 1-3 | +20 | <0 | 0-19 | +20 or higher |
| Month 4-6 | +30 | <+10 | +10-29 | +30 or higher |
| Month 7-12 | +40 | <+20 | +20-39 | +40 or higher |

For context: Average B2B SaaS NPS is +30. Best-in-class is +50-70.

**How to measure it:**
- Use a free tool: Tally.so (free tier, unlimited forms) or a single-question in-app modal
- Send via email 14 days after signup using your existing email system
- After workshops, include it on the last slide or in the follow-up email
- Track in a Google Sheet with columns: Date, User Email, Score, Verbatim Comment, Source (in-app / post-workshop)
- Calculate NPS monthly with at least 20 responses for statistical relevance

**If RED — Action plan:**
1. Read every single verbatim comment. With <100 users, you can and should read them all.
2. Personally email every Detractor (0-6): "I saw your feedback. I'd love 5 minutes to understand what went wrong. Can I send you a Calendly link?"
3. Personally email every Promoter (9-10): "Thank you! Would you be willing to leave a short testimonial or refer a friend? I will give you a free month."
4. Categorize detractor themes: product quality, pricing, support, missing features, confusing UX
5. Fix the top theme. Do not spread effort across all themes. Fix one thing completely.

---

### METRICS EXPLICITLY EXCLUDED (And Why)

**DAU/WAU/MAU — EXCLUDED.** At your scale (100-500 users year 1), daily active user counts will be so small that random variation makes them meaningless. Seeing 3 DAU one day and 7 the next tells you nothing. WAU and MAU become useful at 1,000+ users. Until then, they are noise that will cause anxiety without informing action.

**Credit Purchase Rate — EXCLUDED as a primary metric.** Credit packs are supplementary revenue. Tracking them as a primary metric will tempt you to optimize for credit sales instead of subscription growth. Track credit revenue as a line item in your monthly revenue spreadsheet, but do not dashboard it. At your scale, credit revenue should be <20% of total revenue.

**Support Ticket Volume — EXCLUDED.** With <500 users, you will not have enough tickets to detect patterns statistically. Instead, keep a simple log of every support interaction and review it qualitatively during your monthly review. When you hit 50+ tickets/month, revisit this.

**Signup-to-Paid Conversion Rate — EXCLUDED as a standalone metric.** This is a composite of Activation Rate and your pricing/packaging. If Activation Rate is healthy and MRR is growing, signup-to-paid conversion is fine by definition. Tracking it separately creates a metric that is hard to act on because the lever is always either activation or pricing, never "conversion" in isolation.

**Social media followers, website traffic, email list size — EXCLUDED.** These are vanity metrics. 10,000 Twitter followers with 0 paying customers is failure. 200 Twitter followers with 50 paying customers is success. Do not let vanity metrics distract you from revenue and activation.

---

## 2. DASHBOARD SETUP — The Solo Founder's Command Center

### Tool Recommendation: Layered Approach (Total cost: $0-$29/month)

Do NOT invest in a single expensive analytics platform. Use free tiers of purpose-built tools in layers:

| Layer | Tool | Cost | What It Tracks |
|-------|------|------|----------------|
| Financial | Stripe Dashboard | Free | MRR, churn, subscriptions, revenue |
| Auth/Users | Clerk Dashboard | Free | Signups, active users, auth events |
| Product Analytics | PostHog (Free tier) | $0 | Activation events, feature usage, funnels |
| Manual Tracking | Google Sheets | $0 | NPS, workshop metrics, cohorts, qualitative data |
| Product Analytics alt | Built-in TC Dashboard | $0 | Conversations, agent usage, daily stats |

**Why PostHog over Mixpanel:** PostHog's free tier gives you 1M events/month (more than enough for 500 users), session replay (see exactly where users get stuck), and feature flags. Mixpanel's free tier is 20M events but lacks session replay. At your stage, seeing what users actually do matters more than counting events.

**PostHog setup for Teach Charlie (30 minutes, one time):**

Add the PostHog JS snippet to your frontend. Track these specific events:

```typescript
// In your frontend, after PostHog initialization
// Track in these locations:

// 1. After Clerk signup completes (in your auth callback)
posthog.capture('user_signed_up', {
  source: new URLSearchParams(window.location.search).get('utm_source') || 'organic'
});

// 2. After agent creation (in CreateAgentPage.tsx, after API success)
posthog.capture('agent_created', {
  agent_type: agentType,
  time_since_signup_minutes: Math.round((Date.now() - user.createdAt) / 60000)
});

// 3. After each chat message sent (in PlaygroundPage.tsx)
posthog.capture('chat_message_sent', {
  message_number: messageCount,
  agent_id: agentId
});

// 4. Activation event (after 3rd message — track this explicitly)
if (messageCount === 3) {
  posthog.capture('user_activated', {
    ttv_minutes: Math.round((Date.now() - user.createdAt) / 60000)
  });
}

// 5. Subscription started (after Stripe checkout success)
posthog.capture('subscription_started', {
  plan: planName,
  price: planPrice
});
```

With these 5 events, you can build every funnel and metric you need in PostHog's free dashboard.

---

### Daily Glance (2 minutes — do this every workday morning)

Open three tabs. Look at three numbers. Close the tabs.

**Tab 1: Stripe Dashboard (30 seconds)**
- Look at: MRR number on the overview page
- Is it higher than yesterday? Good. Move on.
- Did someone cancel? Note it mentally for your weekly review.

**Tab 2: Clerk Dashboard (30 seconds)**
- Look at: New signups in the last 24 hours
- Any new users? Good. If zero for 3+ days in a row, note it for weekly review.

**Tab 3: Your built-in TC Analytics Dashboard (60 seconds)**
- Look at: Total conversations in last 24 hours, active agents
- Are people using the product? Good.
- Zero conversations for 2+ days? Check if the product is broken first (hit `/health`), then worry about engagement.

**What you are NOT doing daily:** Checking NPS, calculating activation rate, analyzing cohorts, reviewing churn. These are weekly/monthly activities. Daily, you are just checking for "Is the house on fire?"

---

### Weekly Review (15 minutes — Every Monday morning)

**Template (copy this into a recurring calendar event note):**

```
TEACH CHARLIE WEEKLY REVIEW — Week of [DATE]

=== 2-MINUTE PULSE CHECK ===
□ MRR this week: $_____ (last week: $_____)
□ New signups this week: _____ (last week: _____)
□ New paid subscribers: _____ (last week: _____)
□ Cancellations: _____ (last week: _____)
□ Active conversations (7-day): _____

=== 5-MINUTE QUALITATIVE CHECK ===
□ Any support messages received? Y/N
  If yes, theme: _________________________
□ Any NPS responses received? Y/N
  If yes, average score: _____
□ Any workshop this week? Y/N
  If yes, attendees: _____ | signups: _____

=== 5-MINUTE ACTIVATION CHECK ===
□ Users who signed up this week: _____
□ Of those, how many created an agent? _____
□ Of those, how many sent 3+ messages? _____
□ Rough activation rate: _____%

=== 3-MINUTE DECISION ===
□ Biggest risk right now: _________________________
□ One action I will take this week: _________________________
□ Am I on track for monthly target? Y/N
  If no, what changes: _________________________
```

**Where to get the data:**
- MRR: Stripe Dashboard > Overview
- Signups: Clerk Dashboard > Users > Filter by created date
- Paid subscribers: Stripe > Billing > Subscriptions > Filter by created date
- Cancellations: Stripe > Billing > Subscriptions > Filter by canceled date
- Active conversations: Your TC analytics dashboard or a quick DB query
- Activation: PostHog funnel (signed_up -> agent_created -> user_activated) filtered to last 7 days

---

### Monthly Deep-Dive (1 hour — First Monday of each month)

**Template:**

```
TEACH CHARLIE MONTHLY REVIEW — [MONTH YEAR]

======================================
SECTION 1: FINANCIAL HEALTH (15 min)
======================================

MRR
  Start of month: $______
  End of month: $______
  Change: $______ (____% growth)
  New MRR: $______
  Churned MRR: $______
  Net New MRR: $______

Non-Recurring Revenue
  Credit pack sales: $______
  Workshop revenue: $______
  Total non-recurring: $______

Total Revenue This Month: $______
Total Expenses This Month: $______
  (Hosting, APIs, tools, marketing)
Net: $______ (positive/negative)
Months of runway at current burn: ______

======================================
SECTION 2: USER HEALTH (15 min)
======================================

Signups this month: ______
Activation rate: ______%
  (Target: ______% | Status: RED/YELLOW/GREEN)

Churn rate: ______%
  (Target: ______% | Status: RED/YELLOW/GREEN)

Time to Value (median): ______ minutes
  (Target: ______ min | Status: RED/YELLOW/GREEN)

NPS (if enough responses): ______
  Promoters: ______ | Passives: ______ | Detractors: ______

Total paying customers: ______
Total free users: ______
Free-to-paid ratio: ______:1

======================================
SECTION 3: CHANNEL HEALTH (10 min)
======================================

Workshops this month: ______
  Total attendees: ______
  Workshop-to-signup: ______%
  Workshop-to-paid: ______%

Organic signups: ______
Referral signups: ______
Other channel signups: ______

Best performing channel: __________________
Worst performing channel: __________________

======================================
SECTION 4: QUALITATIVE (10 min)
======================================

Top 3 positive feedback themes:
1. ________________________________
2. ________________________________
3. ________________________________

Top 3 negative feedback/requests:
1. ________________________________
2. ________________________________
3. ________________________________

Support interactions: ______ total
  Most common issue: ___________________

Churned user reasons (if known):
1. ________________________________
2. ________________________________
3. ________________________________

======================================
SECTION 5: DECISIONS (10 min)
======================================

What worked best this month:
________________________________

What failed or underperformed:
________________________________

Top 3 priorities for next month:
1. ________________________________
2. ________________________________
3. ________________________________

Resource allocation next month:
  Product/dev: ______% of time
  Marketing/workshops: ______% of time
  Support/ops: ______% of time

Kill criteria check:
  Am I above minimum viable metrics? Y/N
  If no, what is my plan: ________________

One thing I will STOP doing:
________________________________

One thing I will START doing:
________________________________
```

---

### Google Sheets Tracking Workbook

Create a single Google Sheet with these tabs:

**Tab 1: Monthly Metrics**
| Month | MRR | New MRR | Churned MRR | Signups | Activation Rate | Churn Rate | TTV (median) | NPS | Workshop Revenue | Credit Revenue | Total Revenue |
|-------|-----|---------|-------------|---------|-----------------|------------|-------------|-----|-----------------|----------------|---------------|

**Tab 2: Workshop Tracker**
| Date | Name | Price | Registrants | Attendees | Show Rate | TC Signups | Paid Converts | Conv Rate | Revenue | Notes |
|------|------|-------|-------------|-----------|-----------|------------|---------------|-----------|---------|-------|

**Tab 3: NPS Responses**
| Date | User Email | Score | Category (P/N/D) | Verbatim Comment | Source | Follow-up Done? |
|------|-----------|-------|-------------------|-----------------|--------|-----------------|

**Tab 4: Churn Log**
| Date | User Email | Plan | Months Subscribed | Reason (if known) | Attempted Save? | Notes |
|------|-----------|------|-------------------|-------------------|-----------------|-------|

**Tab 5: Feature Requests**
| Date | User Email | Request | Frequency (how many asked) | Priority (H/M/L) | Status | Notes |
|------|-----------|---------|---------------------------|-------------------|--------|-------|

**Tab 6: Cohort Retention** (see Section 6 below)

---

## 3. DECISION TREES

### Decision Tree A: When to Pivot Pricing

```
START: Review signup-to-paid conversion monthly
│
├─ Is conversion rate below 3% for 4+ consecutive weeks?
│   ├─ YES → Are people signing up but not activating?
│   │   ├─ YES → Problem is NOT pricing. Problem is activation.
│   │   │         Go to Metric 2 action plan. Do NOT change pricing.
│   │   │
│   │   └─ NO (they activate but don't pay) →
│   │       ├─ Survey activated-but-free users: "What would make you upgrade?"
│   │       ├─ If >50% say "too expensive" → Test $9/mo tier for 30 days
│   │       ├─ If >50% say "free tier is enough" → REDUCE free tier limits:
│   │       │   - Limit free to 1 agent (currently unlimited?)
│   │       │   - Limit free to 50 messages/month
│   │       │   - Limit free to no embed widget
│   │       └─ If >50% say "not enough value for $19" → Problem is value prop,
│   │           not price. Add features or improve onboarding first.
│   │
│   └─ NO → Continue monitoring. No action needed.
│
├─ Is MRR growing but churn is eating the growth (net new MRR negative)?
│   ├─ YES → Problem is value delivery, not pricing.
│   │   ├─ Segment churners: Month 1 churn vs Month 2-3 churn
│   │   ├─ Month 1 churn high → Onboarding failure. Fix activation.
│   │   ├─ Month 2-3 churn high → Users hit a wall. They got initial value
│   │   │   but the product did not grow with them. Options:
│   │   │   a. Add "intermediate" features (templates, integrations)
│   │   │   b. Add "stickiness" features (team sharing, saved prompts)
│   │   │   c. Implement usage-based nudges ("You've used 80% of credits")
│   │   └─ Month 4+ churn → Natural churn. Acceptable if <6%.
│   │
│   └─ NO → Continue. This is healthy growth.
│
├─ Are workshop attendees signing up but not converting to paid?
│   ├─ YES (workshop signup rate >40% but paid rate <5%) →
│   │   ├─ The workshop sells the concept but not the paid product
│   │   ├─ Add live paid-feature demos to workshop
│   │   ├─ Offer workshop-exclusive 50% off first month
│   │   └─ Consider annual pricing option ($149/year = $12.42/mo effective)
│   │
│   └─ NO → Workshops are working. Scale them.
│
└─ Has a competitor launched at a lower price point?
    ├─ YES → Do NOT panic-match their price. Instead:
    │   ├─ Differentiate on education/workshops (they cannot copy your brand)
    │   ├─ Add value to justify premium (more templates, better support)
    │   └─ Only match price if you lose 3+ customers specifically citing competitor pricing
    │
    └─ NO → Continue current pricing.
```

**Key thresholds:**
- Free-to-paid conversion below 3% for 4 weeks = investigate
- Free-to-paid conversion below 1% for 4 weeks = urgent pricing/value problem
- Healthy free-to-paid conversion for this model: 5-8%
- Best-in-class free-to-paid conversion: 10-15%

---

### Decision Tree B: When to Pivot Positioning

```
START: Review who is signing up monthly
│
├─ Are the wrong personas signing up?
│   (e.g., developers instead of educators, or hobbyists instead of businesses)
│   ├─ YES → How do you know?
│   │   ├─ Look at Clerk user data: job titles, company names, email domains
│   │   ├─ Look at agent types being created: are they educational or random?
│   │   ├─ Survey: "What do you plan to use Teach Charlie for?"
│   │   │
│   │   ├─ If >60% are wrong persona →
│   │   │   ├─ Your marketing is attracting the wrong audience
│   │   │   ├─ Review workshop descriptions, ad copy, landing page
│   │   │   ├─ Add qualifying language: "For educators, trainers, and coaches"
│   │   │   └─ Change channel mix: if Twitter brings devs, try LinkedIn for educators
│   │   │
│   │   └─ If 30-60% are wrong persona →
│   │       ├─ You might be discovering a new market
│   │       ├─ Interview 5 "wrong persona" users: "Why did you sign up?"
│   │       └─ If they are getting value and paying, they are NOT wrong personas.
│   │           Update your ideal customer profile.
│   │
│   └─ NO → Positioning is fine. Continue.
│
├─ Is "why should I pay?" the dominant feedback?
│   ├─ YES →
│   │   ├─ This means your free tier demonstrates value but paid tier does not
│   │   │   add OBVIOUS additional value
│   │   ├─ Actions:
│   │   │   a. Make paid features visible in free tier (greyed out, "upgrade to unlock")
│   │   │   b. Add a "Compare Plans" page showing clear feature differences
│   │   │   c. Add usage limits to free that create natural upgrade pressure
│   │   │   d. Create case studies: "How [user] built X with Teach Charlie Pro"
│   │   └─ Timeline: implement within 2 weeks, measure for 4 weeks
│   │
│   └─ NO → Value prop is clear enough. Focus elsewhere.
│
├─ Workshops convert but organic does not?
│   (Workshop-to-paid >15% but organic signup-to-paid <2%)
│   ├─ YES →
│   │   ├─ This is NORMAL for education products in early stages
│   │   ├─ It means your product needs hand-holding to demonstrate value
│   │   ├─ Short-term: DOUBLE DOWN on workshops. Run 2x per week.
│   │   ├─ Medium-term: Create a self-serve workshop experience:
│   │   │   - Video onboarding series that mimics workshop flow
│   │   │   - Interactive tutorial (guided first agent build)
│   │   │   - "Workshop in a box" email sequence (5 emails over 7 days)
│   │   └─ Long-term: When self-serve mimics workshop conversion, you can scale
│   │
│   └─ NO → Organic is working. Diversify channels.
│
└─ Are you getting signups but zero engagement?
    (Signups >20/month but activation rate <20%)
    ├─ YES →
    │   ├─ Your marketing promises something the product does not deliver
    │   ├─ OR the product is too confusing to use without guidance
    │   ├─ Secret-shop your own product: sign up with a fresh account,
    │   │   try to create an agent, note every point of confusion
    │   ├─ Watch 5 PostHog session replays of new users
    │   └─ The gap between expectation and reality is your positioning problem
    │
    └─ NO → Engagement is fine. Focus on conversion.
```

---

### Decision Tree C: When to Add Features

```
START: Feature request received
│
├─ Is the requester a paying customer?
│   ├─ NO → Log it. Do not build it. Thank them for the feedback.
│   │         Free users' feature requests are informational, not actionable.
│   │
│   └─ YES → Continue evaluation ↓
│
├─ Have 3+ paying customers requested the same thing?
│   ├─ NO → Log it. Wait. Do not build yet.
│   │         One person's request is an anecdote. Three is a pattern.
│   │
│   └─ YES → Continue evaluation ↓
│
├─ Would this feature reduce churn?
│   (Evidence: churned users cited lack of this feature)
│   ├─ YES → HIGH PRIORITY. Estimate build time.
│   │   ├─ <1 week of work → Build it this month
│   │   ├─ 1-4 weeks of work → Schedule for next month, validate with users first
│   │   └─ >4 weeks of work → Break into smaller pieces. Build the minimum version.
│   │
│   └─ NO → Would this feature help close new sales?
│       ├─ YES → MEDIUM PRIORITY. Build after churn-reducing features.
│       └─ NO → LOW PRIORITY. Add to backlog. Revisit quarterly.
│
├─ VETO CHECK: Does this feature increase complexity for ALL users?
│   ├─ YES → Do not build it unless the evidence is overwhelming (5+ paying users).
│   │         Complexity is the enemy of your "simple for non-technical users" positioning.
│   │
│   └─ NO (can be hidden behind a toggle or advanced mode) → Proceed.
│
└─ FINAL CHECK: Can you build it in <1 week?
    ├─ YES → Build it.
    └─ NO → Write a 1-page spec. Share with 3 requesting users. Get confirmation
            they would use it. Only then build it.
```

---

### Decision Tree D: When to Cut Features

```
START: Monthly feature usage review (check PostHog or DB queries)
│
├─ Is any feature used by <5% of active users?
│   ├─ YES → Is it a paid-only feature?
│   │   ├─ YES → Keep it. Paid features can have low usage and still justify the price
│   │   │         as long as the USERS WHO USE IT find it valuable.
│   │   │
│   │   └─ NO → Is it causing support/maintenance burden?
│   │       ├─ YES (>20% of support requests relate to it) →
│   │       │   ├─ Option A: Fix it so it works reliably (if <1 week of work)
│   │       │   ├─ Option B: Hide it behind a feature flag (don't delete, just hide)
│   │       │   └─ Option C: Remove it entirely (if it is truly broken and unfixable)
│   │       │
│   │       └─ NO → Leave it. Low usage + low maintenance cost = no action needed.
│   │
│   └─ NO → All features are getting used. No action needed.
│
├─ Is any feature actively confusing new users?
│   (Evidence: session replays show users clicking it accidentally,
│    or support messages ask "what does X do?")
│   ├─ YES → Hide it from default view. Show only in "Advanced" section.
│   │         Or add a tooltip/guided tour explaining it.
│   │
│   └─ NO → UX is fine.
│
└─ Is any feature blocking you from building something more important?
    (e.g., maintaining feature X takes 5 hours/month that could go to feature Y)
    ├─ YES → Deprecate with 30-day notice to affected users.
    │         Offer personal migration help to the 3-5 users who rely on it.
    │
    └─ NO → Keep everything. Focus on growth.
```

---

### Decision Tree E: When to Increase Marketing Spend

```
START: Monthly marketing review
│
├─ Do you know your Customer Acquisition Cost (CAC)?
│   ├─ NO → Calculate it first.
│   │   CAC = Total marketing spend this month / New paying customers this month
│   │   (Include: ads, workshop costs, tools, but NOT your time)
│   │   If you spent $200 and got 4 paying customers, CAC = $50
│   │
│   └─ YES → Continue ↓
│
├─ Do you know your Lifetime Value (LTV)?
│   ├─ NO → Estimate it.
│   │   LTV = Average Monthly Revenue Per Customer / Monthly Churn Rate
│   │   Example: $19/mo revenue, 8% churn → LTV = $19/0.08 = $237.50
│   │   In early months, use 3-month survival rate as a proxy:
│   │   If 60% of customers survive 3 months, LTV estimate = $19 x 3 x 0.6 = $34.20
│   │   (This is conservative. Use it until you have 6+ months of data.)
│   │
│   └─ YES → Continue ↓
│
├─ Is CAC < LTV / 3? (The "Rule of 3x")
│   ├─ YES → You have room to scale marketing spend.
│   │   ├─ Current spend <$100/mo → Increase to $200/mo. Test ONE new channel.
│   │   ├─ Current spend $100-$300/mo → Increase by 50%. Double down on best channel.
│   │   ├─ Current spend $300-$500/mo → Optimize before spending more.
│   │   │   Are you getting the most out of existing channels?
│   │   └─ Current spend >$500/mo → This exceeds your budget. Optimize, don't scale.
│   │
│   └─ NO (CAC >= LTV/3) → Do NOT increase spend.
│       ├─ Focus on reducing CAC:
│       │   - Improve conversion rate (better landing page, better onboarding)
│       │   - Shift to lower-CAC channels (referrals, content, community)
│       │   - Improve activation rate (higher activation = more paying users per signup)
│       └─ Focus on increasing LTV:
│           - Reduce churn (higher retention = higher LTV)
│           - Increase ARPU (upsells, credit packs, annual plans)
│
├─ Is organic growth stalling? (Signups flat or declining for 4+ weeks)
│   ├─ YES →
│   │   ├─ Before spending money, exhaust free options:
│   │   │   - Increase workshop frequency
│   │   │   - Ask 5 happy users for referrals
│   │   │   - Post in 3 new communities
│   │   │   - Write 2 SEO articles targeting long-tail keywords
│   │   ├─ If free options exhausted, test paid with $100/mo:
│   │   │   - Option A: LinkedIn ads targeting educators ($50/mo)
│   │   │   - Option B: Google Ads on "AI agent builder" keywords ($50/mo)
│   │   │   - Option C: Sponsor a newsletter in education/AI space ($100/mo)
│   │   └─ Run for 30 days. Measure CAC. If CAC > LTV/3, stop.
│   │
│   └─ NO → Organic is growing. Do not add paid channels yet.
│           Paid marketing should amplify what is already working, not replace organic.
│
└─ BUDGET GATE: Will this spend put you below 3 months of runway?
    ├─ YES → Do NOT increase spend. Survival > growth.
    └─ NO → Proceed with the increase.
```

---

## 4. KILL CRITERIA — When to Make Hard Decisions

This section exists to protect you from the most dangerous trap in entrepreneurship: continuing to invest in something that is not working because you are emotionally attached. These are pre-committed decision points. Write them down now, before emotion is involved.

---

### Month 3 Checkpoint: "Is There Signal?"

**Date to evaluate:** End of Month 3 after public launch.

**Minimum viable metrics (ALL must be met to continue):**

| Metric | Minimum to Continue | Your Actual | Status |
|--------|---------------------|-------------|--------|
| Total signups | 50+ | _____ | PASS/FAIL |
| Activated users | 15+ (30% of signups) | _____ | PASS/FAIL |
| Paying customers | 5+ | _____ | PASS/FAIL |
| MRR | $95+ ($19 x 5) | _____ | PASS/FAIL |
| At least 1 workshop delivered | Yes/No | _____ | PASS/FAIL |
| At least 1 user gave positive unsolicited feedback | Yes/No | _____ | PASS/FAIL |

**If 4-6 metrics PASS:** Continue. You have signal. Double down on what is working.

**If 2-3 metrics PASS:** You have partial signal. You get ONE more month to hit all 6. Identify the failing metrics and allocate 100% of effort to fixing them. If Month 4 still has 2+ failing, proceed to pivot options below.

**If 0-1 metrics PASS:** Serious conversation time. See pivot options below.

**Pivot options at Month 3:**
1. **Reposition, not rebuild.** The product works; the market/message does not. Test a different target audience (e.g., small business owners instead of educators, or coaches instead of teachers). Timeline: 4 weeks to test new positioning.
2. **Workshop-only model.** Stop investing in the SaaS platform. Run Teach Charlie as a pure workshop/training business using the platform as a demo tool. This is viable if workshops are converting but the product is not.
3. **Sell the codebase.** If neither product nor workshops work, the codebase has value to someone building an AI agent builder. List on MicroAcquire/Acquire.com. Realistic range: $5K-$20K based on code quality and user base.

---

### Month 6 Checkpoint: "Is There Growth?"

**Date to evaluate:** End of Month 6.

**Required metrics (ALL must be met):**

| Metric | Minimum to Continue | Your Actual | Status |
|--------|---------------------|-------------|--------|
| Total paying customers | 20+ | _____ | PASS/FAIL |
| MRR | $400+ | _____ | PASS/FAIL |
| MRR growth rate | Positive for 3 of last 4 months | _____ | PASS/FAIL |
| Activation rate | 50%+ | _____ | PASS/FAIL |
| Monthly churn | <15% | _____ | PASS/FAIL |
| Workshops delivered | 3+ total | _____ | PASS/FAIL |
| Net revenue (after all costs) | Less negative than Month 3 (trending toward break-even) | _____ | PASS/FAIL |

**If 5-7 PASS:** Strong signal. Invest more aggressively. Consider part-time contractor for development.

**If 3-4 PASS:** Mixed signal. Identify the 2-3 failing metrics. You have 3 more months to fix them. If MRR growth is one of the failures, prioritize it above all else.

**If 0-2 PASS:** This is not working in its current form.

**Pivot options at Month 6:**
1. **Radical pricing change.** If users exist but will not pay: go 100% free with a different monetization (workshops, consulting, API access). This is a business model pivot, not a product pivot.
2. **Niche down hard.** If you have 5 paying customers, find out what they have in common. Build ONLY for that niche. Example: if 4 of 5 are customer service trainers, become "the AI agent builder for customer service training."
3. **Acqui-hire or soft landing.** If the technology is good but the business is not, approach AI companies that might want your tech + your knowledge. This is not failure; it is strategic recycling.
4. **Maintenance mode.** Reduce to $0 operating cost (shut down paid services, use free tiers only). Keep the product running for existing users. Focus on workshops. Revisit in 6 months when the market may have shifted.

---

### Month 9 Checkpoint: "Is There a Path to Sustainability?"

**Date to evaluate:** End of Month 9.

**Required metrics:**

| Metric | Minimum to Continue | Your Actual | Status |
|--------|---------------------|-------------|--------|
| MRR | $1,500+ | _____ | PASS/FAIL |
| Total paying customers | 50+ | _____ | PASS/FAIL |
| Monthly churn | <10% | _____ | PASS/FAIL |
| CAC:LTV ratio | 1:3 or better | _____ | PASS/FAIL |
| Revenue covers hosting + API costs | Yes/No | _____ | PASS/FAIL |
| At least 1 growth channel is repeatable | Yes/No | _____ | PASS/FAIL |

**If 4-6 PASS:** You have a real business. Plan for Year 2: hiring, features, scaling.

**If 2-3 PASS:** You are close but not there. Give yourself 3 more months. Focus ruthlessly on the failing metrics.

**If 0-1 PASS:** After 9 months, this level of failure means the market/product fit is not there. Proceed to shutdown/pivot decision.

---

### Month 12 Checkpoint: "Continue, Pivot, or Pause?"

**Date to evaluate:** End of Month 12.

This is the definitive checkpoint. You have had a full year. The data is clear.

**CONTINUE if ALL of these are true:**
- MRR is $3,000+ and growing
- You have 80+ paying customers
- Monthly churn is <8%
- You have a repeatable acquisition channel
- You are not losing money (or losses are shrinking)
- You still enjoy the work

**MAJOR PIVOT if:**
- MRR is $500-$3,000 and growth is flat
- You have 20-80 paying customers but cannot grow
- Action: Change target market, pricing model, or core value proposition
- Give the pivot 6 months before the next checkpoint

**PAUSE if:**
- MRR is <$500
- You have <20 paying customers
- Growth has been flat for 3+ months
- Action: Reduce to maintenance mode ($0-$50/mo operating cost), keep product live for existing users, focus energy elsewhere
- Revisit in 6 months. The AI market is moving fast; timing might improve.

**SHUT DOWN if:**
- MRR is <$100
- You have <5 paying customers
- No growth for 6+ months
- You have lost enthusiasm for the product
- Action: Give 30-day notice to users. Export their data. Shut down servers. Optionally, open-source the codebase for goodwill. Write a retrospective blog post (great for personal brand).

---

### The Emotional Framework: Making Hard Decisions

Making kill decisions is the hardest part of being a founder. Here is a framework to keep yourself honest:

**1. Pre-commit in writing.** You are reading this now, before the emotions are high. Write a letter to your future self: "Dear Adam in [Month X], If the numbers below are not met, I will [specific action]. I am writing this now because I know I will be tempted to make excuses later. The numbers are: [copy checkpoint metrics]." Print it. Put it where you will see it.

**2. Get an accountability partner.** Find ONE person — a mentor, a friend who runs a business, a fellow founder — and share your checkpoints with them. When the checkpoint arrives, review the numbers together. Their emotional distance is your advantage.

**3. Apply the "fresh eyes" test.** Ask yourself: "If I were advising a friend with these exact numbers, what would I tell them?" You already know the answer. Apply it to yourself.

**4. Sunk cost is not a factor.** The time and money you have already invested are gone regardless of your decision. The only question is: "Given what I know today, is the next dollar and the next hour best spent on this?" If no, stop.

**5. Pivoting is not failing.** Slack pivoted from a video game. Instagram pivoted from a check-in app. YouTube pivoted from a dating site. The skill is recognizing when to turn, not driving straight off a cliff out of pride.

**6. The 10-10-10 rule.** How will you feel about this decision in 10 minutes? In 10 months? In 10 years? The 10-minute answer is emotional. The 10-year answer is rational. Trust the 10-year answer.

---

## 5. MONTHLY / QUARTERLY BUSINESS REVIEW TEMPLATE

### Monthly Business Review (1 hour, first Monday of each month)

```
=====================================================
TEACH CHARLIE AI — MONTHLY BUSINESS REVIEW
Month: ____________  Date Reviewed: ____________
=====================================================

----- PART 1: THE NUMBERS (20 minutes) -----

REVENUE
  MRR at start of month:               $__________
  MRR at end of month:                  $__________
  MRR growth:                           $__________ (________%)
  New MRR (new subscribers):            $__________
  Expansion MRR (upgrades):             $__________
  Contraction MRR (downgrades):         $__________
  Churned MRR (cancellations):          $__________
  Credit pack revenue:                  $__________
  Workshop revenue:                     $__________
  TOTAL REVENUE:                        $__________

COSTS
  Hosting (DigitalOcean):               $__________
  API costs (OpenAI, Anthropic):        $__________
  SaaS tools (Clerk, Stripe fees, etc): $__________
  Marketing spend:                      $__________
  Other:                                $__________
  TOTAL COSTS:                          $__________

  NET INCOME:                           $__________
  Months of runway remaining:           __________

USERS
  Total signups (all time):             __________
  New signups this month:               __________
  Activated users this month:           __________
  ACTIVATION RATE:                      __________ %
    Target: __________% | Status: [ ] RED [ ] YELLOW [ ] GREEN

  Total paying customers:               __________
  New paying customers this month:      __________
  Churned paying customers this month:  __________
  CHURN RATE:                           __________ %
    Target: __________% | Status: [ ] RED [ ] YELLOW [ ] GREEN

  TIME TO VALUE (median):               __________ minutes
    Target: __________ min | Status: [ ] RED [ ] YELLOW [ ] GREEN

WORKSHOPS
  Workshops delivered:                  __________
  Total attendees:                      __________
  Workshop-to-signup rate:              __________ %
  Workshop-to-paid rate:                __________ %
    Target: __________% | Status: [ ] RED [ ] YELLOW [ ] GREEN

NPS (if measured)
  Responses collected:                  __________
  NPS score:                            __________
    Target: __________  | Status: [ ] RED [ ] YELLOW [ ] GREEN


----- PART 2: WHAT HAPPENED (15 minutes) -----

Top 3 wins this month:
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

Top 3 problems/failures this month:
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

Customer feedback themes (positive):
• ________________________________________________
• ________________________________________________

Customer feedback themes (negative/requests):
• ________________________________________________
• ________________________________________________

Churned customer reasons:
• ________________________________________________
• ________________________________________________

Competitive landscape — anything new?
• ________________________________________________


----- PART 3: DECISIONS (15 minutes) -----

PRICING — any changes needed?
  Decision tree result: [ ] No change [ ] Test new price [ ] Adjust free tier
  Action: ________________________________________________

POSITIONING — any changes needed?
  Decision tree result: [ ] No change [ ] Adjust messaging [ ] New channel
  Action: ________________________________________________

FEATURES — build anything new?
  Requests with 3+ paying customers asking: ________________
  Decision: [ ] Build [ ] Defer [ ] Decline
  Action: ________________________________________________

MARKETING — change spend?
  Current CAC: $__________  Current LTV estimate: $__________
  CAC < LTV/3? [ ] Yes [ ] No
  Decision: [ ] Increase spend [ ] Maintain [ ] Decrease
  Action: ________________________________________________


----- PART 4: NEXT MONTH (10 minutes) -----

Top 3 priorities (ONLY THREE — no more):
1. ________________________________________________
   Success metric: ________________________________
2. ________________________________________________
   Success metric: ________________________________
3. ________________________________________________
   Success metric: ________________________________

Time allocation:
  Product/development:  ________%
  Marketing/workshops:  ________%
  Support/operations:   ________%

One thing I will STOP doing: _________________________
One thing I will START doing: ________________________
One thing I will CONTINUE doing: _____________________

KILL CRITERIA CHECK:
  Am I above minimum metrics for this month's checkpoint?
  [ ] YES — Continue with confidence
  [ ] NO — Review kill criteria section. What is my plan?
  Plan: ________________________________________________


----- SIGN-OFF -----
Reviewed by: Adam
Date: __________
Mood check (1-10, how do I FEEL about the business): __________
(Track this over time. Persistent <5 is a signal to take a break.)
```

---

### Quarterly Business Review (2 hours, end of each quarter)

The quarterly review includes everything in the monthly review PLUS:

```
=====================================================
TEACH CHARLIE AI — QUARTERLY BUSINESS REVIEW
Quarter: Q__ 2026  Date Reviewed: ____________
=====================================================

----- QUARTERLY SUMMARY -----

REVENUE TRAJECTORY
  Month 1 of quarter MRR:  $__________
  Month 2 of quarter MRR:  $__________
  Month 3 of quarter MRR:  $__________
  Quarterly MRR growth:    __________ %
  Total quarterly revenue:  $__________
  Total quarterly costs:    $__________
  Quarterly net income:     $__________

USER TRAJECTORY
  Users at start of quarter:     __________
  Users at end of quarter:       __________
  Quarterly user growth:         __________ %
  Average monthly activation:    __________ %
  Average monthly churn:         __________ %

WORKSHOP TRAJECTORY
  Workshops delivered this Q:    __________
  Total attendees this Q:        __________
  Workshop revenue this Q:       $__________
  Average conversion rate:       __________ %

----- STRATEGIC REVIEW -----

What was the quarter's thesis? (What did I believe would drive growth?)
_______________________________________________________________

Was the thesis correct?
[ ] Yes — double down next quarter
[ ] Partially — adjust the approach
[ ] No — need a new thesis

What did I learn about my customers this quarter?
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

What did I learn about the market this quarter?
1. ________________________________________________
2. ________________________________________________

PRODUCT-MARKET FIT ASSESSMENT (be honest):
On a scale of 1-10, how strong is product-market fit?
Score: __________ (Previous quarter: __________)
Evidence for this score: ________________________________

----- RESOURCE ALLOCATION FOR NEXT QUARTER -----

Budget allocation:
  Hosting/infrastructure: $__________/mo
  Marketing:              $__________/mo
  Tools/SaaS:             $__________/mo
  Reserve:                $__________/mo

Time allocation (hrs/week):
  Product:      __________ hrs
  Marketing:    __________ hrs
  Support:      __________ hrs
  Strategy:     __________ hrs
  Learning:     __________ hrs

Quarterly OKRs (max 3):
1. Objective: ________________________________
   Key Result: ________________________________
   Key Result: ________________________________

2. Objective: ________________________________
   Key Result: ________________________________
   Key Result: ________________________________

3. Objective: ________________________________
   Key Result: ________________________________
   Key Result: ________________________________

----- NEXT QUARTER THESIS -----

I believe that by doing [ACTION], we will achieve [RESULT],
as measured by [METRIC reaching TARGET].

Thesis: ________________________________________________
________________________________________________________
________________________________________________________
```

---

## 6. COHORT ANALYSIS FRAMEWORK

### Why Cohorts Matter

Average metrics lie. If your overall activation rate is 60%, that could mean: January cohort activated at 80% and February cohort activated at 40%. The average looks fine but February was a disaster. Cohort analysis reveals whether things are getting better or worse over time.

### Cohort Definitions

You will track three types of cohorts:

**A. Monthly Signup Cohorts** — all users who signed up in a given month, tracked over time.

**B. Acquisition Channel Cohorts** — users grouped by how they found you:
- Workshop attendees (tagged via UTM: `utm_source=workshop`)
- Organic search (no UTM or `utm_source=google`)
- Referral (tagged via `utm_source=referral` or referral code)
- Direct/other (everything else)

**C. Plan Cohorts** — users grouped by their plan:
- Free tier
- Individual ($19/mo)
- Business (custom)

### Monthly Signup Cohort Retention Table

Set up this table in Google Sheets (Tab 6 of your workbook). Update monthly.

```
MONTHLY COHORT RETENTION (% of cohort still active)

Cohort    | Size | M0   | M1   | M2   | M3   | M4   | M5   | M6
----------|------|------|------|------|------|------|------|------
Jan 2026  |  30  | 100% |  60% |  45% |  38% |  35% |  33% |  32%
Feb 2026  |  45  | 100% |  65% |  50% |  42% |      |      |
Mar 2026  |  55  | 100% |  70% |  55% |      |      |      |
Apr 2026  |  60  | 100% |  72% |      |      |      |      |
May 2026  |  80  | 100% |      |      |      |      |      |
```

**How to read this table:**
- M0 is always 100% (signup month)
- M1 is the percentage who were active in the month after signup
- "Active" = logged in at least once AND either created/edited an agent OR sent a chat message
- Each row is a cohort. Each column is months since signup.
- Read LEFT TO RIGHT to see retention decay for one cohort
- Read TOP TO BOTTOM in any column to see if retention is improving over time

**What "good" looks like at this stage:**

| Month After Signup | Minimum (survival) | Healthy | Great |
|-------------------|---------------------|---------|-------|
| M1 | 40% | 60% | 75%+ |
| M2 | 25% | 45% | 60%+ |
| M3 | 20% | 35% | 50%+ |
| M6 | 15% | 25% | 40%+ |
| M12 | 10% | 20% | 30%+ |

For context, the average B2B SaaS product retains ~35% of users at M3. Consumer products retain ~15% at M3. You are somewhere in between because your users are non-technical business users (consumer-like) using a business tool.

**The "smile curve" is your goal:** Retention drops initially (M0-M2), then flattens (M3-M4), then ideally ticks up slightly (M5+) as remaining users are deeply embedded. If your curve continues to drop without flattening, you have a value delivery problem.

### Acquisition Channel Cohort Comparison

```
CHANNEL COHORT COMPARISON — [MONTH]

                    | Workshop | Organic | Referral | Direct
--------------------|----------|---------|----------|--------
Signups             |    20    |   15    |    8     |   12
Activated (7-day)   |    16    |    7    |    6     |    5
Activation Rate     |   80%    |   47%   |   75%    |   42%
Converted to Paid   |     4    |    1    |    2     |    1
Paid Conv. Rate     |   20%    |    7%   |   25%    |    8%
Avg TTV (minutes)   |    12    |   35    |    15    |   42
M1 Retention        |   85%    |   55%   |   80%    |   50%
M3 Retention        |   60%    |   30%   |   55%    |   25%
CAC                 |   $15    |    $0   |    $5    |    $0
Est. LTV            |  $180    |   $85   |  $165    |   $70
```

**How to use this table:**
- Compare activation rates across channels. If workshop users activate at 80% but organic at 47%, organic users need better onboarding (because they did not get the "workshop experience" of guided setup).
- Compare CAC:LTV ratios. If referral users cost $5 to acquire and have $165 LTV, invest heavily in referral programs.
- If any channel has <20% activation rate consistently, either fix the onboarding for that channel or stop investing in it.

### SQL Query for Cohort Retention

```sql
-- Monthly cohort retention (adapt table/column names to your schema)
WITH cohorts AS (
  SELECT
    id AS user_id,
    DATE_TRUNC('month', created_at) AS cohort_month,
    created_at
  FROM users
),
activity AS (
  SELECT DISTINCT
    a.user_id,
    DATE_TRUNC('month', cm.created_at) AS activity_month
  FROM agents a
  JOIN conversations c ON c.agent_id = a.id
  JOIN chat_messages cm ON cm.conversation_id = c.id
  WHERE cm.role = 'user'
),
cohort_activity AS (
  SELECT
    co.cohort_month,
    EXTRACT(MONTH FROM AGE(ac.activity_month, co.cohort_month))::int AS months_since_signup,
    COUNT(DISTINCT co.user_id) AS active_users
  FROM cohorts co
  LEFT JOIN activity ac ON co.user_id = ac.user_id
  GROUP BY co.cohort_month, months_since_signup
),
cohort_sizes AS (
  SELECT cohort_month, COUNT(*) AS cohort_size
  FROM cohorts
  GROUP BY cohort_month
)
SELECT
  TO_CHAR(ca.cohort_month, 'YYYY-MM') AS cohort,
  cs.cohort_size,
  ca.months_since_signup,
  ca.active_users,
  ROUND(ca.active_users::numeric / cs.cohort_size * 100, 1) AS retention_pct
FROM cohort_activity ca
JOIN cohort_sizes cs ON cs.cohort_month = ca.cohort_month
WHERE ca.months_since_signup >= 0
ORDER BY ca.cohort_month, ca.months_since_signup;
```

Export this query result monthly and paste into your Google Sheet.

### Simple Spreadsheet-Based Cohort Tracking (No Fancy Tools)

If SQL queries feel too technical, here is a fully manual approach:

**Step 1:** At the end of each month, export your user list from Clerk (Users > Export).

**Step 2:** In your Google Sheet, add each user's signup month to their row.

**Step 3:** For each user, check if they were "active" this month (logged in + used the product). You can check this from your built-in analytics dashboard or Clerk's last login date.

**Step 4:** Fill in the cohort table:
- Count users in each signup month (cohort size)
- Count active users from each cohort this month
- Divide to get retention percentage

This takes 15-20 minutes per month with <200 users. It is worth the time.

---

## IMPLEMENTATION CHECKLIST

To put this entire framework into practice, here is the prioritized setup list:

**Week 1 (3 hours total):**
- [ ] Create the Google Sheets workbook with all 6 tabs (1 hour)
- [ ] Set up PostHog free account and add the 5 tracking events to frontend (1.5 hours)
- [ ] Write and print your Month 3 pre-commitment letter (30 minutes)

**Week 2 (2 hours total):**
- [ ] Run the activation rate SQL query for current users — establish your baseline (30 minutes)
- [ ] Run the cohort retention query — establish your baseline (30 minutes)
- [ ] Set up your weekly review as a recurring Monday calendar event with the template (15 minutes)
- [ ] Set up your monthly review as a recurring first-Monday event (15 minutes)
- [ ] Create a Tally.so NPS survey and set up the 14-day trigger email (30 minutes)

**Week 3 (1 hour total):**
- [ ] Review the decision trees and bookmark this document (15 minutes)
- [ ] Identify an accountability partner and share your checkpoints (30 minutes)
- [ ] Do your first weekly review using the template (15 minutes)

**Ongoing weekly:** 15 minutes for weekly review + 2 minutes daily glance = ~25 minutes/week.

**Ongoing monthly:** 1 hour monthly review + 15 minutes cohort update + 15 minutes NPS review = ~1.5 hours/month.

**Total ongoing time commitment:** ~2.5 hours per month. This represents approximately 3% of your 20 hours/week available, which is appropriate for a solo founder. More than this is over-measuring; less than this is flying blind.

---

*This framework is designed to be your operational compass. The metrics tell you where you are. The decision trees tell you what to do. The kill criteria tell you when to stop. Trust the numbers, not your feelings, and you will make the right calls.*

---

Now I have all the information I need. Let me compile the comprehensive risk mitigation section.

---

# RISK MITIGATION -- Teach Charlie AI Launch Playbook

---

## Executive Summary

Teach Charlie AI operates in a high-dependency, high-velocity market as a solo-founded wrapper around open-source infrastructure. The three risks most likely to actually materialize are: **(1) solo founder burnout and operational fragility**, **(2) workshop-to-SaaS conversion falling below sustainable thresholds**, and **(3) Langflow releasing competing simplified features that erode differentiation**. This section provides specific, costed mitigation plans for every identified risk, organized into a priority matrix.

---

## 1. Langflow Platform Risk -- The #1 Existential Dependency

**Current state**: Teach Charlie AI is pinned to `langflowai/langflow:1.7.3` in `docker-compose.prod.yml` (line 212). Langflow is Apache 2.0 licensed, originally built by Logspace, acquired by [DataStax in April 2024](https://techcrunch.com/2024/04/04/datastax-acquires-logspace-the-startup-behind-the-langflow-low-code-tool-for-building-rag-based-chatbots/), and now [IBM plans to acquire DataStax](https://newsroom.ibm.com/2025-02-25-ibm-to-acquire-datastax,-deepening-watsonx-capabilities-and-addressing-generative-ai-data-needs-for-the-enterprise) (announced Feb 2025, expected close Q2 2025). The latest stable release is 1.7.3 (Jan 23, 2026) with 1.8.0 release candidates already shipping.

### Scenario A: Langflow Changes Its License (Apache 2.0 to Restrictive)

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 15-25% over 3 years |
| **Impact** | 5/5 (Existential) |
| **Timeline to impact** | 6-18 months warning before enforcement |

**Historical precedent**: The [open-source license change pattern](https://www.softwareseni.com/the-open-source-license-change-pattern-mongodb-to-redis-timeline-2018-to-2026-and-what-comes-next/) is well-documented:
- **MongoDB** (Oct 2018): AGPL to SSPL. Triggered by AWS competition. Debian, Red Hat, Fedora dropped it.
- **Elasticsearch** (Jan 2021): Apache 2.0 to SSPL + Elastic License. AWS forked as OpenSearch. [Elastic returned to AGPL in Aug 2024](https://en.wikipedia.org/wiki/Server_Side_Public_License).
- **Redis** (Mar 2024): BSD to SSPL/RSAL. Linux Foundation created Valkey fork. [Redis returned to AGPL in May 2025](https://thenewstack.io/redis-is-open-source-again/).
- **HashiCorp** (Aug 2023): MPL 2.0 to BSL. OpenTofu fork created.

**Why Langflow is moderately at risk**: IBM's acquisition of DataStax changes the calculus. IBM has historically been open-source friendly (Red Hat, Eclipse Foundation), and [explicitly committed to supporting Langflow's open-source community](https://www.langflow.org/blog/big-news-for-langflow). However, IBM's commercial pressure to monetize watsonx could create tension. The pattern shows that license changes typically happen 12-24 months after acquisition when the acquirer wants to capture cloud hosting revenue.

**Mitigation plan**:

1. **Pin and archive current version** (ALREADY DONE): Langflow 1.7.3 is pinned in `docker-compose.prod.yml`. Maintain a local Docker image archive.
   - Action: `docker save langflowai/langflow:1.7.3 > langflow-1.7.3-backup.tar`
   - Store on separate cloud storage (S3/Backblaze B2)
   - Cost: $0.50/mo for storage
   - Timeline: Do this today

2. **Fork trigger**: If Langflow announces any license change, immediately fork the last Apache 2.0 tagged release on GitHub.
   - Estimated time to fork: 2 hours
   - Estimated time to set up CI/CD for fork: 1-2 days
   - The Apache 2.0 license permits unlimited commercial use, modification, and distribution. Any code released under Apache 2.0 before a change remains permanently available under that license.

3. **Version ceiling strategy**: Never auto-upgrade Langflow. Test each new version in a staging environment before production. Only upgrade when a feature is specifically needed.
   - Create a `LANGFLOW_VERSION_POLICY.md` document
   - Subscribe to GitHub release notifications: `https://github.com/langflow-ai/langflow/releases`

4. **Abstraction layer**: The current architecture in `/Users/adamcognigy/LangflowSaaS/src/backend/app/services/workflow_service.py` already wraps Langflow API calls. This abstraction layer is the critical defense -- it means swapping Langflow for FlowiseAI or another engine requires changing one service file, not the entire frontend.

### Scenario B: Langflow Breaks Backwards Compatibility

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 70% within 12 months (a near certainty in actively developed OSS) |
| **Impact** | 3/5 (Significant but manageable) |
| **Timeline to impact** | Immediate upon upgrade |

**Mitigation plan**:

1. **Never upgrade in production without staging test** (hard rule):
   ```
   Staging test checklist:
   [ ] Docker pull new version to local
   [ ] Run all 28 E2E tests against new version
   [ ] Test: Agent creation via Q&A wizard
   [ ] Test: Playground chat with multi-turn memory
   [ ] Test: Knowledge source retrieval
   [ ] Test: Custom component publish/unpublish
   [ ] Test: Canvas iframe rendering through nginx proxy
   [ ] Compare Langflow API response schemas for changes
   ```

2. **Pin exact Docker image digest** (not just tag):
   - Tags can be overwritten. Pin to digest: `langflowai/langflow@sha256:abc123...`
   - Retrieve current digest: `docker inspect --format='{{.RepoDigests}}' langflowai/langflow:1.7.3`

3. **Upgrade cadence**: Quarterly at most. Only upgrade if:
   - A security vulnerability (CVE) is found in current version
   - A specific feature is needed that blocks user requests
   - The current version reaches end-of-support

4. **Changelog monitoring**: Set up a GitHub Actions workflow to monitor Langflow releases and post to a Slack channel or email when a new release drops. Estimated setup: 30 minutes.

### Scenario C: IBM/DataStax Makes Langflow Proprietary

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 10-15% over 3 years |
| **Impact** | 4/5 (Severe, but mitigated by fork rights) |
| **Timeline to impact** | 6-12 months notice (legal requirement for open-source projects) |

**Context**: [IBM has explicitly stated](https://www.ibm.com/new/announcements/ibm-to-acquire-datastax-helping-clients-bring-the-power-of-unstructured-data-to-enterprise-ai-applications) they will continue to support and innovate with the open-source Langflow community. IBM's track record with Red Hat suggests they understand the value of open-source ecosystems. However, they may create a "Langflow Enterprise" or "watsonx Langflow" that diverges from the open-source version.

**Mitigation plan**:

1. **Last-open-source-fork strategy**: The moment any announcement suggests proprietary movement:
   - Fork the latest Apache 2.0 release
   - Rename it (e.g., "Charlie Engine" or "OpenFlow")
   - Remove DataStax/IBM branding
   - Host on GitHub under Teach Charlie AI org
   - This is fully legal under Apache 2.0

2. **Community coalition**: If this happens, there will be a community fork (like Valkey for Redis, OpenSearch for Elasticsearch). Join that effort rather than maintaining an independent fork. Maintaining a fork of a project as large as Langflow solo is not feasible long-term.

3. **Cost of fork maintenance**: Estimate $500-1,000/mo for a part-time contractor to maintain security patches. This should only be pursued if revenue exceeds $3K MRR.

### Scenario D: Langflow Launches a Competing Simplified Product

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 40-50% over 2 years |
| **Impact** | 4/5 (Severe competitive threat) |
| **Timeline to impact** | Could happen at any time |

**This is the highest-probability Langflow risk.** [DataStax already offers a hosted Langflow product](https://langflow.datastax.com/) and with IBM's resources, adding a "Simple Mode" or "Guided Builder" is a logical product move.

**Why this is survivable**:
- Langflow/DataStax/IBM will target enterprises, not workshop attendees and solo business owners
- They will never run in-person workshops at local libraries
- They cannot replicate Adam's 10 years of selling no-code automation to non-technical users
- Brand and community are defensible moats that take years to build
- The "dog trainer" metaphor and educational packaging is IP that sits above the engine

**Mitigation plan**:

1. **Double down on what they cannot copy**:
   - In-person workshop network (physical presence)
   - Community of non-technical users who trust the brand
   - Educational content (video courses, tutorials, blog posts)
   - The "Teach Charlie" brand and dog metaphor
   - Personalized onboarding and hand-holding

2. **Differentiation through depth, not breadth**:
   - Langflow will always be a general-purpose tool
   - Teach Charlie is specifically for learning -- guided missions, badges, progressive complexity
   - Focus on the journey, not the destination

3. **Early warning signs to watch**:
   - Langflow blog posts mentioning "simplified" or "beginner" mode
   - New Langflow UI components that look like wizards or guided flows
   - DataStax marketing targeting "non-technical users"
   - IBM watsonx marketing mentioning "low-code AI for everyone"

### Scenario E: Langflow Is Abandoned or Deprecated

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 5-10% over 3 years (very low given IBM acquisition) |
| **Impact** | 4/5 (Severe but slow-moving) |
| **Timeline to impact** | 12-24 months of declining maintenance before it becomes critical |

**IBM's acquisition makes this unlikely in the near term**, but long-term IBM has a history of acquiring and eventually sheltering projects (e.g., IBM Cloud Paks, some Watson products).

**Mitigation plan**:

1. **Migration targets** (in priority order):
   - **[FlowiseAI](https://github.com/FlowiseAI/Flowise)**: Open-source, similar architecture (React Flow + LangChain), MIT license. Most similar to Langflow. Migration effort: 2-4 weeks.
   - **Custom-built engine**: Build a simpler agent execution engine using LangChain directly. Only viable if Teach Charlie has revenue to fund development. Migration effort: 6-12 weeks.
   - **[n8n](https://n8n.io/)**: Open-source workflow automation with AI capabilities. Different paradigm but same target audience. Migration effort: 4-8 weeks.

2. **Warning signs of abandonment**:
   - GitHub commits drop below 10/month (currently ~100+/month)
   - Release cadence slows from monthly to quarterly
   - Key maintainers leave (watch Rodrigo Nader and core team)
   - Issues pile up without responses (>200 open with no activity)

3. **Abstract Langflow touchpoints**: Every Langflow API call should go through `workflow_service.py`. This is already the case. Maintain this discipline. Never add direct Langflow API calls from the frontend.

---

## 2. Competitive Threat Scenarios

### Scenario: Well-Funded Competitor Copies Education-First Approach

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 25-35% over 2 years |
| **Impact** | 3/5 (Moderate -- moats exist) |
| **First-mover window** | 12-18 months |

**Response playbook**:

1. **Moats that compound over time** (ranked by defensibility):
   - **Workshop network** (HIGH): Physical relationships with libraries, community centers, and small business associations. Takes years to build. A VC-funded competitor will not send someone to run a workshop at a public library for 15 attendees.
   - **Brand trust** (HIGH): "Teach Charlie" is memorable, approachable, non-threatening. The dog metaphor creates emotional connection. This is defensible IP.
   - **Community** (MEDIUM): A community of non-technical users who help each other is extremely sticky. Start building this on Day 1 (Discord, forum, or Circle community).
   - **Content** (MEDIUM): 10+ years of automation expertise converted into courses, blog posts, YouTube videos creates a content moat.
   - **Product** (LOW): The product itself is not defensible. Anyone can build a Langflow wrapper.

2. **If a well-funded competitor appears**:
   - Do NOT try to out-feature them
   - DO accelerate community building (paid community manager if revenue supports it)
   - DO publish more educational content (the content library becomes the moat)
   - DO seek partnership (the competitor may want to acquire or license Teach Charlie's approach)

3. **Early warning signs**:
   - A16z or Y Combinator funded startup with "AI education" in pitch
   - Botpress/Voiceflow adding "learning mode" or "tutorial mode"
   - Any product using "dog trainer" or similar approachable metaphor for AI

### Scenario: ChatGPT Custom GPTs Eliminate the Complexity Problem

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 30-40% over 18 months |
| **Impact** | 4/5 (Severe -- undermines core value proposition) |

**Context**: [3 million custom GPTs have been created](https://chad-wyatt.com/ai/100-chatgpt-statistics-for-2026/), and GPT-5.2's release shifted custom GPTs from chatbots to "agentic mini-apps." [20% of enterprise messages already go through Custom GPTs](https://openai.com/index/how-people-are-using-chatgpt/).

**Why this is partially survivable**:
- Custom GPTs are locked into OpenAI's ecosystem (no multi-provider support)
- No Langflow-style visual flow builder for complex workflows
- No in-person learning component
- No community or progressive learning journey
- Users don't learn HOW AI works; they just use it

**Pivot strategy if this materializes**:

1. **Pivot from "build agents" to "understand agents"**: Teach Charlie becomes an AI literacy platform, not an agent builder. The value shifts from the tool to the education.
   - Revenue model: Courses, certifications, workshops (not SaaS)
   - This leverages Adam's 10-year expertise more directly
   - Estimated pivot time: 4-6 weeks

2. **Pivot from "Langflow wrapper" to "multi-platform instructor"**: Teach users how to build agents on ANY platform (Custom GPTs, Langflow, FlowiseAI, Botpress). Teach Charlie becomes the Codecademy of AI agents.
   - Revenue model: Subscription to course content + workshop fees
   - Estimated pivot time: 6-8 weeks

3. **Hybrid approach**: Keep the SaaS for advanced users, add a "ChatGPT Custom GPTs" learning track that teaches users to build on OpenAI's platform. Monetize the learning, not the tool.

**Early warning signs**:
- OpenAI launches "GPT Builder for Teams" with guided workflow
- Custom GPT creation becomes a 1-click experience
- Enterprise GPT usage exceeds 50% of messages
- "Why do I need another tool?" becomes common prospect objection

### Scenario: Major EdTech Company Enters the Space

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 15-20% over 2 years |
| **Impact** | 3/5 (Moderate -- different audience) |

**Likely entrants**: Coursera, Udemy, Khan Academy, LinkedIn Learning, Codecademy.

**Why this is lower impact**: EdTech companies will build courses ABOUT AI agents, not platforms to BUILD AI agents. The "learn by doing" approach requires a product, not just content. Building and maintaining an agent builder is outside their core competency.

**Response playbook**:
1. **Partner, don't compete**: Approach EdTech platforms as a distribution channel. "Teach Charlie" could be the recommended hands-on lab for their AI courses.
2. **Emphasize "applied" over "theoretical"**: EdTech will teach theory. Teach Charlie teaches by building real agents that solve real problems.
3. **Workshop differentiation**: EdTech is digital. Teach Charlie is hybrid (digital + in-person). The in-person component is the differentiator.

### Scenario: Langflow Adds "Simple Mode"

| Attribute | Assessment |
|-----------|------------|
| **Probability** | 40-50% over 2 years (highest probability competitive risk) |
| **Impact** | 3/5 (Moderate -- can be differentiated against) |

**Differentiation strategy**:

1. **Langflow Simple Mode will be generic; Teach Charlie is personal**:
   - Langflow won't have the dog trainer metaphor
   - Langflow won't have guided missions and badges
   - Langflow won't have workshop-driven onboarding
   - Langflow won't have agent presets tailored for non-technical users

2. **Technical defense**: Continue building features that Langflow will never add:
   - Mission-based learning system (Phases 14-17 in backlog)
   - Community features (leaderboards, sharing)
   - Workshop scheduling and group management
   - Certification system

3. **Positioning defense**: "Langflow Simple Mode is a feature. Teach Charlie is a learning experience."

---

## 3. Workshop Conversion Risk

**Core hypothesis**: Live workshops drive SaaS signups and convert to $19/mo subscribers.

### Minimum Viable Conversion Rates

Based on [2026 B2B SaaS conversion benchmarks](https://www.saashero.net/content/2026-b2b-saas-conversion-benchmarks/):

| Metric | Minimum Viable | Target | Excellent |
|--------|---------------|--------|-----------|
| Workshop attendees who sign up for free tier | 40% | 60% | 80% |
| Free tier to $19/mo Individual conversion | 3% | 7% | 12% |
| Workshop-to-paid direct conversion (same day) | 2% | 5% | 10% |
| Monthly churn rate (Individual plan) | <10% | <7% | <5% |

**Break-even calculation** at $19/mo:

| Expense | Monthly Cost |
|---------|-------------|
| DigitalOcean hosting | $48-96 |
| OpenAI API (platform key) | $50-200 |
| Clerk authentication | $0-25 |
| Stripe fees (2.9% + $0.30) | Variable |
| Domain + email | $15 |
| **Total fixed costs** | **$113-336/mo** |

**Break-even**: 6-18 paying subscribers at $19/mo (after Stripe fees of ~$0.85/transaction).

**Sustainable threshold**: 30+ paying subscribers ($570/mo) to cover costs plus founder time.

### When to Declare Workshops Are Not Working

| Signal | Threshold | Timeline |
|--------|-----------|----------|
| Workshop signup rate | <30% of attendees create accounts | After 3 workshops |
| Free-to-paid conversion | <2% within 30 days of signup | After 50 free signups |
| Repeat attendance | <10% attend a second workshop | After 5 workshops |
| Qualitative feedback | "I don't see the point" or "too complex" dominant themes | After 2 workshops |
| **Kill criterion** | <5 paying subscribers after 5 workshops and 90 days | 90 days post-launch |

### Pivot Options If Workshops Fail

**Pivot A: Workshops as standalone revenue** (fastest pivot)
- Charge $49-99/person for AI workshops (no SaaS requirement)
- Partner with libraries, community centers, coworking spaces
- Revenue model: Event fees + optional SaaS upsell
- Estimated pivot time: 1 week (just change the business model)
- Estimated revenue: $500-2,000/workshop (10-20 attendees)

**Pivot B: Content-first approach**
- Create a YouTube channel / course on Udemy / Teachable
- "How to Build AI Agents Without Code" course at $49-199
- Use Teach Charlie platform as the lab environment
- Estimated pivot time: 4-6 weeks to create course
- Revenue potential: $2K-10K/mo at scale

**Pivot C: B2B onboarding tool**
- Pivot from "workshops for individuals" to "AI training for teams"
- Sell to companies that want to upskill employees on AI
- Price: $500-2,000/team for onboarding package
- Estimated pivot time: 2-4 weeks
- This leverages the platform more directly

**Pivot D: Pure PLG (Product-Led Growth) without workshops**
- Invest in SEO, content marketing, social media
- Offer generous free tier to drive organic signups
- Optimize the self-serve onboarding experience
- Estimated pivot time: 2-3 months to see results

### Alternative Customer Acquisition Channels

| Channel | Cost | Timeline to Test | Expected CAC |
|---------|------|-------------------|--------------|
| YouTube tutorials | $0 (time only) | 4-6 weeks | $0-5 |
| SEO blog content | $0 (time only) | 3-6 months | $5-15 |
| Reddit/Twitter community | $0 (time only) | 2-4 weeks | $0-10 |
| Partnership with AI consultants | $0 (referral fee) | 2-4 weeks | $20-50 |
| Facebook/Google Ads | $500-1,000 test | 2-4 weeks | $30-80 |
| AppSumo lifetime deal | Revenue share | 1-2 weeks setup | $0 (but lower LTV) |
| Product Hunt launch | $0 | 1-2 weeks prep | $0-5 |

---

## 4. Pricing Risk

**Current pricing** (from `/Users/adamcognigy/LangflowSaaS/src/backend/app/plans.py`):
- **Free**: $0/mo -- 1 agent, 1,000 test runs, 5 knowledge files
- **Individual**: $19/mo ($180/yr) -- Unlimited agents, unlimited runs, 50 knowledge files
- **Business**: Custom pricing -- Everything + team features, SSO, audit logs

Plus credit packs: $10 (2,000 credits), $25 (5,500 credits), $50 (12,500 credits).

### Price Sensitivity Testing Plan

Before committing to $19/mo, test with:

1. **Pre-launch survey** (Week 1-2): Ask 50+ target users: "Would you pay $X/mo for a tool that helps you build AI agents with guided learning?" Test $9, $19, $29, $49.

2. **Van Westendorp Price Sensitivity Meter**: Ask four questions:
   - At what price would this be too expensive?
   - At what price would this be expensive but worth considering?
   - At what price would this be a bargain?
   - At what price would this be so cheap you'd doubt the quality?

3. **A/B test pricing page** (Month 2-3): Show different prices to different cohorts. Measure signup-to-paid conversion rate. Need minimum 100 visitors per variant for statistical significance.

### Pivot Playbooks by Price Direction

**Raise to $29-49/mo**:
- When: Free-to-paid conversion exceeds 10% (suggests price is too low)
- How: Grandfather all existing subscribers at $19. New subscribers at $29.
- Communication: "We're investing more in the platform. New pricing reflects expanded features."
- Risk: Conversion rate may drop 30-50%. Net revenue should still increase if demand is inelastic.
- Implementation: Change `price_monthly` in `plans.py` from `1900` to `2900` or `4900`. Create new Stripe Price IDs.

**Lower to $9-14/mo**:
- When: Free-to-paid conversion is below 3% after 60 days AND qualitative feedback says "too expensive"
- How: Reduce price for all users. Do not grandfather (everyone benefits).
- Communication: "We want everyone to be able to learn AI. We've lowered our prices."
- Risk: May attract lower-quality users. Revenue per user drops.
- Implementation: Change `price_monthly` in `plans.py` to `900` or `1400`.

**Switch to usage-based only**:
- When: Users want to pay only for what they use (common feedback pattern)
- How: Remove subscription. Charge per credit only. Keep free tier with 500 credits/mo.
- Credit pricing: $0.005-0.01 per credit (already defined in `plans.py`)
- Risk: Unpredictable revenue. Harder to forecast MRR.
- Implementation: Remove Stripe subscription products. Keep credit pack checkout.

**Switch to freemium with higher free tier**:
- When: Activation rate is low because free tier is too restrictive (1 agent, 5 knowledge files)
- How: Increase free tier to 3 agents, 10 knowledge files, 5,000 runs
- Risk: Fewer users upgrade. But more users activate and become advocates.
- Implementation: Update `PlanLimits` in `plans.py` for free tier.

### Grandfathering Strategy

```
RULE: Any user who pays before a price increase keeps their original price FOREVER.

Implementation:
1. Store `original_price_cents` on the subscription record
2. When changing prices, create new Stripe Price IDs
3. Existing subscribers continue on old Price IDs
4. Only new subscribers see new prices
5. Communicate price lock: "Your price is locked in. Thanks for being an early supporter."
```

### Price Change Communication Template

```
Subject: Changes to Teach Charlie AI pricing (effective [DATE])

Hi [NAME],

We're updating our pricing to [increase/decrease] starting [DATE].

[If increase]: We've added [features] and are investing in [improvements].
Your current price of $[X]/mo is locked in forever as a thank you for
being an early supporter.

[If decrease]: We believe everyone should be able to learn AI. We've
lowered our prices to make Teach Charlie more accessible.

What this means for you:
- [Specific impact on their account]
- [Any action they need to take]

Questions? Reply to this email -- I read every one.

Adam
Founder, Teach Charlie AI
```

---

## 5. Solo Founder Burnout Risk

**This is flagged as one of the top 3 most likely risks to actually happen.**

Per [research on solo founder challenges](https://www.thesaaspeople.com/blog/the-solo-founder-trap-why-going-it-alone-is-often-a-strategic-blunder/), solo founders with no boundaries have a 30% higher burnout rate, and decision fatigue is the leading cause of solo founder failure.

### Warning Signs of Burnout (Specific Behavioral Indicators)

| Warning Sign | Description | Severity |
|-------------|-------------|----------|
| Dread opening laptop | Avoiding the product for 2+ consecutive days | HIGH |
| Scope creep as procrastination | Building features nobody asked for instead of selling | MEDIUM |
| Support response time >48hrs | Letting user emails pile up | HIGH |
| Skipping testing | Deploying without running E2E tests | HIGH |
| Night/weekend coding regularly | Working 60+ hours for 2+ consecutive weeks | MEDIUM |
| Physical symptoms | Insomnia, headaches, appetite changes | CRITICAL |
| Isolation | Not talking to anyone about the business for 7+ days | MEDIUM |
| Cynicism about users | "They don't get it" attitude replacing curiosity | HIGH |

### Time Management Framework

**40-hour week split** (hard cap -- exceeding this consistently leads to burnout):

| Block | Hours/Week | Activities |
|-------|-----------|------------|
| **Workshops & Sales** | 10 | Run workshops, sales calls, follow-ups |
| **Content & Marketing** | 6 | Blog posts, social media, YouTube |
| **Product Management** | 4 | Prioritize features, write specs for Claude Code |
| **Technical (AI-assisted)** | 10 | Work with Claude Code on features/fixes |
| **Operations** | 4 | Billing, support, admin |
| **Community** | 4 | Discord/community management, user interviews |
| **Buffer** | 2 | Unexpected issues, rest |

**Hard rules**:
- No coding after 7 PM
- One full day off per week (non-negotiable)
- 15-minute daily review: "What is the one thing I must do today?"
- Weekly CEO review (Friday, 30 min): metrics dashboard, next week priorities

### What to Automate/Delegate First

| Priority | Task | Solution | Cost |
|----------|------|----------|------|
| 1 | Customer support | Intercom/Crisp with auto-responses + FAQ bot | $0-29/mo |
| 2 | Social media | Buffer/Typefully for scheduled posting | $0-15/mo |
| 3 | Workshop scheduling | Calendly/Cal.com for self-service booking | $0-12/mo |
| 4 | Billing inquiries | Stripe customer portal (already built) | $0 |
| 5 | Monitoring/alerts | UptimeRobot/BetterUptime for downtime alerts | $0-7/mo |
| 6 | Database backups | Already automated via GitHub Actions (backup.yml) | $0 |
| 7 | Dependency updates | Dependabot/Renovate for automated PRs | $0 |

### Mental Health Practices (Specific, Not Platitudes)

1. **Daily shutdown ritual** (5 min): Write tomorrow's top 3 priorities. Close laptop. Do not reopen.
2. **Weekly founder peer call**: Join a mastermind group (Indie Hackers, MicroConf community, SaaS Twitter). One 30-minute call per week with another solo founder.
3. **Monthly metric review only**: Do NOT check metrics daily. Set a monthly review date. Daily metric checking causes anxiety without enabling action.
4. **Physical activity non-negotiable**: 30 min/day minimum. Walk, gym, anything. Schedule it like a meeting.
5. **"Two pizza rule" for decisions**: If a decision takes more than 15 minutes, sleep on it. Most decisions are reversible.

### "Break Glass" Plan: 2-4 Weeks Completely Off

**What happens if Adam is unavailable for 2-4 weeks?**

**Minimum viable maintenance** (automated, no human needed):
- Server stays up (DigitalOcean droplet + Docker containers auto-restart)
- Database backups continue (automated daily via `backup.yml`)
- Stripe processes payments (fully automated)
- Clerk handles authentication (fully automated)
- SSL certificate auto-renews (Caddy/Certbot)

**What degrades without intervention**:
- Customer support (response time goes to infinity)
- New user onboarding assistance (no one to help stuck users)
- Bug fixes (any new bugs persist until return)
- Workshop delivery (must be rescheduled)
- Marketing/content (goes silent)

**Pre-departure checklist** (do before any planned absence):
1. Set up auto-responder on support email: "I'm taking a short break. I'll respond within [DATE]. For urgent issues, see our docs at [URL]."
2. Ensure all services are healthy: `ssh root@138.197.92.153 'docker compose -f /root/teachcharlie-app/docker-compose.prod.yml ps'`
3. Verify backups are running: check GitHub Actions backup.yml history
4. Set DigitalOcean alerts for CPU >90%, disk >80%, droplet down
5. Cancel/reschedule any upcoming workshops
6. Post in community: "Taking a short break -- back on [DATE]"

**Emergency contacts** (set up in advance):
- DigitalOcean support: Ticket system (for infrastructure emergencies)
- Stripe support: Dashboard (for payment issues)
- A trusted technical friend who can SSH to server and run `docker compose restart` if everything goes down

### When to Hire First Help

| Revenue Threshold | Role to Hire | Expected Cost |
|-------------------|-------------|---------------|
| $1K MRR | Virtual Assistant (Philippines, part-time) | $500-800/mo |
| $3K MRR | Part-time community manager | $1,000-1,500/mo |
| $5K MRR | Freelance developer (Claude Code + human review) | $2,000-3,000/mo |
| $10K MRR | Full-time operations/support person | $3,000-5,000/mo |

**First hire should be a VA** (virtual assistant) to handle:
- Email triage and templated responses
- Workshop scheduling logistics
- Social media posting (from pre-written content)
- Basic data entry and reporting

**Do NOT hire a developer first.** Claude Code handles development. The bottleneck will be time, not code.

---

## 6. Technical Risks

### Single Point of Failure Analysis

| Component | SPOF? | Impact if Down | Mitigation |
|-----------|-------|----------------|------------|
| DigitalOcean droplet (138.197.92.153) | YES | Total outage | DigitalOcean weekly snapshots + daily DB backup |
| PostgreSQL database | YES | Total outage | Daily automated backups (backup.yml) |
| Langflow container | YES | Can't create/run agents | Auto-restart policy (`restart: always`) |
| Adam (sole operator) | YES | No support, no workshops | "Break glass" plan above |
| Claude Code (sole developer) | PARTIAL | No new features/fixes | Code is standard Python/TS; any developer could maintain |
| DNS (domain) | NO | 1-hour outage | Use registrar with high uptime (Cloudflare) |

### Data Loss Risk & Disaster Recovery

**Current backup strategy** (from `backup.yml`):
- Daily PostgreSQL backup at 3 AM UTC
- Stored on server at `/root/backups/postgres/`

**Gaps and fixes**:

| Gap | Risk | Fix | Cost |
|-----|------|-----|------|
| Backups stored on same server | Server failure loses backups | Upload to S3/Backblaze B2 daily | $1-5/mo |
| No backup testing | Backups may be corrupt | Monthly restore test to staging | $0 (time only) |
| No file/upload backup | User-uploaded knowledge files lost | Add uploads volume to backup script | $0 |
| No Langflow data backup | Flow data lost | Add langflow_data volume to backup | $0 |
| Single region | Regional outage | DigitalOcean weekly snapshots to different region | $5-10/mo |

**Disaster Recovery Playbook**:

```
SCENARIO: Server completely destroyed

Recovery Time Objective (RTO): 2-4 hours
Recovery Point Objective (RPO): 24 hours (daily backup)

Steps:
1. Create new DigitalOcean droplet (5 min)
2. Install Docker + Docker Compose (10 min)
3. Clone repo: git clone https://github.com/[org]/teachcharlie-app (2 min)
4. Copy .env file from secure backup (5 min)
5. Restore database from latest backup (10-30 min)
6. docker compose -f docker-compose.prod.yml up -d (5-10 min)
7. Update DNS to point to new server (5 min, 1-24hr propagation)
8. Verify all services healthy (15 min)

Total: ~1-2 hours hands-on, 1-24 hours for DNS propagation
```

### Security Breach Response Plan

**If user data is accessed by unauthorized party**:

1. **Contain** (0-1 hour): Take server offline. `ssh root@138.197.92.153 'docker compose -f /root/teachcharlie-app/docker-compose.prod.yml down'`
2. **Assess** (1-4 hours): Check logs for scope of breach. What data was accessed? How many users affected?
3. **Notify** (within 72 hours, per GDPR): Email all affected users with: what happened, what data was exposed, what you're doing about it.
4. **Remediate** (1-7 days): Rotate all secrets (API keys, database passwords, Langflow secret key). Patch vulnerability. Rebuild from clean state.
5. **Report** (if required): File with relevant authorities (ICO for UK/EU users, state AG for US users).

**Proactive security measures already in place** (from `docs/07_BEST_PRACTICES_FIXES.md`):
- Input validation (Pydantic)
- Rate limiting on critical endpoints
- Security headers middleware
- CORS hardening
- Secure file upload handling

### Langflow CVE Response

If a CVE is found in the pinned Langflow version (1.7.3):

1. **Assess severity**: CVSS score. If >= 7.0 (High), act within 24 hours.
2. **Check if exploitable**: Is the vulnerable code path used by Teach Charlie? Many CVEs affect features we don't use.
3. **Upgrade or patch**:
   - If a patched version exists: Test in staging, upgrade in production.
   - If no patch: Apply mitigating controls (WAF rules, nginx blocks, disable affected feature).
4. **Communicate**: If user data could be affected, notify users.

### Multi-Provider LLM Fallback

**Current state**: The platform supports OpenAI and Anthropic models (defined in `plans.py` MODEL_COSTS). Users can bring their own API keys.

**If OpenAI goes down**:
- Users with BYO Anthropic keys: Unaffected
- Users on platform keys: Switch default model to Claude (if Anthropic is up)
- Implementation: Add a model fallback chain in `workflow_service.py`
- Priority order: GPT-4o-mini -> Claude 3.5 Haiku -> Gemini 1.5 Flash (cheapest first)

**If both OpenAI and Anthropic go down simultaneously**:
- This has never happened. Probability: <0.1%
- Mitigation: Add Google Gemini as third provider
- Display maintenance page: "AI providers are experiencing issues. Your agents will resume automatically."

---

## 7. Legal/Compliance Risks

### Terms of Service Essentials

Based on [current AI chatbot legal requirements](https://www.spencerfane.com/insight/before-you-launch-that-ai-chatbot-key-legal-risks-and-practical-safeguards/) and [SaaS-specific AI provisions](https://galkinlaw.com/ai-issues-in-saas-agreements/):

**Must include** (non-negotiable):

1. **AI output disclaimer**: "Agents built on Teach Charlie AI generate responses using artificial intelligence. These responses may be inaccurate, incomplete, or inappropriate. Users are responsible for reviewing and verifying all AI-generated content before acting on it."

2. **Limitation of liability**: "Teach Charlie AI is not responsible for any decisions made based on AI agent responses. The platform is provided 'as is' without warranties."

3. **Acceptable use policy**: No illegal content, no impersonation, no generating harmful/deceptive content, no HIPAA/financial/legal advice agents without appropriate disclaimers.

4. **Data handling**: What data you collect, how you process it, retention periods, deletion rights.

5. **Third-party services**: Disclosure that the platform uses OpenAI, Anthropic, and other LLM providers, and their respective ToS apply.

6. **Service availability**: No SLA guarantee (for MVP). Best-effort uptime.

7. **Account termination**: Right to terminate accounts that violate ToS.

**Estimated cost**: $500-2,000 for a lawyer to draft initial ToS, or use a template service like Termly ($10-30/mo) or iubenda.

### Privacy Policy Requirements

**GDPR (if any EU users)**:
- Legal basis for processing (consent or legitimate interest)
- Right to access, rectify, delete personal data
- Data Processing Agreement (DPA) for sub-processors (OpenAI, Anthropic, Clerk, Stripe)
- Cookie consent banner
- Data breach notification within 72 hours

**CCPA (if any California users)**:
- Right to know what data is collected
- Right to delete
- Right to opt out of sale (you don't sell data, so state this clearly)
- "Do Not Sell My Personal Information" link

**Minimum viable privacy policy** should cover:
- What data you collect (email, name, agent configurations, chat logs)
- Why you collect it (to provide the service)
- Who you share it with (Clerk, Stripe, OpenAI, Anthropic)
- How long you keep it (define retention period)
- How users can delete their data

### AI Liability

**The Air Canada precedent**: [Courts ruled that Air Canada was liable for its chatbot's incorrect statements](https://www.wiley.law/alert-AI-Chatbots-How-to-Address-Five-Key-Legal-Risks), establishing that companies cannot disclaim responsibility by saying "the AI made a mistake."

**Teach Charlie's exposure**: Teach Charlie is a platform, not the agent. Users build their own agents. This creates a layer of separation, but does not eliminate liability.

**Mitigation**:
1. **Prominent disclaimers in every agent chat**: Every chat session should display a small disclaimer: "This AI agent was built by [user]. Responses are AI-generated and may be inaccurate."
2. **Prohibited use cases**: ToS should prohibit agents that provide medical, legal, or financial advice without professional oversight.
3. **Usage logging**: Log all agent interactions (already done via conversations table) for potential legal discovery.
4. **Insurance**: Consider Errors & Omissions (E&O) insurance once revenue exceeds $5K MRR. Cost: $500-2,000/year.

### Open Source License Compliance (Apache 2.0)

**Apache 2.0 obligations** (relatively permissive):
- Include a copy of the Apache 2.0 license in distributions
- Include NOTICE file if one exists
- State any modifications you've made
- You do NOT need to open-source your own code
- You CAN use it commercially without restriction
- You CAN modify and distribute without restriction

**Current compliance status**: Teach Charlie uses Langflow as a Docker container (not distributing modified source code). This is the simplest compliance scenario. No additional action needed.

### Stripe/Payment Compliance

- PCI compliance: Handled by Stripe (you never touch card numbers)
- Refund policy: Must be stated in ToS. Recommend 30-day refund policy for annual subscriptions, no refund for monthly (they can just cancel).
- Recurring billing disclosure: Must clearly state subscription is recurring before checkout
- Cancel at any time: Must be easy to cancel (Stripe Customer Portal already handles this)

---

## 8. Contingency Priority Matrix

### Top 10 Risk Register

| Rank | Risk | Probability | Impact (1-5) | Score (P x I) | Category | Mitigation Status |
|------|------|-------------|-------------|----------------|----------|-------------------|
| **1** | **Solo founder burnout** | **70%** | **5** | **3.50** | **Operations** | **PARTIAL -- needs "break glass" plan** |
| **2** | **Workshop-to-SaaS conversion below threshold** | **50%** | **4** | **2.00** | **Business** | **NOT STARTED -- needs first 3 workshops** |
| **3** | **Langflow adds competing simple mode** | **45%** | **3** | **1.35** | **Competition** | **PARTIAL -- differentiation exists** |
| 4 | Pricing wrong ($19 too high or low) | 40% | 3 | 1.20 | Business | NOT STARTED -- needs price testing |
| 5 | ChatGPT eliminates complexity problem | 35% | 4 | 1.40 | Competition | PARTIAL -- pivot plan documented |
| 6 | Single server failure / data loss | 25% | 5 | 1.25 | Technical | PARTIAL -- backups exist, offsite needed |
| 7 | Langflow license change | 20% | 5 | 1.00 | Platform | READY -- version pinned, fork plan ready |
| 8 | Langflow breaking update | 70% | 2 | 1.40 | Platform | DONE -- version pinned, never auto-upgrade |
| 9 | Security breach / data leak | 10% | 5 | 0.50 | Security | PARTIAL -- hardening done, response plan needed |
| 10 | [Composio](https://composio.dev/) shuts down | 10% | 2 | 0.20 | Dependency | LOW RISK -- [$29M funded](https://www.prnewswire.com/news-releases/composio-raises-29m-to-solve-ais-learning-problem-building-skills-that-actually-improve-over-time-302510684.html), 100K+ devs |

### Risk Matrix Visualization

```
                    IMPACT
           1        2        3        4        5
        ┌────────┬────────┬────────┬────────┬────────┐
   90%  │        │        │        │        │        │
        ├────────┼────────┼────────┼────────┼────────┤
   70%  │        │ #8     │        │        │ #1 *** │
P       ├────────┼────────┼────────┼────────┼────────┤
R  50%  │        │        │ #3 **  │ #2 **  │        │
O       ├────────┼────────┼────────┼────────┼────────┤
B  40%  │        │        │ #4     │ #5     │        │
        ├────────┼────────┼────────┼────────┼────────┤
   25%  │        │        │        │        │ #6     │
        ├────────┼────────┼────────┼────────┼────────┤
   20%  │        │        │        │        │ #7     │
        ├────────┼────────┼────────┼────────┼────────┤
   10%  │        │ #10    │        │        │ #9     │
        └────────┴────────┴────────┴────────┴────────┘

*** = TOP PRIORITY (act immediately)
**  = HIGH PRIORITY (act within 30 days)
```

### Immediate Action Items (Next 7 Days)

| # | Action | Risk Addressed | Time | Cost |
|---|--------|---------------|------|------|
| 1 | Archive Langflow Docker image to offsite storage | #7, #8 | 30 min | $0.50/mo |
| 2 | Set up offsite backup (Backblaze B2) for database | #6 | 2 hours | $1-5/mo |
| 3 | Draft Terms of Service and Privacy Policy | #9, Legal | 4 hours | $0-2,000 |
| 4 | Set up UptimeRobot monitoring | #6 | 15 min | $0 |
| 5 | Create "break glass" emergency contacts document | #1 | 30 min | $0 |
| 6 | Set DigitalOcean droplet alerts (CPU, disk, down) | #6 | 15 min | $0 |
| 7 | Add AI disclaimer to all chat sessions | Legal/AI Liability | 1 hour | $0 |

### 30-Day Action Items

| # | Action | Risk Addressed | Time | Cost |
|---|--------|---------------|------|------|
| 1 | Run first 3 workshops and measure conversion | #2 | 20 hours | $0-500 |
| 2 | Survey 50+ target users on pricing | #4 | 5 hours | $0 |
| 3 | Set up monthly backup restore test | #6 | 1 hour/mo | $0 |
| 4 | Join 2 solo founder mastermind groups | #1 | 2 hours/week | $0-50/mo |
| 5 | Document disaster recovery runbook | #6 | 3 hours | $0 |
| 6 | Set up Langflow release monitoring | #7, #8 | 30 min | $0 |
| 7 | Create content calendar (YouTube, blog) | #2, #3 | 3 hours | $0 |

### 90-Day Review Triggers

| If This Happens | Then Do This |
|----------------|--------------|
| <5 paying subscribers after 5 workshops | Activate Pivot A or B from Section 3 |
| Free-to-paid conversion <2% | Test lower price point ($9-14) |
| Free-to-paid conversion >10% | Test higher price point ($29-49) |
| Langflow announces Simple Mode | Accelerate mission system (Phases 14-17) |
| Burnout symptoms appear | Implement hard 30hr/week cap, hire VA |
| Server downtime >4 hours | Migrate to DigitalOcean App Platform or add redundancy |
| >50 paying subscribers | Hire VA ($500-800/mo) |
| Security incident | Execute breach response plan, hire security consultant |

---

## Summary: The Three Risks That Will Actually Happen

**Risk #1: Solo Founder Burnout (70% probability)**. Running workshops, managing product, doing marketing, handling support, AND working with Claude Code is a recipe for exhaustion. The mitigation is structural: hard time caps, automation from day one, and a clear hiring plan tied to revenue milestones. The "break glass" plan ensures the business survives a 2-4 week founder absence.

**Risk #2: Workshop Conversion Below Threshold (50% probability)**. The entire business model depends on workshops converting to SaaS users. This is an untested hypothesis. The mitigation is speed: run workshops quickly, measure ruthlessly, and have pivot options ready. The kill criterion is clear: <5 paying subscribers after 5 workshops and 90 days.

**Risk #3: Langflow Competing Simple Mode (45% probability)**. Langflow/IBM will eventually make their product easier to use. The mitigation is building moats they cannot replicate: brand, community, workshop network, and educational depth. The product is the least defensible part of Teach Charlie -- the educational experience is the most defensible.

The good news: all three risks are manageable with advance planning, and the total cost of mitigation is under $50/month in tooling plus disciplined time allocation.

---

Sources:
- [DataStax Acquires Langflow (TechCrunch)](https://techcrunch.com/2024/04/04/datastax-acquires-logspace-the-startup-behind-the-langflow-low-code-tool-for-building-rag-based-chatbots/)
- [IBM to Acquire DataStax (IBM Newsroom)](https://newsroom.ibm.com/2025-02-25-ibm-to-acquire-datastax,-deepening-watsonx-capabilities-and-addressing-generative-ai-data-needs-for-the-enterprise)
- [Big News for Langflow (Langflow Blog)](https://www.langflow.org/blog/big-news-for-langflow)
- [The Open Source License Change Pattern (SoftwareSeni)](https://www.softwareseni.com/the-open-source-license-change-pattern-mongodb-to-redis-timeline-2018-to-2026-and-what-comes-next/)
- [Redis Is Open Source Again (The New Stack)](https://thenewstack.io/redis-is-open-source-again/)
- [Redis License Change (InfoQ)](https://www.infoq.com/news/2024/03/redis-license-open-source/)
- [Server Side Public License (Wikipedia)](https://en.wikipedia.org/wiki/Server_Side_Public_License)
- [Langflow Release Notes](https://docs.langflow.org/release-notes)
- [Langflow GitHub Releases](https://github.com/langflow-ai/langflow/releases)
- [ChatGPT Statistics 2026 (Chad Wyatt)](https://chad-wyatt.com/ai/100-chatgpt-statistics-for-2026/)
- [ChatGPT Statistics (Index.dev)](https://www.index.dev/blog/chatgpt-statistics)
- [Custom GPT Actions 2026 (Lindy)](https://www.lindy.ai/blog/custom-gpt-actions)
- [2026 B2B SaaS Conversion Benchmarks (SaaS Hero)](https://www.saashero.net/content/2026-b2b-saas-conversion-benchmarks/)
- [Composio Raises $29M (PR Newswire)](https://www.prnewswire.com/news-releases/composio-raises-29m-to-solve-ais-learning-problem-building-skills-that-actually-improve-over-time-302510684.html)
- [The Solo Founder Trap (The SaaS People)](https://www.thesaaspeople.com/blog/the-solo-founder-trap-why-going-it-alone-is-often-a-strategic-blunder/)
- [Solo Founders in 2025](https://solofounders.com/blog/solo-founders-in-2025-why-one-third-of-all-startups-are-flying-solo/)
- [AI Chatbot Legal Risks (Spencer Fane)](https://www.spencerfane.com/insight/before-you-launch-that-ai-chatbot-key-legal-risks-and-practical-safeguards/)
- [AI Chatbot Legal Risks (Wiley)](https://www.wiley.law/alert-AI-Chatbots-How-to-Address-Five-Key-Legal-Risks)
- [AI Issues in SaaS Agreements (Galkin Law)](https://galkinlaw.com/ai-issues-in-saas-agreements/)
- [AI Chatbot Compliance (Cooley)](https://www.cooley.com/news/insight/2025/2025-10-21-ai-chatbots-at-the-crossroads-navigating-new-laws-and-compliance-risks)
- [Cloud Backup Best Practices (DigitalOcean)](https://www.digitalocean.com/blog/cloud-backup-best-practices-startups-smbs)
- [Flowise Alternatives (Voiceflow)](https://www.voiceflow.com/blog/flowise-alternative)
- [Top AI Agent Platforms 2026 (Stack AI)](https://www.stack-ai.com/blog/the-best-ai-agent-and-workflow-builder-platforms-2026-guide)

---

# TEACH CHARLIE AI — 90-DAY LAUNCH SPRINT PLAN

## Executive Summary

This is a go-to-market execution plan for a product that is already built and live. The core thesis: Adam's workshop expertise is the unfair advantage. Every activity in this plan either feeds into workshops, flows from workshops, or amplifies workshop outcomes. The product is the easy part — it works. The hard part is getting the right 100 people to experience it.

**Plan architecture**: Concentric circles radiating outward from workshops. Week 1 starts with 1-on-1 validation calls. Week 4 delivers the first workshop. Week 12 has a repeatable acquisition engine.

---

## MASTER TIMELINE (Text Gantt Chart)

```
WEEK  1  2  3  4  5  6  7  8  9  10 11 12
      ├──PHASE 1: VALIDATE──┤├──PHASE 2: SOFT LAUNCH──┤├──PHASE 3: PUBLIC────┤

VALIDATION CALLS     ████░░░░░░░░
BETA RECRUITMENT     ██████░░░░░░
LANDING PAGE         █░██░░█░░░░░  (v1 wk1, iterate wk3, v2 wk6)
PRICE TESTING        ░███░░░░░░░░
WORKSHOP PREP        ░░██░░█░░░█░  (prep cycles before each workshop)
WORKSHOPS            ░░░█░█░█░█░█  (#1 wk4, #2 wk6, #3 wk8, #4 wk10, #5 wk12)
CONTENT/SEO          ░░█████████░  (foundation wk3, ramp from wk5)
EMAIL LIST           ░░░░████████
COMMUNITY            ░░░░░██████░  (setup wk5-6, active wk7+)
REFERRAL PROGRAM     ░░░░░░█░░░░░  (setup wk7, active ongoing)
PUBLIC LAUNCH        ░░░░░░░░██░░  (prep wk8, launch wk9-10)
PARTNERSHIPS         ░░░░░░░░░░██
CASE STUDIES         ░░░░░░░░░█░█
QUARTER REVIEW       ░░░░░░░░░░░█
```

---

## PHASE 1: VALIDATE & PREPARE (Weeks 1–4)

### WEEKLY TIME BUDGET — PHASE 1

| Activity | Hours/Week | Notes |
|---|---|---|
| **Business/Marketing (20 hrs)** | | |
| Validation calls & outreach | 6 hrs | Drops to 2 hrs after week 2 |
| Landing page & copy | 4 hrs | Front-loaded weeks 1-2 |
| Workshop preparation | 4 hrs | Ramps up weeks 3-4 |
| Content creation | 3 hrs | Starts light, ramps week 3 |
| Analytics & admin | 2 hrs | Weekly review Friday PM |
| Email/community setup | 1 hr | Setup tasks |
| **Technical/Maintenance (20 hrs)** | | |
| Bug fixes from beta feedback | 8 hrs | Highest priority in Phase 1 |
| Onboarding flow polish | 6 hrs | Critical for activation rate |
| Analytics/tracking setup | 4 hrs | PostHog or Mixpanel events |
| Infrastructure/monitoring | 2 hrs | Uptime, error alerting |

---

### WEEK 1: Validation Setup, Beta Recruitment, Landing Page

**Goal**: Have 20 validation conversations scheduled and a landing page that converts.

**MONDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Write the "Validation Interview Script" — 15-minute call structure. Use this exact script:

```
VALIDATION CALL SCRIPT (15 min)

Opening (2 min):
"Hey [name], thanks for taking 15 minutes. I'm building a tool that helps
non-technical people create AI agents — like chatbots, internal assistants,
customer support bots — without coding. I'd love your honest reaction.
No sales pitch, I literally just need to know if this solves a real problem."

Context (3 min):
"Quick background: Have you ever tried to build a chatbot or AI assistant?
What happened? What tools did you try?"
[LISTEN. Write down exact words they use.]

Demo Offer (5 min):
"Let me show you what it looks like — takes 60 seconds to create an agent."
[Share screen → app.teachcharlie.ai → Create Agent → do the 3-step wizard live]
"What's your first reaction?"

Value Probe (3 min):
"If this existed 6 months ago, would you have used it? For what?"
"What would you pay monthly for something like this? $0? $10? $20? $50?"
"Who else do you know that struggles with this?"

Close (2 min):
"I'm letting 20 people use this free for 2 weeks as beta testers.
Want in? I'll also invite you to a free workshop where I walk through
building 3 different types of agents."
[Get email. Ask for 1-2 referrals.]
```

- **(2 hrs)** Build target list of 50 outreach candidates. Sources:
  - LinkedIn connections who are consultants, agency owners, course creators, coaches (search: "automation," "no-code," "AI," "chatbot")
  - Past workshop attendees from Adam's no-code automation work
  - Slack/Discord communities: No Code Founders, Indie Hackers, Automation Nation
  - Twitter/X: search "building chatbot" OR "AI assistant" OR "need a chatbot" (past 7 days)
- **(1 hr)** Send first 15 outreach messages. Use this template:

```
LINKEDIN/EMAIL OUTREACH TEMPLATE

Subject: Quick question about AI agents (15 min)

Hey [name],

I've been building a platform that lets non-technical people create AI
agents in under 2 minutes — no coding, no prompts to write, just
answer 3 questions and your agent is live.

I'm looking for 20 beta testers to try it free and give honest feedback.
You came to mind because [specific reason: you work with clients who
need chatbots / you mentioned struggling with AI tools / etc.].

Would you have 15 minutes this week for a quick call? I'll show you
the tool and get your reaction. No pitch — just need real feedback
before I go wider.

[Calendar link]

Adam
```

Technical (4 hrs):
- **(2 hrs)** Set up analytics tracking. Add PostHog (free tier, $0/mo) or use the existing analytics dashboard. Critical events to track:
  - `signup_started` — hits signup page
  - `signup_completed` — account created
  - `wizard_started` — opens 3-step Q&A
  - `wizard_completed` — finishes all 3 steps
  - `first_chat_sent` — sends first message in playground
  - `agent_published` — publishes agent
  - `plan_upgraded` — converts to paid
- **(2 hrs)** Audit the current signup-to-first-chat flow end-to-end. Document every friction point. Fix any broken links or confusing copy.

**TUESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Landing page audit and optimization. Review `teachcharlie.ai` (marketing site) against this checklist:

```
LANDING PAGE AUDIT CHECKLIST

Above the Fold (5 seconds to communicate value):
□ Headline: Does it say WHAT it does + WHO it's for in <10 words?
  TARGET: "Build AI Agents in 2 Minutes. No Code Required."
□ Subheadline: Does it address the pain point?
  TARGET: "Stop wrestling with prompts. Answer 3 simple questions,
  and Charlie builds your AI assistant."
□ CTA button: Is it specific? (Not "Get Started" → "Create Your First Agent — Free")
□ Social proof: Any number, testimonial, or logo? (Even "20 beta testers" counts)
□ Hero visual: Screenshot or video of the product in action?

Below the Fold:
□ 3 benefits (not features): What does the USER get?
  1. "Create agents without writing a single prompt"
  2. "Test your agent instantly in a live playground"
  3. "Embed it on your website with one line of code"
□ How it works: 3-step visual (matches the 3-step Q&A wizard)
□ Use cases: 3-4 specific examples (customer support bot, onboarding
  assistant, FAQ agent, course companion)
□ Pricing: Visible, simple, with free tier prominent
□ FAQ: 5-6 questions addressing objections
□ Final CTA: Repeat the primary call to action

Technical:
□ Page loads in <3 seconds
□ Mobile responsive
□ Meta description set for SEO
□ OpenGraph image set for social sharing
□ Google Analytics or PostHog installed
```

- **(1 hr)** Write or rewrite the hero section copy based on audit findings
- **(1 hr)** Send 10 more outreach messages (different channel than Monday — if LinkedIn Monday, try email/Twitter today)

Technical (4 hrs):
- **(4 hrs)** Implement critical landing page changes identified in audit. If landing page is Webflow or similar, coordinate with the marketing site. If it is the app itself, update the relevant frontend components.

**WEDNESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Conduct first 3-4 validation calls (15 min each + notes). After each call, record:

```
VALIDATION CALL LOG (copy for each call)

Date: ___  Name: ___  Role: ___  Source: ___
Tried AI tools before? Y/N  Which ones? ___
Top pain point (their words): "___"
Showed demo? Y/N  First reaction (their words): "___"
Would they pay? $___/mo  For what use case? ___
Signed up for beta? Y/N  Email: ___
Referrals given? Names: ___
Key quote: "___"
Follow-up needed: ___
```

- **(1 hr)** Send 10 more outreach messages
- **(1 hr)** Post in 2-3 communities (not promotional — ask questions, add value):

```
COMMUNITY POST TEMPLATE (value-first, not promotional)

Post in: No Code Founders / Indie Hackers / relevant Slack

Title: "What's been your experience building AI chatbots without code?"

Body: "I've been deep in the AI agent space for the past few months and
I'm curious what tools people here have tried. I keep hearing that the
main blockers are (1) writing good prompts, (2) connecting to your own
data, and (3) actually deploying it somewhere useful.

Has that been your experience? What tools have you tried and what
worked/didn't work?

(I'm building something in this space and trying to validate whether
these are the real pain points or if I'm off base.)"
```

Technical (4 hrs):
- **(4 hrs)** Fix the top 2-3 friction points found in Tuesday's signup flow audit. Focus on anything that prevents a new user from going signup → wizard → first chat in under 3 minutes.

**THURSDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Conduct 3-4 more validation calls
- **(1 hr)** Send remaining outreach messages to hit 50 total sent
- **(1 hr)** Begin drafting "Workshop #1 Outline" (rough structure only):

```
WORKSHOP #1 ROUGH OUTLINE (60-90 minutes)

Title: "Build Your First AI Agent in Under 10 Minutes"
Format: Live Zoom, screen-share, interactive
Audience: 10-20 non-technical professionals

Agenda:
0:00 - Welcome + "What's an AI agent?" (5 min)
0:05 - Live demo: Build a customer FAQ agent (10 min)
0:15 - Attendees build their own agent — guided (20 min)
0:35 - Advanced: Add knowledge sources (10 min)
0:45 - Advanced: Embed on a website (10 min)
0:55 - Q&A (10 min)
1:05 - Close: "What to build next" + special offer

Key Success Metric: >50% of attendees create an agent during the workshop
```

Technical (4 hrs):
- **(2 hrs)** Set up error alerting (Sentry free tier or similar) so that when beta users hit errors, Adam knows immediately
- **(2 hrs)** Create a "beta onboarding" email sequence (3 emails, triggered by signup):

```
EMAIL 1: Immediately after signup
Subject: Welcome to Teach Charlie — let's build your first agent

Body: Hey [name]! You're in. Here's what to do first:

1. Go to app.teachcharlie.ai
2. Click "Create Agent"
3. Answer 3 questions (takes 60 seconds)
4. Chat with your agent in the playground

That's it. Your first AI agent in under 2 minutes.

Hit reply if you get stuck — I read every email.

- Adam

EMAIL 2: Day 2 (if they haven't completed wizard)
Subject: Charlie's waiting for you 🐕

Body: Hey [name], I noticed you signed up but haven't created your
first agent yet. The 3-step wizard takes literally 60 seconds.

Here's a quick video showing how: [Loom link - 90 seconds]

Most people are surprised how fast it is. Give it a shot?

EMAIL 3: Day 4 (if they completed wizard)
Subject: 3 things to try with your agent

Body: Nice work creating [agent name]! Here are 3 things to try next:

1. Add a knowledge source (paste a URL or upload a doc)
2. Test edge cases — ask your agent something weird
3. Embed it on a page — takes one line of code

Plus: I'm running a free live workshop on [date] where I walk through
building 3 different types of agents. Want in? [RSVP link]
```

**FRIDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Review all validation call notes. Compile into a "Week 1 Validation Summary":

```
WEEK 1 VALIDATION SUMMARY TEMPLATE

Calls completed: ___ / 10 target
Beta signups: ___ / 10 target
Outreach sent: ___ / 50 target
Response rate: ___%

Top 3 pain points heard (ranked by frequency):
1. "___" (mentioned by ___ people)
2. "___" (mentioned by ___ people)
3. "___" (mentioned by ___ people)

Top 3 use cases requested:
1. ___
2. ___
3. ___

Price sensitivity: Avg willingness to pay: $___/mo
                   Range: $___ to $___

Unexpected findings:
- ___

Quotes to use in marketing:
- "___" — [Name], [Role]
- "___" — [Name], [Role]

Adjustments needed:
- Landing page: ___
- Product: ___
- Positioning: ___
```

- **(1 hr)** Update landing page copy based on validation insights (use their exact words)
- **(1 hr)** Schedule next week's validation calls (aim for 6-8 more)
- **(1 hr)** Week 1 metrics review and planning adjustment

Technical (4 hrs):
- **(2 hrs)** Fix any bugs reported by first beta signups
- **(2 hrs)** Ensure the free tier experience is flawless — test complete flow from signup through publishing an agent on a fresh account

**WEEK 1 TOOLS & COSTS**

| Tool | Purpose | Cost |
|---|---|---|
| Calendly (free) | Schedule validation calls | $0 |
| PostHog (free tier) | Product analytics | $0 |
| Loom (free) | Record quick demo videos | $0 |
| Google Sheets | Validation call log, outreach tracking | $0 |
| Sentry (free tier) | Error alerting | $0 |
| **Week 1 Total** | | **$0** |

**WEEK 1 GO/NO-GO CHECKPOINT**

| Metric | Target | Red Flag |
|---|---|---|
| Outreach messages sent | 50 | <30 |
| Validation calls completed | 6+ | <3 |
| Beta signups | 5+ | 0 |
| Positive demo reactions | >60% of calls | <30% |

**If RED FLAG**: Pivot outreach messaging. Test different audiences (coaches vs. agencies vs. course creators). The problem is likely targeting or messaging, not the product.

---

### WEEK 2: Price Testing, First Beta Users Onboarded, Feedback Collection

**Goal**: 10+ beta users actively using the product. Price sensitivity data from 15+ conversations. First activation rate data.

**MONDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Conduct 3 validation calls. Shift focus from "would you use this?" to price testing. Add these questions:

```
PRICE TESTING QUESTIONS (add to validation script)

"I'm going to show you 3 pricing options. Tell me which feels right
and which feels wrong."

Option A: Free forever, limited to 3 agents, 50 messages/day
Option B: $19/month, unlimited agents, 500 messages/day, knowledge sources
Option C: $49/month, everything + embed widget + priority support

"Which would you pick? Why?"
"At $19/month, what would make it a no-brainer?"
"What would make you cancel after month 1?"
"Would you pay annually for a discount? How much discount?"
```

- **(1 hr)** Personally onboard 2 beta users via Zoom screenshare. Watch them use the product. Do NOT help unless they're stuck for >30 seconds. Note every hesitation, confusion, and "aha" moment.
- **(1 hr)** Write follow-up emails to all validation call participants with beta invites

Technical (4 hrs):
- **(4 hrs)** Fix the #1 friction point observed during Monday's onboarding sessions. This is the single most impactful thing to fix in week 2.

**TUESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Personally onboard 2 more beta users
- **(2 hrs)** Begin creating a "Beta Feedback Board" — use a simple Notion page, Canny (free tier), or even a Google Form:

```
BETA FEEDBACK FORM (Google Form or Notion)

1. What agent did you create? (text)
2. On a scale of 1-5, how easy was the 3-step wizard? (scale)
3. Did your agent give good responses in the playground? (Y/N + text)
4. What confused you? (text)
5. What feature do you wish existed? (text)
6. Would you recommend this to a colleague? (1-10 NPS)
7. Anything else? (text)
```

- **(1 hr)** Send outreach to 3 community leaders / micro-influencers in the no-code space. Not asking for promotion — asking for feedback:

```
INFLUENCER OUTREACH (feedback, not promotion)

Subject: Would love your take on something I built

Hey [name],

I follow your content on [topic] and respect your perspective on
no-code tools. I built a platform that lets non-technical people
create AI agents by answering 3 questions (no prompt engineering).

Would you take 5 minutes to try it and tell me what sucks?
Honest feedback only — I can take it.

Link: app.teachcharlie.ai (free, no credit card)

If you hate it, tell me why. If you love it, I'd be shocked
but grateful.

Adam
```

Technical (4 hrs):
- **(2 hrs)** Implement the top feedback item from beta users (if it is a quick win under 2 hours)
- **(2 hrs)** Add a simple in-app feedback mechanism (floating button or post-wizard prompt: "How was that? Rate 1-5")

**WEDNESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Conduct 3 more validation/price testing calls
- **(1 hr)** Onboard 1 more beta user
- **(1 hr)** Research and list 10 potential workshop distribution channels:
  - Meetup.com groups (AI, no-code, entrepreneurship in your metro area)
  - LinkedIn Events
  - Eventbrite (free events)
  - Luma (event platform popular with tech communities)
  - Partner newsletters (other SaaS tools, course creators)
  - Company Slack channels / internal learning teams
  - Local chamber of commerce
  - Startup incubators / accelerators
  - University entrepreneurship programs
  - Online communities with event channels

Technical (4 hrs):
- **(4 hrs)** Build or improve the "share/embed" experience so it is dead simple for a beta user to show their agent to someone else. This is the virality mechanism — make it frictionless.

**THURSDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Onboard 2 more beta users (target: 10 total by end of Thursday)
- **(2 hrs)** Compile price testing data. Create a pricing decision document:

```
PRICING DECISION DOCUMENT

Interviews completed: ___
Price points tested: Free / $19 / $49

Results:
- ___% chose Free only
- ___% would pay $19/mo
- ___% would pay $49/mo
- Average willingness to pay: $___/mo

Most valued features (ranked):
1. ___
2. ___
3. ___

Least valued features:
1. ___

Decision:
□ Keep current pricing ($0 / $19 / Custom)
□ Adjust to: ___
□ Add annual discount: ___% off
□ Change feature gates: ___

Rationale: ___
```

- **(1 hr)** Begin draft of Workshop #1 registration page (Luma, Eventbrite, or simple landing page)

Technical (4 hrs):
- **(2 hrs)** Fix bugs from beta user reports
- **(2 hrs)** Ensure billing flow works end-to-end — test Stripe checkout, plan upgrades, and cancellation on a test account

**FRIDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Week 2 metrics review and validation synthesis:

```
WEEK 2 METRICS REVIEW

Beta Users:
- Signed up: ___ (target: 10)
- Completed wizard: ___ (activation rate: __%)
- Sent 5+ messages: ___ (engagement rate: __%)
- Published agent: ___ (completion rate: __%)
- NPS score (avg): ___

Validation Calls:
- Total completed (weeks 1-2): ___ (target: 15)
- Positive reaction rate: ___%
- Average WTP: $___/mo

Outreach:
- Messages sent: ___ (target: 70+)
- Response rate: ___%
- Referrals received: ___

Landing Page:
- Visitors: ___
- Signup conversion: ___%

Top 3 Product Issues:
1. ___
2. ___
3. ___

Top 3 Positioning Insights:
1. ___
2. ___
3. ___
```

- **(2 hrs)** Adjust product positioning based on 2 weeks of validation data. Update landing page headline, subheadline, and use case examples to match what resonated most.
- **(1 hr)** Plan Week 3 activities. Confirm Workshop #1 date (should be Week 4).

Technical (4 hrs):
- **(4 hrs)** Prioritize and fix top 2 product issues from beta feedback

**WEEK 2 GO/NO-GO CHECKPOINT**

| Metric | GO (green) | CAUTION (yellow) | NO-GO (red) |
|---|---|---|---|
| Beta users signed up | 10+ | 5-9 | <5 |
| Wizard completion rate | >60% | 40-60% | <40% |
| Positive call reactions | >70% | 50-70% | <50% |
| Avg WTP | >$15/mo | $8-15/mo | <$8/mo |

**If GREEN**: Proceed as planned. Workshop investment justified.
**If YELLOW**: Double down on outreach volume. Adjust messaging. Consider narrowing target audience to the persona that responded best.
**If RED**: Stop. Conduct 10 more calls with a different audience segment before investing in workshops. Possible pivots: (a) different target user, (b) different use case framing, (c) different price point. Do NOT invest in workshop prep until validation improves.

---

### WEEK 3: Workshop #1 Preparation, Content Foundation

**Goal**: Workshop #1 fully prepared and promoted. First 3 pieces of content published. Registration target: 15+ signups for workshop.

**MONDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Build the complete Workshop #1 slide deck and script:

```
WORKSHOP #1: "Build Your First AI Agent in Under 10 Minutes"
FULL RUNDOWN (75 minutes)

MATERIALS NEEDED:
- Zoom Pro account ($13/mo if not already subscribed)
- Slide deck (Google Slides or Canva — free)
- app.teachcharlie.ai loaded and ready
- Backup: pre-recorded 3-min demo in case of technical issues
- Registration page live with confirmation email set up

SLIDE DECK STRUCTURE:

Slide 1: Title + "By the end of this workshop, you'll have a working
AI agent — built by you, in under 10 minutes."

Slide 2: "What is an AI Agent?" (simple explanation, avoid jargon)
- "It's like hiring a digital employee who works 24/7"
- 3 examples: FAQ bot, onboarding assistant, content helper

Slide 3: "The Problem" — Why most people fail at building AI tools
- Prompt engineering is hard
- ChatGPT ≠ a product
- Coding required for deployment
- "What if you could skip all of that?"

Slide 4: "The Teach Charlie Approach" — The Dog Trainer Metaphor
- "You're training a dog, not programming a computer"
- Answer 3 questions → agent is built
- Show the 3 questions on screen

Slide 5: LIVE DEMO — Build a customer FAQ agent
- Share screen
- Walk through the 3-step wizard
- Chat with the agent in playground
- Embed it (show the embed code)
- Total time: ~8 minutes

Slide 6: "YOUR TURN" — Interactive Build Session
- "Open app.teachcharlie.ai in your browser"
- "Sign up (free, takes 30 seconds)"
- "Click Create Agent"
- "I'll walk you through each step"
- Give 15-20 minutes for this
- Be available for questions

Slide 7: Advanced Features (quick tour)
- Knowledge sources (RAG)
- Embedding on websites
- Integrations
- "These are for after the workshop"

Slide 8: Q&A

Slide 9: Close
- "What you built today is live and working"
- "Upgrade to Pro for unlimited agents ($19/mo)"
- "Special workshop offer: [X]" (see pricing strategy below)
- "Join the community: [link]"
- "Next workshop: [date]"

WORKSHOP OFFER OPTIONS (pick one):
a) 30-day free Pro trial (instead of 14-day)
b) 20% off first 3 months ($15.20/mo instead of $19)
c) Free 1-on-1 30-min setup call with Adam
d) Exclusive "Workshop Alumni" badge + priority support
Recommendation: Option (c) for Phase 1 — gives Adam more 1-on-1
touchpoints to learn and build relationships.
```

- **(1 hr)** Set up Workshop #1 registration page on Luma (free) or Eventbrite (free):

```
REGISTRATION PAGE COPY

Title: Build Your First AI Agent in Under 10 Minutes
Subtitle: Free live workshop — no coding, no prompts, no BS

What you'll learn:
✓ Create an AI agent by answering 3 simple questions
✓ Test it live in a chat playground
✓ Embed it on your website with one line of code

Who this is for:
- Consultants who want to offer AI services to clients
- Course creators who want to build AI tutors
- Small business owners who need 24/7 customer support
- Anyone curious about AI who doesn't want to code

Date: [date, week 4]
Time: [time] — 75 minutes
Location: Zoom (link sent after registration)
Price: Free

About the host: Adam has 10+ years helping businesses automate
without code. He built Teach Charlie AI to make building AI agents
as easy as training a dog.

[Register Now — Free]
```

- **(1 hr)** Send workshop invites to all beta users and validation call participants

Technical (4 hrs):
- **(4 hrs)** Ensure the workshop flow is bulletproof. Test: signup → wizard → playground → publish → embed. Fix any issue that would embarrass you in front of 15 people.

**TUESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Write 3 foundational content pieces (these form your SEO base). Publish as blog posts on the Teach Charlie blog or as LinkedIn articles:

```
CONTENT PIECE #1 (Awareness — top of funnel)
Title: "You Don't Need to Learn Prompt Engineering to Build AI Tools"
Length: 800-1,200 words
Structure:
- The myth: "You need to be a prompt expert"
- The reality: Most people just need a simple AI agent
- 3 questions to ask before you start
- CTA: "Try building one in 2 minutes: [link]"

CONTENT PIECE #2 (Education — middle of funnel)
Title: "5 AI Agents Any Small Business Can Build This Week (No Code)"
Length: 1,000-1,500 words
Structure:
- Customer FAQ agent
- Onboarding assistant
- Content idea generator
- Meeting summary bot
- Lead qualification agent
- For each: what it does, who needs it, how to build it
- CTA: "Build any of these free: [link]"

CONTENT PIECE #3 (Use case — bottom of funnel)
Title: "How to Build a Customer Support AI Agent in 10 Minutes"
Length: 800-1,200 words with screenshots
Structure:
- Step-by-step tutorial with screenshots
- The 3-step Q&A wizard walkthrough
- Adding knowledge sources
- Testing in playground
- Embedding on your site
- CTA: "Try it yourself: [link]"
```

- **(1 hr)** Promote workshop on LinkedIn (personal post + event):

```
LINKEDIN POST — WORKSHOP PROMO

I spent the last 3 months building something I wish existed 5 years ago.

A platform that lets non-technical people build AI agents by answering
3 questions. No coding. No prompt engineering. No "temperature settings."

You just describe what you want the agent to do — like training a dog
to do a new trick — and it builds it.

I'm hosting a free live workshop where I'll walk you through building
your first AI agent in under 10 minutes.

[Workshop title]
[Date + time]
[Registration link]

15 spots. If you've ever thought "I should probably figure out this
AI thing" — this is the easiest way to start.

Who should I tag that would find this useful?
```

- **(1 hr)** Post workshop announcement in 3-4 communities where you have existing presence

Technical (4 hrs):
- **(2 hrs)** Add workshop-specific landing page or UTM tracking so you can measure how many workshop attendees sign up and activate
- **(2 hrs)** Create a "Workshop Mode" — consider a simplified view or guided first-run experience that workshop attendees land on. Even just a URL parameter like `?ref=workshop1` that skips the landing page and goes straight to signup.

**WEDNESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Finish and publish the 3 content pieces (if not done Tuesday)
- **(1 hr)** Conduct 2 more validation calls (keep the pipeline warm)
- **(1 hr)** Follow up with all workshop registrants — personal email:

```
WORKSHOP REGISTRANT FOLLOW-UP

Subject: Quick question before [workshop name]

Hey [name],

Excited to see you registered for the workshop! Quick question so I
can make it as useful as possible:

What's the #1 thing you'd want to build with an AI agent?

(Could be a chatbot for your website, a tool for your team, a tutor
for your course — anything.)

Hit reply and let me know. I'll try to cover it live.

See you [date]!
Adam
```

- **(1 hr)** Create workshop reminder email sequence:
  - T-3 days: "Your workshop is in 3 days — here's how to prepare" (just: have a laptop, create a free account ahead of time)
  - T-1 day: "Tomorrow! Here's your Zoom link"
  - T-1 hour: "Starting in 1 hour — join here"
  - T+1 hour: "Thanks for attending! Here's what's next" (replay link, special offer, feedback form)

Technical (4 hrs):
- **(4 hrs)** Fix remaining beta feedback items. Prioritize anything that blocks the signup → wizard → playground flow.

**THURSDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Record a 3-minute product demo video (Loom — free):

```
DEMO VIDEO SCRIPT (3 minutes)

0:00 - "Watch me build an AI customer support agent in 2 minutes."
0:10 - Screen: Click "Create Agent"
0:20 - Step 1: "Who is Charlie?" → "Customer support for a SaaS product"
0:40 - Step 2: "What are the rules?" → Paste knowledge base info
1:00 - Step 3: "What tricks?" → "Answer questions, escalate to human"
1:15 - "That's it. Let's test it."
1:20 - Chat in playground — ask 3 questions, show responses
2:00 - "Now let's embed it on a website."
2:10 - Show embed code, paste into a test page
2:30 - Show it working on the test page
2:45 - "No code. No prompts. Just 3 questions."
2:50 - "Try it free at app.teachcharlie.ai"
3:00 - End
```

- **(1 hr)** Add demo video to landing page and registration page
- **(1 hr)** Send 2nd wave of workshop promotion (different message, different channels)
- **(1 hr)** Reach out to 3 potential "workshop partners" — people who have audiences you want access to:

```
PARTNERSHIP OUTREACH (early stage)

Subject: Collaboration idea — AI workshop for your audience

Hey [name],

I noticed you [run a community / have a newsletter / teach courses]
about [topic]. I built a tool that lets non-technical people build
AI agents in 2 minutes and I'm running free workshops.

Would your audience be interested in a co-hosted workshop? I'd do
all the work — you'd just share it with your audience. Happy to
offer your members a special deal too.

No strings attached. Just trying to reach people who would genuinely
benefit.

Worth a 15-min call?
Adam
```

Technical (4 hrs):
- **(2 hrs)** Do a full dry run of the workshop flow: signup → wizard → chat → embed. Time each step. Identify where attendees might get stuck.
- **(2 hrs)** Fix or smooth any rough edges found in the dry run

**FRIDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Week 3 review. Check:
  - Workshop registrations: ___ (target: 15+)
  - Content published: 3 pieces + demo video
  - Beta users total: ___ (target: 12+)
  - Content views/engagement: ___
- **(1 hr)** Final workshop prep: test Zoom, test screen share, test backup demo video, prepare "cheat sheet" handout for attendees
- **(1 hr)** Create post-workshop feedback form:

```
POST-WORKSHOP FEEDBACK FORM

1. Overall rating (1-5 stars)
2. Did you successfully create an agent during the workshop? (Y/N)
3. What was the most valuable part?
4. What was confusing or could be improved?
5. Would you attend another workshop? (Y/N)
6. Would you recommend this to a colleague? (1-10 NPS)
7. Are you interested in upgrading to Pro? (Y/N / Maybe)
8. What agent would you build next?
```

- **(1 hr)** Send reminder emails to workshop registrants (T-3 if workshop is Monday of week 4, otherwise adjust)

Technical (4 hrs):
- **(2 hrs)** Final testing of workshop flow
- **(2 hrs)** Set up a simple status page or health check dashboard so you can monitor app stability during workshop

**WEEK 3 TOOLS & COSTS**

| Tool | Purpose | Cost |
|---|---|---|
| Luma (free) | Workshop registration | $0 |
| Zoom Pro | Workshop hosting | $13/mo |
| Loom (free) | Demo video | $0 |
| Canva (free) | Slide deck | $0 |
| **Week 3 Total** | | **$13** |

---

### WEEK 4: Workshop #1 Delivery, Beta Feedback Synthesis, Phase 2 Go/No-Go

**Goal**: Deliver Workshop #1 with >50% attendee activation. Synthesize all Phase 1 data. Make go/no-go decision for Phase 2.

**MONDAY or TUESDAY — WORKSHOP DAY (8 hrs business / 2 hrs technical)**

Business (8 hrs — this is the big day, reallocate from other days):
- **(1 hr)** Pre-workshop: test everything. Zoom, screen share, app, backup demo video. Have a glass of water. Breathe.
- **(1.5 hrs)** Deliver Workshop #1 (75 minutes)

```
WORKSHOP DAY MINUTE-BY-MINUTE

T-30 min: Open Zoom room, test screen share, start recording
T-15 min: Load app.teachcharlie.ai, clear browser cache, have
          backup demo video queued
T-5 min:  Welcome early joiners, casual chat
T-0:      "Welcome! Let's build your first AI agent."
          [Follow slide deck from Week 3 prep]
T+75 min: End workshop
T+80 min: Send follow-up email with:
          - Recording link (upload to Loom or YouTube unlisted)
          - Feedback form link
          - Special workshop offer
          - Link to community (if set up)
```

- **(1.5 hrs)** Immediately after: write down observations while fresh:
  - How many attended vs. registered?
  - Where did people get stuck?
  - What questions came up?
  - What got the biggest reaction?
  - Who seemed most engaged? (Follow up with them personally)
  - Any technical issues?

- **(2 hrs)** Send personalized follow-ups to each attendee:

```
POST-WORKSHOP PERSONAL FOLLOW-UP

Subject: Great meeting you at the workshop, [name]!

Hey [name],

Thanks for joining today! I saw you [built a great FAQ agent /
asked a great question about X / etc.].

Here's what I'd suggest as your next step:
[Personalized based on what they built or asked about]

And here's the workshop recording if you want to revisit anything:
[link]

Also: I'm offering workshop attendees a free 30-min 1-on-1 call
where I help you build the exact agent you need. Want to schedule one?
[Calendly link]

Adam
```

- **(2 hrs)** Process feedback forms as they come in. Track:
  - Average rating
  - Activation rate (built an agent during workshop)
  - NPS score
  - Top feedback themes

Technical (2 hrs):
- **(2 hrs)** Fix any technical issues that occurred during the workshop (IMMEDIATELY — these are the highest-priority fixes because they were visible to potential customers)

**WEDNESDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Conduct 3 post-workshop 1-on-1 calls with the most engaged attendees. These are both sales conversations and product research:

```
POST-WORKSHOP 1-ON-1 SCRIPT (30 min)

"Thanks for taking this call! I want to help you build exactly what
you need and also get your honest feedback."

1. "What did you think of the workshop?" (2 min)
2. "What would you actually use an AI agent for in your work?" (5 min)
3. Build it together — live (15 min)
4. "What would make this worth $19/month to you?" (3 min)
5. "Who else should I talk to about this?" (2 min)
6. "Anything else on your mind?" (3 min)
```

- **(1 hr)** Repurpose workshop content:
  - Extract 3-5 key clips from the recording (use Loom or Descript)
  - Write 2 LinkedIn posts about workshop insights
  - Create a "Workshop Recap" blog post with key takeaways
- **(1 hr)** Begin planning Workshop #2 (incorporate feedback from #1)

Technical (4 hrs):
- **(4 hrs)** Implement the #1 product fix identified during the workshop. This should be something that visibly confused multiple attendees.

**THURSDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(3 hrs)** Compile the complete Phase 1 Validation Report:

```
PHASE 1 VALIDATION REPORT (Weeks 1-4)

═══════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════

Total validation calls: ___
Total beta signups: ___
Total beta users who completed wizard: ___
Workshop #1 attendance: ___ of ___ registered (___% show rate)
Workshop #1 activation rate: ___% (built an agent during workshop)
Workshop #1 NPS: ___

═══════════════════════════════════════
AUDIENCE VALIDATION
═══════════════════════════════════════

Best-fit personas (ranked by engagement):
1. [Persona]: [Evidence]
2. [Persona]: [Evidence]
3. [Persona]: [Evidence]

Worst-fit personas (cut from targeting):
1. [Persona]: [Why]

═══════════════════════════════════════
PRODUCT VALIDATION
═══════════════════════════════════════

Wizard completion rate: ___%
Avg time to first chat: ___ minutes
Top 3 "aha moments": ___
Top 3 friction points: ___
Features requested (ranked):
1. ___
2. ___
3. ___

═══════════════════════════════════════
PRICING VALIDATION
═══════════════════════════════════════

Avg willingness to pay: $___/mo
Current pricing fits? Y/N
Recommended changes: ___

═══════════════════════════════════════
CHANNEL VALIDATION
═══════════════════════════════════════

Workshop conversion: ___% (attendee → signup)
LinkedIn outreach response rate: ___%
Community engagement: ___
Content performance: ___

═══════════════════════════════════════
GO/NO-GO DECISION
═══════════════════════════════════════

□ GO: Proceed to Phase 2 (Soft Launch)
□ PIVOT: Change [target audience / positioning / pricing]
□ STOP: Fundamental product-market fit issues (specify)

Rationale: ___
```

- **(1 hr)** Make pricing adjustments if needed based on Phase 1 data
- **(1 hr)** Outline Phase 2 adjustments based on everything learned

Technical (4 hrs):
- **(2 hrs)** Fix remaining critical bugs
- **(2 hrs)** Implement any quick-win features that multiple users requested (if they take <2 hrs)

**FRIDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Phase 2 detailed planning: adjust the Week 5-8 plan below based on Phase 1 learnings
- **(1 hr)** Set up Workshop #2 registration page (target: Week 6)
- **(1 hr)** Publish workshop recap content
- **(1 hr)** Email all beta users with a "What's coming next" update to maintain engagement

Technical (4 hrs):
- **(4 hrs)** Prepare any technical infrastructure needed for Phase 2 (community platform setup, email automation, etc.)

**WEEK 4 GO/NO-GO — THE CRITICAL DECISION**

```
╔══════════════════════════════════════════════════════════════╗
║                    PHASE 1 → PHASE 2 DECISION               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  GO: Proceed to Phase 2 if ALL of these are true:           ║
║  □ Workshop #1 delivered to 8+ attendees                     ║
║  □ >50% of attendees created an agent during workshop       ║
║  □ 10+ beta users have accounts                              ║
║  □ At least 3 people expressed willingness to pay $19+/mo   ║
║  □ You have 5+ quotes you can use in marketing              ║
║  □ You know your top 2 target personas                       ║
║                                                              ║
║  CAUTION: Proceed with adjustments if:                       ║
║  □ Workshop attendance was 5-7 (registration was strong      ║
║    but show rate was low → fix reminder sequence)            ║
║  □ Activation rate was 30-50% (product needs polish →        ║
║    add more guided onboarding before Workshop #2)            ║
║  □ WTP was $8-15/mo (consider lower-priced tier)            ║
║                                                              ║
║  NO-GO: Do NOT proceed if:                                   ║
║  □ <5 workshop attendees AND <5 beta signups                ║
║  □ <30% activation rate                                      ║
║  □ 0 people willing to pay anything                          ║
║  □ You cannot identify a clear target persona                ║
║                                                              ║
║  IF NO-GO: Run 2 more weeks of validation with a different  ║
║  audience. Consider: (a) agency owners specifically,         ║
║  (b) course creators specifically, (c) internal teams at     ║
║  mid-size companies. Rerun the Phase 1 validation loop       ║
║  with a tighter audience before spending money on launch.    ║
╚══════════════════════════════════════════════════════════════╝
```

---

## PHASE 2: SOFT LAUNCH (Weeks 5–8)

### WEEKLY TIME BUDGET — PHASE 2

| Activity | Hours/Week | Notes |
|---|---|---|
| **Business/Marketing (20 hrs)** | | |
| Workshop prep & delivery | 5 hrs | 1 workshop every 2 weeks |
| Content creation & SEO | 5 hrs | Ramping up |
| Community management | 3 hrs | Setup then maintenance |
| Sales/outreach/follow-ups | 3 hrs | Warm leads from workshops |
| Email list & automation | 2 hrs | Building the machine |
| Analytics & planning | 2 hrs | Weekly Friday review |
| **Technical/Maintenance (20 hrs)** | | |
| Bug fixes | 6 hrs | Decreasing as product stabilizes |
| Feature development (user-requested) | 8 hrs | Top 2-3 requests per week |
| SEO/content technical work | 3 hrs | Blog setup, meta tags, etc. |
| Infrastructure | 3 hrs | Monitoring, scaling prep |

---

### WEEK 5: Incorporate Feedback, Landing Page V2, Community Setup

**MONDAY-TUESDAY (10 hrs business / 8 hrs technical)**

Business (10 hrs across 2 days):
- **(4 hrs)** Rewrite landing page based on Phase 1 data. Use exact customer language from validation calls. Apply the headline formula: "[Benefit] without [Pain Point]":
  - Example: "Build AI Agents Without Writing a Single Prompt"
  - Add real quotes from beta users/workshop attendees
  - Add "As seen in [Workshop Name]" or "Trusted by [X] beta testers"
  - Add the 3-minute demo video prominently
- **(3 hrs)** Set up community platform. Recommended: **Discord** (free, good for tech-adjacent audiences) or **Circle** ($39/mo, more professional). For $100-500/mo budget, start with Discord:

```
DISCORD COMMUNITY STRUCTURE

Server name: Teach Charlie Community

Channels:
#welcome — auto-welcome message + rules
#introductions — new members introduce themselves
#show-your-agent — share what you built (social proof goldmine)
#help — ask questions, get help
#feature-requests — upvote what you want built
#workshops — workshop announcements and replays
#general — everything else
#wins — celebrate milestones (first agent, first embed, first paying customer)

Welcome Message:
"Welcome to the Teach Charlie community! 🐕

You're here because you're building AI agents without code. Here's
how to get the most out of this community:

1. Introduce yourself in #introductions (what do you do, what are
   you building?)
2. Share your agents in #show-your-agent
3. Ask anything in #help — Adam and other members will respond
4. Join our live workshops (announced in #workshops)

First task: Build your first agent at app.teachcharlie.ai and share
it in #show-your-agent!"
```

- **(3 hrs)** Invite all beta users and workshop attendees to the community. Send personal invites, not mass emails.

Technical (8 hrs across 2 days):
- **(4 hrs)** Implement the top 3 feature requests from Phase 1 (quick wins only — nothing over 4 hours)
- **(4 hrs)** Landing page V2 technical implementation

**WEDNESDAY-THURSDAY (10 hrs business / 8 hrs technical)**

Business (10 hrs across 2 days):
- **(3 hrs)** Set up email marketing automation. Use **Loops** (free up to 1,000 contacts), **Resend** (free tier), or **Brevo** (free up to 300 emails/day):

```
EMAIL SEQUENCES TO BUILD

Sequence 1: Welcome (triggered by signup)
  Email 1 (immediate): Welcome + first steps
  Email 2 (Day 2): "Did you build your first agent?"
  Email 3 (Day 5): "3 things to try next"
  Email 4 (Day 10): "Workshop invitation"
  Email 5 (Day 14): "Ready to go Pro?"

Sequence 2: Workshop Follow-up (triggered by workshop attendance)
  Email 1 (same day): Recording + feedback form + offer
  Email 2 (Day 2): "How's your agent doing?"
  Email 3 (Day 5): Community invite
  Email 4 (Day 10): Case study or tutorial
  Email 5 (Day 14): Pro upgrade nudge

Sequence 3: Win-back (triggered by 14 days inactive)
  Email 1: "Charlie misses you" + new feature highlight
  Email 2 (Day 3): Tutorial or use case
  Email 3 (Day 7): Workshop invite or 1-on-1 call offer
```

- **(3 hrs)** Write 2 SEO-focused blog posts targeting long-tail keywords:

```
SEO CONTENT TARGETS (long-tail, low competition)

Target keywords (validate with Ubersuggest free or Google Keyword
Planner):
1. "how to build an AI chatbot without coding" (article)
2. "no code AI agent builder" (comparison/review)
3. "AI customer support bot for small business" (tutorial)
4. "create chatbot without programming" (tutorial)
5. "AI agent builder for beginners" (listicle)
6. "embed AI chatbot on website" (tutorial)

For each article:
- 1,200-2,000 words
- Include screenshots of Teach Charlie
- Internal link to app.teachcharlie.ai
- Target 1 primary keyword + 2-3 secondary
- Add FAQ schema markup
```

- **(2 hrs)** Begin building a "lead magnet" — free resource to capture emails:

```
LEAD MAGNET OPTIONS (pick one)

Option A: "The AI Agent Starter Kit" (PDF)
- 10-page guide: "Build Your First AI Agent in 10 Minutes"
- Step-by-step screenshots
- 5 agent templates with example Q&A answers
- Checklist: "Is my agent ready to go live?"

Option B: "5 AI Agents Every Business Needs" (email course)
- 5 emails over 5 days
- Each email covers one agent type
- Includes direct links to build each one in Teach Charlie

Option C: Free mini-workshop recording (video)
- 15-minute edited version of Workshop #1
- "Want the full experience? Join the next live workshop"

Recommendation: Option B — low effort, high email engagement,
drives product usage
```

- **(2 hrs)** Engage in community. Respond to every message in Discord. Seed conversations by asking questions:
  - "What's the most creative agent you've seen?"
  - "What tool do you wish your agent could connect to?"
  - "Share your agent and I'll give feedback"

Technical (8 hrs across 2 days):
- **(4 hrs)** Set up blog infrastructure (if not already done). Options: Webflow blog, Ghost ($9/mo), or static pages on the marketing site.
- **(4 hrs)** Implement email triggers in the app (signup event → email sequence trigger)

**FRIDAY (5 hrs business / 4 hrs technical)**

Business (5 hrs):
- **(2 hrs)** Week 5 metrics review:

```
WEEKLY METRICS DASHBOARD (use every Friday)

Acquisition:
  New signups this week: ___
  Signup source breakdown: ___
  Landing page conversion: ___%
  Email list size: ___

Activation:
  Wizard completion rate: ___%
  First chat sent rate: ___%
  Time to first value: ___ minutes

Engagement:
  Active users (7-day): ___
  Messages sent: ___
  Agents created: ___
  Agents published: ___

Revenue:
  New paying users: ___
  MRR: $___
  Churn: ___

Community:
  Discord members: ___
  Messages this week: ___

Content:
  Blog posts published: ___
  Total blog views: ___
  LinkedIn post impressions: ___
```

- **(2 hrs)** Plan Week 6 Workshop #2 based on learnings
- **(1 hr)** Schedule and write social media posts for next week

Technical (4 hrs):
- **(4 hrs)** Bug fixes and stability work

---

### WEEK 6: Workshop #2, Content Publishing, Email List Building

**MONDAY-TUESDAY (10 hrs business / 8 hrs technical)**

Business:
- **(4 hrs)** Workshop #2 final prep. Adjust based on Workshop #1 feedback. Consider a different topic:

```
WORKSHOP #2 OPTIONS

Option A: "Build an AI Knowledge Base Agent"
- Focus on RAG features
- Attendees upload their own docs
- More advanced, targets people who completed Workshop #1

Option B: "Build an AI Agent for Your Website (Live Embed)"
- Focus on embed widget
- Attendees leave with a working chatbot on their site
- Highly tangible outcome

Option C: "3 AI Agents Every Consultant Should Offer Clients"
- If consultants were top persona from Phase 1
- Focus on productizing AI services
- Revenue-angle for attendees

Recommendation: Choose based on top persona from Phase 1.
```

- **(2 hrs)** Publish 2 content pieces (from Week 5 writing)
- **(2 hrs)** Guest post outreach — pitch articles to 5 publications:

```
GUEST POST PITCH TEMPLATE

Subject: Guest post pitch: [Title]

Hi [editor name],

I run a platform that helps non-technical people build AI agents
and I've been running workshops on the topic. I'd love to write
a practical piece for [publication] on:

"[Title]"

The angle: Most AI content is theoretical or requires coding.
This would be a hands-on tutorial your readers can follow along
with in 10 minutes. I've taught this to [X] people in workshops
and the #1 feedback is "I can't believe how easy that was."

Happy to tailor the angle to your audience. Here are 2 similar
pieces I've published: [links]

Thanks,
Adam
```

- **(2 hrs)** Promote Workshop #2 across all channels

Technical (8 hrs):
- **(4 hrs)** Implement top 2 feature requests from community and beta feedback
- **(4 hrs)** SEO technical: add meta descriptions, OpenGraph tags, blog RSS feed, sitemap.xml

**WEDNESDAY — WORKSHOP #2 DELIVERY (8 hrs business / 2 hrs technical)**

- **(8 hrs)** Same structure as Workshop #1: deliver, observe, follow up, process feedback
- **(2 hrs)** Fix any technical issues encountered during workshop

**THURSDAY-FRIDAY (7 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** Workshop #2 follow-ups: personal emails, 1-on-1 call offers, community invites
- **(2 hrs)** Create first "case study" from a beta user who has gotten value:

```
CASE STUDY TEMPLATE (short format)

Title: "How [Name] Built a [Type] AI Agent in [Time]"

The Challenge:
[1-2 sentences about what they needed]

The Solution:
[1-2 sentences about how they used Teach Charlie]
[Screenshot of their agent]

The Result:
[Specific outcome: saves X hours/week, handles Y conversations/day, etc.]

Quote:
"[Direct quote from the user]"
— [Name], [Role], [Company]

CTA: "Build your own [type] agent for free → [link]"
```

- **(2 hrs)** Week 6 metrics review + Workshop #2 analysis

Technical:
- **(4 hrs)** Work on the #1 feature that would make the best case study even better
- **(4 hrs)** Performance optimization — ensure the app loads fast, especially for workshop attendees joining simultaneously

---

### WEEK 7: SEO Content Batch, Community Seeding, Referral Program

**MONDAY-WEDNESDAY (12 hrs business / 12 hrs technical)**

Business:
- **(6 hrs)** Content batch: write and publish 4-5 SEO articles in one focused sprint. Use a template:

```
SEO ARTICLE TEMPLATE

Title: [Primary Keyword] + [Benefit or Number]
Example: "How to Build a No-Code AI Chatbot in 10 Minutes"

Structure:
1. Hook (2-3 sentences addressing the pain)
2. What you'll learn (bullet list)
3. Step-by-step tutorial with screenshots
4. Common mistakes / FAQ
5. CTA: "Try it yourself"

Each article: 1,200-1,800 words, 3-5 screenshots, internal links,
target 1 primary + 2 secondary keywords
```

- **(3 hrs)** Set up referral program:

```
REFERRAL PROGRAM DESIGN

Mechanism: Give $5/get $5 (or give 1 month free / get 1 month free)

Implementation options (cheapest first):
1. Manual tracking via Google Sheet + unique referral codes ($0)
   - Generate codes like FRIEND-[USERNAME]
   - Track in spreadsheet
   - Apply credits manually
   - Works for first 50 referrals

2. Rewardful ($29/mo) — automated affiliate/referral tracking
   - Integrates with Stripe
   - Dashboard for users to see their referrals
   - Automated payouts

3. Custom build — add referral code to signup flow (4-8 hrs dev)

Recommendation: Start with option 1 (manual). Switch to automated
when you hit 20+ referrals/month.

Referral messaging:
"Love Teach Charlie? Share it with a friend.
They get their first month free. You get your next month free.
Your referral link: [link]"
```

- **(3 hrs)** Community seeding activities:
  - Post a "challenge": "Build an agent and share it in #show-your-agent — I'll review every one and give feedback"
  - Share 3 use case examples from beta users (with permission)
  - Answer every question in #help within 4 hours
  - DM 5 most active community members to thank them and ask what they want to see

Technical (12 hrs):
- **(6 hrs)** Implement referral code tracking in the signup flow (even basic manual tracking needs a URL parameter)
- **(3 hrs)** Blog SEO: add schema markup, internal linking, optimize images
- **(3 hrs)** Bug fixes from community reports

**THURSDAY-FRIDAY (8 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** Publish batch content (if not done Wednesday)
- **(2 hrs)** LinkedIn content sprint — write and schedule 5 posts for next 2 weeks:

```
LINKEDIN POST TEMPLATES (rotate these formats)

Format 1: Lesson Learned
"I ran 2 workshops teaching people to build AI agents.
Here's what surprised me: [insight].
[2-3 sentences expanding]
[CTA: link to next workshop or product]"

Format 2: Quick Tutorial
"How to build a [type] AI agent in 3 steps:
Step 1: [action]
Step 2: [action]
Step 3: [action]
That's it. No coding required.
Try it: [link]"

Format 3: User Story
"[Name] came to my workshop not knowing what an AI agent was.
45 minutes later, [he/she] had a working [type] on [his/her] website.
[Quote from them]
Next workshop: [link]"

Format 4: Contrarian Take
"Unpopular opinion: You don't need to learn prompt engineering.
Here's why: [2-3 sentences]
[CTA]"

Format 5: Behind the Scenes
"Building a SaaS as a non-technical founder. Week [X] update:
[2-3 bullet points of what happened]
[Ask for engagement: question]"
```

- **(2 hrs)** Week 7 metrics review
- **(1 hr)** Workshop #3 preparation begins (target: Week 8)

Technical:
- **(4 hrs)** Feature development: implement top community-requested feature
- **(4 hrs)** Prepare technical infrastructure for public launch (Week 9): load testing, CDN setup, error monitoring hardened

---

### WEEK 8: Workshop #3, Metrics Review, Public Launch Prep

**MONDAY-TUESDAY (10 hrs business / 8 hrs technical)**

Business:
- **(4 hrs)** Workshop #3 prep and promotion. Consider a specialized topic based on what has worked:
  - If consultants are top persona: "How to Sell AI Agent Services to Your Clients"
  - If small biz owners: "Replace Your FAQ Page with an AI Agent Today"
  - If course creators: "Build an AI Tutor for Your Online Course"
- **(3 hrs)** Pre-public-launch checklist preparation:

```
PRE-PUBLIC-LAUNCH TECHNICAL CHECKLIST

Product:
□ All critical bugs fixed
□ Signup → first value in <3 minutes tested
□ Free tier experience is compelling (not crippled)
□ Pricing page is clear and accurate
□ Embed widget works across browsers
□ Error messages are friendly, not technical
□ Billing flow works: signup → upgrade → charge → access
□ Cancellation flow works (don't trap users)
□ Help docs cover top 10 questions

Marketing:
□ Landing page V2 live with social proof
□ Demo video on landing page
□ At least 8 blog posts published
□ Email capture (lead magnet) working
□ Social proof: testimonials, user count, logos
□ OpenGraph images for social sharing
□ Meta descriptions for all pages

Community:
□ Discord active with 20+ members
□ Welcome sequence working
□ At least 3 "show-your-agent" posts as examples

Launch Assets (prepare these):
□ Product Hunt listing draft
□ 5 social media posts ready to schedule
□ Email to existing list announcing public launch
□ Press release / blog post about the launch
□ 3-5 screenshots (annotated) of key features
□ 60-second launch video
□ Launch day FAQ
```

- **(3 hrs)** Content publishing: publish 2 articles + share across channels

Technical (8 hrs):
- **(4 hrs)** Fix all remaining P0/P1 bugs
- **(4 hrs)** Load testing: simulate 50 concurrent users. Ensure the app does not crash or slow down significantly.

**WEDNESDAY — WORKSHOP #3 (8 hrs business / 2 hrs technical)**

- Same delivery structure as previous workshops
- Focus on capturing compelling quotes and stories for launch

**THURSDAY-FRIDAY (7 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** COMPREHENSIVE PHASE 2 REVIEW:

```
PHASE 2 METRICS REVIEW (End of Week 8)

═══════════════════════════════════════
ACQUISITION
═══════════════════════════════════════
Total users: ___ (target: 50+)
Signups this phase: ___
Source breakdown:
  Workshops: ___
  Organic/SEO: ___
  LinkedIn: ___
  Referrals: ___
  Community: ___
  Other: ___

Best channel: ___
Worst channel: ___

═══════════════════════════════════════
ACTIVATION
═══════════════════════════════════════
Wizard completion rate: ___% (target: >70%)
First chat rate: ___%
Agent published rate: ___%
Time to first value: ___ min (target: <5 min)

═══════════════════════════════════════
REVENUE
═══════════════════════════════════════
Paying users: ___ (target: 5+)
MRR: $___ (target: $95+)
Free-to-paid conversion: ___%
Average revenue per user: $___

═══════════════════════════════════════
ENGAGEMENT
═══════════════════════════════════════
Weekly active users: ___
Messages sent / week: ___
Community members: ___
Community engagement rate: ___%

═══════════════════════════════════════
WORKSHOPS
═══════════════════════════════════════
Workshops delivered: 3
Total attendees: ___
Avg activation rate: ___%
Avg NPS: ___
Attendee → signup rate: ___%
Attendee → paid rate: ___%

═══════════════════════════════════════
CONTENT
═══════════════════════════════════════
Blog posts published: ___
Total organic traffic: ___
Top performing content: ___
Email list size: ___

═══════════════════════════════════════
GO/NO-GO FOR PUBLIC LAUNCH
═══════════════════════════════════════
```

- **(2 hrs)** Prepare all launch assets (screenshots, copy, video script)
- **(2 hrs)** Plan Week 9-10 launch activities in detail

Technical (8 hrs):
- **(4 hrs)** Final pre-launch polish: loading states, empty states, micro-copy improvements
- **(4 hrs)** Set up staging environment for launch-day monitoring

**WEEK 8 GO/NO-GO — PUBLIC LAUNCH DECISION**

```
╔══════════════════════════════════════════════════════════════╗
║              PHASE 2 → PHASE 3 (PUBLIC LAUNCH)              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  GO: Launch publicly if ALL of these are true:              ║
║  □ 50+ total users                                           ║
║  □ 5+ paying users ($95+ MRR)                               ║
║  □ >60% wizard completion rate                               ║
║  □ 3 workshops delivered with improving metrics              ║
║  □ At least 3 testimonials/quotes you can use publicly      ║
║  □ Product stable (no critical bugs in past 7 days)         ║
║  □ Landing page, demo video, and blog content live          ║
║                                                              ║
║  SOFT GO: Launch with lower profile if:                      ║
║  □ 30-49 users, 3-4 paying                                  ║
║  □ Skip Product Hunt, do community launches only            ║
║  □ Focus on 1-2 communities where you got traction          ║
║                                                              ║
║  DELAY: Postpone public launch by 2-4 weeks if:            ║
║  □ <30 users                                                 ║
║  □ <3 paying users                                           ║
║  □ <50% activation rate                                      ║
║  □ Product has critical bugs                                 ║
║  □ No clear testimonials                                     ║
║                                                              ║
║  IF DELAY: Run 2 more workshops, fix activation issues,     ║
║  get to 50 users, then launch.                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## PHASE 3: PUBLIC LAUNCH (Weeks 9–12)

### WEEKLY TIME BUDGET — PHASE 3

| Activity | Hours/Week | Notes |
|---|---|---|
| **Business/Marketing (20 hrs)** | | |
| Launch activities & PR | 6 hrs | Front-loaded weeks 9-10 |
| Content creation & SEO | 5 hrs | Consistent |
| Community management | 3 hrs | Growing |
| Workshop prep & delivery | 3 hrs | Every 2 weeks |
| Sales/partnerships | 2 hrs | Starting outbound |
| Analytics & planning | 1 hr | Weekly review |
| **Technical/Maintenance (20 hrs)** | | |
| Bug fixes (launch influx) | 8 hrs | Expect more bugs with more users |
| Feature development | 8 hrs | Based on user demand |
| Infrastructure/scaling | 4 hrs | Handle increased traffic |

---

### WEEK 9: Public Launch

**PRE-LAUNCH (Monday-Tuesday)**

Business (10 hrs across 2 days):
- **(3 hrs)** Prepare and schedule all launch posts:

```
LAUNCH DAY SOCIAL MEDIA POSTS

LINKEDIN POST (publish 9am ET):
"After 4 months of building, 3 workshops, and feedback from 50+ beta
testers — Teach Charlie AI is officially live.

It's a platform that lets anyone build AI agents by answering
3 simple questions. No coding. No prompt engineering. No PhD required.

Think of it like training a dog: you describe the job, set the rules,
and teach it tricks. Charlie does the rest.

In the first 8 weeks of testing:
• [X] agents created
• [X]% of users built their first agent in under 3 minutes
• Average user rating: [X]/5

What can you build?
→ Customer support bots
→ Onboarding assistants
→ Knowledge base agents
→ Course companion tutors
→ And more

Try it free: app.teachcharlie.ai

What would YOU build with an AI agent?"

TWITTER/X POST (publish 9am ET):
"Teach Charlie AI is live 🚀

Build AI agents by answering 3 questions.
No coding. No prompts. Just describe the job.

Free to start → app.teachcharlie.ai"

TWITTER/X THREAD (publish 10am ET):
"1/ I spent 4 months building a platform that makes creating AI
agents as easy as training a dog.

Here's the story and what I learned. 🧵

2/ The problem: Everyone wants to use AI, but most people aren't
prompt engineers or developers.

ChatGPT is powerful but it's not a product. You can't embed it on
your website or train it on your docs.

3/ The solution: What if you could build a specialized AI agent
by answering 3 questions?

1. Who is your agent? (role)
2. What are the rules? (knowledge)
3. What tricks does it know? (capabilities)

4/ That's Teach Charlie AI. In under 3 minutes, you go from zero
to a working AI agent you can:
• Chat with in a playground
• Train with your own docs
• Embed on your website
• Connect to 500+ tools

5/ The 'dog trainer' metaphor isn't just marketing.

It fundamentally changes how non-technical people think about AI.
You're not 'programming' — you're 'training.'

6/ After 3 workshops and 50+ beta testers, the results:
• [X]% build their first agent in under 3 minutes
• Average rating: [X]/5
• Top use cases: [list]

7/ It's free to start. No credit card required.

If you've ever wanted to build an AI tool but didn't know where
to start — this is for you.

Try it: app.teachcharlie.ai"
```

- **(2 hrs)** Prepare Product Hunt listing (if pursuing):

```
PRODUCT HUNT LISTING

Tagline (60 chars max):
"Build AI agents by answering 3 questions. No code required."

Description:
"Teach Charlie AI turns the complex process of building AI agents
into something anyone can do. Instead of writing prompts or code,
you answer 3 simple questions — like training a dog for a new job.

In under 3 minutes, you get a working AI agent that you can:
• Chat with in a live playground
• Train with your own documents and URLs
• Embed on your website with one line of code
• Connect to 500+ tools and integrations

Built for consultants, course creators, small business owners, and
anyone who wants to use AI without a technical background.

Free to start. No credit card required."

Maker's comment:
"Hey PH! I'm Adam, a solo non-technical founder. I built Teach
Charlie because I spent 10 years helping businesses automate with
no-code tools, and I kept seeing the same problem: everyone wants
AI agents but nobody wants to learn prompt engineering.

The 'dog trainer' metaphor came from my own experience — when I
reframed 'programming an AI' as 'training a digital employee,' my
workshop attendees went from confused to building agents in minutes.

Would love your feedback. What would YOU build with an AI agent?"

Screenshots needed (prepare 5):
1. The 3-step Q&A wizard (hero shot)
2. Chat playground with agent responding
3. Knowledge source upload
4. Embed widget on a website
5. Agent dashboard / management view

First comment strategy:
Post a personal story about why you built this. Ask a question
to drive engagement: "What's the first AI agent you'd build?"
```

- **(2 hrs)** Email blast to full list:

```
LAUNCH EMAIL TO LIST

Subject: Teach Charlie AI is officially live

Body:
Hey [name],

You've been part of this journey from the beginning —
and today, Teach Charlie AI is officially open to everyone.

[If they're already a user:]
As an early member, you already know how it works. But we've
made some big improvements based on your feedback:
• [Improvement 1]
• [Improvement 2]
• [Improvement 3]

[If they're not yet a user:]
Here's the short version: build AI agents by answering 3 questions.
No coding, no prompt engineering. Try it free.

Two things I'd appreciate:
1. Share it with ONE person who would find this useful
2. If you have 30 seconds, leave a review [on Product Hunt / in
   our community / reply to this email with your experience]

Your referral link: [link] (you both get [reward])

Thank you for being part of this.

Adam
```

- **(3 hrs)** Post in 8-10 communities where you have built presence over the past 8 weeks. Personalize each post for the community.

Technical (10 hrs across 2 days):
- **(4 hrs)** Monitor systems. Set up a launch-day dashboard showing real-time: signups, wizard completions, errors, server load
- **(4 hrs)** Be on standby for bug fixes. Respond to any issue within 1 hour during launch day
- **(2 hrs)** Ensure database can handle increased load. Review slow queries, add indexes if needed

**LAUNCH DAY (Wednesday)**

```
LAUNCH DAY HOUR-BY-HOUR PLAN

6:00 AM — Wake up. Coffee. Check all systems.
           Verify: app loads, signup works, wizard works, chat works.

7:00 AM — Submit Product Hunt listing (if using — launches 12:01 AM PT,
           so actually submit night before and it goes live automatically).
           Post "maker's comment" immediately.

8:00 AM — Publish launch blog post on your own blog.
           Title: "Teach Charlie AI is Live: Build AI Agents Without Code"

9:00 AM — Publish LinkedIn post + Twitter thread.
           DM 10 people who expressed interest asking them to share.

10:00 AM — Post in communities (stagger throughout the day).
            Community 1: Indie Hackers
            Community 2: No Code Founders

11:00 AM — Check metrics. First 2-hour report:
            Signups: ___ Completions: ___ Errors: ___
            Fix anything broken IMMEDIATELY.

12:00 PM — Post in communities 3-4.
            Respond to ALL Product Hunt comments.
            Respond to ALL social media comments.

1:00 PM — Lunch. Step away for 30 min. You need it.

2:00 PM — Post in communities 5-6.
            Email 5 influencers/journalists with launch news.
            Check metrics again.

3:00 PM — Respond to all new signups personally (if <50).
            Or send a broadcast welcome email (if >50).

4:00 PM — Post in communities 7-8.
            Engage with anyone who shared your launch.
            Thank everyone publicly.

5:00 PM — Mid-day metrics review:
            Signups: ___ Active users: ___ Errors: ___
            Paying conversions: ___

6:00 PM — Final community posts.
            Respond to remaining comments.
            Share any early wins/screenshots/quotes.

8:00 PM — End of day report. Document everything:
            Total signups: ___
            Wizard completions: ___
            First-day paying: ___
            Product Hunt rank: ___
            Bugs reported: ___
            Top feedback: ___

9:00 PM — Schedule tomorrow's posts.
            Queue follow-up emails.
            Go to sleep. Day 2 matters more than Day 1.
```

**POST-LAUNCH (Thursday-Friday)**

Business (10 hrs across 2 days):
- **(3 hrs)** Respond to every comment, email, and message. Speed of response is your launch superpower as a solo founder.
- **(2 hrs)** Publish "Launch Day Results" post on LinkedIn:

```
"We launched Teach Charlie AI yesterday.

Here's what happened:
• [X] signups in 24 hours
• [X] AI agents created
• [X] messages sent to agents
• [Favorite user story]

What I learned:
1. [Insight]
2. [Insight]
3. [Insight]

If you haven't tried it yet: app.teachcharlie.ai

Thank you to everyone who shared, tried it, and gave feedback.
This is just the beginning."
```

- **(3 hrs)** Follow up with every launch-day signup who has not completed the wizard:

```
LAUNCH FOLLOW-UP EMAIL (to non-activated users)

Subject: Quick setup help — takes 60 seconds

Hey [name],

I saw you signed up for Teach Charlie yesterday — awesome!

Looks like you haven't created your first agent yet. Here's a
60-second video showing exactly how: [Loom link]

Or if you're stuck, hit reply and I'll help personally.

Adam (founder)
```

- **(2 hrs)** Week 9 metrics review (likely the most important metrics review of the whole 90 days)

Technical (10 hrs):
- **(6 hrs)** Bug triage and fixes from launch influx
- **(4 hrs)** Performance optimization if needed (slow queries, caching)

---

### WEEK 10: Post-Launch Iteration, Case Studies, Workshop #4

**MONDAY-TUESDAY (10 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** Analyze launch data. Identify:
  - Where signups came from (which channel performed best?)
  - Where users drop off (which step in the funnel leaks most?)
  - What types of agents people are building (matches expectations?)
  - Common questions/confusions
- **(3 hrs)** Create 2-3 case studies from launch users:

```
CASE STUDY OUTREACH (to active users)

Subject: Can I feature your story?

Hey [name],

I noticed you built [agent type] with Teach Charlie and it looks
great. Would you be open to a quick 15-min call where I learn about
your use case?

I'd love to write a short case study (with your approval) about how
you're using it. I'll share it with our community and on our blog —
great exposure for your business too.

Free of charge, of course. Just want to showcase real users doing
cool things.

Adam
```

- **(2 hrs)** Workshop #4 prep and registration
- **(2 hrs)** Content: publish 1 article + share across channels

Technical (8 hrs):
- **(4 hrs)** Fix top 3 post-launch bugs
- **(4 hrs)** Implement the #1 feature request from launch users (if quick win)

**WEDNESDAY — WORKSHOP #4 (8 hrs business / 2 hrs technical)**

- Deliver workshop. Consider making this a "special launch edition" for new users.

**THURSDAY-FRIDAY (7 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** Workshop #4 follow-ups
- **(2 hrs)** Publish 2 case studies
- **(2 hrs)** Week 10 metrics review + post-launch retrospective:

```
POST-LAUNCH RETROSPECTIVE

Launch channels ranked by signups:
1. ___ : ___ signups
2. ___ : ___ signups
3. ___ : ___ signups

Best-performing content: ___
Worst-performing content: ___

Surprise findings: ___

What to double down on: ___
What to stop doing: ___
What to start doing: ___
```

Technical:
- **(4 hrs)** Feature development
- **(4 hrs)** Infrastructure improvements for sustained growth

---

### WEEK 11: Content Doubling Down, Partnership Outreach

**MONDAY-WEDNESDAY (12 hrs business / 12 hrs technical)**

Business:
- **(5 hrs)** Content sprint: write and publish 4 articles focused on what performed best in Weeks 9-10. Double down on winning topics/formats.
- **(4 hrs)** Partnership outreach to 10 potential partners:

```
PARTNERSHIP TARGETS (prioritize based on audience overlap)

1. No-code tool companies (Zapier, Make, Bubble) — "integration
   partnership" or co-marketing
2. Online course platforms (Teachable, Thinkific, Kajabi) —
   "AI tutor for your students" angle
3. Agency communities (UGURUS, Agency Mavericks) — "offer AI
   services to clients" angle
4. Consulting communities — "productize your expertise" angle
5. Newsletter operators in AI/no-code space — cross-promotion
6. YouTube creators who cover AI tools — free account for review
7. Podcast hosts in the AI/no-code/SaaS space — be a guest
8. Complementary SaaS products — mutual referral agreements
9. Local business organizations — workshop partnerships
10. Startup incubators — educational partnerships

PARTNERSHIP OUTREACH TEMPLATE:

Subject: Partnership idea: [specific value proposition]

Hey [name],

I run Teach Charlie AI — a platform that lets non-technical people
build AI agents in 2 minutes. We have [X] users and growing.

I think there's a natural fit with [their product/audience]:
[Specific idea: co-hosted workshop, integration, cross-promo, etc.]

Would you be open to a 15-min call to explore?

What I can offer:
• [Specific value: free accounts for their audience, co-branded
  workshop, featured integration, etc.]

What I'm looking for:
• [Specific ask: mention in newsletter, co-hosted event, etc.]

No pressure either way. Just thought it made sense.

Adam
```

- **(3 hrs)** Community engagement: seed discussions, highlight user wins, host a "community AMA"

Technical (12 hrs):
- **(6 hrs)** Feature development: build the 2-3 features most requested since launch
- **(3 hrs)** Improve analytics: add funnel visualization, cohort analysis
- **(3 hrs)** Bug fixes and performance

**THURSDAY-FRIDAY (8 hrs business / 8 hrs technical)**

Business:
- **(3 hrs)** Follow up on partnership outreach
- **(3 hrs)** Prepare Workshop #5 (for Week 12)
- **(2 hrs)** Week 11 metrics review

Technical:
- **(4 hrs)** Feature development
- **(4 hrs)** Stability and infrastructure

---

### WEEK 12: Quarter Review, Workshop #5, Next 90-Day Planning

**MONDAY-TUESDAY (10 hrs business / 8 hrs technical)**

Business:
- **(4 hrs)** Workshop #5 final prep and promotion
- **(3 hrs)** Begin 90-day retrospective document
- **(3 hrs)** Content: publish 2 articles + 1 case study

Technical:
- **(4 hrs)** Final feature push: ship anything in progress
- **(4 hrs)** Technical debt cleanup: fix the things you have been putting off

**WEDNESDAY — WORKSHOP #5 (8 hrs business / 2 hrs technical)**

- Deliver workshop. This should feel noticeably smoother than Workshop #1.
- Goal: this workshop should be "the template" — repeatable with minimal prep going forward.

**THURSDAY-FRIDAY — 90-DAY REVIEW (10 hrs business / 8 hrs technical)**

Business:
- **(6 hrs)** Complete the 90-Day Retrospective:

```
╔══════════════════════════════════════════════════════════════╗
║              90-DAY LAUNCH SPRINT RETROSPECTIVE              ║
╠══════════════════════════════════════════════════════════════╣

METRICS vs. TARGETS:

Users:
  Target: 100-500
  Actual: ___
  Assessment: ___

Activation Rate:
  Target: >70%
  Actual: ___%
  Assessment: ___

MRR:
  Target: $1,000+
  Actual: $___
  Assessment: ___

Workshops:
  Target: 5
  Actual: ___
  Average NPS: ___
  Total attendees: ___

Content:
  Blog posts published: ___
  Total organic traffic: ___
  Email list size: ___
  Top performing piece: ___

Community:
  Members: ___
  Engagement rate: ___%

═══════════════════════════════════════
CHANNEL PERFORMANCE RANKED
═══════════════════════════════════════

1. [Channel]: ___ users acquired, $___ revenue, $___  CAC
2. [Channel]: ___ users acquired, $___ revenue, $___  CAC
3. [Channel]: ___ users acquired, $___ revenue, $___  CAC
4. [Channel]: ___ users acquired, $___ revenue, $___  CAC
5. [Channel]: ___ users acquired, $___ revenue, $___  CAC

═══════════════════════════════════════
KEY LEARNINGS
═══════════════════════════════════════

What worked (double down):
1. ___
2. ___
3. ___

What didn't work (stop):
1. ___
2. ___
3. ___

What to try next (experiment):
1. ___
2. ___
3. ___

═══════════════════════════════════════
NEXT 90 DAYS — PRELIMINARY PLAN
═══════════════════════════════════════

Focus areas:
1. ___
2. ___
3. ___

Revenue target: $___/mo
User target: ___
Key initiatives:
1. ___
2. ___
3. ___
╚══════════════════════════════════════════════════════════════╝
```

- **(4 hrs)** Plan next 90 days based on retrospective findings. The plan should prioritize the top 2 performing channels and cut the bottom 2.

Technical:
- **(4 hrs)** Technical retrospective: infrastructure review, performance audit, security check
- **(4 hrs)** Plan technical roadmap for next quarter based on user demand

**WEEK 12 GO/NO-GO — FULL YEAR 1 COMMITMENT**

```
╔══════════════════════════════════════════════════════════════╗
║              QUARTER 1 → YEAR 1 COMMITMENT                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FULL COMMITMENT: Invest next 9 months if:                  ║
║  □ 100+ users                                                ║
║  □ $1,000+ MRR (or clear trajectory to $5K in 6 months)    ║
║  □ 5 workshops delivered with repeatable format              ║
║  □ At least 1 channel producing consistent signups           ║
║  □ >50% activation rate maintained                           ║
║  □ Positive unit economics (LTV > CAC)                       ║
║  □ You still enjoy doing this every day                      ║
║                                                              ║
║  CONDITIONAL: Continue with adjustments if:                  ║
║  □ 50-99 users                                               ║
║  □ $500-999 MRR                                              ║
║  □ 1-2 channels working but not yet scalable                ║
║  → Action: Narrow focus to ONLY the top channel.            ║
║    Cut everything else. Go deep, not wide.                   ║
║                                                              ║
║  PIVOT: Consider significant changes if:                     ║
║  □ <50 users after 12 weeks of active marketing             ║
║  □ <$500 MRR                                                 ║
║  □ No clear winning channel                                  ║
║  □ Activation rate <40%                                      ║
║  → Options: (a) different target market entirely,            ║
║    (b) different pricing model (usage-based, one-time),      ║
║    (c) pivot to services (workshops as the product),         ║
║    (d) find a technical co-founder and rebuild               ║
╚══════════════════════════════════════════════════════════════╝
```

---

## PARALLEL VS. SEQUENTIAL ACTIVITY MAP

### Activities That Run in Parallel (throughout all 12 weeks)

```
CONTINUOUS (every week):
├── Community management (3 hrs/wk)
├── Bug fixes (ongoing)
├── Analytics review (Friday PM)
└── Email responses / support

CAN OVERLAP:
├── Content writing ←→ Community posting (same morning)
├── Outreach emails ←→ Workshop follow-ups (batch together)
├── Feature development ←→ Bug fixes (split the day)
└── SEO articles ←→ Social posts (write in same session)
```

### Critical Path (Must Be Sequential)

```
PHASE 1 CRITICAL PATH:
Validation calls (Wk 1-2)
  → Identify top persona (end Wk 2)
    → Write workshop for that persona (Wk 3)
      → Deliver Workshop #1 (Wk 4)
        → GO/NO-GO decision (end Wk 4)

PHASE 2 CRITICAL PATH:
Workshop #1 feedback (Wk 4)
  → Landing page V2 (Wk 5)
    → Email sequences built (Wk 5-6)
      → Workshop #2 (Wk 6)
        → Content batch informed by data (Wk 7)
          → Launch prep complete (Wk 8)
            → GO/NO-GO for public launch (end Wk 8)

PHASE 3 CRITICAL PATH:
Launch assets prepared (Wk 8)
  → Public launch (Wk 9)
    → Post-launch iteration (Wk 10)
      → Scale winning channels (Wk 11-12)
        → 90-day retrospective (end Wk 12)
```

### Dependencies

```
DEPENDENCY MAP:

Landing page copy ← depends on ← Validation call insights
Workshop content ← depends on ← Top persona identification
Email sequences ← depends on ← Workshop content + tech setup
Public launch ← depends on ← 50+ users + 5+ paying
Case studies ← depends on ← Active users with results
Referral program ← depends on ← Happy users who would refer
Partnerships ← depends on ← Traction to demonstrate value
SEO content topics ← depends on ← Understanding what users search for
```

---

## POST-LAUNCH DAILY RHYTHM (Weeks 10-12 and Beyond)

```
THE FOUNDER'S DAILY SCHEDULE

7:00-8:00 AM — Morning review
  □ Check overnight signups and errors
  □ Respond to any support emails/DMs
  □ Review community activity
  □ Check analytics dashboard (2 min glance, not 30 min deep dive)

8:00-12:00 PM — Deep work block (4 hours)
  Mon: Content creation (write 1-2 articles)
  Tue: Technical work (features, bug fixes)
  Wed: Workshop prep OR outreach (alternate weeks)
  Thu: Technical work (features, bug fixes)
  Fri: Planning and metrics review

12:00-1:00 PM — Lunch + community engagement
  □ Respond to all Discord messages
  □ Engage on LinkedIn (comment on 5 posts, reply to comments)
  □ Check email

1:00-4:00 PM — Mixed work block (3 hours)
  Mon: Technical work
  Tue: Sales calls, follow-ups, outreach
  Wed: Content editing, publishing, promotion
  Thu: Community, partnerships, admin
  Fri: Retrospective, next week planning

4:00-5:00 PM — End of day
  □ Final email/message check
  □ Update to-do list for tomorrow
  □ Log daily metrics in spreadsheet

WEEKLY CADENCE:
  Monday: Content + Tech (builder day)
  Tuesday: Tech + Sales (build and sell)
  Wednesday: Workshop/Outreach + Content (external facing)
  Thursday: Tech + Community (build and nurture)
  Friday: Review + Plan (strategist day)
```

---

## THE THREE THINGS MOST LIKELY TO SLIP (AND HOW TO PREVENT THEM)

### 1. Validation Calls Get Skipped

**Why it slips**: Uncomfortable. Easy to rationalize "I'll just improve the product instead." Feels less productive than building features.

**Impact if it slips**: You launch to an audience you do not understand. Your messaging misses. Your workshop falls flat. You waste 8 weeks building the wrong thing.

**Prevention**:
- Block calendar for validation calls FIRST before anything else on Monday/Tuesday
- Set a hard rule: "No feature development until I have completed this week's validation calls"
- Minimum viable call: even a 10-minute chat counts. Lower the bar.
- Track calls in a visible spreadsheet. The number staring at you is accountability.
- If you have not done 3 calls by Wednesday of any week, drop everything else and schedule them.

### 2. Content Publishing Falls Behind

**Why it slips**: Writing is hard. Perfectionism. "I'll publish it when it's better." Other tasks feel more urgent.

**Impact if it slips**: SEO compounds over time. Every week you don't publish is organic traffic you'll never recover. By Week 12, you should have 15+ indexed pages bringing in traffic — if you skip weeks, you might have 5.

**Prevention**:
- Use the "80% done is done" rule. Publish imperfect content.
- Batch write: dedicate one 3-hour block to writing 2-3 drafts. Edit/publish on a different day.
- Keep a running list of 20 topic ideas (replenish when it drops below 10). Never be stuck on "what to write about."
- Minimum viable content: even a 500-word post with 2 screenshots is better than nothing.
- Set a non-negotiable: 2 pieces published per week minimum. Put it on the same calendar block every week.

### 3. Follow-Ups Don't Happen

**Why it slips**: Workshop is delivered, feels like the job is done. New signups happen, feels like progress. The follow-up email is "not urgent" so it gets pushed to tomorrow, then forgotten.

**Impact if it slips**: Follow-up is where conversion happens. Workshop attendees who don't get a personal follow-up within 24 hours are 5x less likely to convert. New signups who don't get a nudge within 48 hours are 3x more likely to churn before activating.

**Prevention**:
- Prepare follow-up templates in advance (already done in this plan). It should take <5 minutes per person.
- Set a rule: workshop follow-ups happen within 2 hours of the workshop ending. Block that time on the calendar.
- New signup follow-ups: batch them at 4:00 PM daily. Set an alarm.
- Use email automation for the first touchpoint (email sequences built in Week 5). Personal follow-up is for high-value contacts only.
- Track follow-up completion rate: "Did I follow up with every workshop attendee within 24 hours? Y/N." Make it a binary habit.

---

## BUDGET SUMMARY (12 Weeks)

| Category | Monthly Cost | 12-Week Total | Notes |
|---|---|---|---|
| Zoom Pro | $13 | $39 | Workshop hosting |
| Email tool (Loops/Brevo free tier) | $0 | $0 | Free up to 1K contacts |
| Analytics (PostHog free tier) | $0 | $0 | Free up to 1M events |
| Community (Discord) | $0 | $0 | Free |
| Blog (Ghost or free option) | $0-9 | $0-27 | Ghost optional |
| Loom Pro (optional) | $0-13 | $0-39 | Free tier may suffice |
| Canva (free tier) | $0 | $0 | For workshop slides |
| Domain/hosting | (already paid) | $0 | Already live |
| Ad spend | $0 | $0 | No paid ads in Phase 1-2 |
| **TOTAL** | **$13-35** | **$39-105** | Well under $100/mo |

Remaining budget ($65-487/mo) reserved for: hiring a freelance writer (Week 7+, $200-400/mo for 4-8 articles), paid tool upgrades as needed, or small promotional spend in Phase 3.

---

## LAUNCH ASSETS CHECKLIST

```
REQUIRED FOR PUBLIC LAUNCH (prepare by end of Week 8):

Written:
□ Landing page V2 copy (hero, benefits, how-it-works, pricing, FAQ)
□ Product Hunt listing (tagline, description, maker comment)
□ Launch blog post (1,000 words)
□ Launch email to list
□ 5 social media posts (LinkedIn, Twitter, community posts)
□ Press/outreach email template
□ 2-3 case studies

Visual:
□ 5 annotated product screenshots
  1. 3-step wizard
  2. Chat playground
  3. Knowledge source upload
  4. Embed widget on site
  5. Agent dashboard
□ OpenGraph image (1200x630, for social sharing)
□ Product Hunt gallery images (5-6 images, 1270x760)

Video:
□ 3-minute product demo (Loom)
□ 60-second launch trailer (optional, use Loom or Canva video)
□ Workshop replay clips (3-5 short clips, 30-60 seconds each)

Technical:
□ UTM tracking on all launch links
□ Analytics dashboard ready
□ Error monitoring active
□ Support email / chat ready
□ Help docs covering top 10 questions
```

---

This plan is designed so that every week builds on the previous one. Nothing in Week 8 requires something that was not started in Weeks 1-7. The workshops are the spine — everything else either feeds into them or extends their reach. Execute the validation calls in Weeks 1-2, and the rest of the plan falls into place. Skip them, and you are guessing for 10 weeks.

---

Now I have comprehensive data. Let me compile the full competitive intelligence appendix.

---

# COMPETITIVE INTELLIGENCE APPENDIX
## Teach Charlie AI Launch Playbook
### February 2026 Edition

---

## TABLE OF CONTENTS

1. Competitor Profiles (1-12)
2. Competitive Positioning Map
3. Emerging Threats Assessment
4. Competitive Content Strategy
5. Market Sizing
6. Master Comparison Tables

---

## SECTION 1: COMPETITOR PROFILES

---

### COMPETITOR 1: ChatGPT Custom GPTs (OpenAI)

**a. Product Overview**

ChatGPT Custom GPTs allow users to create specialized AI assistants within the ChatGPT interface. Users configure a custom GPT by providing instructions, uploading knowledge files, and optionally enabling tools (web browsing, DALL-E image generation, code interpreter). As of early 2026, GPTs run on GPT-5.2 models and can be published to a public GPT Store. OpenAI has added "Actions" -- the ability for GPTs to call external APIs -- and "Projects" for workspace collaboration. Custom GPTs remain confined to the ChatGPT interface; they cannot be embedded on external websites or integrated into business systems without API development work.

**b. Pricing**

| Plan | Price | Custom GPT Access |
|------|-------|-------------------|
| Free | $0/mo | Can USE public GPTs, cannot CREATE |
| Go | $8/mo | Can use GPTs, limited creation |
| Plus | $20/mo | Full creation + publishing, ~160 messages/3hrs on top models |
| Team | $25/user/mo | Shared workspace GPTs, admin controls |
| Enterprise | Custom | Extended context, SSO, audit logs |

Source: [ChatGPT Plans & Pricing](https://chatgpt.com/pricing), [IntuitionLabs Plan Comparison](https://intuitionlabs.ai/articles/chatgpt-plans-comparison)

**c. Target Audience**

Primarily individual knowledge workers, content creators, and professionals who already use ChatGPT daily. Skews toward tech-comfortable users aged 25-45 who want to customize their ChatGPT experience rather than build standalone applications. NOT aimed at small business owners who want to deploy customer-facing agents.

**d. Strengths vs Teach Charlie**

- Massive brand recognition: ChatGPT is synonymous with AI for most people
- Zero learning curve for existing ChatGPT users (200M+ weekly active users)
- Lowest cost entry point ($20/mo includes GPT creation plus all other ChatGPT features)
- Strongest underlying model quality (GPT-5.2)
- Built-in distribution via GPT Store (discovery/marketplace)

**e. Weaknesses vs Teach Charlie**

- Custom GPTs CANNOT be embedded on external websites or customer-facing channels
- No visual flow builder -- configuration is a single text form, not a guided process
- No educational onboarding, no metaphors, no hand-holding for non-technical users
- No multi-step agent workflows (linear prompt-response only)
- No RAG with custom knowledge bases beyond file upload (10 files max on Plus)
- No tool integrations beyond OpenAI's own tools (no Zapier, no CRM, no email)
- Message rate limits frustrate heavy business users (~160 messages/3hrs)
- No workshop or community component; learning is entirely self-directed
- Users are locked into OpenAI's ecosystem (no model choice)

**f. Market Position**

Consumer AI tool with business aspirations. Positioned as "the easiest way to customize AI" but functionally limited to personal productivity. Not a platform for building or deploying business-grade AI agents.

**g. Threat Level to Teach Charlie: MEDIUM**

Reasoning: The sheer brand awareness means some potential Teach Charlie users will try Custom GPTs first. However, they will quickly hit the limitations (no embedding, no integrations, no visual builder) and look for alternatives. The threat is that users may "settle" for a GPT rather than seeking a better tool.

**h. Defensive Strategy**

- Create an "Alternative to Custom GPTs" landing page targeting the search query "custom GPT limitations"
- Emphasize in all marketing: "Unlike Custom GPTs, Charlie agents can be embedded on your website, connected to your tools, and deployed to customers"
- Build a migration guide: "Already built a Custom GPT? Import it into Teach Charlie in 5 minutes"
- Position workshops as "What comes AFTER you've played with ChatGPT"

**i. What to Learn From Them**

- The GPT configuration screen is beautifully simple: name, instructions, conversation starters, knowledge files. Teach Charlie's 3-step wizard already follows this pattern -- validate that simplicity
- The GPT Store concept (discovery/marketplace) is worth watching. If Teach Charlie builds a template gallery, it should feel this effortless
- OpenAI's pricing at $20/mo sets the psychological anchor for "what AI costs." Teach Charlie's $19/mo Individual plan is perfectly positioned against this

**So what? Action item for Teach Charlie:** Create a comparison page titled "Teach Charlie vs Custom GPTs: When You Need More Than a Chat Window" and run Google Ads against "custom GPT alternative" and "custom GPT for business website."

---

### COMPETITOR 2: Botpress

**a. Product Overview**

Botpress is a cloud-based conversational AI platform with a visual "Agent Studio" for designing chatbot flows. It supports multi-channel deployment (web, WhatsApp, Slack, Messenger), LLM integrations, knowledge base training, and autonomous agent behaviors. Botpress has carved a niche among developer-oriented teams who want granular control over conversation logic while maintaining a visual interface. In 2025, Botpress raised a $25M Series B led by FRAMEWORK Ventures with participation from HubSpot and Deloitte.

Source: [Botpress Review 2026](https://chatimize.com/reviews/botpress/), [SalesHive Botpress Profile](https://saleshive.com/vendors/botpress/)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Pay-as-You-Go | Free ($5 AI credit/mo) | Essential tools, 1 bot, limited usage |
| Plus | $89/mo + AI usage | 25% discount on add-ons, 2 bots, 1 collaborator |
| Team | $495/mo + AI usage | Multiple bots, team features, priority support |
| Enterprise | ~$2,000+/mo | Custom, multi-year, dedicated support |

Note: All plans charge additional AI usage at provider cost. Realistic total costs typically range from $170-$400/mo even on Plus.

Source: [Botpress Pricing](https://botpress.com/pricing), [Botpress Pricing Explained](https://www.eesel.ai/blog/botpress-pricing)

**c. Target Audience**

Primarily developers and technical teams at mid-market companies building customer support chatbots. Botpress is developer-centric with APIs, SDKs, and webhook support that assume coding knowledge. Business users can use the visual builder for simple bots but will need developer support for anything complex.

**d. Strengths vs Teach Charlie**

- Multi-channel deployment out of the box (web widget, WhatsApp, Slack, Messenger, Telegram)
- More mature conversation flow designer with branching logic and conditions
- Stronger enterprise features (audit logs, RBAC, SSO)
- Larger community and ecosystem (funded, 25M+ Series B)
- Human handoff capability for live agent escalation
- Better analytics and conversation tracking

**e. Weaknesses vs Teach Charlie**

- Pricing is confusing and expensive for small businesses ($89/mo minimum + usage = $170-400/mo realistic)
- Developer-centric: the visual builder still assumes technical thinking (conditions, variables, API calls)
- No educational scaffolding -- no guided onboarding for non-technical users
- No "Dog Trainer" metaphor or friendly framing; interface uses technical terminology
- No workshop or community learning component
- The free tier's $5 credit is consumed quickly; users hit paywalls fast
- Overkill for simple AI agents (a small business owner wanting a FAQ bot does not need Botpress's complexity)

**f. Market Position**

Developer-first chatbot platform positioned between simple chatbot builders (Tidio, Chatfuel) and enterprise platforms (LivePerson, Genesys). Aims to be the "React of chatbots" -- powerful but requiring technical proficiency.

**g. Threat Level to Teach Charlie: LOW**

Reasoning: Botpress and Teach Charlie serve fundamentally different users. A non-technical small business owner will bounce off Botpress within 15 minutes. The pricing alone ($170-400/mo realistic) prices out Teach Charlie's target market. Botpress is a developer tool; Teach Charlie is an education tool.

**h. Defensive Strategy**

- Do NOT try to compete on features with Botpress. Compete on simplicity and price
- Create a comparison page: "Botpress vs Teach Charlie: Which Is Right for Non-Technical Teams?"
- Emphasize price: "$19/mo vs $170+/mo" is a powerful differentiator
- If a potential customer mentions Botpress, they may be too technical for Teach Charlie's target market (qualify accordingly)

**i. What to Learn From Them**

- Botpress's multi-channel deployment is impressive. Teach Charlie should plan web embedding first, then Slack/WhatsApp as future additions
- Their "Knowledge Base" training from URLs and documents is well-implemented. Validate Teach Charlie's RAG approach against this standard
- Botpress Academy (educational content) is solid. Teach Charlie should build similar educational content but for a non-technical audience

**So what? Action item for Teach Charlie:** Do NOT position against Botpress directly in early marketing. The audiences barely overlap. Instead, study their Knowledge Base feature and ensure Teach Charlie's RAG implementation is at least as intuitive.

---

### COMPETITOR 3: Voiceflow

**a. Product Overview**

Voiceflow is a no-code platform for building AI agents that handle customer conversations across chat and voice channels. It offers a visual flow builder for designing conversation logic, multi-agent management, LLM integrations (GPT-4, Claude), knowledge base training from documents and FAQs, and deployment on web or via telephony providers (Twilio, Vonage). Voiceflow positions itself as the tool for "product teams" building customer-facing AI experiences.

Source: [Voiceflow](https://www.voiceflow.com/), [Voiceflow Pricing](https://www.voiceflow.com/pricing)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Free | $0/mo | 50 KB sources/agent, 2 agents, 100 AI tokens/mo |
| Pro | $60/mo | 3K KB sources/agent, 20 agents, 10K tokens/mo |
| Business | $150/mo + $50/editor | 30K credits, unlimited agents, priority support |
| Enterprise | ~$1,000-2,000/mo | Unlimited credits, SSO, private cloud, SLAs |

Critical note: When you hit your monthly credit limit, your agents STOP RESPONDING until the next billing cycle. You cannot buy extra credits.

Source: [Voiceflow Pricing](https://www.voiceflow.com/pricing), [Featurebase Voiceflow Pricing](https://www.featurebase.app/blog/voiceflow-pricing)

**c. Target Audience**

Product teams and CX teams at mid-market SaaS companies building customer support automation. Voiceflow is positioned for "product people" who are comfortable with flow-based logic but not necessarily developers. More accessible than Botpress but still assumes product/design thinking.

**d. Strengths vs Teach Charlie**

- More polished visual flow builder with sophisticated conversation branching
- Voice agent support (phone, IVR) -- a capability Teach Charlie does not offer
- Stronger collaboration features for teams (version history, commenting)
- Better prototyping and testing tools built into the platform
- More established in the market with known enterprise customers

**e. Weaknesses vs Teach Charlie**

- Steep learning curve reported by users -- "not accessible enough for most folks"
- Pricing is confusing (plan tiers + editor seats + usage credits = three billing dimensions)
- Hard credit limit kills agents mid-month with no way to buy more -- catastrophic for businesses relying on the bot
- No webhook system, no native Zapier/Make integrations (requires custom glue code)
- Limited model access: free tier locked to ChatGPT only; bring-your-own-LLM is Enterprise only
- Analytics capabilities described as "minimal"
- No educational onboarding or guided learning path for beginners
- Support complaints: tickets unanswered for weeks even on Enterprise tier
- $60/mo minimum is 3x Teach Charlie's price

Source: [Voiceflow Limitations Review](https://www.gptbots.ai/blog/voiceflow-ai-review), [Botpress Voiceflow Review](https://botpress.com/blog/voiceflow-review)

**f. Market Position**

"The design tool for conversational AI" -- positioned for product teams building customer experiences. Between consumer simplicity and enterprise complexity, but leaning toward the professional/team segment.

**g. Threat Level to Teach Charlie: LOW-MEDIUM**

Reasoning: Voiceflow is more accessible than Botpress but still targets a different user (product teams, not small business owners). The pricing ($60-150/mo) and learning curve create natural barriers against Teach Charlie's target audience. The medium component comes from Voiceflow's improving marketing presence in "no-code AI agent" search results.

**h. Defensive Strategy**

- Create a comparison page targeting "Voiceflow alternative for beginners"
- Emphasize the credit limit problem: "Your AI agent will NEVER go offline mid-month with Teach Charlie"
- Position against the learning curve: "Build your first AI agent in 5 minutes, not 5 hours"
- Price anchoring: "$19/mo vs $60-150/mo with simpler pricing (no credit limits, no per-seat charges)"

**i. What to Learn From Them**

- Voiceflow's prototyping experience (test inside the builder) is excellent. Teach Charlie's Playground already does this -- make sure the experience is as smooth
- Their positioning as a "design tool" rather than a "development tool" is smart. Teach Charlie should position as a "learning tool" or "teaching tool" to occupy a different mental category entirely
- Voiceflow's content marketing (blog, comparison pages, reviews) is aggressive. They publish comparison articles about every competitor. Teach Charlie needs this same SEO playbook

**So what? Action item for Teach Charlie:** Study Voiceflow's content marketing strategy and replicate it for the non-technical audience. They dominate "alternative to X" searches. Teach Charlie should dominate "AI agent for beginners" and "AI agent for small business" searches.

---

### COMPETITOR 4: FlowiseAI

**a. Product Overview**

FlowiseAI is an open-source, low-code tool for building LLM orchestration flows and AI agents using a drag-and-drop interface based on LangChain/LlamaIndex. It supports chatflows, agent flows, RAG pipelines, 100+ integrations, and deployment via APIs/SDKs/embedded chat. FlowiseAI was acquired by Workday in August 2025, giving it enterprise backing and likely accelerating its development toward HR and finance use cases. It has 42,000+ GitHub stars and strong developer community traction.

Source: [FlowiseAI](https://flowiseai.com/), [Workday Acquires Flowise](https://www.prnewswire.com/news-releases/workday-acquires-flowise-bringing-powerful-ai-agent-builder-capabilities-to-the-workday-platform-302530557.html)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Open Source | Free | Self-hosted, full features, community support |
| Starter (Cloud) | $35/mo | Hosted, basic features |
| Pro (Cloud) | $65/mo | Hosted, advanced features |
| Enterprise | Custom | On-prem, SSO, SLA, Workday integration |

Note: Self-hosted is genuinely free (unlike some "open source" competitors). Cloud plans are for convenience.

Source: [FlowiseAI Pricing via Lindy](https://www.lindy.ai/blog/flowise-pricing), [FlowiseAI via Elest.io](https://elest.io/open-source/flowiseai/resources/plans-and-pricing)

**c. Target Audience**

Developers and technical users who want to build AI applications with a visual interface. The Workday acquisition may shift this toward enterprise HR/finance teams. Self-hosting appeals to privacy-conscious organizations and developers who want full control. NOT aimed at non-technical users.

**d. Strengths vs Teach Charlie**

- Truly open source with massive community (42K+ GitHub stars)
- 100+ integrations and components available
- Self-hosting option for data privacy
- Backed by Workday (enterprise credibility and resources)
- Lower cloud pricing ($35-65/mo) with free self-hosted option
- More flexible architecture (supports any LLM, any vector store)

**e. Weaknesses vs Teach Charlie**

- Developer-oriented: drag-and-drop interface still uses technical concepts (chains, agents, embeddings, vector stores)
- No educational layer: assumes users understand LLM concepts
- No guided onboarding or wizard -- users face a blank canvas
- Self-hosting requires DevOps knowledge (Docker, server management)
- UI is functional but not polished or beginner-friendly
- No workshop or community learning component
- Documentation is technical and assumes prior knowledge
- Post-Workday acquisition, development may pivot toward enterprise HR/finance, moving AWAY from the SMB market

**f. Market Position**

Open-source developer tool for AI agent building. Post-Workday acquisition, likely pivoting toward enterprise HR/finance vertical. Positioned as the "open source alternative to closed platforms."

**g. Threat Level to Teach Charlie: LOW**

Reasoning: FlowiseAI serves a fundamentally different user. The Workday acquisition will likely pull it further into the enterprise segment. A non-technical small business owner will not self-host FlowiseAI or understand its node-based interface. The technical barrier is the strongest natural moat.

**h. Defensive Strategy**

- If asked "why not just use Flowise?", the answer is: "Teach Charlie IS built on technology like Flowise (we use Langflow, its peer). We're the friendly layer on top."
- Monitor the Workday integration to see if they build simplified UX for non-technical HR users -- that could become a reference for Teach Charlie's approach
- The $35/mo cloud pricing could be referenced in marketing: "Even simpler tools cost $35/mo. Teach Charlie starts at $19/mo with guided onboarding included."

**i. What to Learn From Them**

- Flowise's component library (100+ integrations) shows what's possible with LangChain. Teach Charlie should track which integrations its users request most
- The Workday acquisition validates the market: enterprise players are buying AI agent builders. This is tailwind for the entire category
- Flowise's embed widget is well-implemented and could be a reference for Teach Charlie's embed feature

**So what? Action item for Teach Charlie:** Use the Workday acquisition as a talking point: "The world's biggest companies are building AI agent tools for their employees. Teach Charlie brings that same capability to small businesses -- without needing an IT department."

---

### COMPETITOR 5: Langflow (The Underlying Engine)

**a. Product Overview**

Langflow is the open-source, visual flow builder that Teach Charlie is built on. It provides a node-based canvas for creating AI workflows and agents, supporting all major LLMs, vector databases, and a growing library of tools. Langflow was acquired by DataStax in April 2024, and IBM subsequently announced its acquisition of DataStax in February 2025. Langflow provides both a visual authoring experience and built-in API/MCP servers. It is vendor-agnostic and supports RAG, multi-agent, and tool-calling patterns.

Source: [Langflow GitHub](https://github.com/langflow-ai/langflow), [DataStax Langflow](https://www.datastax.com/products/langflow), [IBM Acquires DataStax](https://newsroom.ibm.com/2025-02-25-ibm-to-acquire-datastax,-deepening-watsonx-capabilities-and-addressing-generative-ai-data-needs-for-the-enterprise)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Open Source | Free | Self-hosted, full features |
| DataStax Cloud | Free tier available | Hosted, managed infrastructure |
| Enterprise (via IBM) | Custom | IBM watsonx integration, enterprise support |

Actual costs: Infrastructure (hosting) + LLM API usage + vector database costs. The software itself is free.

Source: [DataStax Langflow](https://www.datastax.com/products/langflow), [Langflow Pricing via Lindy](https://www.lindy.ai/blog/langflow-pricing)

**c. Target Audience**

Developers, data scientists, and AI engineers who want a visual tool for building LLM applications. Post-IBM acquisition, increasingly targeting enterprise AI teams using the watsonx ecosystem. The open-source community includes hobbyists, startups, and mid-market companies.

**d. Strengths vs Teach Charlie**

- Langflow IS Teach Charlie's engine -- it has every technical capability Teach Charlie has, plus more
- Completely free and open source
- Massive and growing community
- IBM/DataStax enterprise backing and resources
- Vendor-agnostic (any LLM, any vector DB, any tool)
- MCP server support (emerging standard for AI tool integration)
- Active development with frequent releases

**e. Weaknesses vs Teach Charlie**

- This is the most important competitive analysis in this entire document. Langflow's weaknesses ARE Teach Charlie's reason for existing:
  - **No educational layer**: Langflow presents a blank canvas with nodes like "OpenAI," "Prompt," "Chat Input" -- meaningless to a non-technical user
  - **No guided onboarding**: No wizard, no presets, no "tell me about your business" flow
  - **Technical terminology throughout**: "System Prompt" not "Charlie's Job Description," "Temperature" not "Creativity"
  - **No workshop component**: No structured learning, no community, no guided tours
  - **No friendly metaphor**: Nodes and edges, not dogs and tricks
  - **No preset templates for business use cases**: Users start from scratch
  - **Intimidating interface**: The node-based canvas scares non-technical users
  - **No billing/subscription management**: Users must manage their own infrastructure
  - **No avatar system, no gamification, no missions**: Pure utility, no delight

**f. Market Position**

Open-source developer infrastructure for AI application building. Post-IBM acquisition, positioned as part of the watsonx enterprise AI platform. Langflow will increasingly target enterprise developers, moving AWAY from consumer/SMB simplicity.

**g. Threat Level to Teach Charlie: MEDIUM-HIGH**

Reasoning: This is the platform dependency risk, not a competitive threat per se. The threat is:
1. IBM could make changes to Langflow that break Teach Charlie's wrapper
2. Langflow could build its own "simple mode" that reduces the need for Teach Charlie's educational layer
3. IBM could restrict certain features to paid enterprise tiers

However, the open-source license means Teach Charlie can always fork if needed. The IBM acquisition actually REDUCES the threat of Langflow building a consumer-friendly layer -- IBM will push it toward enterprise, not SMB.

**h. Defensive Strategy**

- CRITICAL: Monitor every Langflow release for breaking changes. Subscribe to the GitHub releases feed
- Minimize deep Langflow modifications (already the strategy per CLAUDE.md)
- Maintain the ability to fork Langflow if IBM makes hostile changes
- Build value above and beyond Langflow: the educational layer, workshops, community, and brand must be so strong that users come for "Teach Charlie" not for "Langflow with a wrapper"
- Consider contributing to Langflow open source to maintain influence in the project direction

**i. What to Learn From Them**

- Langflow's MCP server support is cutting-edge. Teach Charlie should ensure MCP integration is surfaced simply for users
- The DataStax/IBM ecosystem provides enterprise credibility. If Teach Charlie ever targets larger customers, the IBM backing can be a selling point ("Powered by IBM-backed technology")
- Langflow's component marketplace concept could inspire a "Charlie Template Store" where users share agent configurations

**So what? Action item for Teach Charlie:** The IBM acquisition of DataStax/Langflow is the single most important strategic development to monitor. Assign a quarterly review to assess: (1) Has Langflow's open-source license changed? (2) Are new features being gated behind enterprise tiers? (3) Has IBM built a "simplified mode" that competes with Teach Charlie's value proposition? If any answer is "yes," accelerate the fork contingency plan.

---

### COMPETITOR 6: Zapier AI Agents

**a. Product Overview**

Zapier AI Agents (formerly Zapier Central) allow users to create AI-powered "teammates" that operate across Zapier's 7,000+ app integrations. Users configure agents with prompts, set rules, and grant access to company data so agents can automate work across connected apps. Agents can perform actions like web browsing, reviewing data, and triggering Zapier automations. Each action counts as an "activity" against monthly limits.

Source: [Zapier Agents](https://zapier.com/agents), [Zapier Agents Guide](https://zapier.com/blog/zapier-agents-guide/)

**b. Pricing**

| Plan | Price | Agent Activities |
|------|-------|-----------------|
| Free | $0/mo | 400 activities/mo, max 10 autonomous actions |
| Pro | Included with Zapier plans ($29.99+/mo) | 1,500 activities/mo |
| Team | $103.50/mo | Higher limits |
| Enterprise | Custom | Custom limits |

Note: Zapier Agents is an add-on to the core Zapier platform. Users need a Zapier subscription to access agents with higher limits.

Source: [Zapier Agents Pricing](https://zapier.com/l/agents-pricing), [Zapier Pricing](https://zapier.com/pricing)

**c. Target Audience**

Existing Zapier users who want to add AI capabilities to their automation workflows. Primarily operations managers, marketing managers, and small business owners who already use Zapier for task automation. The target is "the person who already has 10 Zaps running."

**d. Strengths vs Teach Charlie**

- 7,000+ app integrations (the largest ecosystem by far)
- Massive existing user base (millions of Zapier users)
- Familiar brand trusted by small businesses
- Agents can take REAL actions (send emails, update CRM, create tasks) not just chat
- Seamless integration with existing Zapier workflows
- Trusted brand name in the no-code space

**e. Weaknesses vs Teach Charlie**

- NOT an AI agent builder -- it's an automation tool with AI layered on top
- No visual flow builder for conversation design
- No embeddable chat widget for customer-facing deployment
- No educational scaffolding or guided onboarding for AI concepts
- Activity-based pricing is confusing and can be expensive for agent-heavy use
- Agents are limited to Zapier's ecosystem -- cannot build standalone AI experiences
- No knowledge base or RAG capability
- No "teach your agent" metaphor -- purely task-oriented automation
- Free tier limits agents to 10 autonomous actions before requiring human confirmation (defeats the purpose)

**f. Market Position**

AI-enhanced automation platform. Zapier is positioned as "the glue between your apps" with AI agents as a feature, not the product. They are adding AI to an existing automation platform, not building an AI-first agent platform.

**g. Threat Level to Teach Charlie: MEDIUM**

Reasoning: Zapier's brand recognition with small business owners is significant. If a small business owner googles "AI agent for my business," Zapier will appear prominently. The threat is not that Zapier does what Teach Charlie does -- it does not -- but that users may not know the difference and default to the familiar brand. However, Zapier's agents are fundamentally about automation, not about building conversational AI experiences.

**h. Defensive Strategy**

- Create content positioning the difference: "Zapier AI Agents automate your WORKFLOWS. Teach Charlie builds AI ASSISTANTS your customers can talk to."
- Target the "Zapier power user" who wants to go beyond automation: "Love Zapier? Now build the AI agent that talks to your customers."
- Emphasize the chat/conversation element that Zapier lacks
- Consider a future Zapier integration for Teach Charlie agents (connect Charlie agents to Zapier's 7,000 apps)

**i. What to Learn From Them**

- Zapier's onboarding for non-technical users is industry-leading. Study their signup flow, first-run experience, and educational content
- Their "Recommended Zaps" (pre-built templates for common use cases) is exactly the model for Teach Charlie's agent presets
- Zapier's pricing page is a masterclass in communicating value tiers. Study the layout
- Their blog content strategy (guides, tutorials, templates) drives massive organic traffic

**So what? Action item for Teach Charlie:** Build a Zapier integration page that shows how Teach Charlie agents can TRIGGER Zapier workflows. This turns a competitor into a partner and captures users who search for "Zapier + AI agent." The headline: "Your AI agent handles the conversation. Zapier handles the action."

---

### COMPETITOR 7: Microsoft Copilot Studio

**a. Product Overview**

Microsoft Copilot Studio is an enterprise platform for building custom AI agents (called "copilots") that integrate with Microsoft 365, Dynamics 365, and the broader Microsoft ecosystem. It offers a visual conversation designer, integration with Microsoft Graph (emails, chats, documents, meetings), Power Automate workflow connections, and deployment across Teams, web, and other channels. In December 2025, Microsoft launched "Copilot for Business" at $18/user/mo specifically targeting small and medium businesses.

Source: [Copilot Studio Pricing](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio), [Copilot for Small Business](https://www.microsoft.com/en-us/microsoft-365/blog/2025/12/02/microsoft-365-copilot-business-the-future-of-work-for-small-businesses/)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Copilot for Business | $18/user/mo | AI assistant in M365 apps, basic agent creation |
| Copilot for M365 | $30/user/mo | Full Copilot in all M365 apps |
| Copilot Studio Credits | $200/pack/mo | 25,000 credits per pack |
| Pay-as-You-Go | Variable | No upfront commitment |

Critical note: Only ~3% of M365 users (15M out of 450M) have opted to pay for Copilot, indicating significant adoption hesitation driven by unclear ROI.

Source: [Copilot Studio Licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), [Copilot Adoption ROI](https://petri.com/microsoft-copilot-adoption-roi/)

**c. Target Audience**

Enterprise IT teams and Microsoft-centric organizations. Requires Microsoft 365 subscription as a prerequisite. The new "Copilot for Business" tier targets SMBs, but only those already committed to the Microsoft ecosystem.

**d. Strengths vs Teach Charlie**

- Deep Microsoft 365 integration (emails, documents, Teams, SharePoint)
- Enterprise-grade security, compliance, and governance
- Microsoft's brand trust and existing relationships with millions of businesses
- Power Automate integration for complex workflows
- Natural language agent creation (describe what you want)
- $18/user/mo SMB tier is competitively priced

**e. Weaknesses vs Teach Charlie**

- Requires Microsoft 365 ecosystem -- useless for businesses not on Microsoft
- $200/mo minimum for Copilot Studio credits is expensive for small businesses
- Complex licensing model confuses buyers (Copilot vs Copilot Studio vs M365 licenses)
- Only 3% adoption rate suggests the product is not delivering clear value
- No educational framework or guided learning path
- No friendly metaphors -- uses Microsoft corporate terminology
- Not designed for building customer-facing AI agents (focused on internal productivity)
- No workshop or community component
- Governance and compliance overhead adds friction, not speed
- Cannot be embedded on external (non-Microsoft) websites easily

**f. Market Position**

Enterprise productivity AI. Copilot Studio is positioned as part of the Microsoft enterprise platform play -- "AI for your organization" rather than "AI agents for your customers." It is a platform feature, not a standalone product.

**g. Threat Level to Teach Charlie: LOW**

Reasoning: Microsoft and Teach Charlie are targeting entirely different use cases. Copilot Studio builds internal productivity agents for enterprise teams. Teach Charlie builds educational, customer-facing AI agents for small businesses. The ecosystem lock-in, pricing complexity, and enterprise focus create insurmountable barriers for Teach Charlie's target users. A 50-year-old small business owner in a workshop is not going to spin up Copilot Studio.

**h. Defensive Strategy**

- Do NOT position against Microsoft directly -- the brand is too large and the audience too different
- If asked "why not use Copilot?", respond: "Copilot helps YOUR team work faster. Teach Charlie builds an AI assistant your CUSTOMERS can talk to."
- Target the Microsoft-frustrated SMB: "No enterprise IT department? No Microsoft 365? No problem."

**i. What to Learn From Them**

- Microsoft's natural language agent creation ("describe what you want") is an aspirational UX. Teach Charlie's 3-step wizard is the non-technical equivalent
- The $18/user/mo "Copilot for Business" price point validates that SMBs will pay $15-25/mo for AI tools. Teach Charlie's $19/mo is perfectly positioned
- Microsoft's struggle with adoption (3%) despite brand power shows that even the biggest company in the world cannot make AI adoption effortless. This validates Teach Charlie's educational approach

**So what? Action item for Teach Charlie:** Use the 3% Copilot adoption stat in marketing: "Microsoft spent billions on AI, and 97% of their users haven't adopted it yet. Why? Because technology without education is just expensive software. Teach Charlie is AI education first."

---

### COMPETITOR 8: Google Vertex AI Agent Builder

**a. Product Overview**

Google Vertex AI Agent Builder is a cloud-based platform within Google Cloud for building AI agents powered by Gemini models. It supports conversational agents, search agents, and multi-turn dialogue with grounding in enterprise data. Agent Builder includes session memory, tool governance, code interpreter, and integration with Google Cloud services. It requires a Google Cloud account and assumes familiarity with cloud infrastructure concepts.

Source: [Vertex AI Agent Builder](https://cloud.google.com/agent-builder/release-notes), [Vertex AI Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)

**b. Pricing**

| Component | Price |
|-----------|-------|
| Agent Engine Runtime | $0.00994/vCPU-hour + $0.0105/GiB-hour |
| Session Events/Memories | $0.25/1,000 events (from Jan 2026) |
| Model Usage | Variable by model (Gemini 1.5 Pro, Flash, etc.) |
| Free Trial | $300 credit for 90 days |
| Express Mode | Free (limited: 10 agent engines, 90 days) |

This is pure consumption-based pricing with no fixed tiers. Monthly costs are unpredictable and scale with usage.

Source: [Vertex AI Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing), [Vertex AI Pricing via Lindy](https://www.lindy.ai/blog/vertex-ai-pricing)

**c. Target Audience**

Cloud engineers, ML engineers, and enterprise development teams already using Google Cloud. Requires Google Cloud account, billing setup, and understanding of cloud infrastructure. NOT for non-technical users.

**d. Strengths vs Teach Charlie**

- Powered by Google's Gemini models (state-of-the-art)
- Deep integration with Google Cloud services (BigQuery, Cloud Storage, etc.)
- Enterprise-grade infrastructure and scalability
- Advanced features: tool governance, code interpreter, secure browser
- $300 free trial credit for experimentation

**e. Weaknesses vs Teach Charlie**

- Requires Google Cloud account and billing setup (credit card required)
- Consumption-based pricing makes costs completely unpredictable
- Cloud infrastructure knowledge assumed (IAM, VPCs, service accounts)
- No visual flow builder for non-technical users
- No educational scaffolding whatsoever
- Documentation is dense technical reference material
- Vendor lock-in to Google Cloud ecosystem
- No community or workshop component
- Enterprise sales process for any real support

**f. Market Position**

Enterprise cloud infrastructure for AI agents. Positioned as part of Google Cloud's AI platform, targeting organizations already invested in GCP. This is infrastructure, not a product.

**g. Threat Level to Teach Charlie: VERY LOW**

Reasoning: The Google Cloud requirement alone eliminates 99% of Teach Charlie's target audience. A non-technical small business owner will never encounter Vertex AI Agent Builder, let alone use it. Zero audience overlap.

**h. Defensive Strategy**

- No direct defensive action needed. These are entirely different markets
- If a technical prospect asks why not Vertex AI, the answer is: "Vertex AI is for Google Cloud engineers. Teach Charlie is for small business owners who want results in 5 minutes."

**i. What to Learn From Them**

- Google's "Express Mode" (free, limited, no billing required) is an interesting onboarding pattern. Teach Charlie's free tier serves the same purpose
- The session memory feature ($0.25/1000 events) shows that memory/context is becoming a standard feature. Ensure Teach Charlie's multi-turn chat memory is prominently marketed

**So what? Action item for Teach Charlie:** No direct competitive action needed. Monitor Vertex AI for feature ideas (tool governance, code interpreter) that could be simplified and added to Teach Charlie in future phases.

---

### COMPETITOR 9: Amazon Bedrock Agents

**a. Product Overview**

Amazon Bedrock Agents (now part of AgentCore) is AWS's platform for building, deploying, and operating AI agents at enterprise scale. It provides intelligent memory, a gateway for secure tool/data access, and enterprise-grade security with dynamic scaling. Services include Runtime, Gateway, Policy, Identity, Memory, Observability, Evaluations, Browser, and Code Interpreter -- all independently usable. Agents can access foundation models from Anthropic, Meta, Amazon (Nova), Mistral, and others.

Source: [Amazon Bedrock](https://aws.amazon.com/bedrock/), [Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/)

**b. Pricing**

| Component | Price |
|-----------|-------|
| Foundation Models | Per-token, varies by model |
| AgentCore Runtime | Per-second CPU + memory billing |
| No minimum fees | Pay only for what you use |

Pricing is entirely consumption-based with per-second billing for compute resources. No fixed plans. Requires AWS account with billing enabled.

Source: [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/), [Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/)

**c. Target Audience**

Enterprise development teams on AWS. Requires AWS account, IAM configuration, and cloud development expertise. Target users are ML engineers, backend developers, and enterprise architects.

**d. Strengths vs Teach Charlie**

- Multi-model access (Claude, Llama, Nova, Mistral, etc.)
- Enterprise-grade security, compliance, and scalability
- AWS ecosystem integration (S3, Lambda, DynamoDB, etc.)
- Advanced agentic capabilities (browser, code interpreter, tool orchestration)
- Consumption-based pricing means no waste

**e. Weaknesses vs Teach Charlie**

- Requires AWS account and cloud infrastructure knowledge
- No visual builder for non-technical users
- No educational scaffolding or guided onboarding
- Consumption-based pricing is unpredictable and opaque
- Documentation is dense AWS-style technical reference
- No community learning or workshops
- Enterprise sales process for support
- Building even a simple agent requires cloud development skills

**f. Market Position**

Enterprise cloud infrastructure for AI agents. Part of AWS's AI/ML platform play. This is infrastructure for developers, not a product for business users.

**g. Threat Level to Teach Charlie: VERY LOW**

Reasoning: Identical to Google Vertex AI -- different universe. AWS Bedrock serves enterprise cloud developers. Teach Charlie serves non-technical small business owners. Zero audience overlap.

**h. Defensive Strategy**

- No direct action needed. If asked, position as: "Bedrock is the engine room. Teach Charlie is the steering wheel."

**i. What to Learn From Them**

- Bedrock's multi-model approach (choose any foundation model) validates Teach Charlie's strategy of not being locked to one LLM provider
- The "per-second billing" model is increasingly standard for AI infrastructure. Teach Charlie's flat-rate $19/mo pricing is a MASSIVE advantage for SMBs who need cost predictability

**So what? Action item for Teach Charlie:** Use the complexity of cloud pricing as a marketing lever: "With AWS Bedrock, you need a cloud engineer and a spreadsheet to estimate costs. With Teach Charlie, it's $19/month. Period."

---

### COMPETITOR 10: Relevance AI

**a. Product Overview**

Relevance AI is a multi-agent AI platform for building "AI workforces" -- teams of agents that collaborate on tasks like sales, support, and operations. It offers 9,000+ app integrations, multi-agent orchestration, knowledge base management, and scheduling capabilities. The platform is positioned for businesses wanting to automate entire workflows with multiple coordinating agents, not just single chatbots.

Source: [Relevance AI](https://relevanceai.com/), [Relevance AI Review](https://reply.io/blog/relevance-ai-review/)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Free | $0/mo | 1,000 vendor credits, 200 actions/mo |
| Pro | $19/mo | 10K credits, 2,500 runs/mo, 100MB knowledge |
| Team | $199/mo | 100K credits, 33K runs/mo, 1GB knowledge |
| Business | $349/mo | Higher limits, meeting agents, priority support |
| Enterprise | Custom | Custom everything |

Note: Credits split into "Actions" (what agents do) and "Vendor Credits" (AI model costs) as of September 2025, making pricing more complex.

Source: [Relevance AI Pricing](https://relevanceai.com/pricing), [Relevance AI Pricing via Lindy](https://www.lindy.ai/blog/relevance-ai-pricing)

**c. Target Audience**

Sales teams, marketing teams, and operations managers at growing businesses (50-500 employees). Particularly strong in sales automation (lead enrichment, outreach sequences, CRM updates). More technically capable than Teach Charlie's audience but not developers.

**d. Strengths vs Teach Charlie**

- Multi-agent orchestration (agents collaborating with each other) is more advanced
- 9,000+ integrations dwarf Teach Charlie's current integration count
- Pro plan at $19/mo is IDENTICAL to Teach Charlie's pricing -- direct price competition
- Stronger in sales/marketing automation use cases
- More mature platform with established customer base
- Credit-based system allows flexible scaling

**e. Weaknesses vs Teach Charlie**

- Credit system is confusing (Actions vs Vendor Credits, with different rates per tier)
- No educational layer or guided onboarding for complete beginners
- Designed for teams who already understand what AI agents can do
- No workshop or community learning component
- Free tier is very limited (200 actions/mo)
- Interface assumes familiarity with automation concepts (triggers, actions, data mapping)
- No "Dog Trainer" or friendly metaphor -- corporate SaaS language throughout
- Focused on sales/marketing automation, not general-purpose AI agent building

**f. Market Position**

"AI Workforce" platform for business teams. Positioned between simple chatbot builders and enterprise automation platforms, targeting the sales/marketing tech buyer who wants AI-powered automation.

**g. Threat Level to Teach Charlie: MEDIUM**

Reasoning: Relevance AI is the closest direct competitor in terms of pricing ($19/mo Pro) and target audience (business users, not developers). The threat is that a potential Teach Charlie customer who does a Google search will find Relevance AI and its more mature feature set. However, Relevance AI targets a more sophisticated user who already understands AI agents, while Teach Charlie targets beginners learning for the first time.

**h. Defensive Strategy**

- CRITICAL: Monitor Relevance AI closely. They are the most directly competitive at the same price point
- Differentiate on the EDUCATION axis: "Relevance AI assumes you already know AI. Teach Charlie teaches you AI."
- Target the pre-Relevance customer: users who are not yet ready for Relevance AI's complexity
- Position as the on-ramp: "Start with Teach Charlie to learn. Graduate to Relevance AI when you're ready to scale."
- Create a comparison page emphasizing simplicity and the learning journey

**i. What to Learn From Them**

- Their $19/mo Pro plan validates Teach Charlie's price point for this market segment
- The multi-agent orchestration concept could inspire future Teach Charlie features
- Their 9,000+ integration count sets expectations. Teach Charlie should emphasize quality of key integrations over quantity
- Relevance AI's credit-based system is being criticized as confusing. Teach Charlie should NEVER adopt usage-based pricing -- flat rate is a competitive advantage

**So what? Action item for Teach Charlie:** Create a "Relevance AI vs Teach Charlie" comparison page focusing on the distinction between "tool for AI-savvy teams" vs "learning platform for AI beginners." Also, ensure Teach Charlie's $19/mo plan includes enough value to compete feature-for-feature at that price point.

---

### COMPETITOR 11: Stack AI

**a. Product Overview**

Stack AI is an enterprise-focused AI agent building platform with a drag-and-drop interface. It supports knowledge base integration (SharePoint, Confluence, Notion, Google Drive), deployment as chat assistants or APIs, and enterprise security features (SSO, RBAC, audit logs, PII masking, SOC2/HIPAA/GDPR compliance). Stack AI can route across multiple LLMs (OpenAI, Anthropic, Google, local models) with guardrails and evaluations.

Source: [Stack AI](https://www.stack-ai.com/pricing), [Stack AI Review](https://sitegpt.ai/blog/stack-ai-review)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Free | $0/mo | 500 runs/mo, 2 projects, 1 seat, community support |
| Starter | $199/mo | 2,000 runs/mo, 5 projects, 2 seats |
| Enterprise | Custom | Everything, on-prem, VPC, SOC2/HIPAA |

Note: There is a massive gap between Free ($0) and Starter ($199). No $19-50/mo mid-tier exists.

Source: [Stack AI Pricing](https://www.stack-ai.com/pricing)

**c. Target Audience**

Enterprise IT teams and large organizations requiring compliance (healthcare, finance, government). The pricing structure ($0 to $199 with nothing in between) clearly signals enterprise focus. NOT for small businesses.

**d. Strengths vs Teach Charlie**

- Enterprise compliance (SOC2, HIPAA, GDPR) -- essential for regulated industries
- On-premise deployment option
- Multi-LLM routing with guardrails
- Knowledge base integration with enterprise tools (SharePoint, Confluence)
- More sophisticated evaluation and testing capabilities

**e. Weaknesses vs Teach Charlie**

- $199/mo minimum for any paid plan -- 10x Teach Charlie's price
- Enterprise-focused: interface and terminology designed for IT professionals
- No educational layer or guided onboarding
- No mid-market tier (huge gap between free and $199)
- No workshop or community component
- No friendly metaphors or non-technical language
- Free tier limited to 500 runs and 2 projects
- Compliance overhead adds friction for small businesses that don't need it

**f. Market Position**

Enterprise AI agent platform. Positioned for organizations with compliance requirements and dedicated IT teams. Not competing in the SMB or consumer space.

**g. Threat Level to Teach Charlie: VERY LOW**

Reasoning: Stack AI serves enterprises with compliance needs. Teach Charlie serves non-technical small business owners. $199/mo vs $19/mo is a 10x price difference targeting entirely different buyers. No audience overlap.

**h. Defensive Strategy**

- No direct action needed. Different market segment
- If a prospect needs SOC2/HIPAA, they are not a Teach Charlie customer (refer them to Stack AI or similar)

**i. What to Learn From Them**

- Stack AI's knowledge base integration with enterprise tools (SharePoint, Confluence) shows what mature knowledge management looks like. Simplify these concepts for Teach Charlie's RAG feature
- Their free tier (500 runs, 2 projects) is a reasonable benchmark. Teach Charlie's free tier should be at least this generous

**So what? Action item for Teach Charlie:** Stack AI validates the enterprise segment of the AI agent market. Teach Charlie should NOT chase this segment. Instead, use it to reinforce positioning: "We built Teach Charlie for everyone who doesn't have an enterprise IT department."

---

### COMPETITOR 12: Dify.ai

**a. Product Overview**

Dify.ai is an open-source platform for building generative AI applications with a visual workflow builder, RAG engine, agent orchestration, and 50+ built-in tools. It supports multiple LLM APIs (OpenAI, Anthropic, Meta, Azure, Hugging Face) and offers both self-hosted and cloud deployment. Dify emphasizes the full AI application lifecycle: from prototyping to production. It is free for students and educators. Dify has strong traction in Asia and is growing rapidly in Western markets.

Source: [Dify.ai](https://dify.ai/), [Dify GitHub](https://github.com/langgenius/dify), [Dify AI Review](https://www.gptbots.ai/blog/dify-ai)

**b. Pricing**

| Plan | Price | Key Inclusions |
|------|-------|----------------|
| Sandbox | Free | Limited calls, basic features |
| Professional | $59/workspace/mo | For indie devs and small teams |
| Team | $159/workspace/mo | All Professional features + more |
| Enterprise | $6,000-20,000+ setup | On-prem, custom, compliance |

Note: Free for students and educators (an interesting policy for an educational tool to compete against).

Source: [Dify Pricing](https://dify.ai/pricing), [Dify Pricing Guide](https://miichisoft.com/en/dify-chatbot-pricing-guide-from-implementation/)

**c. Target Audience**

Developers and technical product teams building AI applications. The open-source option attracts self-hosting enthusiasts and startups. The cloud plans target small-to-medium development teams. NOT positioned for non-technical end users.

**d. Strengths vs Teach Charlie**

- Open source with active community (GitHub trending frequently)
- Full AI application lifecycle (not just agents, but full apps)
- RAG engine is highly regarded
- 50+ built-in tools for agents
- Multi-LLM support
- Free for students/educators
- Self-hosting option
- More flexible architecture for complex use cases

**e. Weaknesses vs Teach Charlie**

- Developer-oriented: visual builder still uses technical concepts (workflows, APIs, embeddings)
- $59/mo minimum for Professional plan (3x Teach Charlie's price)
- No educational scaffolding or guided onboarding
- No friendly metaphors or non-technical language
- No workshop or community learning component
- Interface intimidates non-technical users
- Enterprise pricing ($6K-20K+ setup) is out of reach for SMBs
- Documentation assumes development knowledge

**f. Market Position**

Open-source AI application development platform. Positioned for developers who want flexibility and control, with cloud convenience available at premium pricing. Between Langflow (visual builder) and building from scratch (code).

**g. Threat Level to Teach Charlie: LOW**

Reasoning: Dify is developer-focused and priced 3x higher than Teach Charlie for the lowest paid tier. The open-source option requires self-hosting skills. However, Dify's growing popularity and AI application framing (not just agents) could make it visible in searches where Teach Charlie wants to appear. The "free for educators" policy is a minor competitive consideration.

**h. Defensive Strategy**

- Monitor Dify's "free for educators" program -- if they build educational features, this could become a threat
- Create content targeting "Dify alternative for non-coders"
- Emphasize price: "$19/mo vs $59/mo" and simplicity: "No coding required"
- If users mention Dify, they may be more technical than Teach Charlie's target audience

**i. What to Learn From Them**

- Dify's RAG engine is well-regarded. Benchmark Teach Charlie's RAG implementation against it
- The "free for educators" policy is clever for building community. Consider a Teach Charlie program for workshop facilitators or educators
- Dify's workflow builder has good UX patterns for node-based editing. Study their visual design

**So what? Action item for Teach Charlie:** Implement a "Teach Charlie for Educators" program offering free or discounted access to workshop facilitators and AI educators. This directly counters Dify's "free for students/educators" and builds the workshop community.

---

## SECTION 2: COMPETITIVE POSITIONING MAP

### 2x2 Matrix: Technical Complexity vs Target User

```
                    ENTERPRISE / LARGE ORG
                           |
    Microsoft              |           Google Vertex AI
    Copilot Studio         |           Amazon Bedrock
         *                 |              * *
                           |
    Stack AI *             |
                           |
                           |
    Botpress *   Dify *    |    Langflow *
                           |
    Voiceflow *            |
                           |
SIMPLE -------|------------|------------|-------- COMPLEX
              |            |            |
              |            |
    Zapier AI *            |
              |            |
    Relevance AI *         |   FlowiseAI *
              |            |
              |            |
   ** TEACH CHARLIE **     |
   (WHITE SPACE)           |
              |            |
    ChatGPT   |            |
    Custom GPTs *          |
              |            |
                           |
                    CONSUMER / SMB
```

### White Space Analysis

Teach Charlie occupies the **lower-left quadrant** -- simple tools for consumers/SMBs -- but with a critical differentiator that NO other competitor has:

**THE EDUCATION LAYER**

The map reveals that the lower-left quadrant (simple + SMB) is actually quite sparse:
- **ChatGPT Custom GPTs** are simpler but are NOT agent builders -- they are chat configurations trapped inside ChatGPT
- **Zapier AI Agents** are simple-ish but are automation tools, not conversational AI builders
- **Relevance AI** is close but targets more sophisticated business users

**The true white space is: "AI agent builder for people who need to LEARN what an AI agent is before they build one."**

No competitor occupies this space because:
1. Enterprise tools assume technical knowledge
2. Developer tools assume coding ability
3. Consumer tools (Custom GPTs) are too limited to be "agent builders"
4. No competitor offers workshops, guided learning, or educational metaphors

Teach Charlie's position is not just a quadrant -- it is a unique CATEGORY: **the educational AI agent builder**.

---

## SECTION 3: EMERGING THREATS (Next 6-12 Months)

### 3.1 Major Tech Company Threats

| Threat | Timeline | Probability | Impact |
|--------|----------|-------------|--------|
| OpenAI launches "GPT Builder Pro" with embedding/deployment | 6-12 months | HIGH | HIGH |
| Google launches simplified Agent Builder for Workspace users | 6-12 months | MEDIUM | MEDIUM |
| Apple enters AI agent space via Siri/Shortcuts | 12+ months | LOW | LOW |
| Meta launches open-source agent builder for WhatsApp Business | 6-12 months | MEDIUM | MEDIUM |

**Most dangerous near-term threat:** OpenAI adding embedding/deployment capabilities to Custom GPTs. If ChatGPT Plus users can embed their GPTs on websites, Teach Charlie loses a key differentiator. However, OpenAI is unlikely to add educational onboarding or workshops.

### 3.2 No-Code Platforms Adding AI Agents

| Platform | Status | Risk to Teach Charlie |
|----------|--------|----------------------|
| Airtable | Already has AI features, may add agents | MEDIUM |
| Notion | Notion AI expanding rapidly | LOW-MEDIUM |
| Wix/Squarespace | Adding AI chat to website builders | MEDIUM |
| HubSpot | AI agents for CRM are coming | LOW (different audience) |
| Canva | AI features expanding, unlikely agents | LOW |

**Most dangerous mid-term threat:** Website builders (Wix, Squarespace, WordPress) adding embedded AI chat agents. Small business owners already use these platforms. If Wix says "Add an AI chat agent to your website in 2 clicks," that directly competes with Teach Charlie's embed widget.

### 3.3 EdTech Companies Entering the Space

| Potential Entrant | Why They Might Enter | Risk |
|-------------------|---------------------|------|
| Udemy/Coursera | Already offering AI agent courses | MEDIUM |
| Codecademy | Could add hands-on AI agent building | LOW-MEDIUM |
| AI Academy | Already running AI Agent Bootcamps | MEDIUM |
| No Code platforms (Bubble, Adalo) | Could add AI agent templates | LOW |

Source: [AI Agent Bootcamp](https://www.ai-academy.com/courses/ai-agent-bootcamp), [Udemy No-Code AI Agents Course](https://www.udemy.com/course/no-code-ai-agents/)

**Key insight:** The boundary between "AI education" and "AI tool" is blurring. An EdTech company that offers a course on building AI agents AND gives students a tool to build them is a direct Teach Charlie competitor. The Udemy course "AI Agents For All!" already teaches non-technical users to build agents with Flowise.

### 3.4 Open Source Projects Gaining Traction

| Project | GitHub Stars | Risk |
|---------|-------------|------|
| CrewAI | Growing fast | LOW (developer-focused) |
| AutoGen (Microsoft) | Growing fast | LOW (developer-focused) |
| n8n (with AI nodes) | 50K+ stars | MEDIUM (adding AI agent capabilities) |
| OpenWebUI | Growing fast | LOW (chat interface, not agent builder) |

**Most dangerous open-source threat:** n8n. It is a visual workflow builder (like Zapier but open source) that is adding AI agent capabilities. It targets a similar technical comfort level as Zapier users and has strong small business adoption. If n8n builds a simple "AI agent" node, it could attract the same "Zapier power user" audience that Teach Charlie targets.

### Defensive Posture for Emerging Threats

1. **Speed is the defense.** Teach Charlie must build brand recognition and community loyalty BEFORE major platforms add simple AI agent features. The window is 6-18 months.
2. **Workshops are the moat.** No tech company will run in-person workshops teaching small business owners to build AI agents. This is Teach Charlie's deepest competitive moat.
3. **Community is the lock-in.** Users who learn AI through Teach Charlie workshops, earn missions, and are part of a community will not switch to a Wix chat widget.
4. **Brand is the differentiator.** "Charlie" the dog, the trainer metaphor, the friendly language -- these create emotional connection that no enterprise tool can replicate.

---

## SECTION 4: COMPETITIVE CONTENT STRATEGY

### 4.1 Comparison Pages (Prioritized)

Create these pages in this order, based on search volume and audience overlap:

| Priority | Page Title | Target Keyword | Reasoning |
|----------|-----------|----------------|-----------|
| 1 | "Teach Charlie vs ChatGPT Custom GPTs" | "custom GPT alternative" | Highest search volume, largest audience overlap |
| 2 | "Teach Charlie vs Zapier AI Agents" | "zapier AI agent alternative" | Strong SMB brand, similar audience |
| 3 | "Teach Charlie vs Relevance AI" | "relevance AI alternative" | Direct price competitor, same segment |
| 4 | "Teach Charlie vs Voiceflow" | "voiceflow alternative for beginners" | Appears in AI agent builder searches |
| 5 | "Teach Charlie vs Botpress" | "botpress alternative simple" | Developer searchers may find Charlie |
| 6 | "Best AI Agent Builder for Small Business 2026" | "AI agent builder small business" | Category page, not comparison |
| 7 | "Best AI Agent Builder for Non-Technical Users" | "no code AI agent builder easy" | Core positioning page |

### 4.2 "Alternative to X" Keyword Opportunities

| Keyword | Monthly Search Volume (est.) | Competition | Teach Charlie Fit |
|---------|------------------------------|-------------|-------------------|
| "chatgpt alternative for business" | High (10K+) | High | Good |
| "custom GPT alternative" | Medium (1-5K) | Medium | Excellent |
| "zapier AI agent alternative" | Medium (1-5K) | Low | Good |
| "voiceflow alternative" | Medium (1-5K) | Medium | Good |
| "botpress alternative" | Medium (1-5K) | Medium | Moderate |
| "AI agent builder for beginners" | Medium (1-5K) | Low | Excellent |
| "AI agent builder no code" | High (5-10K) | High | Good |
| "how to build AI agent no coding" | Medium (1-5K) | Low | Excellent |
| "AI agent for my business" | Medium (1-5K) | Low | Excellent |
| "simple AI chatbot builder" | Medium (1-5K) | Medium | Good |

### 4.3 Competitor Weaknesses to Highlight in Marketing

These should be communicated through feature comparisons and customer stories, not negative advertising:

| Competitor | Weakness to Highlight | Marketing Angle |
|------------|----------------------|-----------------|
| ChatGPT Custom GPTs | Cannot embed on website | "Deploy your AI agent anywhere, not just inside ChatGPT" |
| Botpress | Too complex, too expensive | "Build your first AI agent in 5 minutes for $19/mo" |
| Voiceflow | Credit limits kill agents | "Your AI agent never goes offline" |
| Zapier AI Agents | Not a real agent builder | "More than automation -- build AI assistants that talk to your customers" |
| Microsoft Copilot | 97% of users haven't adopted it | "AI without the learning curve" |
| All developer tools | Require coding knowledge | "No code. No jargon. No PhD required." |
| All enterprise tools | $200-2,000+/month | "$19/month. That's it." |

### 4.4 Review and Listing Sites

Get Teach Charlie listed on these platforms, in priority order:

| Platform | Priority | Action |
|----------|----------|--------|
| Product Hunt | 1 (Highest) | Launch campaign, aim for #1 Product of the Day |
| G2 | 2 | Create vendor profile, solicit early reviews from workshop attendees |
| Capterra | 3 | Create listing, target "AI Agent Builder" category |
| Alternativeto.net | 4 | List as alternative to ChatGPT, Botpress, Voiceflow |
| SourceForge | 5 | Create listing (lower priority but free) |
| TrustRadius | 6 | Create profile |
| AI Agent Lists (aiagentslist.com) | 7 | Submit for review |
| Lindy Blog | 8 | Pitch for inclusion in "Best AI Agent Builders" roundups |
| Marketer Milk | 9 | Pitch for review (they review AI tools for marketers) |
| No-Code Finder | 10 | List in AI agent directory |

Source: [Product Hunt AI Agents](https://www.producthunt.com/categories/ai-agents), [Lindy Best AI Agent Builders](https://www.lindy.ai/blog/best-ai-agent-builders)

---

## SECTION 5: MARKET SIZING

### Total Addressable Market (TAM)

**AI Agents Market (Global)**
- 2025: $7.63 billion
- 2026: $10.91 billion (projected)
- 2030: $52.62 billion (projected)
- 2034: $236.03 billion (projected)
- CAGR: 45-50%

Source: [Grand View Research AI Agents Market](https://www.grandviewresearch.com/industry-analysis/ai-agents-market-report), [Precedence Research](https://www.precedenceresearch.com/ai-agents-market), [MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/ai-agents-market-15761548.html)

### Serviceable Addressable Market (SAM)

**Non-technical users who want simple AI agents for business**

Calculation:
- 33.2 million small businesses in the US (SBA data)
- 68% now use AI regularly (QuickBooks 2025 survey)
- = 22.6 million AI-using small businesses
- Estimated 15% would consider a dedicated AI agent builder tool (not just ChatGPT)
- = 3.39 million potential customers in the US alone
- At $19/mo average revenue per user: **$773 million annual SAM**

Source: [Small Business AI Statistics](https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/), [AI for Small Businesses](https://thrivethemes.com/ai-for-small-businesses-key-stats/)

Additional context: 82% of the smallest SMBs (under 5 employees) say AI "isn't applicable to their business" -- an EDUCATION problem, not an applicability problem. This is exactly the gap Teach Charlie fills.

### Serviceable Obtainable Market (SOM)

**Realistic Year 1-3 capture for Teach Charlie**

| Year | Target Customers | Revenue (est.) | Reasoning |
|------|-----------------|----------------|-----------|
| Year 1 | 200-500 | $45K-114K ARR | Workshop attendees + organic, 5% conversion, $19/mo avg |
| Year 2 | 1,000-3,000 | $228K-684K ARR | Content marketing + referrals + expanded workshops |
| Year 3 | 5,000-15,000 | $1.14M-3.42M ARR | SEO momentum + partnerships + word-of-mouth |

Assumptions:
- Year 1 is primarily workshop-driven (50-100 attendees per workshop, 5-10 workshops, 5-10% conversion to paid)
- Year 2 adds organic search traffic and referral growth
- Year 3 assumes product-market fit and viral mechanics (template sharing, embed widgets creating awareness)

### Market Growth Context

The AI education market is also growing rapidly:
- Global AI education market: $7.57 billion in 2025, projected to exceed $112 billion by 2034
- AI agent courses for non-coders are proliferating (Udemy, Coursera, AI Academy)
- 71.4% of surveyed businesses actively use AI in some capacity

Source: [AI Education Market](https://www.eklavvya.com/blog/ai-edtech-tools/), [AI Adoption Statistics](https://www.warmly.ai/p/blog/ai-agents-statistics)

---

## SECTION 6: MASTER COMPARISON TABLES

### Table A: Feature Comparison

| Feature | Teach Charlie | Custom GPTs | Botpress | Voiceflow | FlowiseAI | Langflow | Zapier AI | Copilot Studio | Relevance AI | Dify.ai |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Visual Flow Builder | Yes | No | Yes | Yes | Yes | Yes | No | Yes | Partial | Yes |
| No-Code Friendly | YES | Partial | No | Partial | No | No | Yes | Partial | Partial | No |
| Educational Onboarding | YES | No | No | No | No | No | No | No | No | No |
| Guided Wizard | YES | No | No | No | No | No | No | No | No | No |
| Friendly Metaphors | YES | No | No | No | No | No | No | No | No | No |
| Website Embed | Yes | No | Yes | Yes | Yes | Yes | No | Limited | Yes | Yes |
| Multi-LLM Support | Yes | OpenAI only | Yes | Limited | Yes | Yes | Limited | Microsoft only | Yes | Yes |
| RAG/Knowledge Base | Yes | Limited | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes |
| Workshop/Community | YES | No | No | No | No | Community | No | No | No | Community |
| Agent Presets/Templates | YES (8) | No | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Partial |
| Multi-Channel Deploy | Future | No | Yes | Yes | Partial | Partial | Yes | Yes | Yes | Partial |
| Open Source | Langflow core | No | Partial | No | Yes | Yes | No | No | No | Yes |

### Table B: Pricing Comparison (Lowest Paid Tier)

| Platform | Free Tier | Lowest Paid | Mid Tier | Enterprise |
|----------|-----------|-------------|----------|------------|
| **Teach Charlie** | **Yes** | **$19/mo** | **Custom** | **Custom** |
| ChatGPT Custom GPTs | Use only | $20/mo (Plus) | $25/user/mo | Custom |
| Botpress | $5 credit/mo | $89/mo + usage | $495/mo + usage | ~$2,000/mo |
| Voiceflow | 100 tokens/mo | $60/mo | $150/mo + seats | ~$1,500/mo |
| FlowiseAI | Self-hosted | $35/mo | $65/mo | Custom |
| Langflow | Self-hosted | Free cloud tier | N/A | Custom (IBM) |
| Zapier AI Agents | 400 activities | $29.99/mo (core) | $103.50/mo | Custom |
| Copilot Studio | N/A | $18/user/mo | $200/pack/mo | Custom |
| Relevance AI | 200 actions/mo | $19/mo | $199/mo | $349+/mo |
| Stack AI | 500 runs/mo | $199/mo | N/A | Custom |
| Dify.ai | Sandbox | $59/mo | $159/mo | $6,000+ setup |

**Key pricing insight:** At $19/mo, Teach Charlie ties with Relevance AI for the most affordable paid plan among dedicated AI agent builders. This is a strong competitive position. The closest alternatives are ChatGPT ($20/mo, but limited), FlowiseAI Cloud ($35/mo), and Voiceflow ($60/mo).

### Table C: Threat Level Summary

| Competitor | Threat Level | Primary Reason |
|------------|:---:|----------------|
| ChatGPT Custom GPTs | MEDIUM | Brand awareness could siphon early-stage users |
| Botpress | LOW | Different audience (developers), 5-10x price |
| Voiceflow | LOW-MEDIUM | Appears in same search results, but steeper and more expensive |
| FlowiseAI | LOW | Developer tool, Workday acquisition pulling enterprise |
| Langflow | MEDIUM-HIGH | Platform dependency risk, not competitive threat |
| Zapier AI Agents | MEDIUM | Brand trust with SMBs, appears in same searches |
| Microsoft Copilot Studio | LOW | Enterprise focus, ecosystem lock-in |
| Google Vertex AI | VERY LOW | Cloud infrastructure, no audience overlap |
| Amazon Bedrock | VERY LOW | Cloud infrastructure, no audience overlap |
| Relevance AI | MEDIUM | Direct price competitor, same segment |
| Stack AI | VERY LOW | Enterprise-only, 10x price |
| Dify.ai | LOW | Developer-focused, 3x price |

---

## SECTION 7: STRATEGIC SUMMARY AND PRIORITY ACTIONS

### Top 10 Competitive Actions (Ranked by Impact)

1. **Create 3 comparison landing pages** (vs Custom GPTs, vs Zapier AI, vs Relevance AI) -- target the highest-overlap searches. Deadline: Before launch.

2. **Launch on Product Hunt** -- Aim for #1 Product of the Day in AI category. Coordinate with workshop attendees for upvotes. Deadline: Week of launch.

3. **Build a "Teach Charlie for Educators" program** -- Free or discounted access for workshop facilitators, coding bootcamp instructors, and SMB consultants. This counters Dify's "free for educators" and builds the workshop flywheel.

4. **Monitor Langflow releases monthly** -- IBM/DataStax acquisition is the single biggest strategic variable. Set a quarterly review cadence for: license changes, feature gating, simplified mode development.

5. **Dominate "AI agent for beginners" search intent** -- Publish 10 SEO-optimized articles targeting non-technical AI agent queries. Content titles: "How to Build Your First AI Agent (No Coding)", "What Is an AI Agent? A Small Business Owner's Guide", "AI Agent vs Chatbot: What's the Difference?"

6. **Get listed on G2 and Capterra** -- Create vendor profiles, solicit 10+ reviews from workshop attendees within 30 days of launch.

7. **Build a Zapier integration** -- Turn the competitor into a distribution channel. "Your Charlie agent + Zapier's 7,000 apps = unstoppable automation."

8. **Use competitor pricing complexity as a marketing weapon** -- Create a "Pricing Comparison" page showing Teach Charlie's flat $19/mo against Botpress's $170-400/mo, Voiceflow's credit limits, and enterprise tools' $200+/mo.

9. **Run workshops as the primary moat-building activity** -- No competitor offers structured, in-person learning for AI agent building. Every workshop attendee becomes a brand ambassador. Target: 1 workshop per month for Year 1.

10. **Prepare a Langflow fork contingency plan** -- Document exactly what Teach Charlie depends on in Langflow, which version is pinned, and what would need to change in a fork scenario. This is insurance against the IBM acquisition going sideways.

---

### The Definitive Competitive Position Statement

> "Teach Charlie is the ONLY AI agent builder designed for people who need to learn what an AI agent is before they can build one. While ChatGPT gives you a text box, Voiceflow gives you a flow chart, and Langflow gives you a node canvas, Teach Charlie gives you a friendly dog named Charlie and a 3-step wizard that turns 'I have no idea what AI can do' into a working AI agent in 5 minutes. At $19/month, it costs less than a Chipotle habit and more than pays for itself when your AI agent handles its first customer question at 2 AM."

---

*Appendix compiled February 2026. All pricing and feature data sourced from public websites and should be verified at time of use. Market data from Grand View Research, Precedence Research, MarketsandMarkets, McKinsey, and SBA.*

**Sources:**
- [ChatGPT Plans & Pricing](https://chatgpt.com/pricing)
- [Botpress Pricing](https://botpress.com/pricing)
- [Voiceflow Pricing](https://www.voiceflow.com/pricing)
- [FlowiseAI](https://flowiseai.com/)
- [Langflow GitHub](https://github.com/langflow-ai/langflow)
- [DataStax Langflow](https://www.datastax.com/products/langflow)
- [Zapier Agents Pricing](https://zapier.com/l/agents-pricing)
- [Microsoft Copilot Studio Pricing](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio)
- [Google Vertex AI Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Amazon Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [Relevance AI Pricing](https://relevanceai.com/pricing)
- [Stack AI Pricing](https://www.stack-ai.com/pricing)
- [Dify.ai Pricing](https://dify.ai/pricing)
- [Grand View Research AI Agents Market](https://www.grandviewresearch.com/industry-analysis/ai-agents-market-report)
- [Precedence Research AI Agents Market](https://www.precedenceresearch.com/ai-agents-market)
- [MarketsandMarkets AI Agents](https://www.marketsandmarkets.com/Market-Reports/ai-agents-market-15761548.html)
- [Small Business AI Statistics](https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/)
- [AI Adoption 2026](https://www.thesmallbusinessexpo.com/blog/ai-adoption-in-2026/)
- [Workday Acquires Flowise](https://www.prnewswire.com/news-releases/workday-acquires-flowise-bringing-powerful-ai-agent-builder-capabilities-to-the-workday-platform-302530557.html)
- [IBM Acquires DataStax](https://newsroom.ibm.com/2025-02-25-ibm-to-acquire-datastax,-deepening-watsonx-capabilities-and-addressing-generative-ai-data-needs-for-the-enterprise)
- [Copilot Adoption ROI Issues](https://petri.com/microsoft-copilot-adoption-roi/)
- [Product Hunt AI Agents Category](https://www.producthunt.com/categories/ai-agents)
- [No-Code AI Agent Builders 2026](https://budibase.com/blog/ai-agents/no-code-ai-agent-builders/)
- [AI Education Conferences 2026](https://www.panoramaed.com/blog/ai-in-education-conferences-2026)
- [IntuitionLabs ChatGPT Plans](https://intuitionlabs.ai/articles/chatgpt-plans-comparison)
- [Botpress Review - Chatimize](https://chatimize.com/reviews/botpress/)
- [Voiceflow Limitations - GPTBots](https://www.gptbots.ai/blog/voiceflow-ai-review)
- [Relevance AI Review - Reply.io](https://reply.io/blog/relevance-ai-review/)
- [Stack AI Review - SiteGPT](https://sitegpt.ai/blog/stack-ai-review)
- [Dify AI Review - GPTBots](https://www.gptbots.ai/blog/dify-ai)
