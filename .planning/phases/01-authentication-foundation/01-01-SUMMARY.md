# Plan 01-01 Summary: Dynamic User ID Migration

## Objective
Replace hardcoded `CURRENT_USER_ID = "u_001"` with dynamic Firebase Auth UID across all services, and add new-user initialization.

## Changes

### src/services/userService.ts
- Removed `CURRENT_USER_ID = "u_001"`
- Added `getCurrentUserId()` helper: reads `auth.currentUser?.uid`
- All functions (`getUserProfile`, `updateUserSettings`, `updateUserBio`, `logWateringActivity`): signature changed to `userId?: string`, uses `resolvedUserId = userId ?? getCurrentUserId()`
- Added `createUserDocument(uid, email)`: creates Firestore user doc with defaults on registration

### src/services/userPlantsService.ts
- Import changed from `CURRENT_USER_ID` to `getCurrentUserId`
- All functions: signature changed to `userId?: string`, uses resolved pattern
- `addUserPlant` destructure default removed

### src/services/userAchievementsService.ts
- Import changed from `CURRENT_USER_ID` to `getCurrentUserId`
- `getUserAchievements`: signature changed to `userId?: string`, uses resolved pattern

### Consumers migrated
- `StatsBar.tsx`: removed `CURRENT_USER_ID` import, calls without arguments
- `companionPlant.tsx`: uses `getCurrentUserId()` directly
- `EditProfileScreen.tsx`: uses `getCurrentUserId()` directly

## TypeScript
Clean compile (only pre-existing shadcn/ui dependency errors remain)

## Files Modified
6 files, +112/-41 lines
- src/services/userService.ts
- src/services/userPlantsService.ts
- src/services/userAchievementsService.ts
- src/components/home/StatsBar.tsx
- app/companionPlant.tsx
- src/screens/editProfile/EditProfileScreen.tsx
