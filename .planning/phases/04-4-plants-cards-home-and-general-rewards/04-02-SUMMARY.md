---
phase: 04-4-plants-cards-home-and-general-rewards
plan: 02
type: execute
generated: "2026-05-13T19:45:00-06:00"
duration: "~2 min"
tasks:
  total: 2
  completed: 2
  skipped: 0
depends_on: []
requirements: []
tech-stack:
  added: []
  patterns:
    - "Service layer with Firestore seeding pattern (check-then-write)"
    - "Client-side unlock logic with typed achievement definitions"
    - "Firestore document writes using subcollections/planar compatibility"
key-files:
  created:
    - src/hooks/useAchievementUnlock.ts
  modified:
    - src/services/userAchievementsService.ts
commits:
  - hash: 0ba82e3
    message: "feat(04-4-logros): añadir catálogo INITIAL_ACHIEVEMENTS con 25 logros y función seedAchievements"
  - hash: 164336c
    message: "feat(04-4-logros): crear hook useAchievementUnlock con lógica de desbloqueo cliente"
---

# Phase 04-4 Plan 02: Backend de Logros — Catálogo y Desbloqueo

Implementación del backend del sistema de logros: catálogo de 25 logros en Firestore con `seedAchievements`, y hook cliente `checkAndUnlockAchievements` para evaluación y persistencia de desbloqueos.

## Key Decisions

- **Estructura de datos:** Los logros se definen con interfaz `AchievementDefinition` (id, name, description, category, icon, requirement, isSecret). Compatible con escritura en Firestore y lectura por el frontend.
- **Persistencia de desbloqueos:** Se usa el array `unlockedAchievements` en el documento del usuario (con soporte para estructura plana o `subcollections.unlockedAchievements`), siguiendo el patrón existente en `getRawUserPlants`.
- **Proxy para waterings:** El requisito `waterings` usa `userProfile.streak` como proxy porque no existe un campo `totalWaterings` dedicado. Marcado con TODO para reemplazo futuro.
- **Stub para tipos no implementados:** Los tipos de requisito `rare_find`, `daily_missions`, `customization` y `fun_facts` emiten `console.warn` con mensaje de no implementado.

## Task Results

### Task 1: Seed Firestore achievements collection ✅

- **Commit:** `0ba82e3`
- **Cambios:**
  - Exporta `AchievementDefinition` interface con tipado estricto de categorías
  - Exporta `INITIAL_ACHIEVEMENTS` con 25 logros en 4 categorías: collection (8), streak (8), usage (5), special (4)
  - Exporta `seedAchievements()`: Lee colección, escribe con `setDoc` + `merge:true` si está vacía
  - Importa `setDoc` de firebase/firestore

### Task 2: Create useAchievementUnlock hook ✅

- **Commit:** `164336c`
- **Cambios:**
  - Exporta `checkAndUnlockAchievements(userId)`: función asíncrona que evalúa y desbloquea logros
  - Soporta `identifications` (desde `userProfile.plantsOwned`)
  - Soporta `streak` (desde `userProfile.streak`)
  - Soporta `species` (cuenta especies distintas en `getUserPlants`)
  - Soporta `waterings` (usa streak como proxy)
  - Soporta `days_active` (calculado desde `joinDate`)
  - Stub con `console.warn` para tipos no implementados
  - Retorna `string[]` de IDs recién desbloqueados

## Deviations from Plan

Ninguna — el plan se ejecutó exactamente como se diseñó.

### Known Stubs

| Component | File | Line | Reason |
|-----------|------|------|--------|
| waterings proxy | useAchievementUnlock.ts | ~88 | `totalWaterings` field doesn't exist on user doc yet; uses `streak` as proxy |
| Unimplemented types | useAchievementUnlock.ts | ~98 | `rare_find`, `daily_missions`, `customization`, `fun_facts` emit console.warn only |

## Threat Flags

None — all threat register mitigations (T-04-04, T-04-05, T-04-06) are addressed:
- T-04-04: Client-side unlock writes only to `unlockedAchievements` array
- T-04-05: Accept client-side trust model for cosmetic achievements
- T-04-06: `seedAchievements` checks empty collection before writing; uses merge

## Self-Check: PASSED

- ✅ `INITIAL_ACHIEVEMENTS` exported: FOUND
- ✅ `seedAchievements` function: FOUND
- ✅ `useAchievementUnlock.ts` exists: FOUND
- ✅ `checkAndUnlockAchievements` exported: FOUND
- ✅ `unlockedAchievements` referenced: FOUND
- ✅ `npx tsc --noEmit` — No errors in modified files
