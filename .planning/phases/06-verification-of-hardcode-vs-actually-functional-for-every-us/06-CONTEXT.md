# Phase 6: Verification of hardcode vs actually functional for every user - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

End-to-end verification that all app features work with dynamic user data — not hardcoded values — for any authenticated user. Find remaining hardcoded patterns (auth UIDs, mock data, Firebase config exposure), file them as issues, then fix them. This is an audit/quality phase wrapping up milestone v1.0.

NOT building: new features, Google OAuth fix, auto-seed data on registration.

</domain>

<decisions>
## Implementation Decisions

### Verification Scope
- **D-01:** Audit + fix — Phase 6 finds remaining hardcoded values AND fixes them (not audit-only)
- **D-02:** Automated checks — use lint rules / custom tool to scan for hardcoded patterns, not manual testing
- **D-03:** File issues first — violations logged as tasks/plans, then fixed per plan (not fix-as-found)

### What counts as "hardcoded"
- **D-04:** Flag pattern categories: (a) hardcoded auth UIDs, (b) mock data imports and placeholder constants, (c) Firebase API keys hardcoded in source
- **D-05:** Firebase config moves to `.env` using Expo's environment variable support — extract from `src/config/firebase.js`
- **D-06:** Flag both mock constants (`ACTIVITIES`, `DAILY_MISSIONS`, etc.) AND placeholder/stub screens showing "Próximamente..."

### Auth Flows to Verify
- **D-07:** Verify full flow with a new Firebase user: register → email/password login → personalized home data → profile → logout → login again — confirm all screens show correct user-specific data
- **D-08:** Google OAuth — skipped (out of scope for this phase)

### New User / Empty States
- **D-09:** Verify every screen for a brand-new user with zero data (no plants, missions, activity, achievements, items) — fix any crashes, blank screens, or garbled layouts
- **D-10:** No auto-seed data on registration — verify native empty states work correctly

### Claude's Discretion
- Exact lint rule implementation (ESLint custom rule vs standalone scan script)
- Exact `.env` setup approach for Firebase config
- Task breakdown for filed issues
- Empty state UI design (message, illustration, layout)

</decisions>

<specifics>
## Specific Ideas

- "Flag pattern categories" means a multi-category lint check: hardcoded UIDs, mock data imports, hardcoded API keys
- Firebase config: move `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` to `.env` — reference via `process.env.EXPO_PUBLIC_*` (Expo's convention)
- New user flow: register → check Home (stats, missions, timeline), Profile (collection, activity, achievements, vitrina), Calendar, Explore, Journal, Identify
- Lint file approach: one custom ESLint rule per pattern category, or a single scan script that checks all categories

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Boundary
- `.planning/ROADMAP.md` — Phase 6 entry (goal, depends-on, 0 plans)
- `.planning/PROJECT.md` — Core value and existing implementation

### Existing Code Concerns (what to look for)
- `.planning/codebase/CONCERNS.md` — Known tech debt items (hardcoded config, u_001, missing tests)
- `.planning/codebase/FEATURES.md` — Features implemented with placeholder statuses
- `.planning/codebase/ARCHITECTURE.md` — Service layer, data flow patterns

### Prior Phase Decisions
- `.planning/phases/01-authentication-foundation/01-CONTEXT.md` — u_001 removal, google OAuth decisions
- `.planning/phases/05-binnacle-test-and-qa-clase-asincronica-pdf/05-CONTEXT.md` — Test setup, Jest/RTL patterns

### Key Source Files (to be verified/scanned)
- `src/config/firebase.js` — Hardcoded Firebase config (target for .env extraction)
- `src/services/userService.ts` — Service layer pattern for dynamic UID verification
- `src/constants/data.ts` — Potential mock data constants
- `src/screens/explore/ExploreScreen.tsx` — Placeholder screen check
- `src/screens/journal/JournalScreen.tsx` — Placeholder screen check

### Technology Reference
- `.planning/codebase/STACK.md` — Expo, React Native, Firebase stack details
- `.planning/codebase/CONVENTIONS.md` — Naming and code style conventions
- `.planning/codebase/TESTING.md` — Testing setup from Phase 5

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `eslint` already configured — custom rules can be added to existing ESLint setup
- `src/services/` — Service layer all use `getAuth()` pattern; verification scan starts here
- `src/constants/data.ts` — Central location for static mock data (ACTIVITIES, DAILY_MISSIONS, etc.)

### Established Patterns
- Service layer: `src/services/*.ts` with async Firestore functions
- Auth: Firebase Auth via `auth.currentUser?.uid` pattern
- UI labels: Spanish throughout
- File-based routing with expo-router

### Integration Points
- `src/config/firebase.js` → `.env` refactor affects all Firebase imports
- `auth.currentUser.uid` usage across all services — single grep pattern to verify consistency
- `src/constants/data.ts` mock exports — verify each is service-driven or flagged

</code_context>

<deferred>
## Deferred Ideas

- Google OAuth fix — not in scope for Phase 6, could be a future Phase 10 or backlog item
- Auto-seed data on registration — not needed, empty states verified instead

</deferred>

---

*Phase: 06-verification-of-hardcode-vs-actually-functional-for-every-us*
*Context gathered: 2026-06-03*
