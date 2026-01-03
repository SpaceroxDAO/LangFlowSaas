# Architecture Documentation

> **Template**: Copy this file to `01_ARCHITECTURE.md` and document your system.
> Updated by core-architect agent and `/docs/update architecture` command.

## System Overview

[High-level description of the system architecture]

## Architecture Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   API/App   │────────▶│  Database   │
│  (Browser)  │         │   Server    │         │  (Postgres) │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  External   │
                        │  Services   │
                        └─────────────┘
```

[Replace with your actual architecture diagram]

## Components

### Component 1: [Name]
- **Purpose**: [What this component does]
- **Technology**: [Tech stack]
- **Location**: [File path or service URL]
- **Dependencies**: [What it depends on]
- **Interface**: [How others interact with it]

### Component 2: [Name]
- **Purpose**: [What this component does]
- **Technology**: [Tech stack]
- **Location**: [File path or service URL]
- **Dependencies**: [What it depends on]
- **Interface**: [How others interact with it]

## Data Flow

### [Feature/Use Case 1]
```
1. User action → Client sends request
2. API validates request
3. Business logic processes data
4. Database query/update
5. Response back to client
```

### [Feature/Use Case 2]
[Describe the data flow]

## Data Models

### Entity: [Name]
```typescript
// Example schema
interface User {
  id: string;
  email: string;
  createdAt: Date;
}
```

### Entity: [Name]
[Describe schema]

## API Contracts

### Endpoint: `POST /api/resource`
**Request**:
```json
{
  "field1": "value",
  "field2": 123
}
```

**Response**:
```json
{
  "id": "abc123",
  "status": "success"
}
```

## Security Architecture

### Authentication
[How authentication works]

### Authorization
[How authorization/permissions work]

### Data Protection
- [ ] Encryption at rest
- [ ] Encryption in transit (HTTPS)
- [ ] Secret management strategy
- [ ] Input validation

## Infrastructure

### Development
- **Local setup**: [How to run locally]
- **Dependencies**: [What needs to be installed]

### Production
- **Hosting**: [Where it's deployed]
- **Scaling**: [How it scales]
- **Monitoring**: [What's monitored]
- **Backup**: [Backup strategy]

## Design Decisions

### Decision 1: [Title]
- **Context**: [Why this decision was needed]
- **Options Considered**: [What alternatives were evaluated]
- **Decision**: [What was chosen]
- **Rationale**: [Why this was chosen]
- **Trade-offs**: [What was sacrificed]

### Decision 2: [Title]
[Document decision]

## Deployment

### Build Process
```bash
# Commands to build
npm run build
```

### Deployment Process
```bash
# Commands to deploy
npm run deploy
```

### Environment Variables
- `API_KEY`: [Description]
- `DATABASE_URL`: [Description]

## Known Limitations
- [Limitation 1]
- [Limitation 2]

## Future Improvements
- [ ] [Planned improvement 1]
- [ ] [Planned improvement 2]

## References
- [Link to tech docs]
- [Link to related ADRs]
