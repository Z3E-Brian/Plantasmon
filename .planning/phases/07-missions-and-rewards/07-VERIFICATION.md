---
phase: 07-missions-and-rewards
verified: 2026-05-23T21:34:19Z
status: gaps_found
score: 27/30 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Completing identify/water actions updates mission progress (event-based detection)"
    status: failed
    reason: "useMissionProgress.reportProgress is never called by identify/water/scan/share flows; HomeScreen only reloads missions."
    artifacts:
      - path: "src/hooks/useMissionProgress.ts"
        issue: "Hook exists but has no callers outside HomeScreen; reportProgress unused"
      - path: "src/screens/home/HomeScreen.tsx"
        issue: "Imports useMissionProgress but never calls reportProgress"
    missing:
      - "Invoke reportProgress('identify'|'water'|'scan'|'share'|'streak') in the relevant action screens or add service-level triggers"
  - truth: "Unclaimed missions older than yesterday are not claimable (grace period cutoff enforced)"
    status: failed
    reason: "getExpiredMissions returns any completed+unclaimed mission not in current assignments without checking date or cutoff."
    artifacts:
      - path: "src/services/missionService.ts"
        issue: "getExpiredMissions lacks date-based grace period filtering"
    missing:
      - "Store assignment/completion dates and filter expired missions to previous-day only"
      - "Prevent claiming after grace period expiry"
  - truth: "All Phase 07 requirement IDs are defined in REQUIREMENTS.md"
    status: failed
    reason: "Plan frontmatter references MISS-01/02/03, OBT-01/02, ACH-02/03/04/05 but REQUIREMENTS.md lacks definitions for these IDs."
    artifacts:
      - path: ".planning/REQUIREMENTS.md"
        issue: "Requirement IDs referenced by Phase 07 plans not defined with descriptions"
    missing:
      - "Add missing requirement IDs with descriptions or update plan requirement references"
human_verification:
  - test: "HomeScreen mission UI"
    expected: "Shows 5 daily missions, 2 weekly missions, progress bars, claim buttons, and expired section styling"
    why_human: "Visual layout and styling cannot be verified via static analysis"
  - test: "Profile vitrina grid"
    expected: "Vitrina tab shows grid with locked/unlocked states and rarity indicators"
    why_human: "Visual presentation and locked/unlocked styling require UI inspection"
---

# Phase 07: Missions & Rewards Verification Report

**Phase Goal:** Users have daily/weekly missions with XP rewards, obtainable cosmetic items with rarity tiers displayed on profile, and new streak/account-age achievements.
**Verified:** 2026-05-23T21:34:19Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 25 daily mission definitions exist in Firestore `missions` collection | ✓ VERIFIED | `seedMissions()` seeds from `DAILY_MISSIONS` (25 items) and runs on app init (`app/_layout.tsx`) |
| 2 | 10 weekly mission definitions exist in Firestore `missions` collection | ✓ VERIFIED | `seedMissions()` seeds from `WEEKLY_MISSIONS` (10 items) |
| 3 | Each mission has id, title, description, type, requirement, xpReward, icon | ✓ VERIFIED | `MissionDefinition` in `missionsData.ts` includes all fields and definitions populate them |
| 4 | User document has mission tracking fields (assignedDailyIds, assignedWeeklyIds, missionProgress, lastDailyRefresh, lastWeeklyRefresh) | ✓ VERIFIED | `createUserDocument()` initializes `missions` object in `userService.ts` |
| 5 | Mission service exports core functions for mission CRUD/assignment/progress/seed | ✓ VERIFIED | `missionService.ts` exports `seedMissions`, `assignDailyMissions`, `assignWeeklyMissions`, `getUserMissions`, `updateMissionProgress`, `claimMissionReward` |
| 6 | User doc has `longestStreak` field in stats | ✓ VERIFIED | `createUserDocument()` + `getUserProfile()` + `logWateringActivity()` in `userService.ts` |
| 7 | HomeScreen shows 5 daily missions from real Firestore data (not mock) | ✓ VERIFIED | `HomeScreen` uses `getUserMissions()` + `getMissionDefinitions()` and renders `DailyMissions` |
| 8 | HomeScreen shows 2 weekly missions | ✓ VERIFIED | `HomeScreen` loads weekly from `getUserMissions()` and renders `WeeklyMissions` |
| 9 | Missions show multi-stage progress (e.g., 2/3) | ✓ VERIFIED | `DailyMissions`/`WeeklyMissions` render `{progress}/{target}` + progress bar |
| 10 | Missions auto-rotate when lastDailyRefresh !== today | ✓ VERIFIED | `needsDailyRefresh()` + `assignDailyMissions()` used in `loadMissions()` |
| 11 | Missions auto-rotate when lastWeeklyRefresh !== current week | ✓ VERIFIED | `needsWeeklyRefresh()` + `assignWeeklyMissions()` used in `loadMissions()` |
| 12 | Previous day's unclaimed missions appear in an “expired” section | ✓ VERIFIED | `getExpiredMissions()` + `DailyMissions` expired section |
| 13 | All 5 daily missions visible at once (no progressive unlock) | ✓ VERIFIED | `DailyMissions` maps full `missions` array |
| 14 | Completing identify actions updates mission progress | ✗ FAILED | `useMissionProgress` exists but `reportProgress` is never invoked |
| 15 | Watering actions update mission progress | ✗ FAILED | No caller invokes `reportProgress('water')` |
| 16 | Tapping claim grants XP and marks mission claimed | ✓ VERIFIED | `claimMissionReward()` updates `missions.missionProgress` + `stats.xp` |
| 17 | Claim shows animation or alert confirmation | ✓ VERIFIED | `Alert.alert` on successful claim in `HomeScreen` |
| 18 | Unclaimed missions older than yesterday are not claimable | ✗ FAILED | `getExpiredMissions()` lacks date cutoff; returns any unclaimed completed missions not currently assigned |
| 19 | XP is granted and visible in UserProgress component | ✓ VERIFIED | `handleClaim()` reloads profile and updates `UserProgress` prop |
| 20 | ~30 cosmetic items seeded in Firestore `obtenibles` collection | ✓ VERIFIED | `seedObtenibles()` seeds 30 items; called in `app/_layout.tsx` |
| 21 | Each item has id, name, description, icon, rarity | ✓ VERIFIED | `ObtenibleDefinition` + `OBTENIBLES` data in `obteniblesData.ts` |
| 22 | Rarity distribution ~50/25/15/10 | ✓ VERIFIED | 15 común / 8 raro / 4 épico / 3 legendario in data |
| 23 | User profile has `obtainedItems` array | ✓ VERIFIED | `createUserDocument()` sets `obtainedItems: []`; `getUserObtainedItems()` reads it |
| 24 | Profile screen shows vitrina grid with locked/unlocked states | ✓ VERIFIED | `ProfileVitrina` + `UserProfile` vitrina tab wiring |
| 25 | Achievement definition supports optional `rewardItemId` | ✓ VERIFIED | `AchievementDefinition.rewardItemId?` in `userAchievementsService.ts` |
| 26 | Streak achievements based on longestStreak | ✓ VERIFIED | `longest_streak_*` definitions + handler in `getUserAchievements()` |
| 27 | Account age achievements (100 days, 1 year) exist and unlock on createdAt | ✓ VERIFIED | `account_100_days`, `account_1_year` + `account_age_days` handling |
| 28 | Weekly active achievement (complete all weekly missions) exists | ✓ VERIFIED | `weekly_all_complete` + `weekly_missions` handler |
| 29 | New achievements are seeded into Firestore achievements collection | ✓ VERIFIED | `seedAchievements()` seeds `INITIAL_ACHIEVEMENTS`, called in `app/_layout.tsx` |
| 30 | Achievement UI loads new achievements | ✓ VERIFIED | `useProfile()` uses `getUserAchievements()` and feeds `Achievements` component |

**Score:** 27/30 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---------|----------|--------|---------|
| `src/services/missionService.ts` | Mission service CRUD/assignment/claims | ✓ VERIFIED | Exports seed/assign/get/update/claim/expired functions |
| `src/constants/missionsData.ts` | 25 daily + 10 weekly definitions | ✓ VERIFIED | Arrays present with correct counts |
| `src/screens/home/HomeScreen.tsx` | Real mission data wiring + rotation | ✓ VERIFIED | Uses missionService + renders daily/weekly |
| `src/components/home/DailyMissions.tsx` | Progress display + expired section | ✓ VERIFIED | Renders progress bar and expired section |
| `src/components/home/WeeklyMissions.tsx` | Weekly mission display | ✓ VERIFIED | Renders 2 weekly missions with progress |
| `src/hooks/useMissionProgress.ts` | Event-based progress hook | ⚠️ ORPHANED | Hook exists but not called by action flows |
| `src/services/obteniblesService.ts` | Obtenibles seed + CRUD | ✓ VERIFIED | Seed + get/grant implemented |
| `src/constants/obteniblesData.ts` | ~30 item definitions | ✓ VERIFIED | 30 entries with rarity tiers |
| `src/components/profile/ProfileVitrina.tsx` | Vitrina grid UI | ✓ VERIFIED | Locked/unlocked states + rarity dot |
| `src/services/userAchievementsService.ts` | New achievements + rewardItemId | ✓ VERIFIED | `rewardItemId` + new definitions + handlers |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `missionService.ts` | `config/firebase.js` | `import { db }` | WIRED | `db` imported and used in Firestore calls |
| `missionService.ts` | `missionsData.ts` | `import { DAILY_MISSIONS, WEEKLY_MISSIONS }` | WIRED | Used in seed/assignment logic |
| `HomeScreen.tsx` | `missionService.ts` | `getUserMissions/assign.../claim...` | WIRED | Mission data fetched and rendered |
| `useMissionProgress.ts` | `missionService.ts` | `updateMissionProgress/getUserMissions` | WIRED | Hook uses mission service; but no external callers |
| `obteniblesService.ts` | `config/firebase.js` | `import { db }` | WIRED | Firestore access for obtenibles |
| `UserProfile.tsx` | `ProfileVitrina.tsx` | component import | WIRED | Vitrina tab renders component |
| `_layout.tsx` | seed functions | `seedMissions/seedObtenibles/seedAchievements` | WIRED | Seeds on app init |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---------|---------------|--------|--------------------|--------|
| `DailyMissions` | `dailyMissions` | `getUserMissions()` + Firestore `missions/users` | Yes | ✓ FLOWING |
| `WeeklyMissions` | `weeklyMissions` | `getUserMissions()` + Firestore `missions/users` | Yes | ✓ FLOWING |
| `ProfileVitrina` | `vitrinaItems` | `getObteniblesWithStatus()` + Firestore `obtenibles/users` | Yes | ✓ FLOWING |
| `Achievements` | `achievements` | `getUserAchievements()` + Firestore `achievements/users` | Yes | ✓ FLOWING |

### Behavioral Spot-Checks

**Step 7b: SKIPPED** (no runnable entry points without starting the app or services)

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|------------|-------------|-------------|--------|----------|
| MISS-01 | 07-01/07-02 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| MISS-02 | 07-01/07-02 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| MISS-03 | 07-01/07-02 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| MISS-04 | 07-03 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| MISS-05 | 07-03 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| MISS-06 | 07-02/07-03 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| OBT-01 | 07-01/07-04 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| OBT-02 | 07-04 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| ACH-02 | 07-05 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| ACH-03 | 07-05 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| ACH-04 | 07-05 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |
| ACH-05 | 07-04/07-05 | Not found in REQUIREMENTS.md | ✗ BLOCKED | Missing definition in REQUIREMENTS.md |

### Anti-Patterns Found

No phase-related stubs or TODOs detected in the modified mission/obtenible/achievement files.

### Human Verification Required

1. **HomeScreen mission UI**

**Test:** Open HomeScreen with a seeded user and missions assigned
**Expected:** 5 daily missions, 2 weekly missions, visible progress bars, claim buttons, and expired section styling
**Why human:** Visual/UX correctness requires manual inspection

2. **Profile vitrina grid**

**Test:** Open Profile → Vitrina tab with some obtained items
**Expected:** Locked/unlocked styles visible; rarity indicators display correctly
**Why human:** Visual styling cannot be verified programmatically

### Gaps Summary

Mission progress is not actually updated by user actions because `reportProgress()` is never called from identify/water/scan/share flows. Additionally, expired missions are not time-bound; any older unclaimed missions can still be claimed, violating the grace-period cutoff. Finally, Phase 07 requirement IDs referenced in plan frontmatter are missing from REQUIREMENTS.md, blocking traceability.

---

_Verified: 2026-05-23T21:34:19Z_
_Verifier: the agent (gsd-verifier)_
