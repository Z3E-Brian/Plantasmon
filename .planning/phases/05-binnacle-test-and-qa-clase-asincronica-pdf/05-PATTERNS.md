# Phase 5: binnacle-test-and-qa-clase-asincronica-pdf - Pattern Map

**Mapped:** 2026-05-22
**Files analyzed:** 3
**Analogs found:** 1 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/lib/plantValidation.ts` | utility | transform | `src/lib/utils.ts` | role-match |
| `src/lib/__tests__/plantValidation.test.ts` | test | request-response | _none_ | none |
| `src/screens/auth/__tests__/loginScreen.test.tsx` | test | request-response | _none_ | none |

## Pattern Assignments

### `src/lib/plantValidation.ts` (utility, transform)

**Analog:** `src/lib/utils.ts`

**Imports/module pattern** (lines 1-5):
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Analog:** `src/schemas/editProfileSchema.ts`

**Validation rule style (Zod, Spanish messages)** (lines 1-49):
```ts
import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre no puede superar 40 caracteres"),
  bio: z
    .string()
    .max(150, "La bio no puede superar 150 caracteres")
    .optional(),
  // ...
});
```

**Analog:** `src/services/userPlantsService.ts`

**Helper function style** (lines 39-55):
```ts
function mapWaterLevel(wateringDays: number): "low" | "medium" | "high" {
  if (wateringDays >= 10) return "low";
  if (wateringDays >= 6) return "medium";
  return "high";
}

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}
```

---

### `src/lib/__tests__/plantValidation.test.ts` (test, request-response)

**No analog found.** No existing Jest/RTL tests in repo. Use RESEARCH.md for testing setup guidance.

---

### `src/screens/auth/__tests__/loginScreen.test.tsx` (test, request-response)

**Analog:** `src/screens/auth/loginScreen.tsx` (for selectors + error text)

**Error message to assert** (lines 85-88):
```ts
if (!email.trim() || !password.trim()) {
  setError("Por favor completa todos los campos.")
  return
}
```

**Error UI block** (lines 308-313):
```tsx
{error && (
  <View style={styles.errorBox}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

## Shared Patterns

### Zod validation messages in Spanish
**Source:** `src/schemas/editProfileSchema.ts` (lines 21-49)
**Apply to:** plant data validation helper (error messages)
```ts
name: z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(40, "El nombre no puede superar 40 caracteres"),
```

### Helper function structure
**Source:** `src/services/userPlantsService.ts` (lines 39-55)
**Apply to:** pure validation helpers in `src/lib/`
```ts
function mapWaterLevel(wateringDays: number): "low" | "medium" | "high" {
  if (wateringDays >= 10) return "low";
  if (wateringDays >= 6) return "medium";
  return "high";
}
```

### Error display block in login screen
**Source:** `src/screens/auth/loginScreen.tsx` (lines 308-313)
**Apply to:** component test expectation
```tsx
{error && (
  <View style={styles.errorBox}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `src/lib/__tests__/plantValidation.test.ts` | test | request-response | No existing tests in repo (`src/**/__tests__` empty). |
| `src/screens/auth/__tests__/loginScreen.test.tsx` | test | request-response | No existing RTL component tests to mirror. |

## Metadata

**Analog search scope:** `src/screens`, `src/schemas`, `src/lib`, `src/services`
**Files scanned:** 18
**Pattern extraction date:** 2026-05-22
