# Architecture

**Analysis Date:** 2026-04-22

## Pattern Overview

**Overall:** React Native + Expo with file-based routing (expo-router)

**Key Characteristics:**
- File-based routing: Routes defined in `app/` directory as file routes
- Component-based: UI built from modular components in `src/components/`
- Service layer: Business logic in `src/services/` (Firebase interactions)
- Hook abstraction: Custom hooks for state management in `src/hooks/`

## Layers

**Routing Layer (app/):**
- Purpose: File-based routes using expo-router
- Location: `app/`
- Contains: Route files that map to URL paths
- Depends on: Components and services
- Used by: Navigation system

**Screen Layer (src/screens/):**
- Purpose: Screen-level components composing features
- Location: `src/screens/auth/`, `src/screens/home/`, `src/screens/userProfile/`, `src/screens/editProfile/`
- Contains: Full page components with state management
- Depends on: UI components, services, hooks

**Component Layer (src/components/):**
- Purpose: Reusable UI building blocks
- Location: `src/components/ui/`, `src/components/home/`, `src/components/profile/`, `src/components/forms/`
- Contains: Buttons, cards, inputs, lists
- Depends on: Design system constants

**Service Layer (src/services/):**
- Purpose: Business logic and Firebase interactions
- Location: `src/services/`
- Contains: Auth, user, plants, achievements services
- Depends on: Firebase config

**Hooks Layer (src/hooks/):**
- Purpose: Component state and logic reuse
- Location: `src/hooks/`
- Contains: useAuth, useProfile, useToast, etc.
- Depends on: Services or context

**Config Layer (src/config/):**
- Purpose: Firebase initialization
- Location: `src/config/firebase.js`
- Contains: Firebase app, auth, firestore instances

**Constants Layer (src/constants/):**
- Purpose: Theme, design tokens, static data
- Location: `src/constants/`
- Contains: Theme colors, titles, badges

## Data Flow

**User Login Flow:**
1. User enters credentials in `loginScreen.tsx`
2. `authService.login()` called
3. Firebase Auth validates credentials
4. Auth state listener in `_layout.tsx` receives user
5. Navigation guard checks auth state
6. User redirected to home

**Plant Identification Flow:**
1. User enters plant ID in `identify.tsx`
2. System fetches plant from Firestore `plants` collection
3. Plant added to user's `userPlants` array in Firestore
4. User collection updates

**Profile Update Flow:**
1. User edits profile in `editProfile.tsx`
2. `userService.updateUserBio()` called
3. Firestore user document updated

## Key Abstractions

**Auth Service:**
- Purpose: Handle Firebase Auth operations
- Examples: `src/services/authService.ts`
- Pattern: Named exports for auth operations

**User Service:**
- Purpose: User profile CRUD
- Examples: `src/services/userService.ts`
- Pattern: Async functions with Firestore

**UserPlants Service:**
- Purpose: User's plant collection management
- Examples: `src/services/userPlantsService.ts`
- Pattern: Async functions with Firestore

**Form Schema:**
- Purpose: Zod validation schemas
- Examples: `src/schemas/editProfileSchema.ts`
- Pattern: Zod schema export with type inference

## Entry Points

**Root Entry (app/_layout.tsx):**
- Location: `app/_layout.tsx`
- Triggers: App launch
- Responsibilities: Auth state listening, navigation guards, layout

**Home (app/index.tsx):**
- Location: `app/index.tsx`
- Triggers: GET `/`
- Responsibilities: Home screen rendering

## Error Handling

**Strategy:** Try-catch with Alert/Toast messages

**Patterns:**
- Service errors: Caught and re-thrown with mapped messages
- Form errors: Zod validation with displayed errors
- UI errors: Alert.alert() for user feedback, console.error() for devs

## Cross-Cutting Concerns

**Logging:** console.log/console.error scattered throughout

**Validation:** Zod schemas via react-hook-form resolvers

**Authentication:** Firebase Auth with state observer in _layout

**Theme:** Theme constants in `src/constants/theme.ts` with useAppTheme/useThemedStyles hooks

---

*Architecture analysis: 2026-04-22*