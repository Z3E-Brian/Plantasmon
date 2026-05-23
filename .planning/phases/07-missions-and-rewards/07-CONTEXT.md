# Phase 7: missions and rewards - Context

**Gathered:** 2026-05-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Daily and weekly mission system with XP rewards. Users get 5 daily missions and 2 weekly missions that rotate. Completing missions grants XP with a claim-on-tap flow. ~30 obtainable cosmetic items (stamps/emblems) in Firestore with rarity tiers, displayed in a profile showcase. New achievements for streak, account age, weekly active milestones — extensible to grant items later.

NOT building: level/progress system (deferred Phase 4), walking missions (dropped), achievement system itself (Phase 4 done), social features (out of scope).
</domain>

<decisions>
## Implementation Decisions

### Mission System
- **D-01:** 25 daily missions in Firestore. Show 5 per day. Rotate when `today !== lastDailyRefresh`.
- **D-02:** 10 weekly missions in Firestore. Show 2 per week. Rotate when `currentWeek !== lastWeeklyRefresh`.
- **D-03:** Walking/"caminar" missions excluded. System designed to be extensible for future mission types.
- **D-04:** Mission definitions stored in Firestore collection (`missions`). User document tracks: assigned daily mission IDs, assigned weekly mission IDs, completion progress per mission, `lastDailyRefresh` date, `lastWeeklyRefresh` week number.
- **D-05:** Multi-stage progress tracking (e.g., "0/3 plants identified") — progress field on each mission assignment.
- **D-06:** All 5 daily missions visible from the start. App is casual — some missions can't be completed instantly anyway.
- **D-07:** Weekly "active" defined as completing missions with intent, not merely opening the app.

### Completion & Rewards
- **D-08:** Completion detection is event-based: after identify, water, scan, share actions, check if relevant missions are affected and update progress.
- **D-09:** User must tap to claim reward. On claim, show animation or alert confirming the reward.
- **D-10:** Grace period: previous day's missions remain visible as "expired" and claimable until midnight of the following day.
- **D-11:** Unclaimed rewards after grace period are permanently lost.
- **D-12:** Reward is XP for now. System architecture must be extensible so future missions and achievements can grant items instead of/in addition to XP.

### Obtainable Items
- **D-13:** ~30 cosmetic items stored in Firestore (`obtenibles` collection).
- **D-14:** Rarity tiers: Común (50%), Raro (25%), Épico (15%), Legendario (10%).
- **D-15:** User profile tracks which items have been obtained (array or subcollection on user doc).
- **D-16:** Items displayed in a "showcase" / vitrina on the Profile screen.
- **D-17:** Items obtainable through missions, achievements, or future mechanics.

### New Achievements (add to Firestore `achievements` collection)
- **D-18:** Streak achievements based on `longestStreak` (historical max), not `currentStreak` (which can reset). Add `longestStreak` to user profile if not already present.
- **D-19:** Account age achievements: 100 days active, 1 year active.
- **D-20:** Weekly active achievement: complete all missions in a week.
- **D-21:** Achievements can optionally grant an obtainable item on completion. Architecture supports `rewardItemId` field on achievement definition.
- **D-22:** Logros nuevos semanales: después de X días de racha, 100 días de cuenta, 1 semana activa.

### Agent's Discretion
- Exact mission list (25 daily + 10 weekly) — derive from existing patterns (identify, water, share, scan, streak actions).
- Exact obtainable item list (~30) — design fitting the plant theme.
- Rarity distribution within obtainables (50/25/15/10 guideline).
- Animation/alert implementation for reward claim (toast, modal, custom animation).
- Firestore schema design for missions, obtenibles, and user tracking.
- UI for the vitrina showcase on Profile screen.
- "Expired" visual treatment for grace-period missions.

</decisions>

<canonical_refs>
## Canonical References

### Project Context
- `.planning/ROADMAP.md` — Phase 7 goal and dependencies
- `.planning/PROJECT.md` — Core value and existing implementation
- `.planning/REQUIREMENTS.md` — Full requirements traceability
- `.planning/STATE.md` — Current progress

### Prior Phase Decisions
- `.planning/phases/04-4-plants-cards-home-and-general-rewards/04-CONTEXT.md` — D-04 (client-side unlock logic), D-06 (locked/unlocked visual states), achievement list

### Existing Code
- `src/services/userAchievementsService.ts` — Existing achievements service (extend for item grants)
- `src/services/userService.ts` — User profile, xp field, update functions
- `src/components/home/DailyMissions.tsx` — Existing mission display component (accepts missions prop)
- `src/components/home/UserProgress.tsx` — XP/level progress display
- `src/services/userPlantsService.ts` — Plant identification records (for mission completion triggers)
- `src/constants/data.ts` — DAILY_MISSIONS mock (replace with real data)
- `src/screens/home/HomeScreen.tsx` — Where DailyMissions is rendered (parent passes data)
- `src/screens/userProfile/UserProfile.tsx` — Where vitrina would display
- `src/hooks/useProfile.ts` — Profile data fetching pattern

### Code Patterns
- `.planning/codebase/STRUCTURE.md` — Directory layout and conventions
- `.planning/codebase/CONVENTIONS.md` — Naming and code style
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DailyMissions.tsx` — Accepts `missions` prop, renders list with status icons and XP badges. Reuse as-is.
- `UserProgress.tsx` — Shows level/xp progress. Reward XP should update this automatically.
- `UserProfile.tsx` — Tab-based layout (collection/activity/badges). Add vitrina as new tab or section.
- `userAchievementsService.ts` — Pattern for Firestore collection + user tracking. Replicate for missions + obtenibles.
- `useProfile()` hook — Fetches user + plants + achievements. Extend to fetch missions + items.
- `Badge` component — Used in DailyMissions for XP display. Available in `src/components/ui/badge`.

### Established Patterns
- Service layer pattern: `src/services/<feature>Service.ts`
- Firestore for all persistent data
- Spanish UI labels throughout
- File-based routing with expo-router
- Component composition in home screen (Header + cards + ScrollView)
- User data fetched via hooks with loading/error states

### Integration Points
- HomeScreen → DailyMissions (already wired to accept props; replace mock with real mission data)
- userService.userProfile → extend with `longestStreak`, mission tracking fields, obtained items
- ProfileScreen → add vitrina/obtenibles showcase
- Identify screen, Water action, Share action → trigger mission progress checks
- userAchievementsService → add `rewardItemId` support, add new achievement definitions
- Firestore: new collections `missions`, `obtenibles`; extend user doc with mission/obtenible tracking
</code_context>

<specifics>
## Specific Ideas

- Missions rotate based on simple date comparison: `today !== lastDailyRefresh` → reassign daily missions. `currentWeek !== lastWeeklyRefresh` → reassign weekly missions.
- Assignment logic: pick N random mission IDs from the pool. Deterministic seed so user gets same set all day even on refreshes.
- Grace period: missions from previous day shown in a separate "expired" section, can still claim until midnight.
- Claim animation: subtle particle/lottie animation when user taps to claim XP.
- Obtainable vitrina: scrollable grid of stamps/emblems with locked/unlocked visual state. Showcase only, no interaction needed yet.
- New achievements list:
  - Streak: 3-day, 7-day, 14-day, 30-day (based on longestStreak)
  - Account age: 100 days, 365 days
  - Weekly: complete all weekly missions in one week
</specifics>

<deferred>
## Deferred Ideas

- **Walking missions** — Dropped. Could be added later when pedometer/HealthKit integration is built.
- **Achievement → item grants** — Architecture should support it, but actual wiring of achievements granting items is deferred until a future phase.
- **Item gacha / random drops** — Not in scope now. Obtainables are granted deterministically via missions/achievements.
</deferred>

---

*Phase: 07-missions-and-rewards*
*Context gathered: 2026-05-23*
