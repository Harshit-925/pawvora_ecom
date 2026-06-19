#!/bin/bash
# ANTIGRAVITY SELF-TESTER

set -e
PASS=0
FAIL=0
WARNINGS=()

check() {
  local label="$1"
  local condition="$2"
  if eval "$condition" > /dev/null 2>&1; then
    echo "  ✅ $label"
    ((PASS++))
  else
    echo "  ❌ $label"
    ((FAIL++))
    WARNINGS+=("FAILED: $label")
  fi
}

echo ""
echo "══════════════════════════════════════════"
echo "  🔬 ANTIGRAVITY SELF-TESTER"
echo "══════════════════════════════════════════"

# ── STRUCTURE ──────────────────────────────────
echo ""
echo "📁 Repository Structure"
check "backend/ exists"           "[ -d backend ]"
check "frontend/ exists"          "[ -d frontend ]"
check ".github/workflows/ exists" "[ -d .github/workflows ]"
check "Dockerfile exists"         "[ -f Dockerfile ]"
check ".env.example exists"       "[ -f .env.example ]"
check ".env NOT committed"        "[ ! -f .env ]"
check "README.md exists"          "[ -f README.md ]"
check "SECURITY_ARCHITECTURE.md"  "[ -f SECURITY_ARCHITECTURE.md ]"
check "ACCESSIBILITY_COMPLIANCE_REPORT.md" "[ -f ACCESSIBILITY_COMPLIANCE_REPORT.md ]"
check "CODE_QUALITY_STANDARDS.md" "[ -f CODE_QUALITY_STANDARDS.md ]"
check "TESTING_STRATEGY.md"       "[ -f TESTING_STRATEGY.md ]"
check "PERFORMANCE_REPORT.md"     "[ -f PERFORMANCE_REPORT.md ]"

# ── SECURITY ──────────────────────────────────
echo ""
echo "🔒 Security"
check "No hardcoded API keys"     "! grep -r 'sk-ant-' . --include='*.py' --include='*.ts' --include='*.tsx' -l 2>/dev/null | grep -v '.env'"
check ".env in .gitignore"        "grep -q '\.env$' .gitignore"
check "SecurityHeadersMiddleware in security.py" "grep -q 'SecurityHeadersMiddleware' backend/app/core/security.py"
check "Rate limiting configured"  "grep -q 'limiter.limit' backend/app/routes/main.py"
check "CSP header set"            "grep -q 'Content-Security-Policy' backend/app/core/security.py"

# ── CODE QUALITY ──────────────────────────────
echo ""
echo "🧹 Code Quality"
check "TypeScript strict mode"    "grep -q '\"strict\": true' frontend/tsconfig.json"
check "No 'any' types in src"     "! grep -r ': any' frontend/src/ 2>/dev/null"
check "Prettier config exists"    "[ -f .prettierrc ]"
check "Zero TypeScript errors"    "cd frontend && npx tsc --noEmit"

# ── ACCESSIBILITY ─────────────────────────────
echo ""
echo "♿ Accessibility"
check "Skip link in App.tsx"      "grep -q 'Skip to main content' frontend/src/App.tsx"
check "aria-live in ResultsPanel" "grep -q 'aria-live' frontend/src/components/ResultsPanel.tsx"
check "role=alert for errors"     "grep -q 'role=\"alert\"' frontend/src/components/ResultsPanel.tsx"
check "aria-describedby on inputs" "grep -q 'aria-describedby' frontend/src/components/InputForm.tsx"
check "frontend/package.json exists" "[ -f frontend/package.json ]"
check "vite.config.ts exists"     "[ -f frontend/vite.config.ts ]"
check "Tailwind config exists"    "[ -f frontend/tailwind.config.js ]"

# ── FINAL REPORT ──────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "  📊 RESULTS: $PASS passed, $FAIL failed"
echo "══════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
  echo "🚀 ALL CHECKS PASSED — safe to push and submit!"
  exit 0
else
  echo "🛑 $FAIL checks failed — do not submit yet."
  exit 1
fi
