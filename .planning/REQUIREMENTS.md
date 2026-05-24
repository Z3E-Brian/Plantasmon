# PlantasMon - Requirements

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can register with email and password
- [ ] **AUTH-02**: User can log in with email and password
- [ ] **AUTH-03**: User can log in with Google OAuth
- [ ] **AUTH-04**: User stays logged in across app restarts (auth persistence)
- [ ] **AUTH-05**: User can log out from any screen

### Home Dashboard

- [ ] **HOME-01**: User can view personalized home dashboard
- [ ] **HOME-02**: User can see plant of the day
- [ ] **HOME-03**: User can view daily missions/progress
- [ ] **HOME-04**: User can view recent plant identifications
- [ ] **HOME-05**: User can see achievements progress

### Plant Identification

- [ ] **ID-01**: User can take photo of a plant
- [ ] **ID-02**: User can identify plant from photo (via API)
- [ ] **ID-03**: User sees identification confidence score
- [ ] **ID-04**: User can add identified plant to collection
- [ ] **ID-05**: User sees plant care tips after identification

### Plant Collection

- [ ] **COLL-01**: User can view their plant collection
- [ ] **COLL-02**: User can add plants manually
- [ ] **COLL-03**: User can edit plant details
- [ ] **COLL-04**: User can remove plants from collection
- [ ] **COLL-05**: User can view per-plant care history

### Care Reminders

- [ ] **REM-01**: User receives watering reminders
- [ ] **REM-02**: User receives fertilizing reminders
- [ ] **REM-03**: User can customize reminder schedule per plant
- [ ] **REM-04**: User can snooze/dismiss reminders

### User Profile

- [ ] **PROF-01**: User can view their profile
- [ ] **PROF-02**: User can edit profile information
- [ ] **PROF-03**: User can view achievements
- [ ] **PROF-04**: User can view activity history

### Explore (Future)

- [ ] **EXPL-01**: User can browse plants in explore (deferred)

### Journal (Future)

- [ ] **JOUR-01**: User can keep plant care journal (deferred)

### QA & Documentation (Phase 5)

- [ ] **QA-01**: Investigación y comparación de herramientas de testing/QA para Expo/RN
- [ ] **QA-02**: Implementar 2 pruebas básicas (unit + component) y documentar resultados
- [ ] **DOC-01**: Bitácora Lab 4 + funcionalidad propia + PDF con link al repo

### Missions & Rewards (Phase 7)

- [ ] **MISS-01**: Daily mission system (5 missions/day, rotated from pool of 25)
- [ ] **MISS-02**: Weekly mission system (2 missions/week, rotated from pool of 10)
- [ ] **MISS-03**: Multi-stage mission progress tracking
- [x] **MISS-04**: Event-based completion detection after identify/water/scan/share actions
- [x] **MISS-05**: Tap-to-claim reward flow with XP grant + confirmation
- [x] **MISS-06**: Grace period for unclaimed missions (visible as expired until midnight next day)
- [ ] **OBT-01**: ~30 obtainable cosmetic items with rarity tiers
- [ ] **OBT-02**: Profile vitrina showcase for obtained items
- [ ] **ACH-02**: Streak achievements based on longestStreak (historical max)
- [ ] **ACH-03**: Account age achievements (100 days, 1 year)
- [ ] **ACH-04**: Weekly active achievement (complete all missions in one week)
- [ ] **ACH-05**: Architecture supports rewardItemId on achievements for future item grants

---

## v2 Requirements

- [ ] Push notifications for care reminders
- [ ] Plant disease diagnosis
- [ ] Care guide database integration
- [ ] Light meter feature
- [ ] Community sharing

---

## Out of Scope

- **Social features** — Not mentioned in requirements
- **E-commerce** — Out of scope for v1
- **AR plant placement** — Complex, deferred
- **Offline mode** — Not in current requirements
- **Widget support** — Not requested

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| AUTH-01 | Phase 1: Authentication Foundation | Pending |
| AUTH-02 | Phase 1: Authentication Foundation | Pending |
| AUTH-03 | Phase 1: Authentication Foundation | Pending |
| AUTH-04 | Phase 1: Authentication Foundation | Pending |
| AUTH-05 | Phase 1: Authentication Foundation | Pending |
| HOME-01 | Phase 1: Authentication Foundation | Pending |
| HOME-02 | Phase 1: Authentication Foundation | Pending |
| HOME-03 | Phase 1: Authentication Foundation | Pending |
| HOME-04 | Phase 1: Authentication Foundation | Pending |
| HOME-05 | Phase 1: Authentication Foundation | Pending |
| PROF-01 | Phase 1: Authentication Foundation | Pending |
| PROF-02 | Phase 1: Authentication Foundation | Pending |
| PROF-03 | Phase 1: Authentication Foundation | Pending |
| PROF-04 | Phase 1: Authentication Foundation | Pending |
| ID-01 | Phase 2: Plant Core | Pending |
| ID-02 | Phase 2: Plant Core | Pending |
| ID-03 | Phase 2: Plant Core | Pending |
| ID-04 | Phase 2: Plant Core | Pending |
| ID-05 | Phase 2: Plant Core | Pending |
| COLL-01 | Phase 2: Plant Core | Pending |
| COLL-02 | Phase 2: Plant Core | Pending |
| COLL-03 | Phase 2: Plant Core | Pending |
| COLL-04 | Phase 2: Plant Core | Pending |
| COLL-05 | Phase 2: Plant Core | Pending |
| REM-01 | Phase 3: Care Reminders | Pending |
| REM-02 | Phase 3: Care Reminders | Pending |
| REM-03 | Phase 3: Care Reminders | Pending |
| REM-04 | Phase 3: Care Reminders | Pending |
| EXPL-01 | Phase 4: Polish | Pending |
| JOUR-01 | Phase 4: Polish | Pending |
| QA-01 | Phase 5: Binnacle + Testing/QA | Pending |
| QA-02 | Phase 5: Binnacle + Testing/QA | Pending |
| DOC-01 | Phase 5: Binnacle + Testing/QA | Pending |
| MISS-01 | Phase 7: Missions & Rewards | Pending |
| MISS-02 | Phase 7: Missions & Rewards | Pending |
| MISS-03 | Phase 7: Missions & Rewards | Pending |
| MISS-04 | Phase 7: Missions & Rewards | Complete |
| MISS-05 | Phase 7: Missions & Rewards | Complete |
| MISS-06 | Phase 7: Missions & Rewards | Complete |
| OBT-01 | Phase 7: Missions & Rewards | Pending |
| OBT-02 | Phase 7: Missions & Rewards | Pending |
| ACH-02 | Phase 7: Missions & Rewards | Pending |
| ACH-03 | Phase 7: Missions & Rewards | Pending |
| ACH-04 | Phase 7: Missions & Rewards | Pending |
| ACH-05 | Phase 7: Missions & Rewards | Pending |

---

*Last updated: 2025-04-22 after requirements definition*
*Research: .planning/research/*
