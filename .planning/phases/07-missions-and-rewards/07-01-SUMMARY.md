---
phase: 07-missions-and-rewards
plan: 01
subsystem: missions
tags: [firestore, typescript, seed-data, mission-system]
requires:
  - phase: 04-4-plants-cards-home-and-general-rewards
    provides: User profile with stats.xp, achievement service pattern
  - phase: 01-authentication-foundation
    provides: Dynamic Firebase Auth UID via getCurrentUserId()
provides:
  - Mission service with Firestore CRUD (missionService.ts)
  - 25 daily + 10 weekly mission definitions (missionsData.ts)
  - User doc schema extension for mission tracking + longestStreak + obtainedItems
affects: [07-02, 07-03, 07-04, 07-05]
tech-stack:
  added: []
  patterns:
    - Deterministic seeded selection for daily/weekly mission rotation
    - seed function following seedAchievements() pattern from userAchievementsService
    - Firestore missionProgress array map update pattern
key-files:
  created:
    - src/services/missionService.ts
    - src/constants/missionsData.ts
  modified:
    - src/services/userService.ts
key-decisions:
  - "Deterministic mission selection via seeded Fisher-Yates shuffle (same date= same missions all day)"
  - "missionProgress accumulates over time — entries from previous assignments remain for grace period"
  - "LongestStreak tracked as historical max in stats.longestStreak, separate from streakDays"
  - "Spanish error messages and mission descriptions consistent with app locale"
patterns-established:
  - "Seed data follows established pattern from userAchievementsService.ts (check if empty → batch setDoc)"
  - "User doc field initialization on createUserDocument for all tracking fields"
requirements-completed: [MISS-01, MISS-02, MISS-03, OBT-01]
duration: 15min
completed: 2026-05-23
---

# Phase 07 Plan 01: Mission Service + Firestore Seed Summary

**Mission service layer with 25 daily + 10 weekly mission definitions, Firestore CRUD operations, deterministic rotation logic, and user doc schema extended for longestStreak tracking and mission/obtenible fields**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-23T20:02:00Z
- **Completed:** 2026-05-23T20:17:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Created `missionService.ts` with 10 exported functions: `seedMissions`, `getMissionDefinitions`, `assignDailyMissions`, `assignWeeklyMissions`, `needsDailyRefresh`, `needsWeeklyRefresh`, `getUserMissions`, `updateMissionProgress`, `claimMissionReward`, `getExpiredMissions`
- Created `missionsData.ts` with 25 daily missions (≥3 per category) and 10 weekly missions — all Spanish titles/descriptions, emoji icons, unique IDs
- Extended `userService.ts` with `longestStreak` tracking in `UserProfile` interface, `getUserProfile`, `logWateringActivity` (both branches), and `createUserDocument`
- Added `missions` and `obtainedItems` fields to `createUserDocument` initial doc
- Deterministic mission assignment via seeded pseudo-random shuffle (Fisher-Yates) — same missions all day for each user

## Task Commits

Each task was committed atomically:

1. **Task 2: Define 25 daily + 10 weekly mission seed data** - `fced397` (feat)
2. **Task 1: Create mission types and missionService.ts with Firestore CRUD** - `89981c7` (feat)
3. **Task 3: Extend userService.ts with longestStreak tracking and mission fields** - `9e890eb` (feat)

## Files Created/Modified

- `src/constants/missionsData.ts` — 25 daily + 10 weekly `MissionDefinition` objects with types, emoji icons, unique IDs, XP rewards
- `src/services/missionService.ts` — Full mission service: types (`MissionType`, `AssignedMission`, `MissionProgress`), seed, CRUD, deterministic assignment, progress tracking, claim flow, grace period
- `src/services/userService.ts` — Extended `UserProfile` interface with `longestStreak`, populated in `getUserProfile`, tracked in `logWateringActivity`, initialized in `createUserDocument` with `missions` and `obtainedItems` fields

## Decisions Made

- **Deterministic selection**: Used seeded Fisher-Yates shuffle with user ID + date/week seed — ensures user sees the same missions all day without Firestore storage of the rotation state
- **missionProgress accumulation**: Progress entries persist across rotation — previous assignments remain accessible for grace period `getExpiredMissions` which filters for completed-but-unclaimed entries not in current `assignedDailyIds`
- **LongestStreak vs streakDays**: `longestStreak` tracks historical maximum (never decreases) while `streakDays` tracks current streak (can reset) — enables future streak achievements
- **seedMissions() follows existing pattern**: Checks if `missions` collection is empty before seeding, matches `seedAchievements()` pattern exactly

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript TS1016 errors in `userService.ts` (`updateUserSettings` and `updateUserBio` have optional parameter before required parameter) — not introduced by this plan's changes

## Threat Surface

No new threat surface introduced beyond what the plan's threat model covers (T-07-01 accepts spoofing via `getCurrentUserId()` guard, T-07-02 mitigates tampering via server-side increment-only progress updates).

## Next Phase Readiness

- Mission service layer is ready for Phase 07-02 (Mission UI + HomeScreen Integration + Rotation)
- User doc schema supports mission assignment, progress tracking, and obtenible storage
- Mission seed data ready for Firestore seeding on app startup

---

## Self-Check: PASSED

- ✅ `src/services/missionService.ts` — exists with 10 exported functions
- ✅ `src/constants/missionsData.ts` — exists with 25 daily + 10 weekly missions
- ✅ `src/services/userService.ts` — extended with longestStreak, missions, obtainedItems
- ✅ Commit `fced397` — feat: 25 daily + 10 weekly mission definitions
- ✅ Commit `89981c7` — feat: mission service with Firestore CRUD
- ✅ Commit `9e890eb` — feat: extended user service with longestStreak and mission fields
- ✅ `07-01-SUMMARY.md` — written with full metadata

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-23*
