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