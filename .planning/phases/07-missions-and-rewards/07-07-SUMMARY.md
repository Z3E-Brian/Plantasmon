---
phase: 07-missions-and-rewards
plan: 07
subsystem: missions
tags: [grace-period, cutoff, event-based-progress, identify, water, firestore]
requires:
  - phase: 07-missions-and-rewards
    provides: Mission service (assignDailyMissions, getExpiredMissions, useMissionProgress hook)
provides:
  - Grace-period cutoff filtering (previous-day only expired missions)
  - Standalone reportMissionProgress helper (callable from services)
  - Event-based progress triggers for identify and water actions
affects:
  - 04-4-plants-cards-home-and-general-rewards
tech-stack:
  added: []
  patterns:
    - Standalone helper pattern: extract service-logic from React hooks for non-React callers
    - Late import for circular dependencies: require() inside function body
key-files:
  created:
    - src/services/__tests__/missionService.test.ts
    - src/hooks/__tests__/useMissionProgress.test.ts
  modified:
    - src/services/missionService.ts
    - src/hooks/useMissionProgress.ts
    - src/services/userPlantsService.ts
    - src/services/userService.ts
key-decisions:
  - "Used lazy require() in userService.ts to avoid circular dependency with useMissionProgress.ts"
  - "Standalone reportMissionProgress in useMissionProgress.ts for access from service code"
patterns-established:
  - "Event-driven mission progress: actions call reportMissionProgress(eventType) fire-and-forget"
  - "Grace period filtering by assignedDate: only previous-day missions are claimable"
requirements-completed: [MISS-04, MISS-06]
duration: 14min
completed: 2026-05-24
---

# Phase 07 Plan 07: Grace-Period Cutoff and Event-Based Progress — Summary

**Standalone reportMissionProgress helper wired to identify/water flows; expired missions filtered to previous-day only via assignedDate metadata**

## Performance

- **Duration:** 14 min
- **Started:** 2026-05-24T04:13:33Z
- **Completed:** 2026-05-24T04:27:30Z
- **Tasks:** 2 (4 commits including TDD cycles)
- **Files modified:** 4 source + 2 test

## Accomplishments

- Added `assignedDate` metadata to mission progress entries on assignment (grace-period anchor)
- `getExpiredMissions` now filters to only previous-day completed+unclaimed missions per D-10/D-11
- Missions without `assignedDate` are excluded (prevents claiming ancient missions — T-07-07-01)
- Extracted standalone `reportMissionProgress(eventType, userId)` from hook for service-level use
- Refactored `useMissionProgress` hook to delegate to the standalone helper (no duplicate logic)
- Wired `reportMissionProgress('identify')` into `userPlantsService.addUserPlant` after successful identification
- Wired `reportMissionProgress('water')` into `userService.logWateringActivity` after successful watering
- Both calls are fire-and-forget with `.catch()` error logging (per T-07-07-02 accept disposition)

## Task Commits

Each task was committed atomically with TDD cycle (RED → GREEN):

1. **Task 1: Grace-period cutoff metadata and filtering**
   - `344cac3` (test): add failing test for grace-period cutoff
   - `f1dd73a` (feat): implement grace-period cutoff metadata and filtering

2. **Task 2: Trigger mission progress on identify and water actions**
   - `7a747d1` (test): add failing test for standalone reportMissionProgress
   - `b0ec242` (feat): implement standalone reportMissionProgress and service wiring

## Files Created/Modified

- `src/services/missionService.ts` — Added `assignedDate` to new progress entries in `assignDailyMissions`/`assignWeeklyMissions`; updated `getExpiredMissions` to filter by yesterday's date
- `src/hooks/useMissionProgress.ts` — Added standalone `reportMissionProgress()` export; refactored hook to delegate to it
- `src/services/userPlantsService.ts` — Imported `reportMissionProgress`; call `reportMissionProgress('identify')` after online plant addition
- `src/services/userService.ts` — Added `reportWaterMissionProgress()` lazy-import helper; called after successful watering updates (first-time and streak)
- `src/services/__tests__/missionService.test.ts` — Tests for assignedDate metadata and grace-period date filtering
- `src/hooks/__tests__/useMissionProgress.test.ts` — Tests for standalone export, mission matching, error handling, and hook API

## Decisions Made

- **Lazy require() for circular dependency**: `userService.ts` uses inline `require()` inside `reportWaterMissionProgress()` to avoid circular dependency with `useMissionProgress.ts` (which imports `getCurrentUserId` from `userService`). Metro/CommonJS resolves the circular dep correctly at call time.
- **Fire-and-forget error handling**: Mission progress reporting errors are logged but never propagated — the primary flow (identification, watering) is never blocked by a mission progress failure.
- **No REFACTOR phase**: The TDD tasks achieved GREEN directly without requiring a separate refactor commit.

## Deviations from Plan

None — plan executed exactly as written.

## TDD Gate Compliance

| Gate | Task 1 | Task 2 |
|------|--------|--------|
| RED (test) | `344cac3` | `7a747d1` |
| GREEN (feat) | `f1dd73a` | `b0ec242` |
| REFACTOR | N/A | N/A |

Both tasks followed the mandatory RED → GREEN TDD cycle. No REFACTOR phase was needed as the GREEN implementation was clean.

## Issues Encountered

- **Dynamic import not supported in Jest**: Initial test used `await import(...)` for the module import, which requires `--experimental-vm-modules`. Switched to static `import * as module` pattern with `(module as any).exportName` access for TDD verification.
- **Circular dependency with userService.ts**: `userService.ts` needs to call `reportMissionProgress('water')` from `useMissionProgress.ts`, which imports `getCurrentUserId` from `userService`. Resolved with inline `require()` at call time (works in Metro/CommonJS; `require` is available despite ESM surface because Expo uses Metro's CommonJS transform).
- **Double getMissionDefinitions call**: `reportMissionProgress` calls `getUserMissions` (which internally calls `getMissionDefinitions`) and then calls `getMissionDefinitions` again. This is a minor redundancy (two Firestore reads instead of one) but doesn't affect correctness. Consider optimizing in a future plan.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Grace-period enforcement and event-based progress triggers are fully wired
- Identify/water actions now advance matching daily/weekly missions
- Expired missions are limited to previous-day only (older missions permanently lost)
- Ready for Phase 08 or remaining Phase 07 gap-closure items

## Self-Check: PASSED

All 7 files created/modified verified on disk. All 4 commits verified in git log.

---

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-24*
