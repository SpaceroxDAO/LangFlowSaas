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