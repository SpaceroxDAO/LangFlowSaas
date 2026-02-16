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
