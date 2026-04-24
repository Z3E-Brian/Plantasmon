# PlantasMon - Roadmap

**Milestone:** v1
**Granularity:** Coarse (3-5 phases)
**Created:** 2026-04-22

---

## Phases

- [ ] **Phase 1: Authentication Foundation** - Fix auth integration and connect user data
- [ ] **Phase 2: Lab3** - API + Sincronización

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

### Phase 2: Lab3

**Goal:** API + Sincronización - Plant identification with AI API and offline support

**Depends on:** Phase 1

**Requirements:**
- Plant identification via API (Pl@ntNet)
- Offline support with local storage
- Sync queue for pending operations
- Module analysis for offline capability

**Success Criteria** (what must be TRUE):
1. User can take photo of plant and identify using AI API
2. App works without internet (offline modules)
3. Data syncs when connection restored
4. User sees feedback about sync status
5. API deployed to cloud (Render)

**Plans:** 3 plans
- [ ] 02-lab3-01-PLAN.md — Plant identification API (Pl@ntNet)
- [ ] 02-lab3-02-PLAN.md — Offline support and sync queue
- [ ] 02-lab3-03-PLAN.md — Module analysis and sync indicators

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1 - Auth Foundation | 0/1 | Not started | - |
| 2 - Lab3 | 0/3 | Not started | - |

---

*Roadmap updated: 2026-04-24*