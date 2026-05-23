---
phase: 07-missions-and-rewards
plan: 04
subsystem: obtenibles
tags: firestore, typescript, seed-data, obtenibles, vitrina, profile
requires:
  - phase: 07-missions-and-rewards
    plan: 01
    provides: obtainedItems field on user doc, seed pattern from missions
  - phase: 07-missions-and-rewards
    plan: 05
    provides: rewardItemId field on AchievementDefinition for future item grants
provides:
  - 30 cosmetic items with rarity tiers (50/25/15/10 distribution)
  - Obtenibles service layer: seed, CRUD, user item grant/lookup
  - ProfileVitrina component with rarity-colored grid display
  - Vitrina tab integrated as 4th tab on profile screen
  - Seed on app init in _layout.tsx
affects: future achievement→item grant wiring (rewardItemId populated on an achievement)
tech-stack:
  added: []
  patterns:
    - "Seed function follows existing seedAchievements() pattern (check empty → setDoc each)"
    - "ProfileVitrina uses useThemedStyles('profileVitrina') pattern for theming"
    - "Item grant uses arrayUnion for idempotent adding to user doc obtainedItems"
key-files:
  created:
    - src/constants/obteniblesData.ts
    - src/services/obteniblesService.ts
    - src/components/profile/ProfileVitrina.tsx
  modified:
    - src/styles/themedStyles.ts
    - src/screens/userProfile/UserProfile.tsx
    - app/_layout.tsx
key-decisions:
  - "30 items split across 4 rarity tiers: 15común/8raro/4épico/3legendario (53/27/13/10%)"
  - "Items stored in Firestore 'obtenibles' collection, user ownership via obtainedItems string[] on user doc"
  - "ProfileVitrina uses inline RARITY_COLORS (gray/blue/purple/gold) with colored borders for obtained items"
  - "Locked items show 0.4 opacity + lock overlay; unlocked show full color + rarity border + rarity dot"
  - "Vitrina data loaded via separate useEffect in UserProfile (not via useProfile hook)"
requirements-completed:
  - OBT-01
  - OBT-02
  - ACH-05
duration: 12min
completed: 2026-05-23
---

# Phase 07 Plan 04: Obtenible Items System + Profile Vitrina

**30 cosmetic items with rarity tiers (común/raro/épico/legendario), Firestore seed + service layer, and profile vitrina showcase as 4th tab on user profile screen**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-23T21:15:00Z
- **Completed:** 2026-05-23T21:27:00Z
- **Tasks:** 3
- **Files created:** 3
- **Files modified:** 3

## Accomplishments

- Created `obteniblesData.ts` with 30 cosmetic items in 4 rarity tiers (15 común, 8 raro, 4 épico, 3 legendario) — all plant/nature themed with Spanish names, descriptions, and emoji icons
- Created `obteniblesService.ts` with 6 exported functions:
  - `seedObtenibles()` — checks empty, iterates OBTENIBLES, setDoc each
  - `getObtenibleDefinitions()` — reads all docs from Firestore `obtenibles` collection
  - `getUserObtainedItems()` — reads `obtainedItems` array from user doc
  - `grantObtenibleItem()` — arrayUnion with duplicate check (T-07-08 mitigation)
  - `getObteniblesWithStatus()` — merges definitions with user ownership status
- Created `ProfileVitrina.tsx` component with:
  - Grid display (3 columns) with square cards (aspectRatio 1)
  - Rarity colors: gray/común, blue/raro, purple/épico, gold/legendario
  - Obtained items: full color, rarity border, rarity dot indicator
  - Locked items: 0.4 opacity, lock overlay, no rarity border
  - Pressable shows Alert with name, description, rarity label
  - Empty state: "Próximamente..."
- Extended `themedStyles.ts` with `createProfileVitrinaStyles` and registered `profileVitrina` component
- Added vitrina as 4th tab on `UserProfile.tsx` (TabKey: "vitrina", emoji: 🏆)
- Loads vitrina data via `useEffect` → `getObteniblesWithStatus`
- Wired `seedObtenibles()` in `app/_layout.tsx` alongside `seedAchievements()`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create obtenibles data + service** — `d421f51` (feat)
2. **Task 2: Create ProfileVitrina component** — `398ca90` (feat)
3. **Task 3: Wire vitrina into profile and seed on init** — `90a6d75` (feat)

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `src/constants/obteniblesData.ts` | Created | 30 item definitions, types (ObtenibleDefinition, RarityTier), getRarityDistribution |
| `src/services/obteniblesService.ts` | Created | 6 exported functions: seedObtenibles, getObtenibleDefinitions, getUserObtainedItems, grantObtenibleItem, getObteniblesWithStatus |
| `src/components/profile/ProfileVitrina.tsx` | Created | Vitrina grid component with rarity display, locked/unlocked states, Alert on press |
| `src/styles/themedStyles.ts` | Modified | Added createProfileVitrinaStyles, profileVitrina registration in stylesByComponent and StylesForComponent type |
| `src/screens/userProfile/UserProfile.tsx` | Modified | Added vitrina tab (4th), data loading useEffect, ProfileVitrina render |
| `app/_layout.tsx` | Modified | Added seedObtenibles import and call in init useEffect |

## Decisions Made

- **30 items (not ~30):** The plan specified "~30" with exact counts (15+8+4+3=30). Implemented exactly 30 items matching the specified distribution.
- **Separate useEffect for vitrina data:** Rather than extending `useProfile` hook, vitrina data is loaded via a standalone `useEffect` in UserProfile. Simpler than modifying the shared hook and keeps concerns separated.
- **ProfileVitrina uses its own themed styles:** Follows the same pattern as Achievements, with `createProfileVitrinaStyles` registered in `themedStyles.ts` and accessed via `useThemedStyles("profileVitrina")`.
- **grantObtenibleItem returns boolean:** Simple success/failure return for future callers (achievement grant flow). Not wired to any caller yet — deferred per D-21.
- **Inline RARITY_COLORS:** Color constants are defined in the component file rather than in the theme system — matches the existing Achievements.tsx pattern (EARNED_COLORS) and keeps rarity as a visual concept separate from app theming.

## Deviations from Plan

None — plan executed exactly as written.

### Auto-fixed Issues

None.

## Issues Encountered

None — all pre-existing TypeScript errors (companionPlant.tsx doc() call, UI component library missing modules) are unrelated to this plan's changes.

## Stub Tracking

No stubs introduced. ProfileVitrina receives real data from Firestore via `getObteniblesWithStatus`. Empty state "Próximamente..." is intentional for users with zero items obtained.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes introduced. Threat model mitigations (T-07-08: grantObtenibleItem uses getCurrentUserId + arrayUnion; T-07-09: definitions are read-only) are implemented.

## Next Phase Readiness

- Obtenibles service ready for future plan wiring (achievement→item grants, missions→item rewards)
- `rewardItemId` on `AchievementDefinition` (Plan 05) can now reference `obt_*` IDs from this plan's data
- Profile vitrina tab visible on profile immediately after seed runs

---

## Self-Check: PASSED

- ✅ `src/constants/obteniblesData.ts` — exists with 30 items (15común/8raro/4épico/3legendario)
- ✅ `src/services/obteniblesService.ts` — exists with 6 exported functions
- ✅ `src/components/profile/ProfileVitrina.tsx` — exists with exported function component
- ✅ Rarity distribution: 50% comunes / 27% raros / 13% épicos / 10% legendarios
- ✅ `npx tsc --noEmit` — no new errors (all pre-existing)
- ✅ Commit `d421f51` — feat: create obtenibles data + service
- ✅ Commit `398ca90` — feat: create ProfileVitrina component
- ✅ Commit `90a6d75` — feat: wire vitrina into profile and seed on init

*Phase: 07-missions-and-rewards*
*Completed: 2026-05-23*
