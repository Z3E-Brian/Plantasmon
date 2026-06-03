# Phase 6 Discussion Log

**Date:** 2026-06-03
**Participants:** User + Claude

## Areas Discussed

### 1. Verification Scope
- **Q:** How should Phase 6 handle issues found?
- **Options:** Audit + fix / Audit only / Verify end-2-end
- **Chosen:** Audit + fix
- **Q:** Verification method?
- **Options:** Manual testing / Automated checks / Both
- **Chosen:** Automated checks
- **Q:** Tool type?
- **Options:** Custom scan script / Lint rule / Jest test
- **Chosen:** Lint rule
- **Q:** Fix strategy?
- **Options:** Fix as found / File issues first
- **Chosen:** File issues first

### 2. What counts as "hardcoded"
- **Q:** Which patterns to flag?
- **Options:** Auth UID only / Auth + mock data / All + config
- **Chosen:** All + config
- **Q:** Firebase config approach?
- **Options:** Move to .env / Log concern only
- **Chosen:** Move to .env
- **Q:** Mock data patterns?
- **Options:** All mock constants / User-facing placeholders / Both
- **Chosen:** Both

### 3. Auth flows
- **Q:** Which flows to verify?
- **Options:** All flows / Login only / Login + Google
- **Chosen:** All flows
- **Q:** Google OAuth?
- **Options:** Verify state / Assume broken and fix / Skip
- **Chosen:** Skip

### 4. New user / empty states
- **Q:** Approach for new users?
- **Options:** Verify + fix / Quick check / Seed data on register
- **Chosen:** Verify + fix

## Deferred Ideas
- Google OAuth fix — out of scope
- Auto-seed data on registration — not needed

## Next Steps
Proceed to `/gsd-plan-phase 6` with captured context.
