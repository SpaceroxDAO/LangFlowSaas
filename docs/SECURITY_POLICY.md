# Security Policy

## Reporting Security Vulnerabilities

We take security seriously at Teach Charlie AI. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please email us at: **security@teachcharlie.ai**

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt within 48 hours
2. **Assessment**: We will assess the vulnerability within 5 business days
3. **Updates**: We will provide regular updates on our progress
4. **Resolution**: We aim to resolve critical issues within 30 days
5. **Credit**: With your permission, we will credit you in our security advisories

### Scope

The following are in scope for security reports:
- **teachcharlie.ai** and all subdomains
- The Teach Charlie AI application (backend and frontend)
- API endpoints at `/api/v1/*`
- Authentication and authorization systems
- Data storage and encryption

Out of scope:
- Third-party services we integrate with (Clerk, OpenAI, Anthropic, etc.)
- Issues that require physical access
- Social engineering attacks
- DoS/DDoS attacks

---

## Data Privacy

### Data We Collect

Teach Charlie AI collects:
- **Account information**: Email, name (via Clerk authentication)
- **Agent configurations**: System prompts, settings, workflow data
- **Conversation history**: Messages between users and their agents
- **Usage analytics**: Anonymous usage patterns for improvement

### Data Storage

- All data is stored in PostgreSQL databases
- Sensitive API keys are encrypted using Fernet symmetric encryption
- Passwords are managed by Clerk (we don't store passwords)
- Conversation data is isolated per user

### Data Retention

- Account data: Retained while account is active
- Conversation history: Retained for 90 days by default
- Agent configurations: Retained until user deletes them
- Audit logs: Retained for 1 year

### Data Deletion

Users can request data deletion by:
1. Deleting their agents through the UI
2. Contacting support for full account deletion
3. We will process deletion requests within 30 days

---

## Security Measures

### Authentication
- JWT-based authentication via Clerk
- RS256 signature verification
- Token expiration and rotation
- Multi-factor authentication available via Clerk

### Authorization
- All API endpoints require authentication
- User isolation enforced at database query level
- Role-based access control for team features (future)

### Encryption
- TLS 1.2+ for data in transit
- Fernet encryption for sensitive data at rest
- API keys encrypted before storage

### Infrastructure
- Docker containerization with security hardening
- Network isolation between services
- Rate limiting to prevent abuse
- Regular security updates and patches

---

## Security Best Practices for Users

1. **Protect your API keys**: Never share your OpenAI/Anthropic keys
2. **Use strong passwords**: Enable MFA via Clerk
3. **Review agent access**: Regularly audit who has access to your agents
4. **Report suspicious activity**: Contact us if you notice anything unusual

---

## Compliance

Teach Charlie AI is designed with security in mind:
- **OWASP Top 10**: We follow OWASP guidelines for web security
- **Data Protection**: User data isolation and encryption
- **Audit Logging**: Security events are logged for review

---

## Contact

- **Security issues**: security@teachcharlie.ai
- **General support**: support@teachcharlie.ai
- **Privacy questions**: privacy@teachcharlie.ai

---

*Last updated: 2026-01-24*
