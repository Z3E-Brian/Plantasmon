# Plan 01-02 Summary: Google OAuth Fix

## Objective
Fix Google OAuth login by wiring Firebase credential exchange, and clean up duplicate auth logic.

## Changes

### src/screens/auth/loginScreen.tsx
- Added `GoogleAuthProvider` and `signInWithCredential` imports from `firebase/auth`
- Added `auth` import from `@/src/config/firebase`
- Replaced `handleGoogleToken`: removed `throw new Error("no implementado")`, now exchanges id_token for Firebase credential via `GoogleAuthProvider.credential(idToken)` + `signInWithCredential(auth, credential)`
- The `expo-auth-session/providers/google` flow (promptAsync) already worked — only the Firebase exchange was missing

### src/hooks/useAuth.ts
- Removed duplicate `Google.useIdTokenAuthRequest` logic that duplicated loginScreen's implementation
- Replaced with `export {}` placeholder for future generic auth hook

## TypeScript
Clean compile (only pre-existing shadcn/ui dependency errors)

## Files Modified
2 files, +14/-31 lines
- src/screens/auth/loginScreen.tsx
- src/hooks/useAuth.ts
