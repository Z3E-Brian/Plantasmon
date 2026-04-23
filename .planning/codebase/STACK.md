# Technology Stack

**Analysis Date:** 2026-04-22

## Languages

**Primary:**
- **TypeScript** 5.9.2 - All app code (`.ts`, `.tsx`)
- **JavaScript** (React Native) - Runtime

**Secondary:**
- None

## Runtime

**Environment:**
- **React Native** 0.81.5
- **Expo** 54.0.33 (managed workflow)
- **Node.js** (dev)

**Package Manager:**
- **npm** (bundled with Node.js)
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- **Expo SDK** 54 - Application framework
- **expo-router** 6.0.23 - File-based routing (app directory)
- **React** 19.1.0 - UI library

**Navigation:**
- **@react-navigation/native** 7.1.8 - Navigation core
- **@react-navigation/bottom-tabs** 7.4.0 - Bottom tab navigator
- **@react-navigation/elements** 2.6.3 - Navigation UI components
- Native stack via expo-router

**Form Handling:**
- **react-hook-form** 7.72.0 - Form management
- **@hookform/resolvers** 5.2.2 - Hookform integration
- **zod** 4.3.6 - Schema validation

**State & Storage:**
- **@react-native-async-storage/async-storage** 2.2.0 - Local persistence

**Backend:**
- **firebase** 12.11.0 - Auth & Firestore

## Key Dependencies

**Critical:**
- `expo` ~54.0.33 - Core Expo framework
- `expo-router` ~6.0.23 - File-based routing
- `react-native` 0.81.5 - React Native runtime
- `firebase` 12.11.0 - Firebase SDK

**UI & Animation:**
- `react-native-reanimated` 4.1.1 - Animations
- `react-native-gesture-handler` 2.28.0 - Gestures
- `react-native-safe-area-context` 5.6.0 - Safe area handling
- `react-native-screens` 4.16.0 - Native screens optimization
- `expo-image` 3.0.11 - Image component
- `expo-haptics` 15.0.8 - Haptic feedback

**Forms & Validation:**
- `react-hook-form` 7.72.0 - Form hooks
- `@hookform/resolvers` 5.2.2 - Zod integration
- `zod` 4.3.6 - Schema validation

**Data Persistence:**
- `@react-native-async-storage/async-storage` 2.2.0 - AsyncStorage

**Toast/Notifications:**
- `react-native-toast-message` 2.3.3 - Toast messages
- `expo-notifications` (implied via expo) - Push notifications

## Configuration

**Environment:**
- Firebase config in `src/config/firebase.js` (hardcoded, not env-based)
- No `.env` file protection needed (config is public Firebase config)

**Build:**
- `app.json` - Expo config
- `tsconfig.json` - TypeScript config
- `eas.json` - EAS Build config

**Platform Requirements:**

**Development:**
- Node.js, Expo CLI
- Android Studio (for Android build)
- Xcode (for iOS, macOS only)

**Production:**
- Expo EAS (builds)
- Google Play / Apple App Store

---

*Stack analysis: 2026-04-22*