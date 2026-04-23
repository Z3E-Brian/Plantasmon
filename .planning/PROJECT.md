# PlantasMon - Plant Care Companion App

**Project Type:** Mobile application (iOS/Android)  
**Framework:** Expo SDK 54 + React Native 0.81  
**Runtime:** 2025-04-22 after codebase mapping

---

## Core Value

A plant care companion app that helps users identify plants, track their plant collection, and get care tips. Users can photograph plants to identify them, maintain a digital garden journal, and earn achievements for consistent plant care.

## What This Is

A React Native mobile app with:
- **Authentication:** Email/password login and registration via Firebase Auth
- **Home Dashboard:** Daily plant tips, user progress tracking, plant of the day
- **Plant Identification:** Camera-based plant identification feature
- **User Profile:** User profile with achievements, plant collection, activity feed
- **Explore:** Plant exploration/discovery (stub)
- **Journal:** Plant care journal (stub)

## Context

**Existing Implementation:**
- 9 screens implemented with file-based routing (expo-router)
- Firebase Auth integrated for email/password
- Service layer pattern with hooks for state management
- UI component library in `src/components/ui/`
- Hardcoded user ID (`u_001`) - should use dynamic Firebase Auth UID

**Known Issues (from CONCERNS.md):**
- Google OAuth is broken (needs fix)
- Hardcoded Firebase config in `src/config/firebase.js`
- No test framework configured
- Zero test coverage

---

## Requirements

### Validated

- ✓ User can register with email/password — Firebase Auth existing
- ✓ User can log in with email/password — Firebase Auth existing
- ✓ User can view home dashboard — HomeScreen implemented
- ✓ User can view plant of the day — PlantOfTheDay component exists
- ✓ User can track daily missions — DailyMissions component exists
- ✓ User can view profile — ProfileScreen implemented
- ✓ User can view achievements — Achievements component exists
- ✓ User can edit profile — EditProfileScreen implemented
- ✓ User can identify plants — IdentifyScreen implemented (feature stub)
- ✓ User can add companion plants — CompanionPlant screen exists (stub)

### Active

- [ ] Fix Google OAuth authentication
- [ ] Connect app to real Firebase Auth UID
- [ ] Implement plant identification API integration
- [ ] Complete Explore screen functionality
- [ ] Complete Journal screen functionality
- [ ] Add test framework and coverage

### Out of Scope

- Push notifications — Not mentioned in existing code
- Social features — Not in current implementation
- Offline mode — Not in current implementation

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Expo framework | Existing - chosen for easier native builds | Confirmed |
| Firebase Auth | Existing - email/password auth works | Confirmed |
| File-based routing | Existing - expo-router convention | Confirmed |
| Service layer pattern | Existing - separates API logic from UI | Confirmed |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2025-04-22 after initialization*