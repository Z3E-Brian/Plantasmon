# PlantasMon - Roadmap

**Milestone:** v1
**Granularity:** Coarse (3-5 phases)
**Created:** 2026-04-22

---

## Phases

- [ ] **Phase 1: Authentication Foundation** - Fix auth integration and connect user data
- [x] **Phase 2: Lab3** - API + Sincronización (completed 2026-05-14)
- [ ] **Phase 3: Calendar + Missing Screens** - Add calendar and functionality to missing screens
- [x] **Phase 4: 4 plants cards, home and general rewards** - 4 plants cards, home and general rewards (completed 2026-05-14)

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

**Plans:** 3 plans
- [ ] 01-01-PLAN.md — Dynamic User ID Migration (remove hardcoded u_001, add createUserDocument)
- [ ] 01-02-PLAN.md — Google OAuth Fix (wire credential exchange, cleanup useAuth.ts)
- [ ] 01-03-PLAN.md — Register Screen (create register route + form + auto-login)

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

**Plans:** 5/5 plans complete
- [x] 02-lab3-01-PLAN.md — Plant identification API (Pl@ntNet)
- [x] 02-lab3-02-PLAN.md — Offline support and sync queue
- [x] 02-lab3-03-PLAN.md — Module analysis and sync indicators
- [x] 02-lab3-04-PLAN.md — Offline storage wiring and auto-sync
- [x] 02-lab3-05-PLAN.md — Offline fallback in identify screen

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1 - Auth Foundation | 0/3 | Planned | - |
| 2 - Lab3 | 5/5 | Complete   | 2026-05-14 |
| 3 - Calendar + Missing Screens | 3/3 | Complete | 2026-05-13 |
| 4 - 4 plants cards, home and general rewards | 3/3 | Complete   | 2026-05-14 |

---

### Phase 3: Calendar + Missing Screens

**Goal:** Explore and Journal screens show real content instead of "Próximamente..." stubs. Explore is a full plant catalog from Firestore with search. Journal is a card-based dashboard with analyzed plants, missions, progress, and achievements. (Calendar deferred to future phase.)

**Requirements:**
- EXPL-01: User can browse plants in explore
- JOUR-01: User can keep plant care journal

**Depends on:** Phase 2

**Success Criteria** (what must be TRUE):
1. Explore screen shows search bar + 2-column card grid of all plants from Firestore `plants` collection
2. Search filters plant cards by name (client-side, case-insensitive)
3. Tapping a plant card navigates to `/plant/{id}`
4. Journal screen shows card-based dashboard with user's analyzed plants
5. Journal screen reuses DailyMissions + UserProgress components for missions and progress sections
6. Journal shows recent achievements (conditional)
7. Pull-to-refresh works on both screens
8. Loading, error, and empty states render correctly on both screens

**Plans:** 3 plans
- [x] 03-01-PLAN.md — Foundation: catalog service, plant detail stub, themed styles
- [x] 03-02-PLAN.md — Explore screen: search bar + 2-column card grid
- [x] 03-03-PLAN.md — Journal screen: card-based dashboard with reused components

### Phase 4: 4 plants cards, home and general rewards

**Goal:** Home dashboard shows real-time stats bar (account age, photos today, watering streak, last identification). Achievement system with 25 achievements seeded in Firestore, client-side unlock logic, and Profile screen display with locked/unlocked visual states.

**Requirements:** None mapped (phase_req_ids: null — custom features per CONTEXT.md)

**Depends on:** Phase 3

**Plans:** 3/3 plans complete
- [x] 04-01-PLAN.md — Home Stats Bar + PlantOfTheDay deferral
- [x] 04-02-PLAN.md — Achievements Backend (Firestore + unlock logic)
- [x] 04-03-PLAN.md — Achievements UI (Profile display + locked/unlocked states)

### Phase 5: binnacle, test and QA @Clase_Asincronica.pdf

**Goal:** Documentar avance de Lab 4 (bitácora + funcionalidad propia), investigar QA/testing para Expo/RN, implementar 2 pruebas básicas, y preparar PDF final con capturas y link al repo.
**Requirements**:
- QA-01, QA-02, DOC-01
**Depends on:** Phase 4
**Plans:** 3 plans

Plans:
- [ ] 05-01-PLAN.md — Configurar Jest/RTL + unit test validación planta
- [ ] 05-02-PLAN.md — Component test LoginScreen error
- [ ] 05-03-PLAN.md — Bitácora + investigación QA + borrador PDF

### Phase 6: verification of hardcode vs actually functional for every user

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 5
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 6 to break down)

### Phase 7: missions and rewards

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 7 to break down)

---

*Roadmap updated: 2026-05-14*

## Execution Status

| Plan | Status | Completed |
|------|--------|-----------|
| 02-lab3-01 — Backend API | ✓ Complete | 2026-04-24 |
| 02-lab3-02 — Frontend Integration | ✓ Complete | 2026-04-24 |
| 02-lab3-03 — Sync Indicators & Module Analysis | ✓ Complete | 2026-05-13 |
| 03-01-PLAN.md — Foundation | ✓ Planned | — |
| 03-02-PLAN.md — Explore Screen | ✓ Planned | — |
| 03-03-PLAN.md — Journal Screen | ✓ Complete | 2026-05-13 |
| 02-lab3-04-PLAN.md — Offline wiring | ✓ Complete | 2026-05-14 |
| 02-lab3-05-PLAN.md — Offline identify fallback | ✓ Complete | 2026-05-14 |
| 02-lab3-04-PLAN.md — Offline wiring | ✓ Complete | 2026-05-14 |
| 02-lab3-05-PLAN.md — Offline identify fallback | ✓ Complete | 2026-05-14 |
| 04-01-PLAN.md — Home Stats Bar | ✓ Complete | 2026-05-13 |
| 04-02-PLAN.md — Achievements Backend | ✓ Complete | 2026-05-13 |
| 04-03-PLAN.md — Achievements UI | ✓ Complete | 2026-05-14 |
| 04-01-PLAN.md — Home Stats Bar | ✓ Planned | — |
| 04-02-PLAN.md — Achievements Backend | ✓ Planned | — |
| 04-03-PLAN.md — Achievements UI | ✓ Planned | — |
