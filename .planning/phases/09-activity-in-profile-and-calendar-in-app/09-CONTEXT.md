# Phase 9: activity in profile and calendar in app - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace hardcoded mock activity feed in profile with real Firestore data, and add a calendar screen showing plant care events (waterings, identifications, missions). Also add an inline calendar/timeline view on Home.

NOT building: push notifications for watering reminders, social activity sharing, recurring event editing.

</domain>

<decisions>
## Implementation Decisions

### Activity Feed — Data Source
- **D-01:** Subcolección `users/{uid}/activities` en Firestore
- **D-02:** Tipos de actividad: identificaciones, riegos, logros desbloqueados, misiones completadas
- **D-03:** Feed unificado cronológico (más reciente primero)
- **D-04:** Cada actividad guarda: `type` (identify|water|achievement|mission), `title`, `description`, `timestamp`, `iconType`, `metadata` (ej: plantName, missionId)
- **D-05:** Servicio `activityService.ts` con funciones: `logActivity`, `getUserActivities`, `getRecentActivities`

### Calendar — Placement
- **D-06:** Pantalla de calendario dedicada (nueva ruta/ruta en tabs)
- **D-07:** Timeline inline en Home mostrando eventos próximos/pasados (riego, IDs, misiones)

### Calendar — Library
- **D-08:** `react-native-calendars` (librería popular, probada, soporta marcado de días con colores)

### Calendar — Events Displayed
- **D-09:** Días con riego marcados en el calendario
- **D-10:** Días con identificaciones marcados
- **D-11:** Días con misiones completadas marcados
- **D-12:** Cada tipo de evento usa un color/punto diferente

### the agent's Discretion
- Color coding scheme for event types on calendar
- Activity feed pagination (infinite scroll or load more)
- Timeline layout on Home (card vs list)
- Animation for calendar transitions
- Exact icon emojis per activity type

</decisions>

<specifics>
## Specific Ideas

- "pantalla a parte y en home un time line o inline como sea" — dedicated calendar screen + inline timeline on Home
- Feed activity exists already with `ActivityFeed` component but hardcoded — need real service
- `react-native-calendars` preferred over expo-calendar or custom

</specifics>

<canonical_refs>
## Canonical References

### Existing Components (modify)
- `src/components/profile/ActivityFeed.tsx` — Timeline UI component, currently fed with mock
- `src/screens/userProfile/UserProfile.tsx:230` — Uses `ACTIVITIES` from `data.ts`

### Existing Constants (replace mock usage)
- `src/constants/data.ts` — `ACTIVITIES` mock array (remove or replace with service)

### Existing Services (patterns)
- `src/services/userService.ts` — Service pattern with Firestore subcollection reads
- `src/services/userPlantsService.ts` — Existing service for plant/watering data

### Calendar Library (to install)
- `react-native-calendars` — https://github.com/wix/react-native-calendars

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/profile/ActivityFeed.tsx` — Timeline component with types, dot, content layout
- `src/components/profile/ActivityFeed.tsx` — `ActivityData` interface (`id`, `type`, `title`, `description`, `time`, `iconType`)
- `src/services/userService.ts` — Pattern for Firestore subcollection access

### Established Patterns
- Service layer: `src/services/*.ts` with named exports, try/catch, console.error
- Hooks: `src/hooks/*.ts` wrapping services for React state
- Firestore subcollections: `users/{uid}/...` pattern established

### Integration Points
- `UserProfile.tsx` activity tab — replace `ACTIVITIES` mock with `useActivity()` hook
- HomeScreen — add inline timeline component after/daily-missions section
- New calendar screen — new route or tab
- `userPlantsService.ts` — watering data source for calendar events
- `missionService.ts` — mission completion data for calendar markers

</code_context>

<deferred>
## Deferred Ideas

- Push notification reminders for watering — separate phase
- Recurring event editing — not needed for v1
- Social activity sharing — out of scope

</deferred>

---

*Phase: 09-activity-in-profile-and-calendar-in-app*
*Context gathered: 2026-05-24*
