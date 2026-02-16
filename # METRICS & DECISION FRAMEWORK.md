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

