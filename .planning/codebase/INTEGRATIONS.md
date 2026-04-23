# External Integrations

**Analysis Date:** 2026-04-22

## APIs & External Services

**Firebase:**
- Firebase Auth - Email/password authentication, Google OAuth (incomplete)
- Firebase Firestore - NoSQL database
- Platform: Firebase (Google)
- Project: `plantasmon-32e0b`

**Authentication:**
- Firebase Auth with email/password
- Google OAuth (partially implemented - OAuth flow exists but `loginWithGoogle` not wired)
- Implementation: `src/services/authService.ts`

## Data Storage

**Databases:**
- **Firebase Firestore**
  - Connection: `src/config/firebase.js` (hardcoded config)
  - Client: Firebase SDK
  - Collections: `users`, `plants`, `achievements`

**Local Storage:**
- `@react-native-async-storage/async-storage` - React Native persistence for auth session
- Location: React Native AsyncStorage

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Firebase Auth
  - Implementation: `src/services/authService.ts` with persistence
  - Methods: Email/password, Google OAuth (stubbed)

**Google Sign-In:**
- Configured in `src/config/firebase.js` and `src/hooks/useAuth.ts`
- Android Client ID: `675783066748-t4sb8dm8rotuu5g0q07c9tahk4kdl0jj.apps.googleusercontent.com`
- Status: OAuth flow exists but login handler throws "not implemented" error

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Crashlytics, etc.)

**Logs:**
- Console.log statements throughout codebase
- No structured logging

## CI/CD & Deployment

**Hosting:**
- Expo EAS (managed builds)
- Google Play Store (Android)
- Apple App Store (iOS)

**CI Pipeline:**
- None detected (no GitHub Actions, etc.)

**Builds:**
- `eas.json` - Expo EAS configuration exists

## Environment Configuration

**Required config (hardcoded in `src/config/firebase.js`):**
```javascript
{
  apiKey: "AIzaSyB1Xj_H9WcB3Ld8NqwWTKDXE1t53H-CTks",
  authDomain: "plantasmon-32e0b.firebaseapp.com",
  projectId: "plantasmon-32e0b",
  storageBucket: "plantasmon-32e0b.firebasestorage.app",
  messagingSenderId: "988204932281",
  appId: "1:988204932281:web:a83308fb2e94d05e2a8f68",
}
```

**Secrets location:**
- Firebase config is exposed in `src/config/firebase.js` (public-facing project ID)

## Webhooks & Callbacks

**Incoming:**
- None detected (no webhook endpoints)

**Outgoing:**
- None detected

---

*Integration audit: 2026-04-22*