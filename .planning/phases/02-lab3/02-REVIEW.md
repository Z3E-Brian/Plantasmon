---
phase: 02-lab3
reviewed: 2026-05-06T18:30:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/components/SyncStatusIndicator.tsx
  - src/hooks/useNetworkStatus.ts
  - src/services/offlineStorage.ts
  - src/services/syncService.ts
findings:
  critical: 0
  warning: 6
  info: 4
  total: 10
status: issues_found
---

# Phase 02-lab3: Code Review Report

**Reviewed:** 2026-05-06T18:30:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed 4 source files implementing offline sync functionality for PlantasMon: a network status hook, offline storage service, sync service, and UI indicator. Found 6 warnings (race conditions, error handling gaps, URL construction issues) and 4 info items (code quality improvements). No critical security vulnerabilities or crashes identified. Main concerns are around sync reliability and error propagation.

---

## Warnings

### WR-01: Race Condition in `processSyncQueue` — Concurrent Sync Operations Possible

**File:** `src/services/syncService.ts:26-60`
**Issue:** The `isSyncing` flag check at line 27 and set at line 37 are not atomic. If `processSyncQueue` is called multiple times rapidly (e.g., from `setupAutoSync`), multiple sync operations can run concurrently because the flag hasn't been set yet when the second call checks it.

Additionally, `processSyncQueue(apiUrl)` is called without `await` in `setupAutoSync` (line 66), which exacerbates this issue.

**Fix:**
```typescript
export async function processSyncQueue(apiUrl: string): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;  // Move this BEFORE any async operations

  try {
    const netInfo: NetInfoState = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      isSyncing = false;
      return;
    }

    const queue = await getSyncQueue();

    for (const item of queue) {
      try {
        const response = await fetch(`${apiUrl}${item.endpoint}`, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: typeof item.data === 'string' ? item.data : JSON.stringify(item.data),
        });

        if (response.ok) {
          await clearSyncQueueItem(item.id);
          console.log(`Synced: ${item.action}`);
        } else {
          console.error(`Sync failed for ${item.action}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Sync failed for ${item.action}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    isSyncing = false;
  }
}
```

Also update `setupAutoSync` to avoid fire-and-forget:
```typescript
export function setupAutoSync(apiUrl: string): () => void {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    if (state.isConnected) {
      // Don't await - just let it run, but the isSyncing guard now works correctly
      processSyncQueue(apiUrl).catch(err => {
        console.error('Auto-sync failed:', err);
      });
    }
  });

  return unsubscribe;
}
```

---

### WR-02: Initial Network Status Defaults to `true` — False Online State

**File:** `src/hooks/useNetworkStatus.ts:11-13`
**Issue:** The hook initializes `isConnected` and `isInternetReachable` to `true`. If the app starts offline, it will briefly (or indefinitely if NetInfo fails) report being online. This could cause the app to attempt network requests before knowing the true state.

**Fix:**
```typescript
export function useNetworkStatus(): NetworkStatus {
  const [isConnected, setIsConnected] = useState<boolean>(false);  // Default to offline
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(false);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    NetInfo.fetch().then((state: NetInfoState) => {
      if (!cancelled) {
        setIsConnected(state.isConnected ?? false);
        setIsInternetReachable(state.isInternetReachable ?? false);
        setType(state.type);
      }
    }).catch((error) => {
      console.error('Error fetching initial network state:', error);
      // Keep default offline state
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (!cancelled) {
        setIsConnected(state.isConnected ?? false);
        setIsInternetReachable(state.isInternetReachable ?? false);
        setType(state.type);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { isConnected, isInternetReachable, type };
}
```

---

### WR-03: Error Swallowing in Offline Storage Functions — Callers Uninformed

**File:** `src/services/offlineStorage.ts:15-36, 50-58, 61-67`
**Issue:** Functions `addToSyncQueue`, `clearSyncQueueItem`, and `clearSyncQueue` catch errors and log them but don't re-throw. Since they return `Promise<void>`, callers have no way to know if the operation succeeded. This could lead to data loss if the queue fails to persist but the app assumes it did.

**Fix:**
```typescript
export async function addToSyncQueue(
  endpoint: string,
  method: string,
  data: any,
  action: string
): Promise<void> {
  try {
    const queue = await getSyncQueue();
    const newItem: SyncQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      endpoint,
      method,
      data,
      action,
      timestamp: Date.now(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    throw error;  // Re-throw so callers can handle
  }
}
```

Apply the same pattern to `clearSyncQueueItem` and `clearSyncQueue`, or create a wrapper that handles errors consistently.

---

### WR-04: URL Construction May Produce Malformed URLs

**File:** `src/services/syncService.ts:42`
**Issue:** The URL is constructed as `${apiUrl}${item.endpoint}`. If `apiUrl` doesn't end with `/` and `item.endpoint` doesn't start with `/`, the resulting URL will be malformed (e.g., `https://api.example.complants` instead of `https://api.example.com/plants`).

**Fix:**
```typescript
const response = await fetch(`${apiUrl.replace(/\/$/, '')}/${item.endpoint.replace(/^\//, '')}`, {
  method: item.method,
  headers: { 'Content-Type': 'application/json' },
  body: typeof item.data === 'string' ? item.data : JSON.stringify(item.data),
});
```

Or use a helper function:
```typescript
function buildUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
}
```

---

### WR-05: Failed Sync Items Remain in Queue Indefinitely

**File:** `src/services/syncService.ts:40-57`
**Issue:** When a sync item fails (non-200 response or network error), it stays in the queue and will be retried on the next sync. For permanent failures (e.g., 400 Bad Request, 401 Unauthorized), this causes infinite retries. There's no retry limit, error classification, or dead-letter queue.

**Fix:** Add a retry limit or remove items with permanent failures:
```typescript
export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: string;
  data: any;
  action: string;
  timestamp: number;
  retryCount?: number;  // Add retry tracking
}

// In the sync loop:
for (const item of queue) {
  try {
    const response = await fetch(`${apiUrl}${item.endpoint}`, {
      method: item.method,
      headers: { 'Content-Type': 'application/json' },
      body: typeof item.data === 'string' ? item.data : JSON.stringify(item.data),
    });

    if (response.ok) {
      await clearSyncQueueItem(item.id);
      console.log(`Synced: ${item.action}`);
    } else if (response.status === 400 || response.status === 401 || response.status === 403) {
      // Permanent failure - remove from queue
      await clearSyncQueueItem(item.id);
      console.error(`Permanent failure for ${item.action}: ${response.status}`);
    } else {
      // Temporary failure - increment retry count
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount > 3) {
        await clearSyncQueueItem(item.id);
        console.error(`Max retries exceeded for ${item.action}`);
      }
    }
  } catch (error) {
    console.error(`Sync failed for ${item.action}:`, error);
    // Optionally increment retry count here too
  }
}
```

---

### WR-06: Duplicate `SyncQueueItem` Interface Definition

**File:** `src/services/syncService.ts:6-13`
**Issue:** The `SyncQueueItem` interface is defined in both `offlineStorage.ts` (lines 5-12) and `syncService.ts` (lines 6-13). This duplication can lead to inconsistencies if one is updated but not the other.

**Fix:** Remove the duplicate definition in `syncService.ts` and import it from `offlineStorage.ts`:
```typescript
import { addToSyncQueue, getSyncQueue, clearSyncQueueItem, type SyncQueueItem } from './offlineStorage';
// Remove the local SyncQueueItem interface definition
```

---

## Info

### IN-01: Deprecated `substr` Usage

**File:** `src/services/offlineStorage.ts:24`
**Issue:** `substr` is deprecated in modern JavaScript. Use `substring` instead.

**Fix:**
```typescript
id: `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
```

---

### IN-02: `data: any` Type in `SyncQueueItem`

**File:** `src/services/offlineStorage.ts:9`, `src/services/syncService.ts:10`
**Issue:** Using `any` type defeats TypeScript's type safety. Consider using a more specific type or `unknown` with runtime validation.

**Fix:**
```typescript
export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: string;
  data: Record<string, unknown>;  // Or a more specific type
  action: string;
  timestamp: number;
}
```

---

### IN-03: `JSON.parse` Result Not Validated

**File:** `src/services/offlineStorage.ts:42`
**Issue:** `JSON.parse(queueJson)` could return any JSON value, but the code assumes it's a `SyncQueueItem[]`. If the storage was tampered with or corrupted, this could cause runtime errors.

**Fix:** Add validation:
```typescript
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (!queueJson) return [];

    const parsed = JSON.parse(queueJson);
    if (!Array.isArray(parsed)) {
      console.error('Sync queue is not an array, clearing');
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
      return [];
    }

    // Optional: validate each item has required fields
    return parsed.filter(item =>
      item && typeof item === 'object' && 'id' in item && 'endpoint' in item
    ) as SyncQueueItem[];
  } catch (error) {
    console.error('Error getting sync queue:', error);
    return [];
  }
}
```

---

### IN-04: `apiUrl` Captured in Closure — Not Updateable

**File:** `src/services/syncService.ts:63-71`
**Issue:** The `apiUrl` parameter is captured in the closure when `setupAutoSync` is called. If the API URL changes (e.g., environment switch), the auto-sync will continue using the old URL. Consider storing the API URL in a way that can be updated.

**Fix:** Use a getter function or ref instead of capturing the value:
```typescript
let _apiUrl: string = '';

export function configureSync(apiUrl: string): void {
  _apiUrl = apiUrl;
}

export function setupAutoSync(): () => void {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    if (state.isConnected && _apiUrl) {
      processSyncQueue(_apiUrl).catch(err => {
        console.error('Auto-sync failed:', err);
      });
    }
  });

  return unsubscribe;
}
```

---

_Reviewed: 2026-05-06T18:30:00Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
