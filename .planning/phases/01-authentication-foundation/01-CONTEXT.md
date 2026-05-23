# Phase 1: Authentication Foundation - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can securely log in with their own identity, and all screens display user-specific data. Replace the hardcoded `u_001` with real Firebase Auth UIDs. Fix Google OAuth. Create the register screen. Initialize user data on first registration.
</domain>

<decisions>
## Implementation Decisions

### Register Screen
- **D-01:** Standard form: email, password, confirm password
- **D-02:** Auto-login after successful registration
- **D-03:** Route: `/register` (top-level route, `app/register.tsx`, matching `/login` pattern)
- **D-04:** Match existing login screen UI style (COLORS, fonts, spacing, ScreenWrapper, KeyboardAvoidingView, scroll)

### Dynamic User ID Migration
- **D-05:** Create a `getCurrentUserId()` helper in `userService.ts` that reads `auth.currentUser?.uid`
- **D-06:** Services (`userService`, `userPlantsService`, `userAchievementsService`) use this helper internally
- **D-07:** Remove the `CURRENT_USER_ID = "u_001"` constant entirely
- **D-08:** Keep explicit `userId` parameter for callers that need to override (admin scenarios) — but drop the default value

### Google OAuth Fix
- **D-09:** Keep existing `expo-auth-session/providers/google` setup (`promptAsync`, `Google.useIdTokenAuthRequest`)
- **D-10:** Fix `handleGoogleToken` in `loginScreen.tsx`: create `GoogleAuthProvider.credential(idToken)` and call `signInWithCredential(auth, credential)` from Firebase Auth
- **D-11:** Remove the `throw new Error("no implementado")` in `handleGoogleToken`
- **D-12:** The `useAuth.ts` hook duplicates Google logic — consolidate or remove in favor of loginScreen's inline implementation

### New User Initialization
- **D-13:** On registration success, create a Firestore user doc with:
  - `createdAt` — server timestamp
  - `displayName` — derived from email (local part) or empty if not available
  - `email` — from auth
  - `plants` — empty array
  - `achievements` — empty array or no field
  - Default fields expected by existing components (e.g. `bio: ""`, `aboutme: ""`)
- **D-14:** `seedAchievements()` already exists and runs on mount in `_layout.tsx` — it will populate the achievements catalogue. No change needed there.

### Agent's Discretion
- Exact `getCurrentUserId()` helper implementation
- Register screen layout details (within login screen visual pattern)
- Error handling messages for register
- Zod schema for register form validation
- Consolidation strategy for `useAuth.ts` hook

</decisions>

<canonical_refs>
## Canonical References

### Project Context
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, requirements (AUTH-01 through AUTH-05, HOME-01 through HOME-05, PROF-01 through PROF-04)
- `.planning/PROJECT.md` — Core value and existing implementation
- `.planning/REQUIREMENTS.md` — Full requirements traceability

### Concerns
- `.planning/codebase/CONCERNS.md` — Known issues: hardcoded u_001, Google OAuth broken, missing register screen

### Existing Auth Code
- `src/screens/auth/loginScreen.tsx` — Login UI with email/password + Google button (pattern to follow for register)
- `src/screens/auth/registerScreen.tsx` — Empty file, to be implemented
- `src/services/authService.ts` — Firebase Auth wrapper (login, register, logout, resetPassword, onAuthChange)
- `src/hooks/useAuth.ts` — Google auth hook using expo-auth-session (may consolidate)
- `app/_layout.tsx` — Auth state observer, route protection, seedAchievements

### Services to Migrate
- `src/services/userService.ts` — Has CURRENT_USER_ID = "u_001", to be replaced
- `src/services/userPlantsService.ts` — Imports CURRENT_USER_ID
- `src/services/userAchievementsService.ts` — Imports CURRENT_USER_ID

### Prior Context
- `.planning/phases/04-4-plants-cards-home-and-general-rewards/04-CONTEXT.md` — Prior phase decisions
- `.planning/phases/03-add-calendar-and-funcionality-to-missing-screens/03-CONTEXT.md` — Prior phase decisions
- `.planning/phases/02-lab3/02-CONTEXT.md` — Prior phase decisions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/services/authService.ts` — login(), register(), logout(), resetPassword(), onAuthChange() — all work
- `src/screens/auth/loginScreen.tsx` — Full login screen UI pattern (ScreenWrapper, KeyboardAvoidingView, form card, error/success boxes, theme colors)
- `app/_layout.tsx` — onAuthChange observer + route redirection already in place
- `src/config/firebase.js` — Firebase app config (hardcoded, but functional)

### Established Patterns
- Spanish UI labels throughout
- ScreenWrapper + KeyboardAvoidingView + ScrollView for form screens
- Service layer pattern with try/catch and error mapping
- Zod for form validation (react-hook-form + zodResolver in other screens)
- `useAppTheme()` for theming

### Integration Points
- Register screen → authService.register() → create Firestore user doc → auto-redirect to home
- userService.getCurrentUserId() → consumed by userService, userPlantsService, userAchievementsService
- loginScreen Google button → handleGoogleToken → GoogleAuthProvider.credential → signInWithCredential

</code_context>

<specifics>
## Specific Ideas

- Register form: similar structure to login screen (brand block, form card, error box, submit button)
- Confirm password validates passwords match — local validation, not sent to Firebase
- After register + auto-login, `_layout.tsx` redirects to home automatically (existing onAuthChange logic handles this)
- Google OAuth fix is just adding ~3 lines in `handleGoogleToken` — the expo-auth-session flow already gets the id_token

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-authentication-foundation*
*Context gathered: 2026-05-14*
