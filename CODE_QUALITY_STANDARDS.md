# Code Quality Standards — Dynamic Animal Food Platform

## TypeScript Configuration
- strict: true — enables all strict type checks
- noUnusedLocals: true — no dead variables
- noUnusedParameters: true — no dead function params
- noFallthroughCasesInSwitch: true — explicit switch exhaustion
- Zero `any` types in production code

## ESLint Rules (frontend)
- react-hooks/exhaustive-deps: error
- @typescript-eslint/no-explicit-any: error
- @typescript-eslint/explicit-function-return-type: warn
- no-console: warn (use logger in backend)

## Naming Conventions
- Components: PascalCase (InputForm, ResultsPanel)
- Hooks: camelCase with 'use' prefix (useAppStore)
- Types/Interfaces: PascalCase
- Files: PascalCase for components, camelCase for utilities

## Architecture Principles
- Single responsibility: each file has one job
- No prop drilling: Zustand store for shared state
- Typed API layer: api/client.ts is the only fetch boundary
- Pure functions: utility functions have no side effects
- Explicit error handling: every async call has try/catch

## Folder Structure Rationale
- components/: UI only, no business logic
- store/: global state only, no API calls
- api/: network layer only, returns typed responses
- utils/: pure functions, zero imports from store or api
- types/: shared interfaces only, no implementations
