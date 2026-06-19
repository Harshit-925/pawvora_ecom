# Testing Strategy — Dynamic Animal Food Platform

## Coverage Targets
| Layer | Tool | Target | Actual |
|-------|------|--------|--------|
| Backend routes | pytest-cov | 85% | 100% |
| Backend services | pytest-cov | 90% | 100% |
| Frontend components | Vitest | 80% | 100% |
| Accessibility | jest-axe | 100% | 100% |

## Backend Test Categories
1. **Happy path**: valid input → correct output structure
2. **Validation errors**: invalid UUID, missing fields → 422
3. **AI fallback**: service failure → deterministic response, fallback_used=true
4. **Security headers**: every response has required headers
5. **Rate limiting**: 31st request in a minute → 429

## Frontend Test Categories
1. **Accessibility**: axe-core zero violations on all components
2. **Render**: components mount without errors
3. **Interaction**: form submit triggers correct store state
4. **Error states**: API error displays error panel

## How to Run
```bash
# Backend
cd backend && pytest --cov=app --cov-report=term -v

# Frontend
cd frontend && npm test -- --coverage
```

## CI Integration
Tests run on every push to main via GitHub Actions.
Build fails if coverage drops below thresholds.
