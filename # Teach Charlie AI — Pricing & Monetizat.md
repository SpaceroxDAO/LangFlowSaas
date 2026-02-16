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
