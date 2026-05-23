---
phase: 07-missions-and-rewards
plan: 02
subsystem: missions-ui
tags: [react-native, firestore, typescript, missions, daily-missions, weekly-missions]
requires:
  - phase: 07-missions-and-rewards
    plan: 01
    provides: Mission service with Firestore CRUD (missionService.ts), 25 daily + 10 weekly mission definitions
provides:
  - Updated DailyMissions component with progress bars, claim buttons, expired section (grace period)
  - WeeklyMissions component matching DailyMissions pattern
  - HomeScreen wired to real mission data from Firestore with auto-rotation logic
affects: [07-03 (mission progress tracking)]
tech-stack:
  added: []
  patterns:
    - "MissionDisplay type used across daily + weekly mission components"
    - "loadMissions useCallback pattern for idempotent mission fetching with rotation"
    - "Local StyleSheet for progress bars + claim buttons, themed styles for container/title"
key-files:
  created:
    - src/components/home/WeeklyMissions.tsx
  modified:
    - src/components/home/DailyMissions.tsx
    - src/screens/home/HomeScreen.tsx
    - src/styles/themedStyles.ts
key-decisions:
  - "WeeklyMissions uses same themed styles as DailyMissions (weeklyMissions key pointed at createDailyMissionsStyles)"
  - "Journal.tsx updated to match new DailyMissions interface (empty arrays + noop claim) — breaking change handled via Rule 3"
requirements-completed:
  - MISS-01
  - MISS-02
  - MISS-03
  - MISS-06
duration: 5min
completed: 2026-05-23
---

# Phase 07 Plan 02: Mission UI — Real Data Wiring, Progress Display, and Rotation

**DailyMissions updated with progress bars, claim buttons, and expired grace-period section; WeeklyMissions component created; HomeScreen wired to load real missions from Firestore with auto-rotation on stale refresh dates**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-23T20:22:00Z
- **Completed:** 2026-05-23T20:27:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Updated `DailyMissions.tsx` — new `MissionDisplay` interface with `progress`, `target`, `claimed`, `expired` fields; component accepts `missions`, `expiredMissions`, and `onClaim` props; shows visual progress bars (X/Y + bar width %), claim buttons for completed-but-unclaimed missions, "✓ Reclamado" for claimed, and "Expirada" label in expired section
- Created `WeeklyMissions.tsx` — follows same visual pattern as DailyMissions, shows 2 weekly missions with progress bars and claim buttons, no expired section per plan design
- Wired `HomeScreen.tsx` — removed `DAILY_MISSIONS` mock import, added `loadMissions` function with auto-rotation (calls `assignDailyMissions`/`assignWeeklyMissions` when `needsRefresh` is true), `handleClaim` function that claims reward via `claimMissionReward` and reloads XP display, combined profile + mission loading in single `useEffect`
- Registered `weeklyMissions` in `themedStyles.ts` pointing at same styles as dailyMissions

## Task Commits

Each task was committed atomically:

1. **Task 1: Update DailyMissions component for real data** — `32553df` (feat)
2. **Task 2: Create WeeklyMissions component** — `36430f3` (feat)
3. **Task 3: Wire HomeScreen with mission loading + rotation** — `d9b4585` (feat)

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `src/components/home/DailyMissions.tsx` | Modified | Replaced old `Mission` interface with `MissionDisplay`, added progress bars, claim buttons, expired section, local styles |
| `src/components/home/WeeklyMissions.tsx` | Created | New component matching DailyMissions pattern (no expired section) |
| `src/styles/themedStyles.ts` | Modified | Added weeklyMissions entry pointing to `createDailyMissionsStyles` |
| `src/screens/home/HomeScreen.tsx` | Modified | Wired to real mission data via missionService, removed DAILY_MISSIONS mock, added auto-rotation + claim handler |
| `app/journal.tsx` | Modified | Updated DailyMissions call to match new interface (Rule 3 fix) |

## Decisions Made

- **WeeklyMissions uses same themed styles as DailyMissions:** Registered `weeklyMissions` key in `stylesByComponent` pointing at `createDailyMissionsStyles` — avoids duplicating identical style functions
- **Local StyleSheet for UI elements:** Progress bar, claim button, expired section styles defined locally in each component file (with inline theme colors) rather than adding to `themedStyles.ts`
- **Breaking change fix for journal.tsx:** The `DailyMissions` interface change broke `app/journal.tsx` which also used the component with mock data. Fixed by passing empty arrays + noop handler (Rule 3 — blocking tsc)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript errors from DailyMissions interface change**
- **Found during:** Task 1 (Update DailyMissions)
- **Issue:** `app/journal.tsx` used `DailyMissions` with the old `{ missions: DailyMission[] }` interface — new `MissionDisplay` interface requires `missions`, `expiredMissions`, and `onClaim` props
- **Fix:** Updated journal.tsx call to `DailyMissions missions={[]} expiredMissions={[]} onClaim={async () => {}}` and removed unused `DAILY_MISSIONS` import
- **Files modified:** `app/journal.tsx`
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** `32553df` (part of Task 1 commit)

**2. [Rule 3 - Blocking] Fixed `theme.colors.destructive` type error**
- **Found during:** Task 1 (Update DailyMissions)
- **Issue:** `ThemeColors` interface in `designSystem.ts` doesn't have `destructive` property — `theme.colors.destructive` causes TS2339
- **Fix:** Used `COLORS.destructive` from `src/constants/theme.ts` instead
- **Files modified:** `src/components/home/DailyMissions.tsx`
- **Verification:** TypeScript compiles clean
- **Committed in:** `32553df` (part of Task 1 commit)

**3. [Rule 1 - Bug] Fixed `assignDailyMissions` / `assignWeeklyMissions` call signatures in plan**
- **Found during:** Task 3 (Wire HomeScreen)
- **Issue:** Plan specified `assignDailyMissions(uid, allDefs)` and `assignWeeklyMissions(uid, allDefs)` with a second `allDefs` parameter, but the actual `missionService.ts` functions only accept `userId: string` (they use internal imports for definitions)
- **Fix:** Called with single argument: `assignDailyMissions(uid)` and `assignWeeklyMissions(uid)`
- **Files modified:** `src/screens/home/HomeScreen.tsx`
- **Verification:** TypeScript compiles clean
- **Committed in:** `d9b4585` (part of Task 3 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All auto-fixes necessary for correctness. No scope creep.

## Issues Encountered

- **Import type error:** `MissionDefinition` type is not re-exported from `missionService.ts` — had to import directly from `@/src/constants/missionsData`. Fixed inline during Task 3.
- **All other TypeScript errors are pre-existing** (companionPlant.tsx doc() call, radix UI missing module declarations).

## Stub Tracking

No stubs introduced. DailyMissions and WeeklyMissions both receive real data from Firestore via `loadMissions()`. Empty state (no missions assigned) is handled gracefully — components render headers with empty lists.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes. Mission data flows through existing Firestore service layer with `getCurrentUserId()` guard.

## Next Phase Readiness

- Daily/weekly mission UI ready for Plan 07-03 (mission progress tracking — detect plant identification, watering, scanning actions and update mission progress via `updateMissionProgress`)
- HomeScreen rotation logic automatically assigns new missions on fresh days/weeks
- Claim flow wired end-to-end through Firestore

---

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-23*
