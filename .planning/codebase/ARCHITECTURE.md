# Architecture

**Analysis Date:** 2026-06-10

## Pattern Overview

**Overall:** Screen-based routing with service/data layer separation

**Key Characteristics:**
- **Expo Router file-based routing** — Each file under `app/` maps to a route, screens are imported from `src/screens/`
- **Service layer pattern** — Business logic and data access are encapsulated in `src/services/` files, screens and components call them directly
- **Custom hooks as state managers** — Hooks in `src/hooks/` wrap service calls with React state (loading, error, data), components consume these hooks
- **Global root layout** — `app/_layout.tsx` owns auth redirect, sync setup, bottom nav, FAB, and toast — single orchestration point
- **Screens delegate rendering to components** — Screen files (`src/screens/*/`) compose presentation components (`src/components/*/`) and hook into services
- **Backend split** — Node.js Express proxy for plant identification API, Python FastAPI for chat WebSocket server

## Layers

**Routing Layer (app/):**
- Purpose: File-based routing via Expo Router. Each file is a route that imports its screen component.
- Location: `app/`
- Contains: Thin route modules that re-export screen components (e.g., `app/index.tsx` → `import HomeScreen from "@/src/screens/home/HomeScreen"; export default HomeScreen`)
- Depends on: `src/screens/`
- Used by: Expo Router

**Screen Layer (src/screens/):**
- Purpose: Page-level components that compose UI sections, wire hooks, handle page-level state
- Location: `src/screens/`
- Contains: One directory per screen feature (e.g., `home/HomeScreen.tsx`, `auth/loginScreen.tsx`, `calendar/CalendarScreen.tsx`, `identify/CameraScreen.tsx`)
- Depends on: `src/hooks/`, `src/services/`, `src/components/`, `src/styles/`
- Used by: `app/` route modules

**Component Layer (src/components/):**
- Purpose: Reusable UI pieces organized by feature domain
- Location: `src/components/`
- Contains: Subdirectories per feature (`home/`, `profile/`, `chat/`, `calendar/`, `forms/`, `ui/`, `screenWrapper/`) plus shared components at top level like `SyncStatusIndicator.tsx`
- Depends on: `src/styles/`, `src/constants/`
- Used by: Screen layer

**Service Layer (src/services/):**
- Purpose: Data access, external API calls, business logic, offline storage, sync
- Location: `src/services/`
- Contains: 16 service modules (e.g., `authService.ts`, `userService.ts`, `missionService.ts`, `plantIdService.ts`, `syncService.ts`, `offlineStorage.ts`, `chatService.ts`)
- Depends on: `src/config/firebase.js`, external APIs
- Used by: Screens, hooks, `app/_layout.tsx`

**Hook Layer (src/hooks/):**
- Purpose: Encapsulate service calls with React state (loading/error/data) for easy consumption by screens
- Location: `src/hooks/`
- Contains: 11 hooks (e.g., `useAuth.ts`, `useCalendar.ts`, `useMissionProgress.ts`, `useNetworkStatus.ts`, `useProfile.ts`)
- Depends on: `src/services/`
- Used by: Screen layer

**Constants Layer (src/constants/):**
- Purpose: Static data, design tokens, mission definitions, theme colors
- Location: `src/constants/`
- Contains: `theme.ts`, `designSystem.ts`, `missionsData.ts`, `obteniblesData.ts`, `data.ts`
- Depends on: Nothing internal
- Used by: Components, services, styles

**Style Layer (src/styles/):**
- Purpose: Themed StyleSheet factories organized per component, with a central `useThemedStyles` hook
- Location: `src/styles/`
- Contains: `themedStyles.ts` (1761 lines) — factory functions like `createHomeScreenStyles(theme)`, `createExploreScreenStyles(theme)`, and a central `stylesByComponent` registry + `useThemedStyles(componentName)` hook
- Depends on: `src/constants/designSystem.ts`
- Used by: All screens and components

**Config Layer (src/config/):**
- Purpose: Firebase initialization (app, auth, Firestore, Storage)
- Location: `src/config/`
- Contains: `firebase.js`
- Depends on: `firebase` npm package
- Used by: All services

**Utility Layer (src/utils/):**
- Purpose: Shared pure utilities and crypto helpers
- Location: `src/utils/`
- Contains: `storage.ts`, `crypto.ts`
- Depends on: `@react-native-async-storage/async-storage`, `tweetnacl`, `@stablelib/*`
- Used by: Services, components

**Validation Layer (src/lib/, src/schemas/):**
- Purpose: Zod schemas for form validation and pure validation functions
- Location: `src/lib/` and `src/schemas/`
- Contains: `plantValidation.ts`, `utils.ts` (lib); `editProfileSchema.ts` (schemas)
- Depends on: `zod`
- Used by: Screen layer

**Type Layer (src/types/):**
- Purpose: TypeScript type definitions for cross-module models
- Location: `src/types/`
- Contains: `chat.ts` — ChatUser, ChatMessage, WsEvent, WsOutgoingEvent types
- Depends on: Nothing
- Used by: `src/services/chatService.ts`, `src/screens/chat/`, `src/components/chat/`

## Data Flow

**Authentication Flow:**

1. User enters email/password in `src/screens/auth/loginScreen.tsx`
2. Screen calls `authService.login(email, password)` which calls Firebase Auth `signInWithEmailAndPassword`
3. `app/_layout.tsx` listens to `onAuthChange()` (Firebase `onAuthStateChanged`)
4. On auth state change, layout redirects user to `/` (authenticated) or `/login` (unauthenticated)
5. On first login, `createUserDocument()` in `userService.ts` creates the Firestore user document

**Plant Identification Flow:**

1. User takes photo in `src/screens/identify/CameraScreen.tsx` using `expo-camera`
2. Photo URI passed via expo-router params to `app/identify.tsx`
3. `identify.tsx` calls `plantIdService.identifyPlant(photoUri)` which sends the image as base64 to the Node.js Express backend (`POST /api/identify`)
4. Express backend forwards the request to Plant.id API (`api.plant.id/v3/identification`) with the API key
5. Result is returned to the frontend, displayed to user, and user can add the plant to their collection via `userPlantsService.addUserPlant()`

**Offline Sync Flow:**

1. When online, `offlineStorage.ts` saves data locally via `AsyncStorage` and directly to Firestore
2. When offline, operations are queued via `addToSyncQueue()` in `offlineStorage.ts`
3. `syncService.ts` monitors network connectivity via `@react-native-community/netinfo`
4. On reconnection, `processSyncQueue()` replays queued operations against the backend API

**Mission Progress Flow:**

1. User performs action (e.g., watering a plant) in `userService.logWateringActivity()`
2. After the action, `reportMissionProgress("water", userId)` is called via dynamic `require()` to avoid circular deps
3. `useMissionProgress.ts` updates the mission progress in Firestore
4. Screen refreshes via `useMissionProgress` hook which returns updated mission state

**Chat Flow:**

1. User joins via nickname in `src/screens/chat/ChatScreen.tsx`
2. `chatService.ChatRestClient.join()` sends POST to Python FastAPI backend
3. On success, `ChatWebSocketManager` connects via WebSocket to `wss://chat-backend-4nzg.onrender.com/ws/{token}`
4. Messages are sent/received through the WebSocket with reconnection logic (exponential backoff, max 5 retries)
5. End-to-end encryption support via `src/utils/crypto.ts` using `tweetnacl`

## State Management

- **No global state library** — React local state (`useState`, `useEffect`, `useCallback`) in hooks and screens
- **Custom hooks** centralize state per domain: `useCalendar`, `useMissionProgress`, `useProfile`, `useActivityFeed`, `useAchievementUnlock`, `useCamera`, `usePopupDismissal`, `useNetworkStatus`
- **Auth state** — handled via `onAuthStateChanged` Firebase listener in `app/_layout.tsx`, stored in a local `useState<User | null>`
- **Sync status** — pub/sub pattern in `syncService.ts` with `onSyncStatusChange()` listener and `SyncStatusIndicator` component
- **Popup dismissal** — `usePopupDismissal` hook uses `AsyncStorage` to persist "don't show again" flags
- **Theme** — `useAppTheme()` hook reads system color scheme, returns dark/light theme object

## Key Abstractions

**ScreenWrapper:**
- Purpose: Consistent screen container with safe area padding and theme background
- Location: `src/components/screenWrapper/ScreenWrapper.tsx`
- Pattern: Wraps children in `SafeAreaView` with `theme.colors.background` and top/left/right edges

**useThemedStyles:**
- Purpose: Centralized theming system — each component registers style factories, hook returns correct theme-aware styles
- Location: `src/styles/themedStyles.ts`
- Pattern: Registry map `stylesByComponent` with light/dark variants, `useThemedStyles(componentName)` returns `{ theme, styles }`

**Service Classes (Chat):**
- Purpose: Encapsulate REST API and WebSocket logic for chat
- Location: `src/services/chatService.ts`
- Pattern: `ChatRestClient` class for HTTP calls, `ChatWebSocketManager` class for WebSocket lifecycle with status listeners and reconnection

**Custom Hooks as Facades:**
- Purpose: Wrap service calls with React state management
- Location: `src/hooks/`
- Pattern: Hook calls service function, manages `loading/error/data` state, returns derived data and action callbacks

**Seed Functions:**
- Purpose: Ensure essential data exists in Firestore on app launch
- Location: `src/services/userAchievementsService.ts`, `missionService.ts`, `obteniblesService.ts`
- Pattern: Idempotent seed functions called from `app/_layout.tsx` that check if data exists before writing

## Entry Points

**Root Layout (app/_layout.tsx):**
- Location: `app/_layout.tsx`
- Triggers: App launch / cold start
- Responsibilities: Firebase auth listener, auth-based redirect, auto-sync setup, seed achievements/missions/obtenibles, render `<Stack>` navigator, bottom nav, sync status indicator, chat FAB, toast

**Route Modules (app/*.tsx):**
- Location: Route files in `app/` (12 routes total)
- Triggers: User navigation via Expo Router
- Responsibilities: Re-export screen component; some routes like `app/identify.tsx` and `app/journal.tsx` contain full page logic

**Backend Entry Point (backend/index.js):**
- Location: `backend/index.js`
- Triggers: Server start
- Responsibilities: Express server on `0.0.0.0:${PORT}`, serves health check (`GET /`) and plant identification proxy (`POST /api/identify`)

**Chat Backend Entry Point (backend/chat/main.py):**
- Location: `backend/chat/main.py`
- Triggers: Server start
- Responsibilities: FastAPI Uvicorn server, chat REST endpoints and WebSocket handling

## Error Handling

**Strategy:** Try/catch in service functions with `console.error` logging and error mapping

**Patterns:**
- **Auth errors** — Firebase error codes mapped to Spanish messages via `mapAuthError()` in `authService.ts`
- **Service errors** — Catch block returns default/empty values (e.g., `return []`, `return null`) or throws with descriptive message
- **Screen-level error states** — `useState<error>` in screens, rendered as error UI with retry buttons
- **Silent catch** — Non-critical operations (haptics, activity logging) use empty catch blocks to avoid blocking the main flow
- **Network errors** — `useNetworkStatus` hook prevents API calls when offline; `syncService` queues operations

## Cross-Cutting Concerns

**Logging:** `console.log` and `console.error` throughout — no structured logging library. Auth and sync operations use `[Auth]` and `[ChatWS]` prefixes.

**Validation:**
- Form schemas: `zod` in `src/schemas/editProfileSchema.ts`
- Plant data: `validatePlantData()` in `src/lib/plantValidation.ts`
- No centralized validation service — validation is per-module

**Authentication:**
- Firebase Auth email/password via `authService.ts`
- `onAuthStateChanged` listener in `app/_layout.tsx` drives auth state
- `requireUserId()` guard in `userService.ts` throws if unauthenticated
- Google Auth (expo-auth-session) present in `loginScreen.tsx`

**Offline Support:**
- `AsyncStorage`-based plant cache (`offlineStorage.ts`)
- Sync queue for offline operations replayed on reconnect (`syncService.ts`)
- Network-aware UI with `useNetworkStatus` hook

**Encryption:**
- Chat messages encrypted via `tweetnacl` in `src/utils/crypto.ts`
- Public key registration via chat backend API

---

*Architecture analysis: 2026-06-10*
