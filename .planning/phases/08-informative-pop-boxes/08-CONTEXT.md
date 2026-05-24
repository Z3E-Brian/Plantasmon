# Phase 8: informative pop boxes - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Informative bottom-sheet popups across the app. Show explanations on first use of features, celebration popups on unlock (achievements/missions/items), and info tooltips on demand via icons. NOT building: tutorial walkthroughs, onboarding flows beyond first-use popups, settings for popup preferences.

</domain>

<decisions>
## Implementation Decisions

### Popover Triggers
- **D-01:** Auto-show on first use of a feature — displays until explicitly dismissed
- **D-02:** Auto-show on unlock — celebration popup when earning achievement, completing mission, obtaining vitrina item
- **D-03:** Manual trigger — info icon (ℹ️) on cards, sections, and editable areas for on-demand explanation

### First-Use Frequency
- **D-04:** Popups shown every session until user presses "Entendido" or "No mostrar de nuevo". Stored in AsyncStorage (or Firestore per-user).
- **D-05:** Once dismissed, never shows again for that feature.

### Visual Style
- **D-06:** Bottom sheet — panel slides up from bottom, draggable to dismiss. Modern feel, less intrusive than centered modal.
- **D-07:** Dark overlay behind the sheet.

### Dismiss Behavior
- **D-08:** Swipe down to dismiss + close button ("Entendido")
- **D-09:** No tap-outside-to-dismiss — user must intentionally close

### Screens Requiring Popups
- **📷 Camera / Identificar:** How identification works, camera permissions, first-use explanation
- **🏠 Home / Misiones:** Tooltip on mission tap showing description; popup on achievement/mission reward unlock
- **🖼️ Vitrina / Items:** Celebration popup when obtaining a new vitrina item
- **🔍 Explora / Catálogo:** Info icon on plant cards explaining what the user is seeing (UI explanation, not plant details)
- **📖 Journal:** First-use explanation of what each section shows (plants, missions, progress, achievements)
- **👤 Perfil:** Editable areas show "Esto se edita presionando el botón Editar perfil"

### Content Tone
- **D-10:** Playful with emojis. Friendly assistant tone. Examples:
  - "🌱 ¡Sacá una foto y descubrí qué planta tenés!"
  - "🎉 ¡Logro desbloqueado! Seguí así."
  - "📸 Tocá el ícono de cámara para identificar una planta"

### the agent's Discretion
- Exact emoji selection per popup
- Animation timing and easing
- Bottom sheet height (content-driven)
- AsyncStorage key naming convention
- Error state if popup data fails to load

</decisions>

<specifics>
## Specific Ideas

- "Cuando se desbloquea algo definitivamente" — celebration popups on unlock are highest priority
- Popups info should explain the UI, not plant biology
- Misiones: tap on mission card shows tooltip/popover with description of what to do
- Perfil: "Esto se edita con presionar el botón editar"

</specifics>

<canonical_refs>
## Canonical References

### Existing UI Components (reusable)
- `src/components/ui/dialog.tsx` — Dialog primitive (base for bottom sheet)
- `src/components/ui/sheet.tsx` — Sheet/slide panel component
- `src/components/ui/tooltip.tsx` — Tooltip component (for mission descriptions)
- `src/components/ui/popover.tsx` — Popover component
- `src/components/ui/sonner.tsx` — Toast/sonner for lightweight notifications

### Existing App Screens (integration points)
- `app/identify.tsx` + `src/screens/identify/CameraScreen.tsx` — Camera/identify screen
- `app/journal.tsx` — Journal screen
- `app/explore.tsx` — Explore/catalog screen
- `app/profile.tsx` + `src/screens/userProfile/UserProfile.tsx` — Profile screen
- `src/screens/home/HomeScreen.tsx` — Home screen with missions

### State & Persistence
- `src/services/userService.ts` — User profile service (for per-user popup dismissal tracking)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/sheet.tsx` — Bottom sheet component already exists, built on Radix dialog
- `src/components/ui/tooltip.tsx` — Tooltip for mission descriptions
- `src/components/ui/badge.tsx` — Badge component for info icon indicators
- `react-native-toast-message` — Already installed (used in EditProfileScreen)

### Established Patterns
- Modal/overlay pattern already used in ProfileHero settings panel
- Theme system via `useThemedStyles` hook — new components should follow same pattern
- AsyncStorage available for lightweight dismissal tracking
- Firestore available for per-user persistent state

### Integration Points
- HomeScreen: after `DailyMissions` and `RecentAchievement` sections
- Journal: after mission card section
- Camera: before/during first identify attempt
- Profile: in ProfileAbout section for editable hints
- Explore: info icon on PlantCard component
- Vitrina: on item obtain in ProfileVitrina

</code_context>

<deferred>
## Deferred Ideas

- Full onboarding tutorial walkthrough — separate phase if needed
- Popup preference settings screen — not needed for v1
- Analytics tracking of popup views — not in scope

</deferred>

---

*Phase: 08-informative-pop-boxes*
*Context gathered: 2026-05-24*
