# Codebase Concerns

**Analysis Date:** 2026-04-22

## Tech Debt

**Hardcoded Firebase Configuration:**
- Issue: Firebase config is hardcoded in `src/config/firebase.js` instead of using environment variables
- Files: `src/config/firebase.js`
- Impact: Config exposed in source, cannot rotate API keys without code changes
- Fix approach: Use environment variables via Expo secrets or .env file

**Google OAuth Not Fully Implemented:**
- Issue: Google login button exists but throws error when clicked
- Files: `src/screens/auth/loginScreen.tsx` (line 58-59)
- Impact: Users cannot sign in with Google
- Fix approach: Implement backend Firebase Auth with Google or use Firebase Auth directly

**CURRENT_USER_ID is Hardcoded:**
- Issue: `src/services/userService.ts` uses `CURRENT_USER_ID = "u_001"` instead of dynamic user ID
- Files: `src/services/userService.ts`, `src/services/userPlantsService.ts`, `src/services/userAchievementsService.ts`
- Impact: Only works for single hardcoded test user
- Fix approach: Use Firebase Auth user ID: `auth.currentUser?.uid`

## Known Bugs

**Firestore Field Mapping Inconsistency:**
- Symptoms: Code checks for both `userData.subcollections?.userPlants` and `userData.userPlants`
- Files: `src/services/userPlantsService.ts`, `src/services/userAchievementsService.ts`
- Trigger: First run or new user with different schema structure
- Workaround: Migration plan needed

## Security Considerations

**Firebase Config Exposed:**
- Risk: API keys in source code
- Files: `src/config/firebase.js`
- Current mitigation: None (Firebase project is public-facing anyway)
- Recommendations: Still use environment variables for best practices

**No Input Sanitization:**
- Risk: User input passed directly to Firestore
- Files: Throughout services
- Current mitigation: Zod validation on forms
- Recommendations: Add Firestore security rules

## Performance Bottlenecks

**No obvious issues detected:**
- Simple Firestore reads/writes
- No N+1 query issues in current implementation

## Fragile Areas

**Field Path Mapping:**
- Files: `src/services/userService.ts`
- Why fragile: Different field names between Firestore and app (e.g., `bio` vs `aboutme`, `userPlants` vs `subcollections.userPlants`)
- Safe modification: Standardize schema migration
- Test coverage: None

## Scaling Limits

**Firestore Document Size:**
- Limit: 1MB per document
- Current capacity: User document holds arrays of plants/achievements
- Scaling path: Move arrays to subcollections

**No Pagination:**
- Limit: Loads all user plants at once
- Scaling path: Implement Firestore pagination

## Dependencies at Risk

**No outdated dependencies detected:**
- All dependencies appear current
- Firebase SDK 12.x is recent

## Missing Critical Features

**User Registration Screen:**
- Problem: Register link in login screen is non-functional
- Files: `src/screens/auth/loginScreen.tsx` (line 395)
- Blocks: New user sign-up

**Complete Testing:**
- Problem: No tests exist
- Blocks: Safe refactoring

**Error Boundaries:**
- Problem: No React error boundaries
- Blocks: App stability

**Offline Support:**
- Problem: No Firebase offline persistence
- Blocks: Working offline

## Test Coverage Gaps

**Untested area:** All source code
- What's not tested: Everything
- Risk: Bugs go undetected
- Priority: HIGH

---

*Concerns audit: 2026-04-22*