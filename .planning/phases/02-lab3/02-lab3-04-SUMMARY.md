---
phase: 02-lab3
plan: 04
subsystem: api
tags: [offline, sync, netinfo, asyncstorage, firebase]

requires:
  - phase: 02-lab3
    provides: offlineStorage service, syncService, SyncStatusIndicator, useNetworkStatus hook
provides:
  - Offline-first addUserPlant() with local save + sync queue
  - Auto-sync via setupAutoSync() called in app layout
  - Sync status indicator rendered in app UI
affects: [phase 3]

tech-stack:
  added: []
  patterns: [offline-first write pattern, sync queue for pending ops, auto-sync on reconnect]

key-files:
  modified:
    - app/_layout.tsx
    - src/services/userPlantsService.ts
    - src/services/offlineStorage.ts

key-decisions:
  - "Adapted addToSyncQueue call to single-object API instead of positional args (actual function signature differs from plan)"
  - "hasLocalPlant added as utility alongside existing savePlantLocal/getLocalPlants"

requirements-completed:
  - Offline support with local storage
  - Sync queue for pending operations

duration: 12min
completed: 2026-05-14
---

# Phase 2 Plan 4: Offline/Sync Wiring - Summary

**Offline-first plant saving with local storage, auto-sync on reconnect, and sync status indicator wired into app layout**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-14T14:30:00Z
- **Completed:** 2026-05-14T14:42:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- `app/_layout.tsx` now calls `setupAutoSync()` on mount when user is logged in, enabling auto-sync when connection restores
- `SyncStatusIndicator` rendered in app layout (visible on all navigated screens)
- `offlineStorage.ts` gains `hasLocalPlant()` utility function
- `addUserPlant()` fully rewritten with offline-first approach: saves locally first, then syncs to Firebase when online (or queues for later sync when offline)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update app/_layout.tsx — setupAutoSync + SyncStatusIndicator** - `6c71aeb` (feat)
2. **Task 2: Add hasLocalPlant to offlineStorage.ts** - `c6b17a3` (feat)
3. **Task 3: Offline-first addUserPlant with sync queue** - `b8671c6` (feat)

## Files Modified
- `app/_layout.tsx` — Imports and calls `setupAutoSync()` on mount, renders `SyncStatusIndicator` before `BottomNav` when user is logged in
- `src/services/offlineStorage.ts` — Added `hasLocalPlant()` to check if a plant exists in local storage
- `src/services/userPlantsService.ts` — Rewrote `addUserPlant()` with offline-first flow, added new fields to `AddPlantFromIdInput` interface (commonName, scientificName, waterSchedule, sunlight)

## Decisions Made
- **addToSyncQueue API adaptation**: The plan's code called `addToSyncQueue()` with positional arguments, but the actual function takes a single object parameter. Adapted the call to match the real signature.
- **hasLocalPlant added**: Included as a utility alongside the existing `savePlantLocal()`/`getLocalPlants()` even though not used in current code — available for future offline query needs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] addToSyncQueue called with positional args instead of single object**
- **Found during:** Task 3 (Offline-first addUserPlant)
- **Issue:** Plan code called `await addToSyncQueue(endpoint, method, data, id)` as separate positional arguments, but the actual `addToSyncQueue()` signature is `addToSyncQueue(op: Omit<SyncOperation, 'id' | 'timestamp'>)` — a single object parameter with `action`, `plantId`, `endpoint`, `method`, `data` fields.
- **Fix:** Changed call to `addToSyncQueue({ action, plantId, endpoint, method, data: JSON.stringify({...}) })` matching the real API
- **Files modified:** src/services/userPlantsService.ts
- **Verification:** TypeScript compiles without errors in our files
- **Committed in:** `b8671c6` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary fix for correctness — would have caused runtime crash. No scope creep.

## Issues Encountered
- None — the addToSyncQueue API mismatch was caught during implementation and fixed inline

## TypeScript Check
- `npx tsc --noEmit` passes for all modified files (pre-existing errors in `src/components/ui/` — shadcn web components unrelated to our changes)

## Next Phase Readiness
- Phase 2 gaps closed: offline storage, sync service, and sync status indicator are now wired into the app flow
- Ready for Phase 3 (Care Reminders) which can build on the offline/sync infrastructure

---
*Phase: 02-lab3*
*Completed: 2026-05-14*
