# Plan 01-03 Summary: Register Screen

## Objective
Create the missing registration flow: route, form screen, Firestore init, and auto-login.

## Changes

### app/register.tsx (new)
- Expo Router route wrapping RegisterScreen (matches /login pattern)

### src/screens/auth/registerScreen.tsx (new)
- Full register form: email, password, confirm password
- Local validation: empty fields, password min 6 chars, passwords match
- On submit: `register()` from authService → `createUserDocument()` from userService → `router.replace("/")`
- UI matches login screen exactly: ScreenWrapper, KeyboardAvoidingView, brand block, form card, error box, Button
- "¿Ya tienes cuenta?" link to /login

### src/screens/auth/loginScreen.tsx
- Register link now calls `router.push("/register")` (antes comentado)

### app/_layout.tsx
- Added `<Stack.Screen name="register" />` to navigator

## TypeScript
Clean compile (only pre-existing shadcn/ui dependency errors)

## Files Modified
4 files, +282/-1 lines (1 new file)
- app/register.tsx (new)
- src/screens/auth/registerScreen.tsx (new)
- src/screens/auth/loginScreen.tsx
- app/_layout.tsx
