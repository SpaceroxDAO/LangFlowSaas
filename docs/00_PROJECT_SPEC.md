# Project Specification: Teach Charlie AI

**Last Updated**: 2026-01-24
**Status**: MVP Complete (Phase 13) - Production Ready
**Owner**: Adam (Founder)

## Overview

### Project Name
**Teach Charlie AI** - "Fisher-Price" AI Agent Builder for Non-Technical Teams

### Description
An educational AI agent builder platform that uses a "Dog Trainer" metaphor to demystify AI for non-technical users. Built on Langflow, Teach Charlie AI combines live workshops with a simplified SaaS platform that teaches users AI fundamentals while helping them build production-ready agents. The platform is designed for library workshops, small businesses, and non-technical teams who want to leverage AI without learning code.

### Core Value Proposition
> "We're not innovating on Langflow - we're packaging it brilliantly for a market that's desperate to learn."

The differentiation is **enablement and adoption**, not technical innovation. Leverage a 10-year track record of selling no-code automation to non-technical users, combined with in-person workshop delivery, to create a learning platform with real-world results.

### Target Users

#### Primary Personas

**1. Sarah - Small Business Owner**
- Age: 35-50
- Business: Local retail shop or service business
- Pain: Overwhelmed by customer inquiries, can't afford full-time support staff
- Goal: Build a customer support chatbot to handle FAQs and basic inquiries
- Technical level: Can use Shopify/Squarespace, but "not a coder"
- Trigger: Business growth, can't keep up with demand

**2. Marcus - Marketing Manager**
- Age: 28-40
- Company: Mid-size B2B company (10-100 employees)
- Pain: Manual lead qualification wastes sales team's time
- Goal: Create a lead qualification agent to score and route inquiries
- Technical level: Expert in HubSpot/Salesforce, but technical tools intimidate him
- Trigger: Saw competitor using AI, FOMO

**3. Jessica - Workshop Attendee**
- Age: 22-60 (wide range)
- Context: Attended local library or community workshop on AI
- Pain: Curious about AI, but existing tools are too complex or expensive
- Goal: Learn AI fundamentals, build something simple to understand the concepts
- Technical level: Varies - from complete beginners to some tech literacy
- Trigger: Curiosity, career development, staying relevant

#### Secondary Personas
- HR/Ops teams at enterprises (need internal knowledge assistants)
- Content creators (need help generating social posts, emails)
- Educators (want to teach AI to their students)

## Goals and Success Criteria

### Primary Goals
1. **Launch MVP within 1-2 months** that's stable enough to use in live workshops
2. **Achieve 100-500 users in Year 1** (MVP validation phase)
3. **Validate freemium business model** with paying customers and positive MRR trajectory
4. **Prove the education-first approach works** by running successful workshops that convert to platform users

### Success Metrics

#### Launch Criteria (Definition of "Done")
- ✅ Platform is stable enough to run a live workshop without embarrassing failures
- ✅ 3-step Q&A onboarding works reliably
- ✅ Playground chat interface allows users to test agents
- ✅ Basic agent persistence (save/load)
- ✅ 5-10 beta testers successfully onboarded

#### User Success Metrics (First 90 Days)
- **Activation**: % of signups who create their first agent (target: >70%)
- **Engagement**: % of users who test agent in playground (target: >50%)
- **Retention**: % of users who return 3+ times (target: >30%)
- **Growth**: User invitations (team sharing)

#### Business Metrics (Year 1)
- **Signups**: 100-500 total users
- **Activation Rate**: >70% (users who complete first agent)
- **Paying Customers**: TBD based on freemium conversion
- **MRR**: Target $5K-$25K by end of Year 1
- **Workshop Completion**: Run at least 5 successful workshops

#### Technical Metrics
- **Page Load**: < 2 seconds (first contentful paint)
- **Agent Response**: < 3 seconds (LLM response time in playground)
- **Canvas Interactions**: < 100ms (drag nodes, connect wires)
- **Uptime**: Best effort (no SLA for MVP), but minimize downtime

## Core Features

### Must Have (MVP - Launch Blockers) - ALL COMPLETE ✅
- [x] **3-Step Q&A Onboarding**
  - Modal walkthrough asking: "Who is Charlie? What's his job? What are his rules? What tricks does he know?"
  - Simple, conversational language (no technical jargon)
  - Collect user inputs, map to template flow
  - **8 agent presets** for quick start

- [x] **Playground (Chat Interface)**
  - Test created agent in a working chat interface
  - See agent responses in real-time (streaming)
  - Multi-turn conversation memory
  - Tool execution support

- [x] **Agent Persistence**
  - Save created agents to database
  - Load agents for editing or testing
  - **JSON export/import** for backup
  - **Duplicate** agents with one click

- [x] **Template Mapping Engine**
  - Backend logic to convert Q&A answers into Langflow flow
  - Map user text to predefined agent templates
  - Generate working flow without user seeing nodes (initially)

### Should Have (Phase 2) - ALL COMPLETE ✅
- [x] **Flow Canvas "Unlock"**
  - After testing in playground, users can "unlock" and see the real Langflow flow
  - Edit nodes directly for advanced customization
  - **4 progressive disclosure levels** (hidden → preview → limited → full)

- [x] **Clerk Authentication**
  - Clerk JWT validation on all endpoints
  - User management, signup/login
  - **Dev Mode** for local testing without auth

- [x] **Pre-Built Agent Templates Library**
  - 8 default presets: Customer Support, Sales, Knowledge Base, Creative Writing, Data Analyst, Code Review, Meeting Facilitator, Learning Coach
  - Users can start from preset instead of blank slate
  - Presets auto-populate wizard fields

- [x] **Avatar System**
  - Auto-inference from 40+ job types
  - Three-tier generation (known job → description → base)
  - Displayed in playground and agent cards

### Implemented Beyond Original Scope ✅
- [x] **Knowledge Sources (RAG)**
  - Text paste, file upload (PDF/TXT/MD/DOCX/CSV), URL fetch
  - Keyword-based search with relevance scoring
  - Content chunking for large documents

- [x] **Embeddable Chat Widget**
  - JavaScript snippet to embed agent on external websites
  - Customizable appearance (colors, branding)
  - Public chat endpoint with embed tokens

- [x] **Composio Integrations (500+ Apps)**
  - OAuth connections to Gmail, Slack, Notion, and 500+ more
  - Action execution from agents
  - Connection management UI

- [x] **Billing & Subscriptions**
  - Stripe integration for payments
  - Free/Pro/Team plan tiers
  - Usage tracking and credit limits
  - Billing portal for subscription management

- [x] **Analytics Dashboard**
  - Conversation metrics and counts
  - Daily aggregated statistics
  - Agent usage tracking

- [x] **Mission-Based Learning System**
  - Gamified guided tours
  - Step-by-step mission completion
  - XP rewards and achievements (UI ready)

- [x] **Custom Langflow Components**
  - Publish agents to Langflow sidebar
  - Auto-generated Python component files
  - Hot reload after publish

- [x] **MCP Server Management**
  - Create/configure Model Context Protocol servers
  - Health monitoring
  - Sync to .mcp.json configuration

- [x] **Three-Tab Project Organization**
  - Agents, Workflows, MCP Servers tabs
  - Project-based organization
  - Drag-to-reorder support

### Future (V3+) - Deferred
- [ ] **Multi-Tenant Organizations**
  - Organizations with multiple users/seats
  - Role-based access (admin, member)
  - Team collaboration features

- [ ] **Version History / Rollback**
  - See previous versions of agent configuration
  - Revert changes if something breaks

- [ ] **Slack/Discord Integrations**
  - Deploy agents directly to messaging platforms
  - Real-time bot responses

- [ ] **Mobile Optimization**
  - Responsive design for mobile devices
  - Touch-friendly interface

## Out of Scope (For MVP) - Updated 2026-01-24

**Still Deferred** (not building yet):
- Mobile app or mobile-optimized web UI (desktop-only)
- Direct Slack/Discord bot deployment (agents work via embed widget instead)
- Multi-language support (English only)
- White-label or agency features
- SSO / Enterprise authentication
- WCAG AA accessibility compliance (basic accessibility only)
- Service level agreements (SLAs) or guaranteed uptime
- Multi-tenant organizations with teams

**Now Implemented** (moved from out of scope):
- ~~Integrations with external platforms~~ → Composio provides 500+ OAuth integrations
- ~~Advanced analytics or usage dashboards~~ → Analytics dashboard implemented
- ~~Custom node creation or Langflow plugin system~~ → Custom component publishing works

## User Journeys

### Primary Journey: First-Time User (Workshop Attendee)

1. **Workshop Introduction (Live)**
   - Adam explains AI using "Dog Trainer" metaphor
   - Attendees see live demo of creating an agent
   - Excitement builds, attendees want to try it themselves

2. **Signup**
   - Attendees go to Teach Charlie AI website
   - Sign up with email (Clerk/Supabase auth)
   - Minimal friction, fast onboarding

3. **3-Step Q&A Onboarding**
   - **Step 1**: "Who is Charlie? What kind of job does he have?"
     - Example: "Charlie is a customer support agent for a bakery."
   - **Step 2**: "What are the rules to his job? What does he need to know about?"
     - Example: "Charlie should be friendly and helpful. He knows our hours (9-5) and our menu (cookies, cakes, pastries)."
   - **Step 3**: "What tricks does Charlie need to know? Does he need to fetch information?"
     - Example: "Charlie should be able to answer questions about our products and take orders."

4. **Playground Testing**
   - System generates agent flow in background (using template mapping)
   - User lands in playground chat interface
   - Interacts with their new agent: "Hi Charlie, what are your hours?"
   - Agent responds correctly, user feels success

5. **Unlock Flow (Optional)**
   - User clicks "See how Charlie works" or "Edit Charlie's brain"
   - Langflow canvas appears, showing the nodes and connections
   - User sees the "magic" behind the scenes, gains deeper understanding

6. **Save & Iterate**
   - User saves agent, comes back later to refine
   - Retention: User returns 3+ times to improve or build new agents

### Secondary Journey: Small Business Owner (Self-Serve)

1. **Discovery**
   - Sarah Googles "AI chatbot for small business" or "how to build AI agent"
   - Finds Teach Charlie AI through content marketing (blog post, YouTube video)

2. **Landing Page**
   - Clear value prop: "Learn AI by training your own Charlie"
   - Free tier available, no credit card required
   - CTA: "Create Your First Agent"

3. **Signup & Onboarding**
   - Same 3-step Q&A as workshop attendees
   - No workshop context, so platform provides helpful tooltips and examples

4. **Test & Deploy (Future)**
   - Sarah tests agent in playground, satisfied it works
   - Wants to deploy to her website (embeddable widget - V2 feature)
   - Upgrades to Pro plan to unlock deployment

## Technical Requirements

### Technology Stack

**Frontend**
- **Language**: JavaScript (React)
- **Framework**: React + React Flow (inherit from Langflow)
- **State Management**: Consider adding Zustand or Jotai for multi-tenancy state
- **UI Components**: Stick with Langflow's existing components, minimal custom UI library
- **Build Tool**: Vite or Webpack (whatever Langflow uses)

**Backend**
- **Language**: Python
- **Framework**: FastAPI (Langflow's backend)
- **ORM**: SQLAlchemy or Langflow's existing database layer
- **Task Queue**: (Future) Celery or similar for async jobs

**Database**
- **Primary**: PostgreSQL (migrate from Langflow's SQLite)
- **Vector DB**: pgvector extension (for future RAG/knowledge features)
- **Caching**: (Future) Redis for session management

**Authentication**
- **Provider**: Clerk (recommended) or Supabase Auth
- **Features**: Email/password, Google OAuth, org/team management

**Hosting & Infrastructure**
- **Platform**: DataStax (Langflow hosting blueprint)
- **Containers**: Docker Compose (PostgreSQL + pgvector + Langflow)
- **CI/CD**: (Future) GitHub Actions for automated deployments

**External Services**
- **LLM Providers**: Inherit Langflow's multi-provider support (OpenAI, Anthropic, open-source models)
- **Payment Processing**: Stripe (for freemium subscriptions)
- **Email**: SendGrid or Resend (transactional emails)
- **Analytics**: PostHog or Mixpanel (track user behavior)
- **Error Tracking**: Sentry or Rollbar (minimal for MVP)

### Performance Requirements
- Page load (initial): < 2 seconds
- Agent response time (playground): < 3 seconds (depends on LLM provider)
- Flow canvas interactions (drag, connect): < 100ms (instant feel)
- API response times: < 500ms for most endpoints
- Database query optimization: Index frequently queried fields (user_id, org_id, agent_id)

### Security Requirements
- [x] **Authentication**: All routes require auth (except landing page, signup)
- [x] **Multi-Tenancy Isolation**: Users can only access agents within their org
- [x] **Secrets Management**: Environment variables for API keys, never commit to git
- [x] **Data Encryption**: Use HTTPS for all traffic, encrypt sensitive data at rest
- [x] **Input Validation**: Sanitize user inputs to prevent XSS, SQL injection
- [x] **Rate Limiting**: Prevent abuse of LLM API calls (cost control)
- [ ] **Audit Logging**: (Future) Track critical actions for debugging and compliance

### Compatibility Requirements
- **Browsers**: Modern desktop browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Devices**: Desktop-only (no mobile optimization for MVP)
- **Operating Systems**: Platform-agnostic (web-based)
- **Screen Resolution**: Optimized for 1280x720 and above

## Constraints and Dependencies

### Hard Constraints

**Technical Constraints**
- **Must fork Langflow** (non-negotiable) - deep UI customization required for educational layer
- **Must use DataStax hosting** - leveraging Langflow's deployment blueprint
- **Must support multiple LLM providers** - inherit Langflow's provider flexibility

**Team Constraints**
- **Solo founder** (non-technical) - relying on Claude Code for all development
- **AI-assisted development** - Adam has "some experience" with prototyping using AI tools
- **Budget**: $100-$500/month for infrastructure and services

**Timeline Constraints**
- **Target Launch**: 1-2 months (ASAP)
- **Definition of Done**: Stable enough to run a workshop

**Budget Constraints**
- $100-$500/month for hosting, auth, tools
- Must prioritize free tiers and open-source tools
- Defer expensive services (enterprise analytics, advanced monitoring) to post-MVP

### External Dependencies

**Critical Dependencies**
- **Langflow**: Upstream changes could break fork (risk: medium)
  - Mitigation: Pin Langflow version, selectively merge upstream updates
- **LLM APIs**: OpenAI, Anthropic, or other providers (risk: low)
  - Mitigation: Multi-provider support, allow users to bring their own API keys
- **DataStax Hosting**: Infrastructure reliability (risk: low)
  - Mitigation: DataStax is stable, but have backup plan (AWS, GCP)

**Nice-to-Have Dependencies**
- Stripe (payment processing) - only needed when monetizing
- SendGrid/Resend (email) - can defer until post-MVP
- PostHog/Mixpanel (analytics) - helpful but not critical

## Risks and Assumptions

### Assumptions

**Market Assumptions**
- ✅ Non-technical people CAN learn AI (Adam has 10 years of evidence selling no-code tools)
- ✅ Dog/trainer metaphor resonates and simplifies AI concepts (needs validation in workshops)
- ✅ People will pay for education + tool combo (freemium model, needs validation)
- ⚠️ Workshop attendees convert to platform users (hypothesis to test)

**Technical Assumptions**
- ⚠️ **Forking Langflow is manageable** (might be more complex than expected)
- ⚠️ **AI-assisted development can build this** (biggest risk - non-technical founder)
- ✅ Template mapping (Q&A → Flow) is feasible (backend logic, not too hard)
- ✅ DataStax hosting is reliable and scalable (low risk)

**Business Assumptions**
- ✅ User acquisition via workshops is viable (Adam's strength)
- ⚠️ Pricing strategy will work (freemium, need to find willingness-to-pay)
- ⚠️ Users can be acquired cheaply (content marketing, viral growth)

### Known Risks

**Critical Risks**

1. **Technical Risk: Multi-Tenancy Implementation**
   - **Risk**: Isolating orgs, preventing data leaks, managing seats is complex
   - **Impact**: High (security/privacy breach would be catastrophic)
   - **Mitigation**: Defer multi-tenancy to Phase 2, start with single-user agents for MVP

2. **Technical Risk: Non-Technical Founder Building with AI**
   - **Risk**: Project complexity exceeds AI-assisted development capabilities
   - **Impact**: High (could fail to launch)
   - **Mitigation**:
     - Simplify MVP aggressively (cut scope ruthlessly)
     - Hire technical contractor if blocked
     - Extend timeline if needed (1-2 months is aspirational)

3. **Market Risk: User Acquisition**
   - **Risk**: Can't acquire users cheaply, workshop model doesn't scale
   - **Impact**: Medium (slow growth, hard to reach 100-500 users)
   - **Mitigation**:
     - Content marketing (SEO, YouTube tutorials)
     - Product-led growth (viral loops, referrals)
     - Paid acquisition if budget allows

4. **Market Risk: Pricing/Monetization**
   - **Risk**: Users love it but won't pay, can't sustain business
   - **Impact**: Medium (can't fund growth or hiring)
   - **Mitigation**:
     - Freemium with clear upgrade path
     - Test pricing with beta users
     - Offer professional services as revenue backstop

**Medium Risks**

5. **Dependency Risk: Langflow Breaking Changes**
   - **Risk**: Upstream Langflow updates break fork, hard to maintain
   - **Impact**: Medium (time sink, technical debt)
   - **Mitigation**:
     - Pin Langflow version, don't auto-upgrade
     - Minimize fork customizations (wrapper approach where possible)

6. **Operational Risk: Lack of Monitoring**
   - **Risk**: Things break and we don't know (minimal monitoring for MVP)
   - **Impact**: Low-Medium (user frustration, churn)
   - **Mitigation**:
     - Add basic error tracking (Sentry free tier)
     - Monitor cloud provider dashboards manually

### De-Risking Strategy
- **Simplify MVP aggressively** - cut features, reduce scope
- **Build quick validation artifacts** - landing page + waitlist, Figma prototype
- **Hire technical help if needed** - contractor for critical blockers
- **Extend timeline if necessary** - 1-2 months is target, not hard deadline

## V2 Roadmap (Post-MVP)

### Top Priority Features (Version 2)
1. **Advanced Flow Editing (Unlock Full Langflow)**
   - Power users can edit nodes directly, not just Q&A
   - Toggle between "Beginner Mode" (Q&A) and "Advanced Mode" (full canvas)

2. **Analytics Dashboard**
   - Conversation metrics (# of chats, top questions, response times)
   - Agent performance tracking
   - User behavior insights

3. **Agent Templates Library**
   - Pre-built templates for common use cases (support, sales, knowledge, content)
   - Users can clone, customize, and share templates

4. **Embeddable Chat Widget**
   - JavaScript snippet to deploy agents on external websites
   - Customizable appearance, branding
   - Analytics on embedded widget usage

### Future Features (V3+)
- Slack, Discord, WhatsApp integrations
- Advanced RAG (document upload, knowledge base)
- Team collaboration (comments, shared agents, permissions)
- White-label / agency features
- Custom node creation (Langflow plugin system)

## Growth Strategy

### Year 1: MVP Validation (100-500 users)
- **Workshop Program**: Scale in-person and online workshops (libraries, community centers, online webinars)
- **Content Marketing**: SEO blog posts, YouTube tutorials, educational content
- **Product-Led Growth**: Viral loops (user invitations, share agents), word-of-mouth

### Year 2+: Scale (500-10K users)
- Continue workshop program at scale (partnerships with educational institutions)
- Paid acquisition (Google/Facebook ads)
- Strategic partnerships (Langflow community, DataStax, education platforms)

## Long-Term Vision (3-5 Years)

**Success Scenario**: Leading no-code AI tool (10K+ users) OR Acquisition/Partnership

Adam's preference: Build a top Langflow alternative with strong brand in educational AI, with potential for acquisition by Langflow, DataStax, or edtech company.

**Exit Criteria**: Won't shut down - committed to pivoting and iterating until it works.

## References
- [Langflow GitHub Repo](https://github.com/logspace-ai/langflow)
- [DataStax Langflow Hosting Blueprint](https://www.datastax.com/)
- [React Flow Documentation](https://reactflow.dev/)
- Universal Starter Framework: `/Users/adamcognigy/LangflowSaaS`
