# Security Architecture — Dynamic Animal Food Platform

## Threat Model
- No PII stored: session_id is a random UUID generated client-side, never tied to identity
- No authentication required: public tool, no user accounts
- AI API key: stored in Secret Manager (prod) / .env (local), never in code or logs

## Security Headers (all responses)
| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| Permissions-Policy | camera=(), microphone=() | Disable unused APIs |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Content-Security-Policy | default-src 'self' | Restrict resource origins |

## Rate Limiting
- POST /api/analyze: 30 requests/minute/IP
- POST /api/insights: 10 requests/minute/IP (AI-backed)
- GET endpoints: 60 requests/minute/IP
- Exceeding limits returns 429 with Retry-After header

## Input Validation
- All inputs validated by Pydantic v2 with explicit field validators
- session_id must be a valid UUID (validated with uuid.UUID())
- Numeric fields have explicit min/max constraints (e.g., pet weight > 0)
- No raw SQL — no injection surface

## Secret Management
- Zero hardcoded credentials anywhere in codebase
- .env.example documents all required variables without values
- Production: environment variables injected at deploy time
- .gitignore explicitly excludes .env files

## Dependency Security
- requirements.txt pins exact versions
- GitHub Actions runs on every push — adds security scanning hook point
