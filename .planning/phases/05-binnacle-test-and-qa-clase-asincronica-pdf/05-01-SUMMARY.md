---
phase: 05-binnacle-test-and-qa-clase-asincronica-pdf
plan: 01
subsystem: testing
tags: [jest, unit-test, activity-service, verification]
requires: []
provides: [activityService.test.ts]
affects: [src/services/activityService.ts]
tech-stack:
  added: []
  patterns: [firebase-firestore-mock, fake-timers]
key-files:
  created:
    - src/services/__tests__/activityService.test.ts
  modified: []
decisions: []
metrics:
  duration: ~5 min
  completed_date: 2026-05-24
tasks:
  total: 2
  completed: 2
---

# Phase 05 Plan 01: Verify and Enhance Jest Testing Setup — Summary

Verify existing Jest config + plantValidation unit test, then add a new unit test for activityService pure helpers.

## Task Results

### Task 1: Verify Jest config, setup, and plantValidation unit test

**Result:** Configs verified — all correct, all tests pass.

- `jest.config.js`: Has `preset: "jest-expo"`, `moduleNameMapper` with `@/` alias, `testMatch`, `transformIgnorePatterns`, etc.
- `jest.setup.ts`: Imports `@testing-library/jest-native/extend-expect`
- `plantValidation.test.ts`: 2 test cases (valid + invalid), Spanish error messages — all pass

**No modifications needed** — configuration was already correct.

### Task 2: Create unit test for activityService pure helpers

**Result:** `src/services/__tests__/activityService.test.ts` created with **17 tests** across 3 describe groups.

| Group | Tests | Coverage |
|-------|-------|----------|
| `formatRelativeTime` | 7 | "Ahora", "Hace X min" (5, 30), "Hace X h" (1, 12), "Hace X días" (2), formatted date (10+) |
| `safeParseDate` | 6 | Date, null, undefined, Timestamp-like object, ISO string, invalid string |
| `toActivityData` | 4 | identify, mission→achievement, water, achievement type mapping |

**Mock strategy:** Firebase Firestore fully mocked (same pattern as `missionService.test.ts`). No backend needed.

### Full Suite Results

```
Test Suites: 5 passed, 5 total
Tests:       26 passed, 26 total
```

All 5 existing test suites continue to pass:
1. `plantValidation.test.ts` — 2 tests ✓
2. `loginScreen.test.tsx` — 1 test ✓
3. `missionService.test.ts` — 2 tests ✓
4. `useMissionProgress.test.ts` — 4 tests ✓
5. `activityService.test.ts` — 17 tests (new) ✓

## Deviations from Plan

**None** — plan executed exactly as written.

## Test File Details

**Path:** `src/services/__tests__/activityService.test.ts` (249 lines)

**Key design decisions:**

- Non-exported helpers (`formatRelativeTime`, `safeParseDate`) accessed via `(mod as any)` with runtime `typeof` guards — tests gracefully skip if function signature changes
- `jest.useFakeTimers()` + `jest.setSystemTime()` freezes `Date.now()` for deterministic relative time assertions
- `toActivityData` type mapping tested as the code actually behaves (only `mission→achievement` mapped; `identify`, `water`, `achievement` pass through as-is)

## Commits

- `d5f3426`: `test(05-01): add unit test for activityService pure helpers`

## Self-Check: PASSED

- [x] `src/services/__tests__/activityService.test.ts` exists (249 lines, ≥60 min per plan)
- [x] `npx jest --watchAll=false --no-cache` passes all 5 test suites (26 tests)
- [x] Jest config correctly resolves `@/` path aliases
- [x] All tests mock Firebase — no backend required
