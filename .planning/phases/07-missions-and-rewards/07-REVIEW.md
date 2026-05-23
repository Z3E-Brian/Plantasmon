---
phase: 07-missions-and-rewards
reviewed: 2026-05-23T22:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - src/services/missionService.ts
  - src/constants/missionsData.ts
  - src/services/userService.ts
  - src/components/home/DailyMissions.tsx
  - src/components/home/WeeklyMissions.tsx
  - src/screens/home/HomeScreen.tsx
  - src/styles/themedStyles.ts
  - app/journal.tsx
  - src/hooks/useMissionProgress.ts
  - app/_layout.tsx
  - src/constants/obteniblesData.ts
  - src/services/obteniblesService.ts
  - src/components/profile/ProfileVitrina.tsx
  - src/screens/userProfile/UserProfile.tsx
  - src/services/userAchievementsService.ts
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 07: Code Review Report

**Reviewed:** 2026-05-23T22:00:00Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Reviewed missions/rewards, obtenibles, and achievement updates across services, hooks, and UI. Core logic looks consistent, but there are race conditions in mission progress/XP updates and the “expired missions” grace period is not time-bounded, which can surface incorrect state over time.

## Warnings

### WR-01: Non-atomic XP updates can overwrite concurrent changes

**File:** `src/services/missionService.ts:483-496`
**Issue:** `claimMissionReward` reads `stats.xp`, adds `xpReward`, and writes back. If XP is updated elsewhere (other missions, achievements) at the same time, last-write-wins can lose increments.
**Fix:** Use `runTransaction` or `increment()` to apply XP changes atomically, and update mission progress within the same transaction to prevent double-claim race.

```ts
import { runTransaction, increment } from "firebase/firestore";

await runTransaction(db, async (tx) => {
  const userSnap = await tx.get(userRef);
  if (!userSnap.exists()) return;

  const missionProgress = [...(userSnap.data().missions?.missionProgress ?? [])];
  const idx = missionProgress.findIndex((m: any) => m.id === missionId);
  if (idx === -1) return;

  const mission = { ...missionProgress[idx] };
  if (!mission.completed || mission.claimed) return;

  mission.claimed = true;
  mission.claimedAt = new Date().toISOString();
  missionProgress[idx] = mission;

  tx.update(userRef, {
    "missions.missionProgress": missionProgress,
    "stats.xp": increment(xpReward),
  });
});
```

### WR-02: Mission progress updates can lose increments under concurrency

**File:** `src/services/missionService.ts:411-440`
**Issue:** `updateMissionProgress` reads the full `missionProgress` array and writes it back. If multiple events report progress concurrently, one write can overwrite another, losing increments.
**Fix:** Use a transaction to read-modify-write, or store mission progress in a map keyed by mission ID and update via transaction to ensure increments are not lost.

```ts
import { runTransaction } from "firebase/firestore";

await runTransaction(db, async (tx) => {
  const userSnap = await tx.get(userRef);
  if (!userSnap.exists()) return;

  const missionProgress = [...(userSnap.data().missions?.missionProgress ?? [])];
  const idx = missionProgress.findIndex((m: any) => m.id === missionId);
  if (idx === -1) return;

  const mission = { ...missionProgress[idx] };
  mission.progress = (mission.progress ?? 0) + increment;
  if (mission.progress >= mission.target) mission.completed = true;
  missionProgress[idx] = mission;

  tx.update(userRef, { "missions.missionProgress": missionProgress });
});
```

### WR-03: Expired missions never age out beyond one day

**File:** `src/services/missionService.ts:511-545`
**Issue:** `getExpiredMissions` returns any completed-but-unclaimed mission not in today’s assignment, with no date constraint. Older missions can linger indefinitely, violating the “grace period until midnight of the next day.”
**Fix:** Store an `assignedAt` (or `assignedDate`) on mission progress when assigned, and filter expired missions to those from the immediately previous day (or within a 24h window). Example:

```ts
// When assigning
return {
  id,
  progress: 0,
  target: definition?.requirement.count ?? 1,
  completed: false,
  claimed: false,
  assignedAt: new Date().toISOString(),
};

// When filtering expired
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = toDateStr(yesterday);

const expired = missionProgress.filter((m: any) =>
  m.completed &&
  !m.claimed &&
  !assignedDailyIds.includes(m.id) &&
  m.assignedAt &&
  toDateStr(new Date(m.assignedAt)) === yesterdayStr
);
```

---

_Reviewed: 2026-05-23T22:00:00Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
