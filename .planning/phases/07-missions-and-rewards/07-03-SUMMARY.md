---
phase: 07-missions-and-rewards
plan: 03
subsystem: missions
tags: [event-based-progress, claim-flow, alert, useFocusEffect, missions-seeding]
requires:
  - phase: 07-missions-and-rewards
    plan: 01
    provides: Mission service (missionService.ts) with claimMissionReward, getMissionDefinitions
  - phase: 07-missions-and-rewards
    plan: 02
    provides: DailyMissions/WeeklyMissions UI, HomeScreen mission loading with rotation, handleClaim prop
  - phase: 07-missions-and-rewards
    plan: 07
    provides: useMissionProgress hook, standalone reportMissionProgress, grace-period filtering
provides:
  - Claim alert confirmation with XP feedback on successful reward claim (D-09)
  - Focus-based mission progress re-check (useFocusEffect reloading missions on HomeScreen focus)
  - seedMissions() call in root layout for auto-seeding on app init
  - Fixed MissionDefinition type re-export for TypeScript compilation
affects:
  - 07-02 (HomeScreen handleClaim modified with Alert.alert)
  - 07-04 (future plan using useMissionProgress reportProgress)
tech-stack:
  added: []
  patterns:
    - "useFocusEffect from expo-router for screen-focus-based data refresh"
    - "Alert.alert for user-facing action confirmation (Spanish locale)"
    - "seedMissions alongside seedAchievements/seedObtenibles in _layout.tsx"
key-files:
  created: []
  modified:
    - src/screens/home/HomeScreen.tsx
    - app/_layout.tsx
    - src/services/missionService.ts
key-decisions:
  - "useMissionProgress is initialized in HomeScreen for future extensibility but actual progress events flow through Plan 07-07's service-layer wiring"
  - "seedMissions placed after seedAchievements, before seedObtenibles — aligns with existing call order pattern"
requirements-completed:
  - MISS-05
duration: 2min
completed: 2026-05-24
---

# Phase 07 Plan 03: Event-Based Progress Detection and Tap-to-Claim Flow — Summary

**Claim alert wired to HomeScreen, mission progress re-checks on screen focus via useFocusEffect, and missions seeded alongside achievements on app init**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-24T04:22:15Z
- **Completed:** 2026-05-24T04:24:37Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- **Task 1 (verify):** `useMissionProgress.ts` already existed with complete implementation from Plan 07-07 — verified exports, types, and event-to-mission mapping meet all criteria. No modifications needed.
- **Task 2 (HomeScreen claim + focus):**
  - Added `Alert.alert` with Spanish confirmation message on successful claim claim (`"¡Recompensa reclamada!"`) and error alert on failure (`"Error"`)
  - Added `useFocusEffect` from expo-router to reload missions when the HomeScreen gains focus (user returns from identify/water/share actions) — fulfills D-08 event-based detection pragmatically
  - Initialized `useMissionProgress()` hook for future direct event reporting
- **Task 3 (seed missions on init):**
  - Added `seedMissions` import from `@/src/services/missionService`
  - Called `seedMissions()` in the root layout's `useEffect` alongside `seedAchievements()` and `seedObtenibles()` — fires once when user is authenticated
- **Rule 2 fix:** Re-exported `MissionDefinition` type from `missionService.ts` — `useMissionProgress.ts` imported it but the type was not exported, causing a TypeScript compilation error

## Task Commits

Each task was committed atomically:

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Verify useMissionProgress hook | (no-op — existing from 07-07) | — |
| — | Fix MissionDefinition re-export (Rule 2) | `4def866` | `src/services/missionService.ts` |
| 2 | Add claim alert and mission focus reload | `6932ad1` | `src/screens/home/HomeScreen.tsx` |
| 3 | Seed missions on app init | `8114849` | `app/_layout.tsx` |

## Files Modified

| File | Action | Description |
|------|--------|-------------|
| `src/screens/home/HomeScreen.tsx` | Modified | Added Alert.alert to handleClaim (success + error), useFocusEffect for mission reload on focus, useMissionProgress hook init |
| `app/_layout.tsx` | Modified | Added seedMissions import and call in auth-user useEffect |
| `src/services/missionService.ts` | Modified | Added `export type { MissionDefinition }` re-export (Rule 2 fix) |

## Decisions Made

- **Focus-based progress detection:** Rather than calling `reportProgress` directly in HomeScreen (events happen on other screens), `useFocusEffect` reloads missions from Firestore whenever the screen gains focus. Since Plan 07-07 already wired `reportMissionProgress` into the identify and water service layers, mission progress is already updated in Firestore by the time the user returns to Home.
- **seedMissions call order:** Placed after `seedAchievements()` and before `seedObtenibles()` — maintains the existing pattern without introducing ordering dependencies.
- **Alert.alert for confirmation:** Kept simple per D-09 ("animation or alert") — native `Alert.alert` is reliable and doesn't require new dependencies. Can be upgraded to a custom animation in a future polish phase.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing functionality] Re-exported MissionDefinition type from missionService.ts**
- **Found during:** Task 1 (tsc verification)
- **Issue:** `src/hooks/useMissionProgress.ts` imports `MissionDefinition` type from `@/src/services/missionService`, but `missionService.ts` only imports it (not re-exports it) from `@/src/constants/missionsData`. TypeScript error TS2724: "has no exported member named 'MissionDefinition'"
- **Fix:** Added `export type { MissionDefinition } from "@/src/constants/missionsData"` to `missionService.ts`
- **Files modified:** `src/services/missionService.ts`
- **Verification:** `npx tsc --noEmit` no longer reports this error
- **Committed in:** `4def866`

---

**Total deviations:** 1 auto-fixed (1 missing functionality)
**Impact on plan:** Required for TypeScript compilation. No scope creep.

## Issues Encountered

- **useMissionProgress.ts already complete:** Plan 07-07 (executed after this plan was written) already created and wired the `useMissionProgress.ts` hook with standalone `reportMissionProgress`. Task 1 was a verification no-op.
- **Pre-existing tsc errors remain:** Unrelated errors in `app/companionPlant.tsx` (getCurrentUserId null check) and `src/components/ui/` (missing @radix-ui/lucide-react module declarations) are not caused by this plan.

## Stub Tracking

No stubs introduced. The `reportProgress` function from `useMissionProgress()` is initialized but not called directly in HomeScreen — this is intentional per the plan's architecture (service-layer event wiring from Plan 07-07 handles the actual event detection; the hook is initialized for future direct component usage).

## Threat Flags

None — no new network endpoints, auth paths, or schema changes. Claim flow Alert.alert is client-side only. SeedMissions is idempotent (checks collection emptiness before writing).

## Self-Check: PASSED

- ✅ `src/hooks/useMissionProgress.ts` — verified on disk (exists, all exports correct)
- ✅ `src/screens/home/HomeScreen.tsx` — verified on disk (alert, focus effect, hook init)
- ✅ `app/_layout.tsx` — verified on disk (seedMissions import + call)
- ✅ `src/services/missionService.ts` — verified on disk (type re-export)
- ✅ Commit `6932ad1` — verified in git log
- ✅ Commit `4def866` — verified in git log
- ✅ Commit `8114849` — verified in git log

---

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-24*
