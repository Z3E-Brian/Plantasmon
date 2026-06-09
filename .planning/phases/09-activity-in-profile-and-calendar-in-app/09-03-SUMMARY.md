---
phase: 09-activity-in-profile-and-calendar-in-app
plan: 03
type: execute
wave: 2
depends_on: [09-01]
requirements: [D-03, D-07]
completed: 2026-05-25
duration: 2min
---

# Phase 09 Plan 03: Wire Activity Feed, Home Timeline, and Logging

**Profile activity tab wired to real Firestore data via useActivityFeed, Home screen shows inline recent-activity timeline, all 4 event-producing services log activities fire-and-forget.**

## Performance

- **Duration:** 2 min
- **Completed:** 2026-05-25
- **Tasks:** 3

## Accomplishments

- Profile activity tab now renders real Firestore data instead of mock ACTIVITIES constant
- Home screen has inline HomeTimeline component between WeeklyMissions and RecentAchievement
- All 4 event-producing services log activities on their primary actions: water, identify, mission claim, achievement unlock

## Files Modified

- `src/screens/userProfile/UserProfile.tsx` — Replaced mock ACTIVITIES import with useActivityFeed() hook
- `src/screens/home/HomeScreen.tsx` — Added HomeTimeline component import and render
- `src/services/userService.ts` — logActivity("water") calls in logWateringActivity
- `src/services/userPlantsService.ts` — logActivity("identify") in addPlantToCollection
- `src/services/missionService.ts` — logActivity("mission") in claimMissionReward
- `src/services/userAchievementsService.ts` — logActivity("achievement") in unlock flow

## Verification

- ✅ All logActivity calls use fire-and-forget pattern (try/catch + .catch())
- ✅ All imports use inline require() to avoid circular dependencies
- ✅ UserProfile.tsx no longer imports mock ACTIVITIES from data.ts
- ✅ HomeTimeline component exists at src/components/home/HomeTimeline.tsx
- ✅ HomeScreen.tsx renders <HomeTimeline /> between WeeklyMissions and RecentAchievement
