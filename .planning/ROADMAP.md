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
| 1 - Auth Foundation | 3/3 | Complete | 2026-05-23 |
| 2 - Lab3 | 5/5 | Complete   | 2026-05-14 |
| 3 - Calendar + Missing Screens | 3/3 | Complete | 2026-05-13 |
| 4 - 4 plants cards, home and general rewards | 3/3 | Complete   | 2026-05-14 |
| 5 - Binnacle, Test & QA | 3/3 | Complete | 2026-05-24 |
| 6 - Verification of hardcode | 0/3 | Planned | - |
| 7 - Missions & Rewards | 7/7 | Complete   | 2026-05-25 |
| 8 - Informative Pop Boxes | 3/3 | Complete | 2026-05-25 |
| 9 - Activity & Calendar | 3/3 | Complete   | 2026-05-25 |
| 10 - Chat y PDF | 0/4 | Planned | - |

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
**Plans:** 3/3 plans executed

Plans:
- [x] 05-01-PLAN.md — Configurar Jest/RTL + unit test validación planta
- [x] 05-02-PLAN.md — Component test CalendarScreen (loading, empty, legend, title)
- [x] 05-03-PLAN.md — Bitácora + investigación QA + borrador PDF

### Phase 6: verification of hardcode vs actually functional for every user

**Goal:** End-to-end verification that all app features work with dynamic user data — not hardcoded values — for any authenticated user. Find remaining hardcoded patterns (auth UIDs, mock data, Firebase config exposure), then fix them.

**Requirements**: None (phase_req_ids: null — per CONTEXT.md decisions)
**Depends on:** Phase 5
**Plans:** 3 plans

Plans:
- [ ] 06-01-PLAN.md — Hardcoded Pattern Scanner + Audit Report (create scanner, catalog findings)
- [ ] 06-02-PLAN.md — Firebase Config → .env Extraction (env vars, update firebase.js)
- [ ] 06-03-PLAN.md — Mock Data & Placeholder Cleanup + Empty State Verification

### Phase 7: missions and rewards

**Goal:** Users have daily/weekly missions with XP rewards, obtainable cosmetic items with rarity tiers displayed on profile, and new streak/account-age achievements.

**Requirements**:
- MISS-01: Daily mission system (5 missions/day, rotated from pool of 25)
- MISS-02: Weekly mission system (2 missions/week, rotated from pool of 10)
- MISS-03: Multi-stage progress tracking on missions (e.g., "0/3 plants identified")
- MISS-04: Event-based completion detection after identify/water/share/scan actions
- MISS-05: Tap-to-claim reward flow with XP grant + animation
- MISS-06: Grace period for unclaimed missions (visible as expired until midnight next day)
- OBT-01: ~30 obtainable cosmetic items with rarity tiers in Firestore
- OBT-02: Profile vitrina showcase for obtained items
- ACH-02: Streak achievements based on longestStreak (historical max)
- ACH-03: Account age achievements (100 days, 1 year)
- ACH-04: Weekly active achievement (complete all missions in one week)
- ACH-05: Architecture supports rewardItemId on achievements for future item grants

**Depends on:** Phase 6
**Plans:** 7/7 plans complete

Plans:
- [x] 07-01-PLAN.md — Mission Service + Firestore seed
- [x] 07-02-PLAN.md — Mission UI + HomeScreen Integration + Rotation
- [x] 07-03-PLAN.md — Claim Flow + Grace Period + Completion Detection
- [x] 07-04-PLAN.md — Obtenibles System + Profile Vitrina
- [x] 07-05-PLAN.md — New Achievements (Streak, Account Age, Weekly)

### Phase 8: informative pop boxes

**Goal:** Users see informative bottom-sheet popups across the app — first-use explanations for features, celebration popups on unlocks (achievements/missions/items), and info tooltips on demand via info icons.
**Requirements**: None (phase_req_ids: null — per CONTEXT.md decisions)
**Depends on:** Phase 7
**Plans:** 3 plans

Plans:
- [ ] 08-01-PLAN.md — Popup dismissal service + hooks
- [ ] 08-02-PLAN.md — InfoBottomSheet + CelebrationSheet components
- [ ] 08-03-PLAN.md — Screen integration (first-use, celebration, info icons)

### Phase 9: activity in profile and calendar in app

**Goal:** Replace hardcoded mock activity feed in profile with real Firestore data, and add a calendar screen showing plant care events (waterings, identifications, missions). Also add an inline calendar/timeline view on Home.

**Requirements:** TBD (planned via D-01 through D-12 from CONTEXT.md)
**Depends on:** Phase 8
**Plans:** 3/3 plans complete

Plans:
- [x] 09-01-PLAN.md — Activity Service + Hook (Firestore subcollection + useActivityFeed)
- [x] 09-02-PLAN.md — Calendar Screen (react-native-calendars + route + event markers)
- [x] 09-03-PLAN.md — Profile Wire + Home Timeline + Logging (wire real data + log calls)

### Phase 10: chat y pdf

**Goal:** Users can chat in real-time with each other via WebSocket, and export a PDF with app progress report including screenshots and Android build link.

**Requirements**:
- CHAT-BACKEND-01: Chat backend cloned and configured with env vars
- CHAT-BACKEND-02: Deployed backend verified healthy and operational
- CHAT-FRONTEND-01: Chat screen with real-time messaging via WebSocket
- CHAT-FRONTEND-02: Chat navigation integrated into app
- CHAT-FRONTEND-03: Chat works with deployed backend
- BUILD-01: Android APK/AAB generated via EAS Build
- PDF-01: PDF export with app progress report

**Depends on:** Phase 9
**Plans:** 4 plans

Plans:
- [ ] 10-01-PLAN.md — Chat Backend Configuration (clone repo, .env, verify deployment)
- [ ] 10-02-PLAN.md — Chat Frontend Integration (service + screen + navigation)
- [ ] 10-03-PLAN.md — Android Build (EAS Build preview APK)
- [ ] 10-04-PLAN.md — PDF Export (expo-print, progress report with build link)

---

*Roadmap updated: 2026-06-09 (Phase 10 plans created)*

## Execution Status

| Plan | Status | Completed |
|------|--------|-----------|
| 01-01-PLAN.md — Dynamic User ID Migration | ✓ Complete | 2026-05-23 |
| 01-02-PLAN.md — Google OAuth Fix | ✓ Complete | 2026-05-23 |
| 01-03-PLAN.md — Register Screen | ✓ Complete | 2026-05-23 |
| 02-lab3-01 — Backend API | ✓ Complete | 2026-04-24 |
| 02-lab3-02 — Frontend Integration | ✓ Complete | 2026-04-24 |
| 02-lab3-03 — Sync Indicators & Module Analysis | ✓ Complete | 2026-05-13 |
| 02-lab3-04-PLAN.md — Offline wiring | ✓ Complete | 2026-05-14 |
| 02-lab3-05-PLAN.md — Offline identify fallback | ✓ Complete | 2026-05-14 |
| 03-01-PLAN.md — Foundation | ✓ Planned | — |
| 03-02-PLAN.md — Explore Screen | ✓ Planned | — |
| 03-03-PLAN.md — Journal Screen | ✓ Complete | 2026-05-13 |
| 04-01-PLAN.md — Home Stats Bar | ✓ Complete | 2026-05-13 |
| 04-02-PLAN.md — Achievements Backend | ✓ Complete | 2026-05-13 |
| 04-03-PLAN.md — Achievements UI | ✓ Complete | 2026-05-14 |
| 05-01-PLAN.md — Jest/RTL + unit test | ✓ Complete | 2026-05-24 |
| 05-02-PLAN.md — Component tests | ✓ Complete | 2026-05-24 |
| 05-03-PLAN.md — Bitácora + QA + PDF | ✓ Complete | 2026-05-24 |
| 07-01-PLAN.md — Mission Service + Firestore seed | ✓ Complete | 2026-05-23 |
| 07-02-PLAN.md — Mission UI + HomeScreen + Rotation | ✓ Complete | 2026-05-23 |
| 07-03-PLAN.md — Claim Flow + Grace Period + Events | ✓ Complete | 2026-05-24 |
| 07-04-PLAN.md — Obtenibles + Profile Vitrina | ✓ Complete | 2026-05-24 |
| 07-05-PLAN.md — New Achievements | ✓ Complete | 2026-05-24 |
