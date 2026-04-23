# PlantasMon Research Summary

**Project:** PlantasMon - Plant Care Mobile Application  
**Synthesized:** 2026-04-22  
**Purpose:** Roadmap creation and requirements prioritization

---

## Executive Summary

PlantasMon is a plant care companion app built with Expo Router and Firebase Auth. The research confirms the existing architecture is sound (service layer pattern, file-based routing), but three critical issues block progress: **(1) hardcoded user ID prevents multi-user support**, **(2) plant identification is a stub with no API**, and **(3) care reminders don't exist**. The recommended approach is to fix auth integration first, then layer plant data and identification on top.

**Key insight:** Market leaders (Planta, PictureThis, Blossom) show that plant ID is the acquisition feature, but care tracking with smart reminders is the retention feature. The #1 user pain point is forgetting to water — apps that solve this with species-specific schedules have highest retention.

---

## Key Findings

### From STACK.md (Technology)

| Finding | Action |
|---------|--------|
| Firebase JS SDK needs upgrade (12.11.0 → 12.12.1) | Upgrade in next tech phase |
| Missing `AuthContext` pattern | Create for consistent auth state |
| Google OAuth using deprecated `expo-auth-session` | Replace with `@react-native-google-signin/google-signin` |
| Firebase config hardcoded in source | Move to Expo environment variables |
| Auth persistence already correct | No changes needed |

**Critical missing piece:** AuthContext to manage auth state across screens. Currently each screen checks `auth.currentUser?.uid` independently, causing flash of unauthenticated UI on app launch.

### From FEATURES.md (Product)

**Table Stakes (must have for v1):**
- Plant identification (primary value proposition) — needs external API
- Care reminders (top user pain point) — missing completely
- Plant profiles with care history — partial implementation
- Care guides from plant database — needs integration

**Differentiation opportunities (v1.5+):**
- Plant journal with photo timeline
- Disease diagnosis with confidence scores
- Gamification/achievements (already has entry points)

**Anti-features to avoid:**
- Social media feeds (moderation cost too high)
- E-commerce/marketplace (out of scope)
- AR placement (limited utility)
- Full offline-first (add complexity prematurely)

### From ARCHITECTURE.md (System)

**Current structure is sound:**
```
app/ (expo-router) → components/ui → services/ → Firebase/External APIs
```

**Three architectural problems to fix:**
1. Hardcoded `u_001` user ID — replace with `auth.currentUser.uid`
2. Plant ID stub — connect to PlantNet/Kindwise API
3. No reminder system — integrate expo-notifications

**Recommended build order:**
1. Fix auth (replace hardcoded UID, add AuthContext)
2. Plant data layer (services + models)
3. Plant ID API integration
4. Care reminders system
5. Polish remaining screens

### From PITFALLS.md (Risk)

**Critical risks requiring prevention:**
| Pitfall | Prevention |
|--------|-------------|
| AI plant ID trusted as truth | Display confidence scores, allow corrections |
| Static care schedules | Add environmental context input |
| Disease diagnosis wrong | Recommend human verification |
| Notification fatigue | Start minimal, let users customize |
| Hardcoded config exposed | Use Expo env variables |

**Moderate risks already identified:**
- Hardcoded user ID `u_001` (matches PITFALL #6)
- No test framework
- No error boundaries

---

## Roadmap Implications

### Suggested Phase Structure

Based on combined research, recommend **5-phase roadmap**:

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| **Phase 1: Auth Integration** | Fix Firebase auth flow | AuthContext, remove hardcoded UID, fix Google OAuth, env vars |
| **Phase 2: Plant Data Layer** | Foundation for plant features | Plant services, userPlantsService, data models |
| **Phase 3: Plant Identification** | Connect to external API | PlantNet/Kindwise integration, IdentifyScreen UI |
| **Phase 4: Care Reminders** | Address #1 pain point | Push notifications, per-plant schedules |
| **Phase 5: Polish & Complete** | Finish incomplete screens | Journal, Explore, achievements, error boundaries |

### Phase 1 Details (Immediate Priority)

**Why first:** All other features depend on real user identity. Currently every user sees the same data (`u_001`).

**Deliverables:**
- Create `AuthContext` with `onAuthStateChanged` observer
- Update all services to use `auth.currentUser.uid` instead of `u_001`
- Fix Google OAuth with `@react-native-google-signin/google-signin`
- Move Firebase config to environment variables
- Add loading states to protect screens during auth resolution

**Pitfalls to avoid:**
- PITFALL #5: Hardcoded config exposed in source
- PITFALL #6: Hardcoded user ID breaks multi-user support

### Phases 2-3 Details (Core Value)

**Phase 2** builds the plant data foundation needed before Phase 3 can work.

**Phase 3** connects the plant identification API — the primary value proposition. This is the acquisition feature that brings users in.

**Pitfalls to avoid:**
- PITFALL #1: Trusting AI identification as truth (display confidence scores)
- PITFALL #2: Static care schedules don't account for environment

### Phases 4-5 Details (Enhancement)

**Phase 4** solves the retention problem — smart reminders that adapt to species and environment.

**Phase 5** completes the journey and adds defensive coding.

**Pitfalls to avoid:**
- PITFALL #3: Disease diagnosis without caveats
- PITFALL #4: Notification fatigue causes churn
- PITFALL #8: No error boundaries = full app crashes
- PITFALL #9: No test coverage = bugs undetected

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified with npm registry, official docs |
| Features | HIGH | Market research consistent across top apps |
| Architecture | HIGH | Based on existing codebase patterns |
| Pitfalls | HIGH | Common React Native/Expo issues documented |

**Gaps identified:**
- Plant ID API selection needs vendor evaluation (PlantNet vs Kindwise vs other)
- Exact notification implementation patterns untested
- Test framework not evaluated

---

## Research Flags

**Needs deeper research during planning:**
- Phase 3: Plant ID API vendor comparison and pricing
- Phase 4: expo-notifications best practices for scheduling
- Phase 5: Test framework selection (Jest vs other)

**Standard patterns (skip research):**
- Phase 1: Firebase Auth patterns (well-documented)
- Phase 2: Firestore CRUD patterns (already in use)

---

## Sources

| Research File | Sources |
|--------------|---------|
| STACK.md | npm registry, Expo docs, Firebase docs |
| FEATURES.md | Market research: Planta, PictureThis, Blossom, PlantIn |
| ARCHITECTURE.md | Expo Router docs, clean architecture examples |
| PITFALLS.md | Industry case studies, CONCERNS.md |

---

*Research synthesized for roadmap creation — 2026-04-22*