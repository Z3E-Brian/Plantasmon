---
phase: 04-4-plants-cards-home-and-general-rewards
plan: 01
subsystem: ui, services
tags: [firestore, stats, home-screen, react-native]
requires:
  - phase: 03-add-calendar-and-funcionality-to-missing-screens
    provides: Home screen components, user service patterns
provides:
  - StatsBar component with 4 live Firestore stats
  - User service helpers (getAccountAge, logWateringActivity)
  - User plants service helpers (getPhotosTodayCount, getLastIdentification)
  - Stubbed PlantOfTheDay (hidden per D-02)
affects: [future plans that add more home stats or achievements]
tech-stack:
  added: []
  patterns:
    - useFocusEffect for data refresh on screen focus
    - Individual try/catch per stat for graceful degradation
    - Service-layer helpers for Firestore data aggregation
key-files:
  created:
    - src/components/home/StatsBar.tsx
  modified:
    - src/services/userService.ts
    - src/services/userPlantsService.ts
    - src/styles/themedStyles.ts
    - src/screens/home/HomeScreen.tsx
    - src/components/home/PlantOfTheDay.tsx
key-decisions:
  - "Account age and streak fetched from single getUserProfile call to minimize Firestore reads"
  - "Individual try/catch per stat so one failing data source doesn't crash the entire bar"
  - "toDateStr helper duplicated in both service files to avoid cross-file dependency on a utility"
  - "PlantOfTheDay stubbed to return null with _props convention to maintain type compatibility"
patterns-established:
  - "StatsBar: useFocusEffect for data refresh, loading skeleton, per-stat error isolation"
  - "logWateringActivity: client-side streak calculation with yesterday/today/older logic"
requirements-completed: []
duration: 2min
completed: 2026-05-13
---

# Phase 04-4 Plan 01: Home Stats Bar Summary

**StatsBar component with 4 live Firestore data points (account age, photos today, watering streak, last identification) wired into HomeScreen with PlantOfTheDay hidden per D-02**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-13T19:44:09-06:00
- **Completed:** 2026-05-13T19:46:01-06:00
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added `getAccountAge` and `logWateringActivity` helpers to `userService.ts` with full streak logic (yesterday → increment, older → reset, today → no-op)
- Added `getPhotosTodayCount` and `getLastIdentification` helpers to `userPlantsService.ts` with Firestore plant doc lookup for common name
- Created `StatsBar` component with 4 stat items, loading skeleton, and individual try/catch per stat
- Registered `statsBar` styles in `themedStyles.ts` (createStatsBarStyles, stylesByComponent, StylesForComponent)
- Wired `<StatsBar />` into `HomeScreen` between HomeHeader and card components
- Stubbed `PlantOfTheDay` to return null per D-02 (deferred until catalog has 100+ plants)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add stats helpers to userService and userPlantsService** - `d2905af` (feat)
2. **Task 2: Create StatsBar component and themed styles** - `9ffea9a` (feat)
3. **Task 3: Wire StatsBar into HomeScreen and stub PlantOfTheDay** - `b3ac1b4` (feat)

## Files Created/Modified

- `src/services/userService.ts` — Added `getAccountAge(joinDate)` and `logWateringActivity(userId)` with streak calculation logic
- `src/services/userPlantsService.ts` — Added `getPhotosTodayCount(userId)` (filters by today's date) and `getLastIdentification(userId)` (sorts desc, fetches plant doc)
- `src/components/home/StatsBar.tsx` — New component: horizontal row of 4 stat items with emoji + value + label, loading skeleton, per-stat try/catch isolation
- `src/styles/themedStyles.ts` — Added `createStatsBarStyles` with container, statItem, statIcon, statValue, statLabel, skeleton styles; registered in `stylesByComponent` and `StylesForComponent`
- `src/screens/home/HomeScreen.tsx` — Added `StatsBar` import and rendering; commented out `PlantOfTheDay` with D-02 note; removed `handleLearnMore`
- `src/components/home/PlantOfTheDay.tsx` — Stubbed to return null; kept `PlantOfTheDayProps` interface for type compatibility

## Decisions Made

- **Single profile fetch:** Account age and streak are fetched from a single `getUserProfile` call to minimize Firestore reads
- **Per-stat error isolation:** Each stat has its own try/catch block so one failure shows "—" instead of crashing the entire bar
- **ToDateStr duplication:** The `toDateStr` helper is duplicated in both service files to avoid creating a shared utility dependency
- **useFocusEffect:** Stats refresh on screen focus so data stays up-to-date without polling

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript errors in `src/components/ui/*` (shadcn/ui components with missing dependencies like radix, lucide-react, class-variance-authority) are unrelated to this plan and do not affect the stat bar functionality.

## Threat Model Compliance

- **T-04-01 (Information Disclosure):** Accept — all stats derived from user's own data.
- **T-04-02 (Tampering):** Mitigated — `logWateringActivity` only writes `stats.streakDays` and `stats.lastWateredDate`, following existing codebase pattern.
- **T-04-03 (Denial of Service):** Accept — `getPhotosTodayCount` uses client-side filter on bounded data.

## Next Phase Readiness

- Home screen now has a live stats bar replacing the old hardcoded badges in HomeHeader
- Service helpers available for future achievement unlock hooks (e.g., trigger streak achievements after logWateringActivity)
- PlantOfTheDay stub ready to be replaced when catalog grows or external API integration is planned

---

## Self-Check: PASSED

- All 6 files confirmed present
- All 3 commits confirmed in git history (`d2905af`, `9ffea9a`, `b3ac1b4`)
- TypeScript: No new errors introduced (pre-existing errors in `src/components/ui/*` only)

---

*Phase: 04-4-plants-cards-home-and-general-rewards*
*Completed: 2026-05-13*
