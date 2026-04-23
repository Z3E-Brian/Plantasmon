# PlantasMon - Roadmap

**Milestone:** v1
**Granularity:** Coarse (3-5 phases)
**Created:** 2026-04-22

---

## Phases

- [ ] **Phase 1: Authentication Foundation** - Fix auth integration and connect user data
- [ ] **Phase 2: Plant Core** - Plant identification and collection features
- [ ] **Phase 3: Care Reminders** - Smart reminder system
- [ ] **Phase 4: Polish** - Complete remaining screens

---

## Phase Details

### Phase 1: Authentication Foundation

**Goal:** Users can securely log in with their own identity, and all screens display user-specific data

**Depends on:** Nothing (first phase)

**Requirements:**
- AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
- HOME-01, HOME-02, HOME-03, HOME-04, HOME-05
- PROF-01, PROF-02, PROF-03, PROF-04

**Success Criteria** (what must be TRUE):
1. User can register with email and password and see their own data after login
2. User can log in with email/password and see personalized dashboard
3. User can log in with Google OAuth successfully
4. User stays logged in across app restarts
5. User can log out from any screen and return to login
6. Home dashboard shows personalized data for the logged-in user
7. Profile shows achievements and activity for the logged-in user

**Plans:** TBD

---

### Phase 2: Plant Core

**Goal:** Users can identify plants from photos and build their personal plant collection

**Depends on:** Phase 1

**Requirements:**
- ID-01, ID-02, ID-03, ID-04, ID-05
- COLL-01, COLL-02, COLL-03, COLL-04, COLL-05

**Success Criteria** (what must be TRUE):
1. User can take a photo of a plant using the camera
2. User receives plant identification result with species name
3. User sees confidence score for identification
4. User can add identified plant to their collection
5. User can view their full plant collection
6. User can add plants manually (without identification)
7. User can edit and remove plants from collection

**Plans:** TBD

**UI hint:** yes

---

### Phase 3: Care Reminders

**Goal:** Users receive intelligent reminders to care for their plants

**Depends on:** Phase 2

**Requirements:**
- REM-01, REM-02, REM-03, REM-04

**Success Criteria** (what must be TRUE):
1. User receives push notification reminders to water plants
2. User receives push notification reminders to fertilize plants
3. User can customize reminder schedule per plant
4. User can snooze or dismiss individual reminders

**Plans:** TBD

---

### Phase 4: Polish

**Goal:** Complete incomplete screens and add defensive coding

**Depends on:** Phase 3

**Requirements:**
- EXPL-01 (Explore functionality)
- JOUR-01 (Journal functionality)

**Success Criteria** (what must be TRUE):
1. User can browse plants in Explore screen
2. User can keep a plant care journal with entries
3. App handles errors gracefully with error boundaries
4. App has basic test coverage for critical flows

**Plans:** TBD

---

## Coverage Map

| Phase | Requirements | Coverage |
|-------|--------------|----------|
| 1 - Auth Foundation | AUTH-01 to AUTH-05, HOME-01 to HOME-05, PROF-01 to PROF-04 | 14/28 |
| 2 - Plant Core | ID-01 to ID-05, COLL-01 to COLL-05 | 10/28 |
| 3 - Care Reminders | REM-01 to REM-04 | 4/28 |
| 4 - Polish | EXPL-01, JOUR-01 | 0/28* |

*EXPL-01 and JOUR-01 were marked "deferred" but belong in v1 for complete app

**Total:** 28/28 requirements mapped ✓

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1 - Auth Foundation | 0/1 | Not started | - |
| 2 - Plant Core | 0/1 | Not started | - |
| 3 - Care Reminders | 0/1 | Not started | - |
| 4 - Polish | 0/1 | Not started | - |

---

*Roadmap created: 2026-04-22*