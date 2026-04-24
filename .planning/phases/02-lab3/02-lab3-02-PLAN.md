---
phase: 02-lab3
plan: 02
type: execute
wave: 2
depends_on:
  - 02-lab3-01
files_modified:
  - src/services/syncQueueService.ts
  - src/hooks/useOfflineSync.ts
  - src/services/plantStorageService.ts
autonomous: true
requirements:
  - LAB3-SYNC-01
  - LAB3-SYNC-02
  - LAB3-SYNC-03
  - LAB3-SYNC-04
user_setup: []

must_haves:
  truths:
    - "User actions work offline and queue for later sync"
    - "App displays sync status indicator"
    - "Queued operations sync when connection restored"
    - "Offline plants are cached locally"
  artifacts:
    - path: "src/services/syncQueueService.ts"
      provides: "Offline operation queue with persistence"
      exports: ["SyncQueue", "SyncOperation", "addToQueue", "processQueue"]
    - path: "src/hooks/useOfflineSync.ts"
      provides: "React hook for sync status and network state"
      exports: ["useOfflineSync"]
    - path: "src/services/plantStorageService.ts"
      provides: "Local plant cache with AsyncStorage"
      exports: ["PlantCache", "cachePlant", "getCachedPlants"]
  key_links:
    - from: "src/hooks/useOfflineSync.ts"
      to: "src/services/syncQueueService.ts"
      via: "useEffect triggers processQueue on network restore"
      pattern: "processQueue\\(\\)"
    - from: "src/services/plantStorageService.ts"
      to: "src/services/plantIdService.ts"
      via: "Cache stores identified plants for offline access"
      pattern: "cachePlant|cachedPlants"
---

<objective>
Implement offline support with local storage and sync queue. User actions work offline and sync when connection is restored.

Purpose: App functions without internet; data syncs transparently when online
Output: Sync queue service, offline hook, and local plant cache
</objective>

<execution_context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/workflows/execute-plan.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md (Phase 2 goal)
@.planning/codebase/STRUCTURE.md

# Existing patterns
@src/services/userPlantsService.ts  # Current Firestore operations to wrap
@src/services/plantIdService.ts  # From Plan 01

# Key dependencies
@package.json  # expo-camera, async-storage available
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->

From src/services/userPlantsService.ts:
```typescript
export interface UserPlantUpdate {
  nickname?: string;
  notes?: string;
  lastWatered?: string;
  lastWeeded?: string;
  favorite?: boolean;
  isCompanion?: boolean;
  location?: string;
  personality?: string;
}

updateUserPlant(plantId: string, updates: UserPlantUpdate, userId?: string): Promise<void>
getUserPlants(userId?: string): Promise<UserPlant[]>
togglePlantFavorite(plantId: string, isFavorite: boolean, userId?: string): Promise<void>
```

From Plan 01 (plantIdService.ts):
```typescript
export interface PlantSpecies {
  scientificName: string;
  commonNames: string[];
  genus: string;
  family: string;
  score: number;
}
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Create sync queue service</name>
  <files>src/services/syncQueueService.ts</files>
  <behavior>
    - Test 1: addToQueue(operation) persists to AsyncStorage
    - Test 2: processQueue() sends pending operations to Firestore
    - Test 3: processQueue() removes successfully synced items
    - Test 4: Queue is FIFO - first in, first out
  </behavior>
  <action>
Create `src/services/syncQueueService.ts`:

```typescript
export type SyncOperationType = 'ADD_PLANT' | 'UPDATE_PLANT' | 'TOGGLE_FAVORITE' | 'DELETE_PLANT';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface SyncQueue {
  operations: SyncOperation[];
  lastProcessed: number | null;
}
```

**Functions to export:**
1. `addToQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>)` - Add operation to queue
2. `processQueue(userId: string)` - Process all pending operations in FIFO order
3. `getQueueSize()` - Return number of pending operations
4. `clearQueue()` - Clear all operations (after full sync)

**Implementation:**
- Store queue in AsyncStorage under key `sync_queue`
- On add: prepend new operation with UUID and timestamp
- On process: iterate FIFO, execute each against Firestore, remove on success
- On failure: increment retryCount, keep in queue (max 3 retries)
- Use exponential backoff for retries

**Offline wrapper pattern:**
```typescript
export async function offlineAddPlant(plantData: any, userId: string) {
  const operation = { type: 'ADD_PLANT', payload: { plantData, userId }, maxRetries: 3 };
  await addToQueue(operation);
  // Also cache locally immediately
  await cachePlantLocally(plantData);
}
```
  </action>
  <verify>
    <automated>npx tsc --noEmit src/services/syncQueueService.ts</automated>
  </verify>
  <done>Sync queue persists operations to AsyncStorage and processes them in order</done>
</task>

<task type="auto">
  <name>Task 2: Create useOfflineSync hook</name>
  <files>src/hooks/useOfflineSync.ts</files>
  <action>
Create `src/hooks/useOfflineSync.ts`:

```typescript
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { addToQueue, processQueue, getQueueSize } from '@/src/services/syncQueueService';
import { useAuth } from './useAuth';

export interface SyncStatus {
  isOnline: boolean;
  pendingOperations: number;
  isSyncing: boolean;
  lastSyncTime: number | null;
  hasFailedSyncs: boolean;
}

export function useOfflineSync(): SyncStatus {
  // Implementation monitors network state and triggers sync
}
```

**Implementation:**
1. Use `NetInfo` to track connectivity (expo has @react-native-community/netinfo)
2. Track pending operations count from syncQueueService
3. When network restored: auto-call processQueue()
4. Expose `forceSyncNow()` callback
5. Show toast on sync completion/failure

**UI integration points:**
- Component can show sync indicator (spinning icon when syncing)
- Badge with pending count when operations queued
- Status bar color: green (synced), yellow (pending), red (failed)

**Persist sync metadata:**
- Store `lastSyncTime` in AsyncStorage
- Display "Last synced: X minutes ago" in UI
  </action>
  <verify>
    <automated>npx tsc --noEmit src/hooks/useOfflineSync.ts</automated>
  </verify>
  <done>Hook provides sync status and triggers auto-sync on network restore</done>
</task>

<task type="auto">
  <name>Task 3: Create plant storage/cache service</name>
  <files>src/services/plantStorageService.ts</files>
  <action>
Create `src/services/plantStorageService.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CachedPlant {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  family: string;
  imageUri?: string;
  cachedAt: number;
}
```

**Functions to export:**
1. `cachePlant(plant: CachedPlant)` - Save plant to local cache
2. `getCachedPlants(): Promise<CachedPlant[]>` - Get all cached plants
3. `getCachedPlant(id: string): Promise<CachedPlant | null>` - Get specific plant
4. `clearPlantCache()` - Clear all cached plants
5. `isPlantCached(id: string): Promise<boolean>` - Check if plant exists

**Storage key:** `plant_cache` (JSON array of CachedPlant)

**Integration with PlantNet:**
- After successful identification, cache the result locally
- This enables offline viewing of identified plants
- Cache expires after 30 days (check `cachedAt` timestamp)

**Integration with sync:**
- When queued operations include plant data, ensure it's cached first
- This provides immediate UI feedback even before server confirms
  </action>
  <verify>
    <automated>npx tsc --noEmit src/services/plantStorageService.ts</automated>
  </verify>
  <done>Plants cached locally for offline access with 30-day expiry</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| App → AsyncStorage | Local persistence of sync queue and plant cache |
| Network restore → Firestore | Queued operations sent to server |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-LAB3-05 | S | Sync queue storage | mitigate | Queue stored locally, only processed when authenticated |
| T-LAB3-06 | D | Sync conflicts | accept | Last-write-wins for plant updates; user can manually resolve |
| T-LAB3-07 | E | Failed sync retry | mitigate | Max 3 retries with exponential backoff; alert after max retries |
| T-LAB3-08 | I | Offline plant cache | accept | Cached plants are public botanical data, no PII risk |
</threat_model>

<verification>
1. TypeScript check on all services
2. Verify sync queue persists across app restarts
3. Check NetInfo integration for network detection
</verification>

<success_criteria>
1. Operations queue when offline and process when online
2. User sees pending operation count in UI
3. Plants cached locally after identification
4. Auto-sync triggers on network restore
5. TypeScript compiles without errors
</success_criteria>

<output>
After completion, create `.planning/phases/02-lab3/02-lab3-02-SUMMARY.md`
</output>