# Phase 7: missions and rewards - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-23
**Phase:** 07-missions-and-rewards
**Areas discussed:** Mission types, Data source, Completion detection, Reward claim, Reset timing, Reward UI, Obtenibles rarity, Streak logic, Weekly active definition, Mission visibility

---

## Mission Types & Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| Daily only | 5 daily missions, no weekly | |
| Daily + Weekly | 5 daily + 2 weekly, different pools | ✓ |
| Daily + Weekly + Milestone | Three tiers | |

**User's choice:** Daily + Weekly. 25 daily (5/day), 10 weekly (2/week). Walking dropped. Extensible for future types.

---

## Completion Detection & Progress

| Option | Description | Selected |
|--------|-------------|----------|
| Event-based | Detect after identify, water, share, scan | ✓ |
| Polling | Check periodically | |
| Manual | User marks complete | |

**User's choice:** Event-based. Multi-stage tracking (0/3 plants). Progress stored per assigned mission.

---

## Reward Claim Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-grant | XP added silently | |
| Tap to claim | User taps → animation → XP | ✓ |
| Mixed | Auto for small, tap for big | |

**User's choice:** Tap to claim with animation/alert. Grace period: missions from yesterday visible as "expired", claimable until midnight day after. Unclaimed after grace = lost.

---

## Reset Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Midnight | Rotate at midnight | ✓ (daily) |
| 24h rolling | 24h from first completion | |
| Manual refresh | User taps to refresh | |

**User's choice:** `today !== lastDailyRefresh` → repick 5 daily. `week !== lastWeeklyRefresh` → repick 2 weekly.

---

## Obtenibles (Cosmetic Items)

| Option | Description | Selected |
|--------|-------------|----------|
| No rarity | All equal | |
| Rarity tiers | Común/Raro/Épico/Legendario | ✓ |

**User's choice:** ~30 items with rarity. Distribution: 50% común, 25% raro, 15% épico, 10% legendario. Display in vitrina on profile. Extensible for achievements to grant items later.

---

## Streak Achievement

| Option | Description | Selected |
|--------|-------------|----------|
| Current streak only | Logro basado en racha actual (se rompe) | |
| Longest streak | Logro basado en racha histórica máxima | ✓ |
| Both | Ambos trackeados | |

**User's choice:** `longestStreak` (histórico) for achievements. `currentStreak` exists but can reset.

---

## Weekly Active Definition

| Option | Description | Selected |
|--------|-------------|----------|
| Open app | Abrir la app | |
| Complete missions | Acción con intención | ✓ |
| Water a plant | Acción específica | |

**User's choice:** Completar misiones (acción con intención).

---

## Mission Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| All visible | 5 misiones desde el inicio | ✓ |
| Progressive unlock | Misiones escalonadas durante el día | |

**User's choice:** All visible. App casual, algunas misiones toman tiempo de todas formas.

## Agent's Discretion
- Exact mission list (25 daily + 10 weekly)
- Exact obtainable item list (~30)
- Animation/alert implementation style
- Firestore schema design
- UI for vitrina showcase
- "Expired" visual treatment

## Deferred Ideas
- Walking missions — dropped, could add with pedometer/HealthKit later
- Achievement → item grants — architecture support only, wiring deferred
- Item gacha/random drops — not in scope
