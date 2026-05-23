---
phase: 07-missions-and-rewards
plan: 03
subsystem: missions
tags: [react-native, missions, hooks, firestore, expo-router]

requires:
  - phase: 07-missions-and-rewards
    plan: 02
    provides: Mission UI wiring with claim handler + rotation
provides:
  - useMissionProgress hook for event-based mission progress updates
  - Claim flow alert confirmation on HomeScreen
  - Mission seeding on app init
affects: [07-04, 07-05]

tech-stack:
  added: []
  patterns:
    - "Event-based mission progress hook mirrors achievement unlock pattern"
    - "Home screen focus refresh ensures mission progress updates after actions"

key-files:
  created:
    - src/hooks/useMissionProgress.ts
  modified:
    - src/screens/home/HomeScreen.tsx
    - app/_layout.tsx

key-decisions:
  - "ReportProgress maps event types to mission requirement types before incrementing"
  - "Mission refresh on Home focus used as pragmatic event trigger for now"

patterns-established:
  - "Mission progress detection uses hook with reportProgress(eventType) entry point"

requirements-completed: [MISS-04, MISS-05, MISS-06]

duration: 2min
completed: 2026-05-23
---

# Phase 07 Plan 03: Event-Based Mission Progress + Claim Feedback

**Event-based mission progress hook, claim confirmation alerts, and mission seeding on app init for daily/weekly mission updates**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-23T21:23:15Z
- **Completed:** 2026-05-23T21:24:49Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Created `useMissionProgress` hook that maps action events to mission requirement types and increments progress
- Added claim success/error alerts and mission refresh on Home focus
- Seeded missions on app init alongside achievements and obtenibles

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useMissionProgress hook for event-based completion detection** - `9cac7f6` (feat)
2. **Task 2: Add claim alert/animation and wire useMissionProgress to HomeScreen** - `5ff61df` (feat)
3. **Task 3: Seed missions from _layout.tsx on app init** - `5f5e13c` (feat)

**Plan metadata:** `pending`

## Files Created/Modified
- `src/hooks/useMissionProgress.ts` - Hook that reports mission progress by event type
- `src/screens/home/HomeScreen.tsx` - Claim alerts and focus-based mission refresh
- `app/_layout.tsx` - Seed missions on app startup

## Decisions Made
- Used `useFocusEffect` to re-check missions when returning to Home, supporting event-based progress without wiring every screen yet
- Map event types to requirement types in a shared hook for future integration in identify/water/share screens

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript errors in `app/companionPlant.tsx` and missing `@radix-ui/react-accordion` declarations surfaced during `npx tsc --noEmit`; not introduced by this plan's changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Mission progress hook ready to be called directly from identify/water/share actions
- Claim UX now confirms XP award and refreshes UI state

---

## Self-Check: PASSED

- ✅ `.planning/phases/07-missions-and-rewards/07-03-SUMMARY.md` exists
- ✅ Commit `9cac7f6` exists
- ✅ Commit `5ff61df` exists
- ✅ Commit `5f5e13c` exists
