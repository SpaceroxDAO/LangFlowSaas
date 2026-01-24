# Incident Response Plan

## Purpose

This document outlines the procedures for responding to security incidents affecting Teach Charlie AI.

---

## Severity Levels

### SEV1 - Critical
**Response time: Immediate (within 1 hour)**

Examples:
- Active data breach
- Compromised API keys affecting multiple users
- Authentication bypass in production
- Complete service outage

Actions:
1. All hands on deck
2. Notify all affected users immediately
3. Take affected systems offline if necessary
4. Engage external security team if needed

### SEV2 - High
**Response time: Within 4 hours**

Examples:
- Vulnerability actively being exploited
- Single user data exposure
- Authentication issues affecting subset of users
- Significant performance degradation

Actions:
1. Primary on-call responds
2. Escalate to team lead
3. Implement temporary mitigations
4. Plan permanent fix

### SEV3 - Medium
**Response time: Within 24 hours**

Examples:
- Security vulnerability discovered (not exploited)
- Failed intrusion attempt detected
- Rate limiting triggered by attack
- Non-critical configuration issue

Actions:
1. On-call investigates
2. Document findings
3. Schedule fix for next sprint
4. Monitor for escalation

### SEV4 - Low
**Response time: Within 1 week**

Examples:
- Minor security improvement needed
- Documentation gap discovered
- Best practice not followed
- Theoretical vulnerability

Actions:
1. Create tracking ticket
2. Prioritize in backlog
3. Address in normal development cycle

---

## Response Process

### 1. Detection & Triage (0-15 minutes)

**Who**: First responder (whoever detects the issue)

Tasks:
- [ ] Confirm the incident is real (not false positive)
- [ ] Assess initial severity level
- [ ] Document initial observations
- [ ] Alert the appropriate team members

Communication template:
```
SECURITY INCIDENT DETECTED
Severity: [SEV1/2/3/4]
Time detected: [timestamp]
Description: [brief description]
Initial impact: [known impact]
Action needed: [immediate actions required]
```

### 2. Containment (15-60 minutes for SEV1/2)

**Who**: Security lead + Engineering team

Tasks:
- [ ] Isolate affected systems if necessary
- [ ] Revoke compromised credentials
- [ ] Block malicious IPs/actors
- [ ] Enable additional logging
- [ ] Preserve evidence for investigation

### 3. Investigation (Ongoing)

**Who**: Security lead + relevant engineers

Tasks:
- [ ] Determine root cause
- [ ] Identify all affected systems/users
- [ ] Review logs and audit trails
- [ ] Document attack timeline
- [ ] Assess full scope of impact

### 4. Eradication (After investigation)

**Who**: Engineering team

Tasks:
- [ ] Remove attacker access
- [ ] Patch vulnerability
- [ ] Reset affected credentials
- [ ] Verify fix effectiveness
- [ ] Deploy to production

### 5. Recovery (After eradication)

**Who**: Engineering team + Operations

Tasks:
- [ ] Restore affected systems
- [ ] Verify system integrity
- [ ] Monitor for re-infection
- [ ] Gradually restore service
- [ ] Confirm user impact resolved

### 6. Post-Incident (Within 1 week)

**Who**: Entire team

Tasks:
- [ ] Conduct post-mortem meeting
- [ ] Document lessons learned
- [ ] Update runbooks/procedures
- [ ] Implement preventive measures
- [ ] Share learnings with team

---

## Communication Plan

### Internal Communication

**SEV1/SEV2**:
- Immediate Slack/phone alert to all team members
- War room (video call) within 30 minutes
- Hourly status updates until resolved

**SEV3/SEV4**:
- Slack notification to security channel
- Daily updates until resolved

### External Communication

**User Notification Required When**:
- User data was accessed or exposed
- Service was significantly impacted
- Users need to take action (password reset, etc.)

**Notification Template**:
```
Subject: Security Notice from Teach Charlie AI

Dear [User],

We are writing to inform you of a security incident that may have affected your account.

What Happened:
[Brief, clear description]

What We're Doing:
[Actions taken]

What You Should Do:
[User actions required]

We sincerely apologize for any inconvenience. If you have questions, please contact security@teachcharlie.ai.

The Teach Charlie AI Team
```

---

## Contacts

### Primary Response Team

| Role | Name | Contact |
|------|------|---------|
| Security Lead | [TBD] | [email/phone] |
| Engineering Lead | [TBD] | [email/phone] |
| Operations | [TBD] | [email/phone] |

### Escalation Path

1. On-call engineer
2. Security lead
3. Engineering lead
4. CEO/Founder

### External Resources

- **Clerk Security**: For authentication issues
- **Cloud Provider**: For infrastructure issues
- **Legal Counsel**: For data breach notification requirements
- **PR/Communications**: For public statements

---

## Runbooks

### Compromised API Keys

1. Identify which keys are compromised
2. Revoke keys in provider dashboard (OpenAI, Anthropic, etc.)
3. Rotate ENCRYPTION_KEY if encryption key compromised
4. Re-encrypt all stored API keys
5. Notify affected users to update their keys
6. Monitor for unauthorized usage

### Authentication Bypass

1. Enable maintenance mode if widespread
2. Invalidate all active sessions (via Clerk dashboard)
3. Force password reset for affected users
4. Review authentication logs
5. Patch vulnerability
6. Re-enable service with monitoring

### Data Exposure

1. Identify exposed data scope
2. Contain exposure (remove public access)
3. Determine if data was accessed
4. Notify affected users per legal requirements
5. Document for compliance

### DDoS Attack

1. Enable enhanced rate limiting
2. Work with cloud provider on mitigation
3. Block identified attack sources
4. Scale infrastructure if needed
5. Monitor for attack pattern changes

---

## Post-Incident Review Template

```markdown
## Incident Post-Mortem

**Date**: [date]
**Severity**: [SEV level]
**Duration**: [time from detection to resolution]

### Summary
[Brief description of what happened]

### Timeline
- [time]: Event 1
- [time]: Event 2
- [time]: Incident resolved

### Root Cause
[What caused the incident]

### Impact
- Users affected: [number]
- Data exposed: [yes/no, scope]
- Service downtime: [duration]
- Financial impact: [estimate]

### Resolution
[How the incident was resolved]

### Lessons Learned
1. What went well
2. What could be improved
3. Action items

### Prevention
- [ ] Action item 1 (owner, due date)
- [ ] Action item 2 (owner, due date)
```

---

## Review Schedule

- This plan should be reviewed quarterly
- Test incident response procedures annually
- Update contacts immediately when roles change

---

*Last updated: 2026-01-24*
*Next review: 2026-04-24*
