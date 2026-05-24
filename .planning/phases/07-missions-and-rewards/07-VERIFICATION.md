---
phase: 07-missions-and-rewards
verified: 2026-05-24T05:00:00Z
status: human_needed
score: 25/25 must-haves verified
overrides_applied: 0
overrides: []
gaps: []
deferred: []
human_verification:
  - test: "Visual check — DailyMissions renders 5 missions on home screen with progress bars, XP badges, and claim button for completed-but-unclaimed missions"
    expected: "Each mission shows icon, title, X/Y progress bar, +XP badge. Completed but unclaimed shows '¡Reclamar!' button. Claimed shows '✓ Reclamado'. Expired section shows yesterday's unclaimed missions at reduced opacity."
    why_human: "Visual layout and styling can't be verified programmatically — React Native rendering requires device/simulator."
  - test: "Visual check — WeeklyMissions renders 2 missions below daily missions, same progress/claim pattern"
    expected: "2 weekly missions with higher XP values, progress bars, and claim UI matching daily missions style."
    why_human: "Visual layout needs human eyes on device."
  - test: "Visual check — ProfileVitrina shows 30-item grid as 4th profile tab with rarity colors and locked/unlocked states"
    expected: "Grid of 3 columns with item emojis, names. Obtained items in full color with rarity border; unobtained at 0.4 opacity with lock overlay. Rarity colors: gray=común, blue=raro, purple=épico, gold=legendario."
    why_human: "Visual layout and color rendering require human verification on device."
  - test: "Functional check — Mission rotation triggers on new day (daily) and new week (weekly)"
    expected: "When device date advances to next day (or week), HomeScreen auto-assigns fresh set of missions on focus."
    why_human: "Requires running app with real Firestore; date-dependent logic can't be verified statically."
  - test: "Functional check — Claim flow shows Alert.alert with XP confirmation and updates UserProgress XP display"
    expected: "Tapping claim on completed mission shows '¡Recompensa reclamada!' alert, then XP value in UserProgress updates."
    why_human: "Requires running app with real Firestore; alert interaction is runtime behavior."
---

# Phase 7: Missions & Rewards — Verification Report

**Phase Goal:** Users have daily/weekly missions with XP rewards, obtainable cosmetic items with rarity tiers displayed on profile, and new streak/account-age achievements.

**Verified:** 2026-05-24T05:00:00Z
**Status:** human_needed (automated checks all pass; UI visual/runtime items need human confirmation)
**Re-verification:** No — initial verification

## Goal Achievement

The phase goal is achieved at the code level. All 25 must-have truths are verified in the codebase:

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 25 daily mission definitions exist in Firestore `missions` collection | ✓ VERIFIED | `src/constants/missionsData.ts` — `DAILY_MISSIONS` array has exactly 25 items (5 identify + 5 water + 4 scan + 4 streak + 4 explore + 3 share) |
| 2 | 10 weekly mission definitions exist in Firestore `missions` collection | ✓ VERIFIED | `src/constants/missionsData.ts` — `WEEKLY_MISSIONS` array has exactly 10 items (2+2+2+1+2+1) |
| 3 | Each mission has id, title, description, type, requirement, xpReward, icon | ✓ VERIFIED | `MissionDefinition` interface enforces all fields; actual data in `missionsData.ts` has all fields populated |
| 4 | User document has mission tracking fields | ✓ VERIFIED | `userService.ts` `createUserDocument` (lines 303-309) sets `missions: { assignedDailyIds, assignedWeeklyIds, missionProgress, lastDailyRefresh, lastWeeklyRefresh }` |
| 5 | missionService exports getMissions(), assignMissions(), updateMissionProgress(), seedMissions() | ✓ VERIFIED | `src/services/missionService.ts` exports: `seedMissions`, `getMissionDefinitions`, `assignDailyMissions`, `assignWeeklyMissions`, `needsDailyRefresh`, `needsWeeklyRefresh`, `getUserMissions`, `updateMissionProgress`, `claimMissionReward`, `getExpiredMissions` — 10 exported functions |
| 6 | User doc has `longestStreak` field in stats | ✓ VERIFIED | `userService.ts` `createUserDocument` sets `longestStreak: 0` (line 301); `logWateringActivity` updates it (lines 250-257); `UserProfile` interface includes `longestStreak` (line 41); `getUserProfile` populates it (line 111) |
| 7 | HomeScreen shows 5 daily missions from real Firestore data (not mock DAILY_MISSIONS) | ✓ VERIFIED | `HomeScreen.tsx` — `loadMissions` calls `getUserMissions(uid)` from Firestore; no `DAILY_MISSIONS` import from `data.ts` remains |
| 8 | HomeScreen shows 2 weekly missions | ✓ VERIFIED | `HomeScreen.tsx` renders `<WeeklyMissions missions={weeklyMissions} onClaim={handleClaim} />` (line 185) |
| 9 | Missions show multi-stage progress (e.g., 2/3) | ✓ VERIFIED | `DailyMissions.tsx` renders `{mission.progress}/{mission.target}` with progress bar (lines 53-71); `UpdateMissionProgress` increments and checks `progress >= target` (missionService.ts lines 433-438) |
| 10 | Missions auto-rotate when lastDailyRefresh !== today | ✓ VERIFIED | `HomeScreen.tsx` `loadMissions` checks `needsRefresh.daily` → calls `assignDailyMissions(uid)` (lines 74-77); `needsDailyRefresh` compares `toDateStr(lastRefresh) !== toDateStr(today)` (missionService.ts lines 282-290) |
| 11 | Missions auto-rotate when lastWeeklyRefresh !== current week | ✓ VERIFIED | `HomeScreen.tsx` checks `needsRefresh.weekly` → calls `assignWeeklyMissions(uid)` (lines 82-83); `needsWeeklyRefresh` compares week numbers (missionService.ts lines 295-302) |
| 12 | Previous day's unclaimed missions appear in an 'expired' section | ✓ VERIFIED | `DailyMissions.tsx` renders `expiredMissions.length > 0 && <View>` with "⏰ Misiones del día anterior" header (lines 106-113); `getExpiredMissions` filters completed+unclaimed from yesterday (missionService.ts lines 540-557) |
| 13 | All 5 daily missions visible at once | ✓ VERIFIED | `DailyMissions.tsx` renders all `missions.map(m => renderMission(m))` without any progressive unlock (line 103) |
| 14 | Completing a plant identification checks relevant daily/weekly missions and updates progress | ✓ VERIFIED | `userPlantsService.ts` line 296: `reportMissionProgress("identify", resolvedUserId)` called after `updateDoc` for successful identification |
| 15 | Watering a plant checks relevant missions and updates progress | ✓ VERIFIED | `userService.ts` `reportWaterMissionProgress(resolvedUserId)` called after both first-time (line 231) and streak (line 261) watering branches |
| 16 | Tapping claim on a mission grants XP and marks it claimed | ✓ VERIFIED | `missionService.ts` `claimMissionReward` — sets `claimed = true`, `claimedAt`, adds `xpReward` to `stats.xp` (lines 483-500) |
| 17 | Claim shows an alert confirmation | ✓ VERIFIED | `HomeScreen.tsx` `handleClaim` — `Alert.alert("¡Recompensa reclamada!", ...)` on success (lines 106-109) |
| 18 | Unclaimed missions older than yesterday are not claimable | ✓ VERIFIED | `getExpiredMissions` filters `m.assignedDate && toDateStr(new Date(m.assignedDate)) === yesterdayStr` — only yesterday's date matches; missions without `assignedDate` excluded (lines 540-557) |
| 19 | XP is granted and visible in UserProgress component | ✓ VERIFIED | `HomeScreen.tsx` `handleClaim` reloads profile and calls `setUserXp(profile.xp)` (line 116); `<UserProgress xp={userXp} />` renders updated value (line 175) |
| 20 | ~30 cosmetic items seeded in Firestore `obtenibles` collection | ✓ VERIFIED | `obteniblesData.ts` exports `OBTENIBLES` array with exactly 30 items (15 común + 8 raro + 4 épico + 3 legendario); `obteniblesService.ts` `seedObtenibles()` writes them to Firestore |
| 21 | Each item has id, name, description, icon, rarity (común/raro/épico/legendario) | ✓ VERIFIED | `ObtenibleDefinition` interface enforces all fields; all 30 items in `obteniblesData.ts` have all fields populated |
| 22 | Rarity distribution: ~50% común, ~25% raro, ~15% épico, ~10% legendario | ✓ VERIFIED | 15/30 = 50% común, 8/30 = 27% raro, 4/30 = 13% épico, 3/30 = 10% legendario |
| 23 | Profile screen shows vitrina grid with locked/unlocked visual states | ✓ VERIFIED | `ProfileVitrina.tsx` — obtained items at full opacity with rarity-colored border; unobtained at 0.4 opacity with 🔒 overlay (lines 69-108); integrated as 4th tab in `UserProfile.tsx` |
| 24 | Achievement definition supports optional `rewardItemId` field | ✓ VERIFIED | `userAchievementsService.ts` line 33: `rewardItemId?: string` on `AchievementDefinition` interface |
| 25 | New achievements seeded into Firestore (streak, account age, weekly) | ✓ VERIFIED | `userAchievementsService.ts` `INITIAL_ACHIEVEMENTS` includes `longest_streak_3/7/14/30`, `account_100_days`, `account_1_year`, `weekly_all_complete` (lines 270-337); `getUserAchievements` has handlers for `longest_streak`, `account_age_days`, `weekly_missions` requirement types (lines 417-482) |

**Score:** 25/25 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/services/missionService.ts` | Mission types, Firestore CRUD, assignment, rotation, progress tracking | ✓ VERIFIED | 564 lines, 10 exported functions, Typescript compiles |
| `src/constants/missionsData.ts` | 25 daily + 10 weekly mission definitions | ✓ VERIFIED | 395 lines, 25 DAILY_MISSIONS + 10 WEEKLY_MISSIONS, all unique IDs, Spanish locale |
| `src/services/userService.ts` | Extended user doc with longestStreak + mission tracking | ✓ VERIFIED | `longestStreak` in UserProfile, getUserProfile, logWateringActivity, createUserDocument; `missions` and `obtainedItems` fields initialized |
| `src/hooks/useMissionProgress.ts` | Shared `reportMissionProgress` entry point | ✓ VERIFIED | Exports `ProgressEvent` type, `reportMissionProgress` standalone helper, `useMissionProgress` hook |
| `src/services/obteniblesService.ts` | Types, Firestore seed, user item tracking, grant function | ✓ VERIFIED | 5 exported functions: seedObtenibles, getObtenibleDefinitions, getUserObtainedItems, grantObtenibleItem, getObteniblesWithStatus |
| `src/constants/obteniblesData.ts` | ~30 obtainable item definitions with rarity tiers | ✓ VERIFIED | 30 items (15/8/4/3), RarityTier type, ObtenibleDefinition interface |
| `src/components/profile/ProfileVitrina.tsx` | Grid display of items with locked/unlocked states | ✓ VERIFIED | Rarity-colored grid, lock overlay, pressable info alert, empty state |
| `src/components/home/DailyMissions.tsx` | Updated component with progress bars, claim states, expired section | ✓ VERIFIED | MissionDisplay interface, progress bars, claim/claimed states, expired section |
| `src/components/home/WeeklyMissions.tsx` | Weekly mission display component | ✓ VERIFIED | Same pattern as DailyMissions, no expired section |
| `src/screens/home/HomeScreen.tsx` | Real mission data from missionService, rotation, claim | ✓ VERIFIED | No mock DAILY_MISSIONS, useFocusEffect, handleClaim with alert |
| `src/screens/userProfile/UserProfile.tsx` | Vitrina integrated into profile screen | ✓ VERIFIED | 4th "vitrina" tab, ProfileVitrina loaded from obteniblesService |
| `app/_layout.tsx` | Seed missions + obtenibles on app init | ✓ VERIFIED | Calls seedMissions() and seedObtenibles() alongside seedAchievements() |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `missionService.ts` | `firebase.js` | `import { db } from @/src/config/firebase` | ✓ WIRED | Line 1 |
| `missionService.ts` | `missionsData.ts` | `import { DAILY_MISSIONS, WEEKLY_MISSIONS }` | ✓ WIRED | Lines 11-15 |
| `HomeScreen.tsx` | `missionService.ts` | `import { getUserMissions, assignDailyMissions, assignWeeklyMissions, getMissionDefinitions, claimMissionReward, getExpiredMissions }` | ✓ WIRED | Lines 19-27 |
| `DailyMissions.tsx` | `missionService.ts` (types) | `import type { AssignedMission, ... }` | ✓ WIRED | Done via HomeScreen; MissionDisplay type defined locally |
| `missionService.ts` | `userService.ts` | `import { getCurrentUserId }` | ✓ WIRED | Line 10 |
| `useMissionProgress.ts` | `missionService.ts` | `import { getUserMissions, updateMissionProgress, getMissionDefinitions }` | ✓ WIRED | Lines 3-8 |
| `obteniblesService.ts` | `firebase.js` | `import { db }` | ✓ WIRED | Line 1 |
| `obteniblesService.ts` | `userService.ts` | `import { getCurrentUserId }` | ✓ WIRED | Line 11 |
| `ProfileVitrina.tsx` | `obteniblesService.ts` | `import type { ObtenibleDefinition, RarityTier }` | ✓ WIRED | Line 4 |
| `UserProfile.tsx` | `ProfileVitrina.tsx` | `import { ProfileVitrina, type ObtenibleDisplay }` | ✓ WIRED | Line 18 |
| `userPlantsService.ts` | `useMissionProgress.ts` | `import { reportMissionProgress }... reportMissionProgress('identify')` | ✓ WIRED | Lines 13, 296 |
| `userService.ts` | `useMissionProgress.ts` | `reportMissionProgress('water')` via lazy require() | ✓ WIRED | Lines 171-181 (circular dep handled) |
| `userAchievementsService.ts` | `userService.ts` | `import { getAccountAge, getCurrentUserId }` | ✓ WIRED | Line 11 |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `missionService.ts` `getUserMissions()` | `userDoc.missions` | Firestore `users/{uid}.missions` | ✓ FLOWING — reads from Firestore, merges with `missions` collection definitions |
| `missionService.ts` `getMissionDefinitions()` | `missions` collection | Firestore `missions/*` | ✓ FLOWING — reads all docs from collection (seeded via seedMissions) |
| `missionService.ts` `claimMissionReward()` | `stats.xp` + `missionProgress` | Firestore `users/{uid}` | ✓ FLOWING — reads current XP, adds reward, writes back |
| `missionService.ts` `getExpiredMissions()` | `missionProgress` + `assignedDate` | Firestore `users/{uid}.missions` | ✓ FLOWING — filters by date, reads from user doc |
| `misionsData.ts` `DAILY_MISSIONS` | Static array | Constant data file | ✓ FLOWING — seed writes to Firestore; runtime reads from Firestore collection |
| `obteniblesService.ts` `getObteniblesWithStatus()` | `obtenibles` collection + `obtainedItems` | Firestore `obtenibles/*` + `users/{uid}.obtainedItems` | ✓ FLOWING — reads from both Firestore sources, merges |
| `HomeScreen.tsx` `loadMissions()` | `dailyMissions`, `weeklyMissions`, `expiredMissions` state | Firestore via `getUserMissions` + `getExpiredMissions` | ✓ FLOWING — React state populated from Firestore, passed as props to DailyMissions/WeeklyMissions |
| `UserProfile.tsx` vitrina data | `vitrinaItems` state | Firestore via `getObteniblesWithStatus(uid)` | ✓ FLOWING — useEffect loads from Firestore, passes to ProfileVitrina |
| `userService.ts` `logWateringActivity()` | `stats.streakDays`, `stats.longestStreak` | Firestore `users/{uid}` | ✓ FLOWING — reads current values, computes new streak, writes back |
| `getUserAchievements()` achievement handlers | `stats.longestStreak`, `createdAt`, `missions` | Firestore `users/{uid}` | ✓ FLOWING — computed from Firestore user doc data |

### Behavioral Spot-Checks

Step 7b: SKIPPED (no runnable entry points — React Native mobile app requires device/simulator to run)

### Requirements Coverage

All 12 requirement IDs for Phase 7 are accounted for across the plans and verified in the codebase:

| Requirement | Source Plans | Description | Status | Evidence |
| ----------- | ------------ | ----------- | ------ | -------- |
| **MISS-01** | 07-01, 07-02, 07-06 | Daily mission system (5/day, 25 pool) | ✓ SATISFIED | 25 DAILY_MISSIONS; `assignDailyMissions()` picks 5; HomeScreen renders `<DailyMissions>` |
| **MISS-02** | 07-01, 07-02, 07-06 | Weekly mission system (2/week, 10 pool) | ✓ SATISFIED | 10 WEEKLY_MISSIONS; `assignWeeklyMissions()` picks 2; `<WeeklyMissions>` component rendered |
| **MISS-03** | 07-01, 07-02, 07-06 | Multi-stage progress tracking | ✓ SATISFIED | `MissionProgress` with `progress`, `target`, `completed` fields; progress bar "X/Y" in UI |
| **MISS-04** | 07-03, 07-06, 07-07 | Event-based completion detection | ✓ SATISFIED | `reportMissionProgress('identify')` in userPlantsService; `reportMissionProgress('water')` via userService lazy require |
| **MISS-05** | 07-03, 07-06, 07-07 | Tap-to-claim with XP grant + confirmation | ✓ SATISFIED | `claimMissionReward()` grants XP; `Alert.alert` confirmation on claim |
| **MISS-06** | 07-02, 07-03, 07-06, 07-07 | Grace period for unclaimed missions | ✓ SATISFIED | `getExpiredMissions` filters by `assignedDate === yesterdayStr`; expired section in DailyMissions; older missions excluded |
| **OBT-01** | 07-01, 07-04, 07-06 | ~30 obtainable cosmetic items with rarity tiers | ✓ SATISFIED | 30 items (15/8/4/3); `ObtenibleDefinition` with rarity; `seedObtenibles()` to Firestore |
| **OBT-02** | 07-04, 07-06 | Profile vitrina showcase | ✓ SATISFIED | `ProfileVitrina` component as 4th tab in UserProfile; locked/unlocked states; rarity colors |
| **ACH-02** | 07-05, 07-06 | Streak achievements (longestStreak) | ✓ SATISFIED | 4 `longest_streak_*` achievements; `stats.longestStreak` tracked; handler in `getUserAchievements` |
| **ACH-03** | 07-05, 07-06 | Account age achievements (100 days, 1 year) | ✓ SATISFIED | `account_100_days`, `account_1_year`; `getAccountAge()` from userService; handler in `getUserAchievements` |
| **ACH-04** | 07-05, 07-06 | Weekly active achievement | ✓ SATISFIED | `weekly_all_complete`; checks all `assignedWeeklyIds` completed + claimed |
| **ACH-05** | 07-04, 07-05, 07-06 | Architecture supports rewardItemId | ✓ SATISFIED | `rewardItemId?: string` on `AchievementDefinition` interface |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
| ---- | ------- | -------- | ------ |
| `src/services/missionService.ts` — `getUserMissions` calls `getMissionDefinitions()` inside after `getUserMissions` already reads definitions internally | Minor redundancy | ℹ️ `reportMissionProgress` calls `getUserMissions` (which calls definitions) then calls `getMissionDefinitions` again. Two Firestore reads instead of one. Noted in 07-07-SUMMARY. Non-blocking. |
| `src/services/userService.ts` — `reportWaterMissionProgress` uses `require()` for circular dependency resolution | Service pattern | ℹ️ Necessary circular dep workaround. Metro/CommonJS resolves at call time. Non-blocking. |

### Human Verification Required

The following items require human testing on a device or simulator:

1. **Mission UI Visual Check** — Verify DailyMissions renders 5 missions with progress bars, XP badges, claim buttons, and expired section. Verify WeeklyMissions renders 2 missions below daily. Confirm styling matches app theme (colors, spacing, fonts).

2. **ProfileVitrina Visual Check** — Open profile → vitrina tab. Verify 30-item grid renders in 3 columns with correct rarity colors (gray/común, blue/raro, purple/épico, gold/legendario). Verify locked items show at 0.4 opacity with lock overlay. Tap an item → verify Alert shows name, description, and rarity.

3. **Mission Rotation Functional Check** — Verify missions auto-rotate when date advances. After completing a mission on day 1, check it appears in the expired section on day 2. Verify unclaimed missions older than 2 days are not visible/claimable.

4. **Claim Flow Functional Check** — Complete a mission, tap "¡Reclamar!", verify Alert.alert shows "¡Recompensa reclamada!" with XP confirmation. Verify UserProgress XP value updates after claim.

5. **Achievements Visual Check** — Open profile → badges tab. Verify new achievements (longest_streak_*, account_100_days, account_1_year, weekly_all_complete) appear in the achievement grid with correct icons and progress.

## Summary

**Code-level verification: PASSED** — All 25 observable truths verified, all 12 source artifacts exist and are substantive, all key links wired, all 12 requirements satisfied, data flows trace to real Firestore sources, no blocker anti-patterns.

**Runtime verification: NEEDS HUMAN** — UI visual appearance, mission rotation, claim flow, and achievement display require human testing on a device/simulator.

**Deferred items:** None — all Phase 7 requirements are implemented.

---

_Verified: 2026-05-24T05:00:00Z_
_Verifier: the agent (gsd-verifier)_
