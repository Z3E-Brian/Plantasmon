# Architecture Research: PlantasMon

**Domain:** Plant Care Mobile App  
**Researched:** 2026-04-22  
**Mode:** Ecosystem + Architecture

---

## Executive Summary

This plant care app follows an **Expo Router + Service Layer** architecture with Firebase Auth for authentication. The existing codebase already has good foundational patterns: file-based routing, separating concerns via services and hooks, and a component library. The key architectural decisions needed involve: (1) integrating dynamic user auth from Firebase, (2) connecting plant identification to an external API, and (3) implementing care reminders with notifications.

**Recommended approach:** Build outward from existing auth flow → add plant data layer → integrate identification API → add reminder system. This ensures each layer is testable and dependencies flow inward.

---

## Current Architecture

### Existing Structure (from codebase analysis)

```
plantasmon/
├── app/                    # File-based routes (expo-router)
│   ├── _layout.tsx         # Auth state listener, navigation guards
│   ├── (tabs)/             # Tab-based navigation group
│   ├── login/
│   └── register/
├── src/
│   ├── components/ui/     # Reusable UI building blocks
│   ├── services/           # Firebase interactions (auth, user, plants)
│   ├── hooks/             # Custom hooks (useAuth, useProfile)
│   ├── config/            # Firebase initialization
│   └── constants/        # Theme, design tokens
```

### Current Data Flow

1. **Auth Flow:** Login/Register → `authService.login()` → Firebase Auth → `_layout.tsx` listener → Navigation guard
2. **Profile Flow:** ProfileScreen → `userService.getUser()` → Firestore → Display
3. **Plant Flow:** IdentifyScreen → User input only (stub) → Manual add to collection

### Current Issues

| Issue | Impact | Fix Required |
|-------|--------|--------------|
| Hardcoded user ID (`u_001`) | All data appears for one user | Use Firebase Auth UID |
| Google OAuth Broken | Users can't OAuth login | Fix Firebase config |
| Plant ID is stub | No actual identification | Connect to PlantNet/Kindwise API |

---

## Recommended Architecture

### Component Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ app/       │  │ components/ │  │ screens/    │          │
│  │ (routes)   │  │ (ui/*)      │  │ (wrappers)  │          │
│  └─────┬─────┘  └──────┬──────┘  └──────┬──────┘          │
│        └───────────────┴───────────────┘                   │
│                          ↓                                │
├──────────────────────────┴──────────────────────────────┤
│                    BUSINESS LOGIC LAYER                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ hooks/      │  │ services/   │  │ stores/     │        │
│  │ (state)    │  │ (logic)     │  │ (global)    │        │
��  └─────┬─────┘  └──────┬──────┘  └──────┬──────┘        │
│        └───────────────┴───────────────┘                   │
│                          ↓                                │
├──────────────────────────┴──────────────────────────────┤
│                      DATA LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Firebase   │  │ External    │  │ Local      │        │
│  │ Auth/Firestore│ │ APIs      │  │ Storage    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└──────────────────────────────────────────────────────────┘
```

### Communication Boundaries

| From | To | Data Flow |
|------|-----|----------|
| Routes (`app/`) | Screens (`src/screens/`) | UI rendering only |
| Screens | Hooks (`src/hooks/`) | Request state via hooks |
| Hooks | Services (`src/services/`) | Execute business logic |
| Services | Firebase/APIs | I/O operations |
| Components | Constants/Theme | Read-only configuration |

---

## Data Flow Diagrams

### Authentication Flow (with Firebase UID)

```
User Input → LoginScreen → useAuth hook → authService.login()
                                            ↓
                                     Firebase Auth
                                            ↓
                               FirebaseAuthListener (_layout)
                                            ↓
                               AuthContext (global state)
                                            ↓
                               NavigationGuard (redirects to /home)
```

**Key change from current:** Replace hardcoded `u_001` with `auth.currentUser.uid`.

### Plant Identification Flow

```
Camera/Gallery → IdentifyScreen → usePlantIdentification hook
                                            ↓
                           plantIdService.identify(imageBlob)
                                            ↓
                           External API (PlantNet or Kindwise)
                                            ↓
                           Response: species name, care info
                                            ↓
                           User confirms → userPlantsService.add()
                                            ↓
                           Firestore: userPlants collection
```

### Care Reminder Flow (new feature)

```
User adds plant → sets watering frequency → userPlantsService.update()
                                                  ↓
                         Firestore: plant.careSchedule[].intervalDays
                                                  ↓
                         Background task checks daily
                                                  ↓
                         expo-notifications: schedule reminder
                                                  ↓
                         User receives push → taps → Opens plant detail
```

---

## Build Order (Dependencies)

### Phase 1: Fix Auth Integration
**Priority: CRITICAL** - All other features depend on real user identity

| Task | Dependencies | Reason |
|------|---------------|--------|
| Fix Firebase Auth listener to use UID | None | Foundation for all data |
| Update services to use `auth.currentUser.uid` | Auth listener fixed | User-specific data |
| Remove hardcoded `u_001` | Services updated | Data isolation |

### Phase 2: Plant Data Layer
**Priority: HIGH** - Core domain functionality

| Task | Dependencies | Reason |
|------|---------------|--------|
| Add plantService for CRUD | Auth UID fixed | Fetch plant catalog |
| Add userPlantsService for collection | Auth UID fixed | User's plants |
| Create plant data models | None | Type safety |

### Phase 3: Plant Identification API
**Priority: HIGH** - Primary value proposition

| Task | Dependencies | Reason |
|------|---------------|--------|
| Connect to PlantNet or Kindwise API | None | External API integration |
| Create plantIdService wrapper | Plant data models | Service layer pattern |
| Build IdentifyScreen UI | plantIdService | User interface |

### Phase 4: Care Reminders
**Priority: MEDIUM** - Enhancement feature

| Task | Dependencies | Reason |
|------|---------------|--------|
| Integrate expo-notifications | Phase 1 complete | Push functionality |
| Create reminderService | UserPlantsService | Read schedules |
| Build reminder scheduling logic | reminderService | Background checks |

### Phase 5: Polish & Complete Features
**Priority: MEDIUM** - Complete Journey

| Task | Dependencies | Reason |
|------|---------------|--------|
| Complete Explore screen | Plant data layer | Discovery feature |
| Complete Journal screen | userPlantsService | Care logging |
| Add achievements logic | Auth + userPlants | Gamification |

---

## Architecture Patterns to Follow

### Pattern 1: Service Layer (Already in use)
**What:** Business logic in services, UI in components
**Why:** Separates concerns, enables testing
**Example:**
```typescript
// src/services/plantService.ts
export const plantService = {
  async identify(imageBlob: Blob): Promise<PlantResult> {
    const response = await fetch(PLANTNET_API, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    return response.json();
  }
};
```

### Pattern 2: Hook Composition (Already in use)
**What:** Custom hooks that use services, exposed to screens
**Why:** Centralizes state management, enables reuse
**Example:**
```typescript
// src/hooks/usePlantIdentification.ts
export function usePlantIdentification() {
  const mutate = useMutation({
    mutationFn: (image: Blob) => plantService.identify(image)
  });
  return { identify: mutate.mutate, ...mutate };
}
```

### Pattern 3: Context for Global Auth State (Recommended)
**What:** React Context wraps Firebase auth listener
**Why:** Reduces prop drilling, centralized auth state
**Current state:** Already exists via `_layout.tsx` listener

### Pattern 4: Repository Pattern (Optional - for complexity)
**What:** Services implement repository interfaces
**Why:** Enables swapping data sources (local↔remote)
**When:** If offline mode becomes priority

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Business Logic in Screens
**What:** Putting Firebase calls directly in screen components
**Why:** Breaks separation, makes testing hard, duplicates logic
**Instead:** Always go through service layer

### Anti-Pattern 2: Prop Drilling Auth UID
**What:** Passing user ID through multiple component layers
**Why:** Fragile, easy to miss, error-prone
**Instead:** Use AuthContext or useAuth hook at point of need

### Anti-Pattern 3: Hardcoded API Keys
**What:** Storing API keys directly in source files
**Why:** Security risk, hard to rotate
**Instead:** Use environment variables (`EXPO_PUBLIC_*`)

### Anti-Pattern 4: Direct Firestore in Components
**What:** Calling `firestore.collection(...).doc(...).get()` in components
**Why:** Breaks service layer abstraction, tight coupling
**Instead:** Use service methods: `userPlantsService.getUserPlants(uid)`

---

## Scalability Considerations

| Scale | Current | At Scale |
|-------|---------|----------|
| Users | 1 (hardcoded) | 1K - 100K Firestore reads for user data |
| Plants per user | 1-10 | 10-500 - Consider pagination |
| API calls | None | Plant ID API - rate limited, cache responses |
| Offline | Not supported | Consider AsyncStorage + sync queue |

### Scaling Strategy

1. **100 users:** Current architecture works fine
2. **10K users:** Add query indexing, consider caching user plants in memory
3. **100K users:** Move to TanStack Query for server state management
4. **1M users:** Consider dedicated plant data microservice

---

## Technology Decisions

| Category | Current | Recommended | Why |
|----------|---------|-------------|-----|
| Auth | Firebase Auth ✓ | Keep | Already working |
| Database | Firestore ✓ | Keep | Good for user data |
| Plant ID API | None | PlantNet or Kindwise | Both have free tiers |
| Notifications | None | expo-notifications | Native, works with Expo |
| State Management | Hooks only | Add TanStack Query at scale | When offline/sync needed |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Component boundaries | HIGH | Based on existing codebase |
| Data flow direction | HIGH | Verified against code patterns |
| Build order | HIGH | Dependencies clear |
| Tech recommendations | MEDIUM | Ecosystem patterns vary |

---

## Sources

- **Expo Router Best Practices:** https://expo.dev/blog/expo-app-folder-structure-best-practices (2025-09-23)
- **React Native Architecture Patterns:** https://www.reddit.com/r/expo/comments/1i6r5r9/whats_the_recommended_architecture_for_a_react/ (2025-01-21)
- **Clean Architecture Example:** https://github.com/jonyw4/plant-manager (Clean Architecture plant app)
- **Plant Care App Examples:** https://github.com/Svetzayats/plantly, https://github.com/MSSkowron/smart-plant-care-assistant
- **New Architecture:** https://docs.expo.dev/guides/new-architecture/ (2026-02-26)