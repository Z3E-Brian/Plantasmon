---
phase: "04-4-plants-cards-home-and-general-rewards"
plan: "03"
type: "execute"
subsystem: "achievements"
tags: ["achievements", "profile", "firestore", "ui"]
requires: ["04-02"]
provides: ["achievement-display-end-to-end"]
affects:
  - "src/components/profile/Achievements.tsx"
  - "src/screens/userProfile/UserProfile.tsx"
  - "src/services/userAchievementsService.ts"
  - "src/styles/themedStyles.ts"
tech-stack:
  added: []
  patterns: ["category-grouped-grid", "progress-bar-in-achievement-card", "opacity-locked-state"]
key-files:
  created: []
  modified:
    - path: "src/components/profile/Achievements.tsx"
      summary: "Complete rewrite — locked/unlocked visual states, category dividers, progress bars, Spanish labels, 14-emoji map"
    - path: "src/screens/userProfile/UserProfile.tsx"
      summary: "Wrap Achievements component in padded View inside badges tab"
    - path: "src/services/userAchievementsService.ts"
      summary: "Add category field to UserAchievement interface and map it from Firestore"
    - path: "src/styles/themedStyles.ts"
      summary: "Add category divider, earned badge, and progress bar styles; fix locked opacity to 0.4"
decisions: []
metrics:
  duration: ""
  completed_date: "2026-05-14"
---

# Phase 04-4 Plan 03: Achievements — Locked/Unlocked Visual States

**One-liner:** Wire live Firestore achievement data into Achievements component on Profile screen with category-grouped grid, locked (40% opacity, "?" icon) / unlocked (full color, emoji, check badge) visual states, progress bars, and Spanish labels.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Update Achievements component with locked/unlocked visual states and live data | aa1b33b | `Achievements.tsx`, `userAchievementsService.ts`, `themedStyles.ts` |
| 2 | Wire Profile screen to show achievements from Firestore | 369095e | `UserProfile.tsx` |

### Task Details

**Task 1 — Achievements.tsx rewrite:**
- Expanded `EMOJI_MAP` from 7 to 14 entries (added: fire, calendar, camera, trophy, paint, book)
- Header shows `{earned}/{total} desbloqueados` in Spanish
- Added `category` to `UserAchievement` interface (Rule 2 — missing critical functionality for grouping)
- 4 category dividers: Colección, Racha y Cuidado, Uso, Especiales
- Locked state: `opacity: 0.4`, "❓" emoji, muted background
- Unlocked state: full color, emoji, check badge overlay in top-right corner
- Progress bar for achievements with `progress/target` but not yet earned
- Haptic feedback on press for unlocked achievements

**Task 2 — UserProfile.tsx wiring:**
- Already wired: `useProfile` returns achievements from `getUserAchievements`, Achievements rendered in badges tab
- Added `paddingHorizontal: 20, paddingTop: 12` View wrapper around Achievements for consistent spacing

## Deviations from Plan

### Rule 2 — Auto-add missing critical functionality

**1. Added `category` field to `UserAchievement` interface**
- **Found during:** Task 1
- **Issue:** The `UserAchievement` interface had no `category` field, making it impossible to group achievements by category for the dividers required by the plan
- **Fix:** Added `category: string` to the interface and mapped `global.category` from Firestore in `getUserAchievements()`
- **Files modified:** `src/services/userAchievementsService.ts`
- **Commit:** aa1b33b

### Rule 1 — Auto-fix style attribute

**1. Changed locked badge opacity from 0.5 to 0.4**
- **Found during:** Task 1
- **Issue:** The existing `badgeLocked` style used `opacity: 0.5` but the plan required `opacity: 0.4` per D-06
- **Fix:** Updated `badgeLocked` opacity in `createAchievementsStyles`
- **Files modified:** `src/styles/themedStyles.ts`
- **Commit:** aa1b33b

## Verification Results

- ✅ `npx tsc --noEmit`: No errors in modified files (pre-existing errors in `src/components/ui/*` unrelated to this plan)
- ✅ `"desbloqueados"` found in Achievements.tsx
- ✅ Category labels found: Colección, Racha, Uso, Especiales
- ✅ Achievements prop passed to component in UserProfile.tsx
- ✅ `badges` tab key exists
- ✅ `getUserAchievements` imported in useProfile.ts
- ✅ Locked opacity: 0.4 in themedStyles
- ✅ 14 EMOJI_MAP entries

## Success Criteria

| Criterion | Status |
|-----------|--------|
| Profile badges tab shows all achievements from Firestore | ✅ |
| Locked achievements at 40% opacity with "?" icon | ✅ |
| Unlocked achievements at full color with emoji | ✅ |
| Header shows "{earned}/{total} desbloqueados" | ✅ |
| 4 category dividers present | ✅ |

## Known Stubs

None — all achievement data comes from live Firestore via `getUserAchievements`.

## Threat Flags

None — no new security-relevant surface introduced.

## Self-Check: PASSED

All modified files exist and both commits are present in git history.
