# 🧠 ANTIGRAVITY AGENT

**Trigger:** `/agent {topic}` → builds a complete, secure, accessible, tested full-stack web app + landing page for `{topic}`.

**Pre-configured (already in this environment — USE them, don't reinstall):**
- `ui-ux-pro-max` skill — design tokens (colors, type, layout) per topic
- `framer-motion` skill — physics-based animation (springs, gestures, page transitions)
- `Stitch` MCP — generates page UI/layout
- `TestSprite` MCP — autonomous E2E + a11y + security testing

Build order is fixed. Do not skip or reorder. Write files to disk as you go — don't buffer the whole repo in one response (token limits will truncate).

---

## PIPELINE

```
0. Analyze topic → define data model + 1 core AI feature
1. Scaffold folders, git init, configs
2. Backend: FastAPI + Pydantic v2 (security + rate limit + AI service)
3. UI: ui-ux-pro-max → design tokens
      Stitch MCP → generate landing page + app layout
      framer-motion → add motion to the Stitch output
      Build React components wired to backend
4. Tests: pytest (backend) + Vitest/jest-axe (frontend)
5. Docker + GitHub Actions CI
6. 5 compliance docs (security/a11y/quality/testing/perf)
7. README
8. self_test.sh → then TestSprite MCP → fix all failures → commit
```

---

## PHASE 0 — TOPIC ANALYSIS

State in 5 lines before coding:
1. Core problem this solves
2. 2–4 main data entities
3. Where AI adds value (one clear feature, not a kitchen sink)
4. Chosen challenge vertical
5. One differentiator that makes it feel real, not a toy

---

## PHASE 1 — SCAFFOLD

```bash
mkdir [topic-slug]-platform && cd [topic-slug]-platform
git init && git checkout -b main
mkdir -p .github/workflows backend/app/{core,models,routes,services} backend/tests
mkdir -p frontend/src/{components,store,api,utils,types} frontend/tests scripts
```

**`.gitignore`**
```
node_modules/ dist/ .env .env.local __pycache__/ *.pyc .venv/ .coverage coverage/ .DS_Store
```

**`.env.example`**
```bash
ANTHROPIC_API_KEY=your_key_here
ENVIRONMENT=development
USE_AI=true
```

---

## PHASE 2 — BACKEND

**Stack:** Python 3.11 · FastAPI · Pydantic v2 · slowapi

**`backend/requirements.txt`**
```
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.1
pydantic-settings==2.3.0
slowapi==0.1.9
python-dotenv==1.0.1
anthropic==0.28.0
pytest==8.2.2
pytest-cov==5.0.0
pytest-asyncio==0.23.7
httpx==0.27.0
```

**`backend/app/core/config.py`** — env-driven settings, `lru_cache` singleton, never hardcode secrets.

**`backend/app/core/security.py`** — middleware that sets on every response:
`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · `Strict-Transport-Security: max-age=31536000` · `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.anthropic.com`
CORS: restrict `allow_origins` to localhost dev + deployed domain only, `allow_methods=["GET","POST"]`.

**`backend/app/core/rate_limit.py`** — `slowapi` Limiter by IP. Apply: `30/minute` on primary write routes, `10/minute` on AI-backed routes, `60/minute` on reads.

**`backend/app/models/schemas.py`** — Pydantic v2 models for the topic's entities. Every field has explicit constraints (`min_length`, `max_length`, regex, enums). `session_id` is a random client-generated UUID, validated server-side — never store PII.

**`backend/app/services/ai_service.py`** — Claude client (`model="claude-3-5-sonnet-latest"`). Must:
- Never crash on API failure — wrap in try/except, log, fall back
- Fallback function reads actual request context (not generic strings) so it stays useful with no API key — judges often test without one
- Return `(result, fallback_used: bool)` tuple

**`backend/app/routes/main.py`** — `/api/health` (GET, no limit) + `/api/analyze` (POST, rate-limited, typed in/out, try/except → 500 with detail, never leak stack traces).

**`backend/app/main.py`** — app factory: security middleware → CORS → rate-limit exception handler → router. `docs_url="/api/docs"`, `redoc_url=None`.

**`backend/pytest.ini`**
```ini
[pytest]
asyncio_mode = auto
```
(This removes the need for `@pytest.mark.asyncio` on every test — do not add that decorator anywhere, it's redundant with `asyncio_mode=auto` and will warn in newer pytest-asyncio.)

**`backend/tests/conftest.py`** — shared `AsyncClient` fixture using `ASGITransport(app=app)`, `scope="function"`.

---

## PHASE 3 — UI (Stitch → Framer Motion → React)

### Step 1 — Design tokens (`ui-ux-pro-max` skill)
Generate before writing any component:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "[TOPIC]" --design-system -f markdown
```
Output → CSS custom properties in `frontend/src/index.css` + `tailwind.config.js` theme extension. Every component uses these tokens. No hardcoded hex values anywhere.

### Step 2 — Page UI (Stitch MCP)
Use the Stitch MCP tool directly (already connected) to generate the landing page and main app layout for `[TOPIC]`. Prompt it with the design tokens from Step 1 so output matches the palette/type system. Generate:
- Landing/hero page (value prop, CTA, feature highlights)
- Main app screen (input form + results panel, two-column)
- Loading and error states

Take the Stitch output as the structural/layout source of truth. Convert it into real React + Tailwind components — don't leave it as static HTML.

### Step 3 — Motion (`framer-motion` skill)
Apply physics-based motion on top of the Stitch layout, not decorative animation everywhere:
- Page/section entrance: spring fade+slide (`type: "spring", stiffness: 300, damping: 30`)
- Button/interactive press: scale feedback (`whileTap={{ scale: 0.97 }}`)
- Results panel: staggered children entrance when AI insights arrive
- Respect `prefers-reduced-motion` — wrap all animation with a check, fall back to instant transitions
- Never animate focus rings or anything that interferes with keyboard navigation

### Step 4 — Build the real components

**`frontend/package.json`** — React 18, TypeScript strict, Vite, Tailwind, Zustand, Zod, `framer-motion`, Vitest, `@testing-library/react`, `jest-axe`, `jsdom`.

**`frontend/tsconfig.json`** — `"strict": true`, `noUnusedLocals`, `noUnusedParameters`. Zero `any` anywhere in `src/`.

**`frontend/src/types/index.ts`** — input/output interfaces matching backend Pydantic schemas exactly.

**`frontend/src/api/client.ts`** — single typed fetch wrapper. No raw `fetch()` in components.

**`frontend/src/store/useAppStore.ts`** — Zustand: `result`, `isLoading`, `error`, `history`, actions. No prop drilling.

**`frontend/src/utils/validation.ts`** — Zod schema matching backend constraints, validated client-side before submit.

**`frontend/src/components/LandingHero.tsx`** — Stitch-derived hero section, framer-motion entrance, single clear CTA scrolling/routing to the app form.

**`frontend/src/components/InputForm.tsx`** — every input: `label htmlFor` + `aria-describedby` + `aria-required` on required fields. Submit button: `aria-busy={isLoading}`, `disabled` while loading, motion `whileTap`.

**`frontend/src/components/ResultsPanel.tsx`** — `aria-live="polite" aria-atomic="true"` wrapping results; errors in a separate `role="alert" aria-live="assertive"` block; framer-motion staggered list entrance for insights.

**`frontend/src/App.tsx`** — skip-to-main-content link (first focusable element, `sr-only focus:not-sr-only`), landing hero → app section, `Suspense` boundary, logical heading hierarchy (`h1` → `h2` → `h3`).

**`frontend/src/index.css`** — Tailwind directives + design tokens from Step 1 + global `@media (prefers-reduced-motion: reduce)` override.

---

## PHASE 4 — TESTS

**Backend (`backend/tests/test_routes.py`, `test_ai_service.py`)** — no `@pytest.mark.asyncio` (handled by `pytest.ini`). Cover: happy path, validation error (422), security headers present on every response, AI fallback path (`fallback_used=True` when AI disabled), rate limit triggers 429.

**Frontend (`frontend/tests/*.test.tsx`)** — every component: `jest-axe` zero violations (mandatory, not optional). Cover: renders without crashing, form submit triggers correct store state, error state shows `role="alert"`.

**Coverage target:** 85%+ backend, 80%+ frontend. CI fails build below threshold.

---

## PHASE 5 — DOCKER + CI

**`Dockerfile`** — multi-stage: `node:20-alpine` builds frontend → `python:3.11-slim` runtime, copies built frontend into backend static dir. `EXPOSE 8000`, `CMD uvicorn app.main:app --host 0.0.0.0 --port 8000`.

**`.github/workflows/ci.yml`** — 3 jobs: backend (`pytest --cov-fail-under=85`), frontend (`lint` → `test --coverage` → `build`), docker (`docker build` after both pass). Runs on every push to `main`.

---

## PHASE 6 — COMPLIANCE DOCS (write all 5, concise, with real numbers after running tests)

- **`SECURITY_ARCHITECTURE.md`** — threat model, headers table, rate limits, input validation, secret handling
- **`ACCESSIBILITY_COMPLIANCE_REPORT.md`** — WCAG 2.1 AA checklist (nav, forms, dynamic content, focus, motion), jest-axe results
- **`CODE_QUALITY_STANDARDS.md`** — TS strict config, lint rules, naming conventions, folder rationale
- **`TESTING_STRATEGY.md`** — coverage table (target vs actual), test categories, how to run, TestSprite results summary
- **`PERFORMANCE_REPORT.md`** — bundle size, optimizations (memo, lazy, tree-shaking), Lighthouse targets

Keep each doc under ~40 lines. Specific numbers, not vague claims.

---

## PHASE 7 — README

```markdown
# [TOPIC] Platform
[![CI](badge_url)]() 

## Live Demo
[url]

## Vertical
[stated clearly] — solves [problem] via [Input → AI Analysis → Output]

## Stack
React 18 · TS strict · Vite · Tailwind · Zustand · Zod · Framer Motion (frontend)
Python 3.11 · FastAPI · Pydantic v2 (backend)

## Quick Start
[backend run commands]
[frontend run commands]

## Tests
[commands]

## Assumptions
[2-3 explicit assumptions]

## Security
No PII stored · env-based secrets · see SECURITY_ARCHITECTURE.md
```

---

## PHASE 8 — SELF-TEST → TESTSPRITE → COMMIT

### Step 1 — `scripts/self_test.sh`

```bash
#!/bin/bash
set -e
PASS=0; FAIL=0; WARNINGS=()

check() {
  if eval "$2" > /dev/null 2>&1; then echo "  ✅ $1"; ((PASS++))
  else echo "  ❌ $1"; ((FAIL++)); WARNINGS+=("$1"); fi
}

echo "🔬 ANTIGRAVITY SELF-TEST"

# Structure
check "backend/ exists" "[ -d backend ]"
check "frontend/ exists" "[ -d frontend ]"
check ".env not committed" "[ ! -f .env ]"
check "5 compliance docs exist" "[ -f SECURITY_ARCHITECTURE.md ] && [ -f ACCESSIBILITY_COMPLIANCE_REPORT.md ] && [ -f CODE_QUALITY_STANDARDS.md ] && [ -f TESTING_STRATEGY.md ] && [ -f PERFORMANCE_REPORT.md ]"

# Security
check "No hardcoded secrets" "! grep -rE '(api_key|secret|password)\s*=\s*[\"'\''][^\"'\'']{1,}[\"'\'']' backend/app/ 2>/dev/null | grep -v '# '"
check "Security headers middleware present" "grep -q 'SecurityHeadersMiddleware' backend/app/core/security.py"
check "Rate limiting applied" "grep -q 'limiter.limit' backend/app/routes/main.py"

# Code quality
check "TS strict mode" "grep -q '\"strict\": true' frontend/tsconfig.json"
check "No 'any' in src" "! grep -r ': any' frontend/src/ 2>/dev/null"
check "Zero TS errors" "cd frontend && npx tsc --noEmit"

# Accessibility
check "Skip link present" "grep -q 'Skip to main content' frontend/src/App.tsx"
check "aria-live in ResultsPanel" "grep -q 'aria-live' frontend/src/components/ResultsPanel.tsx"
check "reduced-motion handled" "grep -rq 'prefers-reduced-motion' frontend/src/"

# Tests
cd backend && python -m pytest --cov=app --cov-fail-under=85 -q && cd .. && ((PASS++)) || { ((FAIL++)); WARNINGS+=("Backend coverage <85%"); }
cd frontend && npm test -- --watchAll=false && cd .. && ((PASS++)) || { ((FAIL++)); WARNINGS+=("Frontend tests failed"); }

# Git
check "Single branch" "[ $(git branch | wc -l) -eq 1 ]"
check "Repo under 10MB" "[ $(du -sm . | cut -f1) -lt 10 ]"

# Docker
check "Docker build succeeds" "docker build -t self-test:check . -q"

echo "RESULTS: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ] && echo "🚀 READY" || { printf '%s\n' "${WARNINGS[@]}"; exit 1; }
```

### Step 2 — TestSprite MCP (already connected — use it, don't reconfigure)

Start the app, then trigger TestSprite directly in chat:

```bash
cd backend && uvicorn app.main:app --reload --port 8000 &
cd frontend && npm run dev &
```

```
Use the TestSprite MCP to test this project end-to-end: form submission,
AI insight generation, error states, keyboard-only navigation, ARIA
correctness, and basic security checks (headers, rate limiting).
```

Fix every failure at the root cause. Re-run until TestSprite reports zero failures. Only then commit.

### Step 3 — Commit

```bash
git add . && git commit -m "feat: complete [TOPIC] platform" && git push origin main
```

---

## SCORE TARGETS

| Axis | Target | Driven by |
|---|---|---|
| Code Quality | 98 | TS strict, zero `any`, JSDoc |
| Security | 99 | Headers, rate limiting, validation, TestSprite checks |
| Efficiency | 100 | Async backend, memoized components, tree-shaking |
| Testing | 99 | 85%+ coverage, jest-axe, TestSprite E2E |
| Accessibility | 99 | WCAG 2.1 AA, ARIA, reduced-motion, ui-ux-pro-max tokens |
| Problem Alignment | 100 | README maps every feature to the brief |

*Built to score, not to demo.*
