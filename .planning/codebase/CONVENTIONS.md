# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- **Services:** `kebab-case.ts` — e.g. `authService.ts`, `activityService.ts`, `missionService.ts`
- **Components:** `PascalCase.tsx` — e.g. `ChatBubble.tsx`, `ProfileHero.tsx`, `HomeTimeline.tsx`
- **Hooks:** `camelCase.ts` with `use` prefix — e.g. `useAuth.ts`, `useMissionProgress.ts`, `useNetworkStatus.ts`
- **Screens:** `PascalCase.tsx` — e.g. `loginScreen.tsx`, `CalendarScreen.tsx`
- **Constants/Data:** `kebab-case.ts` — e.g. `missionsData.ts`, `designSystem.ts`, `theme.ts`
- **Types:** `kebab-case.ts` — e.g. `chat.ts`
- **Utils/Lib:** `kebab-case.ts` — e.g. `crypto.ts`, `storage.ts`, `plantValidation.ts`, `utils.ts`
- **Schemas:** `PascalCase.ts` — e.g. `editProfileSchema.ts`
- **Style files:** `ComponentName.styles.ts` — co-located with the component, e.g. `ProfileHero.styles.ts`, `ScreenWrapper.styles.ts`
- **Test files:** `*.test.ts` for pure TypeScript, `*.test.tsx` for components with JSX — e.g. `activityService.test.ts`, `CalendarScreen.test.tsx`
- **App route files (expo-router):** `kebab-case.tsx` — e.g. `app/index.tsx`, `app/login.tsx`, `app/plant/[id].tsx`

**Functions:**
- All functions use `camelCase` naming
- Exported async functions in services: `logActivity`, `getUserActivities`, `assignDailyMissions`
- Private/helper functions: `safeParseDate`, `formatRelativeTime`, `toDateStr`, `deterministicPick`
- React hooks: `useMissionProgress`, `useAuth`, `useCalendar`
- Event handlers in components: `handleLogin`, `handleGooglePress`, `handleForgotPassword`

**Variables:**
- `camelCase` for all variables: `const getCurrentUserId`, `const resolvedUserId`
- React state: `camelCase` with `[value, setValue]` destructuring: `[email, setEmail]`, `[loading, setLoading]`
- Mock variables in tests: `mock` prefix — `mockGetUserActivities`, `mockToActivityData`
- Constants that are module-level: `UPPER_SNAKE_CASE` — `CACHE_KEY`, `QUEUE_KEY`, `CHAT_API_URL`, `EVENT_MISSION_MAP`
- Boolean state: `loading`, `googleLoading`, `showSettings`, `completed`, `claimed`

**Types:**
- Interfaces: `PascalCase` — `ActivityEvent`, `ChatMessage`, `UserProfile`, `MissionDefinition`
- Type aliases: `PascalCase` — `ActivityData`, `SyncStatus`, `WsEvent`
- Union type aliases: `PascalCase` — `CalendarEventType`, `MissionCategory`, `ProgressEvent`
- Enums/const objects: `PascalCase` — `FLAG_THEMES`, `BG_THEMES`, `TITLE_OPTIONS`, `TIER_COLORS`
- Generic type props in components: `T extends ...` — `InputFieldProps<T extends FieldValues>`

## Code Style

**Formatting:**
- No Prettier config detected — formatting relies on ESLint and manual style
- VS Code configured for `source.fixAll` and `source.organizeImports` on save (`.vscode/settings.json`)
- Inconsistent quote usage across the codebase:
  - **Services** (`src/services/`, `src/lib/`, `src/hooks/`): Double quotes `"` (e.g. `activityService.ts`, `missionService.ts`, `useAuth.ts`)
  - **UI components** (`src/components/ui/`): Single quotes `'` (e.g. `button.tsx`, `card.tsx`, `input.tsx`) — inherited from shadcn/ui template
  - **Profile components** (`src/components/profile/`): Double quotes (e.g. `ProfileHero.tsx`)
  - **Home components** (`src/components/home/`): Double quotes (e.g. `HomeTimeline.tsx`)
  - **Some form/auth components**: Double quotes
  - **Offline/sync modules**: Single quotes (`offlineStorage.ts`, `syncService.ts`)
- **Conclusion:** New code should use **double quotes `"`** to match the predominant service/screen convention

**Linting:**
- ESLint via `eslint` v9.x with `eslint-config-expo` flat config (`eslint.config.js`)
- Extends `eslint-config-expo/flat` — Expo's recommended ruleset
- Some files use `// eslint-disable-next-line @typescript-eslint/no-var-requires` for require() calls in ESM-style code (used to break circular dependencies)

**Semicolons:**
- **Services, screens, hooks, lib files:** Semicolons always used (e.g. `activityService.ts`, `loginScreen.tsx`, `useAuth.ts`)
- **UI shadcn-style components:** Semicolons omitted in some cases, used in others — inconsistent
- **Conclusion:** New code should **use semicolons** to match the predominant convention

## Import Organization

**Order:**
1. Standard library / React / React Native imports
2. External package imports (e.g., Firebase, expo modules)
3. Internal path alias imports (`@/src/...`)

```
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/src/components/ui/button"
import { getCurrentUserId } from "@/src/services/userService"
```

**Path Aliases:**
- `@/` maps to root directory (configured in `tsconfig.json` paths)
- All internal imports use the `@/` alias: `@/src/services/activityService`, `@/src/constants/designSystem`
- Exception: Some files in `src/` use relative imports: `../../services/authService` (seen in `loginScreen.tsx`)

**Barrel Files:**
- Barrel files (`__init__.py` in backend, `/app/__init__.py` patterns) not used in frontend
- Each service/component is imported directly by path — no `index.ts` barrel pattern for services

**Late/Circular Imports:**
- Circular dependency pattern handled via inline `require()` inside functions rather than top-level `import`
- Example: `userService.ts` calls `reportMissionProgress` from `useMissionProgress.ts` using `// eslint-disable-next-line @typescript-eslint/no-var-requires` + `require()`

## Error Handling

**Patterns:**
```typescript
// Pattern 1: try/catch with error logging and return fallback value
export async function getData(userId: string): Promise<Data[]> {
  try {
    // ... async operations ...
    return result;
  } catch (error) {
    console.error("Error en [context]:", error);
    return [];  // fallback empty value
  }
}

// Pattern 2: try/catch with re-throw
export async function writeData(userId: string): Promise<void> {
  try {
    // ... async operations ...
  } catch (error) {
    console.error("Error en [context]:", error);
    throw error;
  }
}

// Pattern 3: try/catch with error transformation
export async function login(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));  // Firebase → Spanish messages
  }
}
```

- Three tiers of error handling:
  1. **Fallback functions** (e.g., `getUserActivities`, `getRecentActivities`): Return empty arrays on error — consumer renders empty state
  2. **Throw functions** (e.g., `logActivity`, `seedMissions`, `assignDailyMissions`): Log error and re-throw — caller is responsible for handling
  3. **Fire-and-forget** (e.g., `reportMissionProgress`): Errors are logged but never thrown — `fire-and-forget` pattern for non-critical operations
- `requireUserId(userId)` pattern: throws `"Usuario no autenticado"` if no userId

**Auth error mapping:**
- Firebase auth error codes mapped to Spanish messages in `mapAuthError()` function at `src/services/authService.ts`

## Logging

**Framework:** `console` (`console.log`, `console.warn`, `console.error`)

**Patterns:**
```typescript
console.error("Error en [context]:", error);   // Errors with descriptive context
console.warn("[Context] Warning message:", data);  // Warnings with context tag
console.log("[Context] Info message:", data);      // Info with context tag in brackets
```

- Chat WebSocket: `[ChatWS]` prefix tag — `"[ChatWS] Conectado"`, `"[ChatWS] Error de conexión"`
- Spanish log messages for user-facing operations: `"Misión diaria creada:"`, `"Usuario no encontrado:"`
- English log messages for technical operations: `"Error en activityService:"`, `"Error reporting mission progress:"`

## Comments

**When to Comment:**
- Interface/type definitions above exports
- Complex business logic explanations
- Section headings with `// ───` separator pattern
- TODO notes linking to requirements (e.g., `// Phase 9: D-02`)
- Late import explanations (circular dependency documentation)

**Comment Style:**
```typescript
// ─── Types ──────────────────────────────────────────────────────
// Simple `//` for inline comments
// ─── Section Headers ────────────────────────────────────────────
/** JSDoc for exported functions with @param and @returns */
```

- Section headers use `// ─── Title ──` with padded dashes (~80 chars wide)
- JSDoc used for exported utility functions: `@param`, `@returns`, description
- Inline comments explain "why" not "what"

**Example JSDoc:**
```typescript
/**
 * Deterministic pseudo-random pick from an array using a seed string.
 * Same seed + same array → same selection every time.
 */
function deterministicPick<T>(items: T[], count: number, seed: string): T[] {
```

## Function Design

**Size:** Functions range from single-line (e.g., `getAppTheme`) to large service functions (~50-80 lines). Service functions that interact with Firestore tend to be larger due to error handling and data mapping.

**Parameters:**
- Required params first, optional params last with defaults
- Object destructuring for 3+ related parameters
- Pattern: `(userId?, optionalParam = default)` — optional params often derived via `??` operator
- Component props use explicit `interface`/`type` definitions

**Return Values:**
- Async functions return `Promise<T>` consistently
- Fallback pattern: return empty array `[]` or `null` on error
- Boolean state indicated via function name: `needsDailyRefresh()`, `hasLocalPlant()`
- Functions that can fail gracefully return `T | null`

## Module Design

**Exports:**
- **Named exports** are the standard — both static and dynamic
- **Default exports** used only for screen/page components that are route entries (e.g., `loginScreen.tsx`, `CalendarScreen.tsx`, `ChatScreen.tsx`)
- UI primitives and utility components export as named: `export { Button }`, `export function InputField`
- Services export multiple named functions: `export async function logActivity`, `export async function getUserActivities`

**Type Exports:**
- Interfaces and types are exported from their defining module
- Re-exports used for convenience: `export type { MissionDefinition } from "@/src/constants/missionsData"`

## Component Design

**Structure:**
```typescript
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  // typed props
}

export function ComponentName({ prop1, prop2 }: Props) {
  const theme = useAppTheme();
  // logic
  return (
    <View>...</View>
  );
}

const styles = StyleSheet.create({
  container: { ... },
});
```

- Props defined as `interface` above the component — either named `Props` or `ComponentNameProps`
- Styles defined at bottom of file via `StyleSheet.create()` or in separate `.styles.ts` file
- Theme accessed via `useAppTheme()` from `src/constants/designSystem.ts`
- Some complex features use `useThemedStyles()` pattern from `src/styles/themedStyles.ts`

**Style File Pattern:**
- `ComponentName.styles.ts` exports a `StyleSheet.create()` object
- Example: `ProfileHero.styles.ts`, `ScreenWrapper.styles.ts`, `CameraScreen.styles.ts`

## Schema / Validation Patterns

- `zod` schemas used for form validation (`editProfileSchema.ts`)
- Simple validation function pattern for non-form data: `validatePlantData(input) → { valid, errors }`
- `react-hook-form` with `Controller` wrapper for form fields (`InputField.tsx`)

## Constants Pattern

- Constants defined as `const` arrays/objects with `as const` assertion
- TypeScript `satisfies` not observed — `as const` is the standard
- Constants co-located in `src/constants/` directory

---

*Convention analysis: 2026-06-10*
