# Coding Conventions

**Analysis Date:** 2026-04-22

## Naming Patterns

**Files:**
- PascalCase for components: `HomeScreen.tsx`, `ProfileHero.tsx`
- camelCase for services: `authService.ts`, `userService.ts`
- camelCase for hooks: `useAuth.ts`, `useProfile.ts`
- kebab-case for routes: `editProfile.tsx`, `companionPlant.tsx`

**Functions:**
- camelCase: `handleLogin()`, `getUserProfile()`, `onSubmit()`
- Named exports for services

**Variables:**
- camelCase: `email`, `password`, `userPlants`
- Constants: SCREAMING_SCREAM (rare)

**Types:**
- PascalCase: `UserProfile`, `UserPlant`, `TabKey`
- Interface keyword: `export interface UserProfile { ... }`

## Code Style

**Formatting:**
- ESLint configured: `eslint.config.js`
- No Prettier config detected
- Expo lint script: `npm run lint`

**Linting:**
- ESLint: `eslint-config-expo` ~10.0.0
- TypeScript: Type checked

## Import Organization

**Order:**
1. Framework imports (react, react-native)
2. Navigation (expo-router, @react-navigation)
3. Expo modules (expo-*)
4. Firebase (firebase)
5. Internal components (@/src/...)
6. Styles/theme

**Path Aliases:**
- `@/*` maps to project root

## Error Handling

**Patterns:**
- Try-catch blocks with custom error messages
- Service errors re-thrown with mapped messages
- Form validation via Zod
- UI feedback: Alert.alert() for user-facing errors

**Logging:**
- console.log for debug output
- console.error for caught exceptions
- No structured logging

## Comments

**When to Comment:**
- Code is generally self-explanatory
- Comments rare outside TODO items
- No JSDoc/TSDoc observed

**JSDoc/TSDoc:**
- Not observed in codebase

## Function Design

**Size:**
- Varies; some screens are large (>400 lines)

**Parameters:**
- Typed via TypeScript interfaces
- Default values where appropriate

**Return Values:**
- Explicit return types where useful

## Module Design

**Exports:**
- Named exports for services
- Default exports for screens/components

**Barrel Files:**
- Not observed (no index.ts for re-exports)

## Language

**Primary:** TypeScript (all code is `.ts` or `.tsx`)

**React Hook Form Usage:**
- Zod resolvers: `zodResolver(schema)`
- Mode: `onBlur`

**Zod Usage:**
- Schema definition with `.object()`, `.string()`, etc.
- Type inference via `z.infer<typeof schema>`

---

*Convention analysis: 2026-04-22*