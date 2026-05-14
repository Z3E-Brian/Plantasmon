# Phase 4: 4 plants cards, home and general rewards - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Home screen improvements — add stats bar (account age, photos today, watering streak, last identification) and achievement/unlock system. Plant of the day with external API and level/progress system deferred.
</domain>

<decisions>
## Implementation Decisions

### Home — Stats Bar
- **D-01:** Add a stats bar at the top of the Home screen below the header with:
  - Days since account created (from `createdAt` field on user doc)
  - Photos taken "today" (filter user's plant identifications by current date)
  - Watering streak (continuous days watering; if lastWatered - today > 1, reset streak to 0)
  - Last identification (plant name + date from most recent identification — real data from Firestore, not a stub)

### Plant of the Day
- **D-02:** DEFERRED. Current random-plant-from-catalog won't work until there are enough plants (~100+). Will use an external API later. Remove or stub the current PlantOfTheDay component until then.

### Achievements System
- **D-03:** Create an achievements catalogue in Firestore (a `achievements` collection) with the initial set below. Each achievement has: `id`, `name`, `description`, `category`, `icon`, `requirement` (what triggers unlock), `isSecret` (boolean).

#### Achievement List (initial — user will add more later)

**Collection**
- First plant identified
- 5 plants identified
- 10 plants identified
- 25 plants identified
- 50 plants identified
- 3 different species
- 5 different species
- 10 different species

**Streak / Care**
- First watering logged
- 3-day watering streak
- 7-day watering streak
- 14-day watering streak
- 30-day watering streak
- 10 total waterings
- 50 total waterings
- 100 total waterings

**App Usage**
- First day in app
- 7 days active
- 30 days active
- 50 photos taken
- 100 photos taken

**Special**
- Identify a rare plant
- Complete all daily missions
- Customize your profile
- View 5 fun plant facts

- **D-04:** Unlock logic runs client-side (check achievement requirements after relevant user action). Unlocked achievements stored in user's subcollection or array field on user doc.
- **D-05:** Achievements visible on Profile screen (existing Achievements component) and/or a dedicated achievements section.
- **D-06:** Achievement badges can have locked/unlocked visual states.

### Deferred / Out of Scope
- **Level/progress system** — postponed, not designed yet
- **Plant of the day with external API** — deferred until catalog is large enough
- **Nivel** — no tocar por ahora

### Agent's Discretion
- Stats bar visual design (icons, layout within home screen)
- Achievement unlock check frequency (on mount, after action, periodic)
- Achievement UI details (toast on unlock, badge animation)
- Firestore schema design for achievements collection
- How to handle the PlantOfTheDay component in the meantime (hide, stub, repurpose)

</decisions>

<canonical_refs>
## Canonical References

### Project Context
- `.planning/ROADMAP.md` — Phase 4 goal and dependencies
- `.planning/PROJECT.md` — Core value and existing implementation
- `.planning/REQUIREMENTS.md` — Full requirements traceability

### Existing Code
- `src/screens/home/HomeScreen.tsx` — Current home screen layout (stats bar will be added here)
- `src/components/home/` — Existing home components (HomeHeader, PlantOfTheDay, LastIdentified, UserProgress, DailyMissions, RecentAchievement, TipCard)
- `src/components/profile/Achievements.tsx` — Existing achievements display (will be repurposed)
- `src/services/userAchievementsService.ts` — Existing achievements service
- `src/services/userService.ts` — User data (for account age, streak calculations)
- `src/services/userPlantsService.ts` — Plant identification records (for photos today, last ID)
- `src/constants/theme.ts` — Theme tokens for styling
- `app/index.tsx` — Routes to HomeScreen
- `app/profile.tsx` — Routes to UserProfile (where achievements display)

### Prior Context
- `.planning/phases/03-add-calendar-and-funcionality-to-missing-screens/03-CONTEXT.md` — Prior phase decisions
- `.planning/phases/02-lab3/02-CONTEXT.md` — Prior phase decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HomeScreen.tsx` — Existing layout with ScrollView, 7 components; stats bar fits naturally
- `Achievements.tsx` — Existing profile component for displaying achievements
- `userAchievementsService.ts` — Service layer for achievement data
- `userService.ts` — User profile data
- `userPlantsService.ts` — Plant identification history
- `DailyMissions.tsx` — Streak-like component pattern
- `ScreenWrapper` — Consistent container
- `useThemedStyles` — Theming system

### Established Patterns
- Service layer pattern (`src/services/*.ts`) for data access
- Firestore for persistent data
- Spanish UI labels throughout
- File-based routing with expo-router
- Component composition in home screen (Header + cards + scroll)

### Integration Points
- Stats bar → userService (account age) + userPlantsService (photos, last ID) + watering records
- Achievements → new Firestore `achievements` collection + userAchievementsService + profile screen
- Unlock logic → hooks checking post-action conditions

</code_context>

<specifics>
## Specific Ideas

- Stats bar as a horizontal row of 4 stat items with icons below the HomeHeader
- Achievement unlock: subtle toast/notification when a new achievement is unlocked
- "Hoy" means the current device date, used to determine photos taken today
- Watering streak stored as a user field (lastWatered date, currentStreak count)
- When user logs watering: if today - lastWatered == 1, increment streak; if >1, reset to 1; if 0, no change

</specifics>

<deferred>
## Deferred Ideas

- **Plant of the day (external API)** — Not enough plants in catalog yet. Needs ~100+ or external API integration. Future phase.
- **Level/progress system** — Postponed indefinitely, not designed.
- **More achievements** — User will add more later, not part of initial planning.

</deferred>

---

*Phase: 04-4-plants-cards-home-and-general-rewards*
*Context gathered: 2026-05-13*
