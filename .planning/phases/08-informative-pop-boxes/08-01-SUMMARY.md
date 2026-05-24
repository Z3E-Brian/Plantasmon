---
phase: 08-informative-pop-boxes
plan: 01
type: execute
subsystem: data-layer
tags: [async-storage, popup-dismissal, service, hook, persistent-state]
requires: []
provides: [popupService, usePopupDismissal]
affects: []
tech-stack:
  added: []
  patterns:
    - "AsyncStorage key prefix @plantasmon/popup_ with namespacing"
    - "Per-session (popup_session:) and permanent (popup_forever:) dual-key strategy"
    - "try/catch with console.error in service layer"
    - "React hook with useState + useEffect + useCallback wrapping async service"
    - "Named exports (not default exports) following codebase pattern"
key-files:
  created:
    - src/services/popupService.ts
    - src/hooks/usePopupDismissal.ts
  modified: []
decisions:
  - "Dismissal check order: permanent first, then session (permanent takes precedence)"
  - "Fail-safe behavior: on AsyncStorage error, popup defaults to visible (never hidden)"
  - "autoCheck defaults to true in hook for convenience; caller can opt-out with autoCheck: false"
metrics:
  duration: 2m
  completed: "2026-05-24"
---

# Phase 8 Plan 1: Popup Dismissal Service + Hook — Summary

## One-liner

AsyncStorage-based popup dismissal tracking with dual-key strategy (per-session and permanent flags), wrapped in a React hook providing `{ visible, dismiss, dismissForeverFn, reset, checkDismissal }` for screens and components.

## Files Created

| File | Description |
|------|-------------|
| `src/services/popupService.ts` | AsyncStorage service with 4 named exports: isPopupDismissed, dismissPopup, dismissForever, resetPopup |
| `src/hooks/usePopupDismissal.ts` | React hook wrapping popupService with useState/useEffect/useCallback |

## popupService.ts — Key Design (D-04, D-05)

**Key Format:**
- Per-session: `@plantasmon/popup_session:{popupKey}` — resets between app restarts
- Permanent: `@plantasmon/popup_forever:{popupKey}` — persists forever

**Function Behavior:**

| Function | Session Key | Forever Key | When to Use |
|----------|-------------|-------------|-------------|
| `isPopupDismissed()` | Checks second | Checks first | "Should I show this popup?" |
| `dismissPopup()` | Sets "true" | Untouched | User taps "Entendido" (D-04) |
| `dismissForever()` | Sets "true" | Sets "true" | User checks "No mostrar de nuevo" (D-05) |
| `resetPopup()` | Removes | Removes | Dev/testing reset |

**Fail-safe:** All functions wrapped in try/catch with console.error. On AsyncStorage failure:
- `isPopupDismissed()` returns `false` → popup shown (safe default: never accidentally hide)
- Write operations re-throw so caller can handle if needed

## usePopupDismissal.ts — Hook Interface

```typescript
// Options
interface UsePopupDismissalOptions {
  popupKey: string;
  autoCheck?: boolean;  // default true
}

// Return
interface UsePopupDismissalReturn {
  visible: boolean;
  dismiss: () => Promise<void>;
  dismissForeverFn: () => Promise<void>;
  reset: () => Promise<void>;
  checkDismissal: () => Promise<void>;
}
```

**Behavior:**
- `visible` initialized to `false`; after `checkDismissal()` set to `!isPopupDismissed()`
- `useEffect` on mount: if `autoCheck !== false`, calls `checkDismissal()`
- All async functions wrapped in `useCallback([popupKey])`
- `popupKey` intentionally NOT in useEffect deps (stable per component usage)

## Verification Results

| Criterion | Status |
|-----------|--------|
| `npx tsc --noEmit` passes | ✅ No errors in either file |
| Both files exist at expected paths | ✅ |
| popupService.ts exports all 4 functions | ✅ `isPopupDismissed`, `dismissPopup`, `dismissForever`, `resetPopup` |
| usePopupDismissal.ts exports named function | ✅ `export function usePopupDismissal` |
| Key format matches spec | ✅ `@plantasmon/popup_session:{key}`, `@plantasmon/popup_forever:{key}` |
| Import from `@/src/services/popupService` in hook | ✅ |
| Try/catch with console.error in service | ✅ All 4 functions |
| Spanish comments/JSDoc | ✅ Following codebase convention |

## Deviations from Plan

None — plan executed exactly as written.

## Stub Tracking

No stubs present. Service and hook are fully functional:
- `popupService.ts`: All 4 functions implement complete AsyncStorage read/write/remove
- `usePopupDismissal.ts`: All 5 return members are fully wired to service calls with React state updates

## Threat Surface Scan

No new threat surface beyond what was anticipated in threat model:
- Local AsyncStorage only — no network boundaries
- Boolean flags only — no sensitive PII
- Fail-safe already designed: on storage error, popups default to visible

Threat register T-08-01 (tampering) disposition "accept" remains applicable.

## Self-Check: PASSED

- [x] `src/services/popupService.ts` exists (100 lines)
- [x] `src/hooks/usePopupDismissal.ts` exists (141 lines)
- [x] Commit `c121cdb` — feat(08-informative-pop-boxes-01): create popupService.ts
- [x] Commit `77936d0` — feat(08-informative-pop-boxes-01): create usePopupDismissal hook
- [x] Named exports verified via grep: `export async function` (4x) and `export function usePopupDismissal` (1x)
- [x] `AsyncStorage.setItem/getItem/removeItem` verified in popupService.ts
- [x] `useState/useEffect/useCallback` verified in usePopupDismissal.ts
- [x] TypeScript compiles with zero errors in both files
