# Technology Stack Research

**Project:** PlantasMon
**Research Date:** 2026-04-22
**Dimension:** Stack (Expo/React Native + Firebase Auth)
**Confidence:** HIGH (verified with npm registry, official docs, and 2026 articles)

---

## Executive Summary

Current stack is solid but needs three targeted improvements:
1. **Upgrade Firebase** from 12.11.0 → 12.12.1 (latest stable)
2. **Add `@react-native-google-signin/google-signin`** for Google OAuth (not the deprecated expo-auth-session)
3. **Environment variables** for Firebase config (security best practice)

The existing auth persistence setup is correct. The missing piece is the AuthContext pattern for consistent auth state management across screens.

---

## Current Stack Assessment

| Component | Current | Recommended | Status | Confidence |
|----------|---------|-------------|--------|------------|
| Expo SDK | 54.0.33 | 54.0.33 | ✓ Current | HIGH |
| React Native | 0.81.5 | 0.81.5 | ✓ Current | HIGH |
| TypeScript | 5.9.2 | ~5.9.2 | ✓ Current | HIGH |
| Firebase JS SDK | 12.11.0 | 12.12.1 | ⚠ Upgrade | HIGH |
| react-hook-form | 7.72.0 | 7.72.0 | ✓ Current | HIGH |
| zod | 4.3.6 | 4.3.6 | ✓ Current | HIGH |

---

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Expo SDK | 54 | Application framework | Current, stable, New Architecture ready |
| React Native | 0.81 | Runtime | Part of Expo 54 |
| TypeScript | ~5.9.2 | Type safety | Required by Expo SDK 54 |

### Firebase
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| firebase | 12.12.1 | Auth, Firestore, Storage | **Latest stable (upgrade from 12.11.0)** |
| @react-native-google-signin/google-signin | 16.1.2 | Google OAuth native | **Official recommended library for Google Sign-In** |
| @react-native-async-storage/async-storage | 2.2.0 | Auth persistence | Already configured, works correctly |

### Navigation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| expo-router | ~6.0.23 | File-based routing | Current implementation |
| @react-navigation/native | ^7.1.8 | Navigation core | Current implementation |
| @react-navigation/bottom-tabs | ^7.4.0 | Tab navigation | Current implementation |

### Forms & Validation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-hook-form | 7.72.0 | Form management | Already in use |
| @hookform/resolvers | 5.2.2 | Schema validation | Already in use |
| zod | 4.3.6 | Schema validation | Already in use |

### Animation & UI
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| react-native-reanimated | ~4.1.1 | Animations | New Architecture compatible |
| react-native-gesture-handler | ~2.28.0 | Gestures | Required by Reanimated v4 |
| react-native-safe-area-context | ~5.6.0 | Safe areas | Current implementation |
| react-native-screens | ~4.16.0 | Native screens | Performance optimization |

---

## Firebase Auth Best Practices

### 1. Auth State Management (CRITICAL)

**Problem:** No AuthContext currently exists. Each screen uses `auth.currentUser?.uid` or hardcoded user ID.

**Solution:** Create `AuthContext` with `onAuthStateChanged` observer:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Why:** Firebase checks persisted session asynchronously on app launch. Without loading state, protected screens flash unauthenticated UI before auth state resolves.

### 2. Firebase Config Security

**Current:** Hardcoded in `src/config/firebase.js`

**Recommended:** Environment variables via Expo secrets:

```bash
# Set secrets in Expo
eas secret:create --name FIREBASE_API_KEY --value your-api-key
eas secret:create --name FIREBASE_AUTH_DOMAIN --value your-project.firebaseapp.com
# etc.
```

```typescript
// src/config/firebase.ts (rename from .js to .ts)
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};
```

**app.json:**
```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "FIREBASE_API_KEY"
    }
  }
}
```

**Why:** Environment variables allow API key rotation without code changes. Firebase configs are public-safe but this is still a security best practice.

### 3. Google OAuth Integration

**Current:** Google Sign-In button exists but throws error (broken)

**Recommended:** `@react-native-google-signin/google-signin` 16.1.2

**NOT:** `expo-auth-session` Google provider — **deprecated** per Expo team (see expo/expo#32468)

**Installation:**
```bash
npm install @react-native-google-signin/google-signin
npx expo prebuild  # Required for native modules
```

**app.json plugin:**
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "webClientId": "<GOOGLE_WEB_CLIENT_ID>",
          "offlineAccess": false
        }
      ]
    ]
  }
}
```

**Firebase Auth integration:**
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebase';

export async function signInWithGoogle(): Promise<void> {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}
```

**Critical SHA-1 fingerprint requirement:**
For Android production builds, you MUST register the Play App Signing SHA-1 in Firebase Console:
1. Upload key (debug) — found via `expo fetch:android:hashes`
2. App signing key — found in Google Play Console > Release > Setup > App Integrity
3. Upload key — found in Google Play Console

Without all three fingerprints, Google Sign-In fails silently on production APK.

### 4. Auth Persistence (Already Correct)

**Current:** Correctly configured with AsyncStorage persistence:

```typescript
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
```

This is correct. No changes needed.

### 5. Route Guards

**Pattern:** Redirect to login if not authenticated:

```typescript
// In protected screen
const { user, loading } = useAuth();

if (loading) {
  return <LoadingScreen />;
}

if (!user) {
  router.replace('/auth/login');
  return null;
}
```

---

## What NOT to Use and Why

| Anti-Pattern | Why Avoid |
|-------------|-----------|
| `expo-auth-session` Google provider | **Deprecated** per Expo team. Use `@react-native-google-signin/google-signin` instead. |
| Hardcoded Firebase config | Cannot rotate API keys without code changes. Use environment variables. |
| Direct `auth.currentUser?.uid` in services | Creates multiple auth state listeners. Use AuthContext. |
| Storing tokens in AsyncStorage directly | Firebase Auth handles persistence correctly. Duplicating this creates sync issues. |
| `expo-google-sign-in` | Deprecated in favor of `@react-native-google-signin/google-signin` |

---

## Installation Commands

```bash
# Upgrade Firebase to latest
npm install firebase@12.12.1

# Add Google Sign-In (requires prebuild)
npm install @react-native-google-signin/google-signin@16.1.2

# After adding native module
npx expo prebuild
```

---

## Sources

| Source | Confidence | What It Verifies |
|-------|------------|-----------------|
| npm show firebase versions | HIGH | Current Firebase version (12.12.1) |
| npm show @react-native-google-signin/google-signin versions | HIGH | Current Google Sign-In version (16.1.2) |
| Expo Changelog SDK 54 (2025-09-10) | HIGH | Expo 54 requirements |
| Expo Google Authentication Guide (docs.expo.dev) | HIGH | Official Google Sign-In setup |
| nourkitab.com Firebase + Expo Router (2026-03-05) | MEDIUM | Integration patterns |
| Google Sign-In Guide - Sergio Lema (2026-03-09) | MEDIUM | Production SHA-1 fingerprints |
| expo/expo#32468 GitHub issue | HIGH | expo-auth-session deprecation |
| Upgrade Expo 54 + RN 0.81 (Medium, 2025-09-12) | MEDIUM | Version migration |
| EloByte SDK 54 upgrade experience (2026-01-06) | MEDIUM | New Architecture notes |

---

*Research for STACK.md — Phase 6: Research*