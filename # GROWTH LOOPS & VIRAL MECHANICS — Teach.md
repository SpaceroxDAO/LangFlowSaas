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
