# Phase 3: Calendar + Missing Screens - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the Explore screen stub and Journal screen stub — both currently show "Próximamente...". Calendar functionality deferred to future phase.
</domain>

<decisions>
## Implementation Decisions

### Explore Screen
- **D-01:** Show catalog of ALL plants from Firestore — browse-only, for users to discover plants
- **D-02:** Cards with image, plant name, and other useful fields from the Firestore `plants` collection (difficulty, watering frequency, rarity, etc.)
- **D-03:** Search bar at the top of the screen for filtering by name
- **D-04:** Categorization/filtering by type is extra — implement if straightforward, don't over-engineer

### Journal Screen
- **D-05:** Card-based layout (not tabs) — a scrollable feed/list of cards covering:
  - Analyzed plants (plants the user has identified and added)
  - Objectives / missions (daily tasks, care goals)
  - Progress indicators (achievements, plant collection stats)
  - Other useful info that fits the card format
- **D-06:** Not a simple event timeline — more of a dashboard/overview with actionable cards

### Calendar
- **D-07:** Deferred to a future phase — not in scope here

### Agent's Discretion
- Specific card designs and visual layout for both screens
- Search implementation (debounce, filter logic)
- Card content priority for Journal (which sections appear first)
- Navigation to plant detail from Explore cards

</decisions>

<canonical_refs>
## Canonical References

### Project Context
- `.planning/ROADMAP.md` — Phase 3 goal and dependencies
- `.planning/PROJECT.md` — Core value and existing implementation
- `.planning/REQUIREMENTS.md` — Full requirements traceability

### Existing Code
- `app/explore.tsx` — Current placeholder, to be replaced
- `app/journal.tsx` — Current placeholder, to be replaced
- `src/services/userPlantsService.ts` — User plant collection (for Journal)
- `src/services/userAchievementsService.ts` — Achievements (for Journal progress)
- `src/services/authService.ts` — Auth context for user-specific data

### Prior Context
- `.planning/phases/02-lab3/02-CONTEXT.md` — Prior phase decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ScreenWrapper` — consistent screen wrapper component
- `COLORS` theme constants — established styling
- `userPlantsService.ts` — user's identified plants (for Journal)
- `userAchievementsService.ts` — achievements data (for Journal progress)
- `SyncStatusIndicator.tsx` — sync status component

### Established Patterns
- Service layer pattern (`src/services/*.ts`) for data access
- Firestore for persistent data
- Spanish UI labels throughout
- File-based routing with expo-router
- Cards in `companionPlant.tsx` for reference layout patterns

### Integration Points
- Explore → Firestore `plants` collection → navigate to `/plant/[id]`
- Journal → user plant collection + achievements + missions data

</code_context>

<specifics>
## Specific Ideas

- Explore cards: image + plant name + badges (difficulty, watering, rarity) — similar card pattern to companionPlant screen
- Journal: multi-section card feed showing different aspects of user activity
- Search in Explore: simple text search filtering by plant name

</specifics>

<deferred>
## Deferred Ideas

- **Calendar functionality** — Moved to future phase. Was originally part of Phase 3 scope but user decided to postpone.

</deferred>

---

*Phase: 03-add-calendar-and-funcionality-to-missing-screens*
*Context gathered: 2026-05-13*
