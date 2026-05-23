---
phase: 07-missions-and-rewards
plan: 05
subsystem: achievements
tags: firebase, firestore, achievements, streak, account-age, weekly-missions
requires:
  - phase: 07-missions-and-rewards
    plan: 01
    provides: longestStreak tracking in userService, pendingObtenibles architecture
provides:
  - 7 new achievement definitions for streak (longestStreak), account age, and weekly missions
  - rewardItemId optional field on AchievementDefinition for future item grants
  - Unlock logic handlers for longest_streak, account_age_days, weekly_missions requirement types
affects: future item-grant wiring when rewardItemId is populated
tech-stack:
  added: []
  patterns:
    - "Achievement unlock computed from Firestore user doc data (stats.longestStreak, createdAt, missions) without client-side auth gates"
    - "New requirement types handled via early-continue in for...of loop before default mapping"
key-files:
  created: []
  modified:
    - src/services/userAchievementsService.ts
key-decisions:
  - "New longest_streak achievements coexist with existing streak_* achievements for backward compatibility"
  - "rewardItemId is optional metadata on achievement definition — actual grant flow deferred to future phase"
  - "Account age computed from createdAt (Firestore Timestamp) via getAccountAge from userService"
  - "Weekly active achievement checks assignedWeeklyIds every() for completion + claimed status"
requirements-completed:
  - ACH-02
  - ACH-03
  - ACH-04
  - ACH-05
duration: 8min
completed: 2026-05-23
---

# Phase 07 Plan 05: New Achievement Definitions + rewardItemId Architecture

**7 new achievements added (streak, account age, weekly complete) with rewardItemId on AchievementDefinition and unlock logic for longest_streak/account_age_days/weekly_missions requirement types**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-23T21:05:00Z
- **Completed:** 2026-05-23T21:13:00Z
- **Tasks:** 3 (1 code change, 2 verification)
- **Files modified:** 1

## Accomplishments

- Added `rewardItemId?: string` to `AchievementDefinition` interface for future item grant architecture (D-21)
- Added 4 streak achievements (`longest_streak_3/7/14/30`) based on `stats.longestStreak` (historical max, per D-18)
- Added 2 account age achievements (`account_100_days`, `account_1_year`) computed from `createdAt` (D-19)
- Added 1 weekly active achievement (`weekly_all_complete`) checking all weekly missions completed + claimed (D-20)
- Extended `getUserAchievements` with custom unlock logic handlers for all 3 new requirement types
- Updated `mapEmoji` to return proper icons for "Racha Máxima" (fire/crown) and "Semana Completa" (trophy)
- Verified `userService.ts` already tracks `longestStreak` in `UserProfile`, `getUserProfile`, `logWateringActivity`, and `createUserDocument`
- Verified `useProfile.ts` already loads achievements via `getUserAchievements(userId)` — new achievements flow automatically

## Task Commits

Each task was committed atomically:

1. **Task 1: Add rewardItemId and new achievement definitions + unlock logic** - `fcec44e` (feat)
2. **Task 2: Verify userService longestStreak tracking** - No code changes (already in place from Plan 01)
3. **Task 3: Verify useProfile.ts already loads achievements** - No code changes (already works)

**Plan metadata:** `pending`

## Files Created/Modified

- `src/services/userAchievementsService.ts` — Interface extended with `rewardItemId`, 7 new definitions added, `mapEmoji` updated, `getUserAchievements` converted to for...of with handlers for longest_streak, account_age_days, weekly_missions

## Decisions Made

- **Coexistence strategy:** New `longest_streak_*` achievements coexist alongside existing `streak_*` achievements. The old ones continue to track `currentStreak`; the new ones explicitly use `longestStreak` (historical max). Both are valid — users can earn both sets.
- **rewardItemId is metadata-only:** Added to interface per D-21 but no grant logic wired yet. Actual item distribution deferred to future phase.
- **getAccountAge imported from userService:** No circular dependency issue (userService doesn't import userAchievementsService). Inline computeAccountAge not needed.
- **weekly_missions check uses every() with completed + claimed:** Ensures both completion AND reward claim before achievement unlocks. Prevents partial state from triggering unlock.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — all pre-existing TypeScript errors (UI component library imports, optional param ordering) are unrelated to this plan's changes.

## Stub Tracking

No stubs introduced. New achievements have real data sources (longestStreak, createdAt, missions) and proper unlock logic computed from Firestore.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes introduced.

## Next Phase Readiness

- All 7 new achievements will appear in Firestore `achievements` collection after next seed run
- Achievement unlock auto-computes from existing Firestore data — no migration needed
- `rewardItemId` field ready for wiring when obtenibles grant flow is built

## Self-Check: PASSED

- ✅ `SUMMARY.md` created: `.planning/phases/07-missions-and-rewards/07-05-SUMMARY.md`
- ✅ Commit `fcec44e` exists in git history
- ✅ STATE.md updated (plan position, decisions, metrics, session)
- ✅ ROADMAP.md updated (plan progress)
- ✅ no new TypeScript errors in modified files

---

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-23*
