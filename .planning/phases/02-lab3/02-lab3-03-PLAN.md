---
phase: 02-lab3
plan: 03
type: execute
wave: 3
depends_on:
  - 02-lab3-02
files_modified:
  - src/services/moduleAnalyzer.ts
  - app/_layout.tsx
  - src/components/ui/SyncStatusIndicator.tsx
autonomous: true
requirements:
  - LAB3-MOD-01
  - LAB3-MOD-02
  - LAB3-MOD-03
user_setup: []

must_haves:
  truths:
    - "User can see which features work offline vs online"
    - "Offline capability displayed per module"
    - "Sync status visible in app header"
  artifacts:
    - path: "src/services/moduleAnalyzer.ts"
      provides: "Module capability analysis"
      exports: ["ModuleCapability", "analyzeOfflineCapability", "ModuleReport"]
    - path: "src/components/ui/SyncStatusIndicator.tsx"
      provides: "Visual sync status component"
      exports: ["SyncStatusIndicator"]
    - path: "app/_layout.tsx"
      provides: "Sync indicator integrated into app layout"
      exports: ["Stack"]
  key_links:
    - from: "app/_layout.tsx"
      to: "src/hooks/useOfflineSync.ts"
      via: "useOfflineSync hook provides status to SyncStatusIndicator"
      pattern: "useOfflineSync"
    - from: "SyncStatusIndicator"
      to: "src/services/moduleAnalyzer.ts"
      via: "Displays module capability report"
      pattern: "analyzeOfflineCapability"
---

<objective>
Analyze and document offline capability per module, create UI indicators for sync status.

Purpose: User understands which features work offline and current sync state
Output: Module analysis service, sync status indicator component
</objective>

<execution_context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/workflows/execute-plan.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md (Phase 2 goal)
@.planning/codebase/STRUCTURE.md

# Dependencies from previous plans
@src/services/syncQueueService.ts  # From Plan 02
@src/hooks/useOfflineSync.ts  # From Plan 02
@src/services/plantStorageService.ts  # From Plan 02

# Existing UI components
@src/components/ui/  # Reusable components to extend
</context>

<interfaces>
<!-- Key types and contracts from previous plans. -->

From Plan 02 (syncQueueService.ts):
```typescript
export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}
```

From Plan 02 (useOfflineSync.ts):
```typescript
export interface SyncStatus {
  isOnline: boolean;
  pendingOperations: number;
  isSyncing: boolean;
  lastSyncTime: number | null;
  hasFailedSyncs: boolean;
}

export function useOfflineSync(): SyncStatus
```

From Plan 02 (plantStorageService.ts):
```typescript
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
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create module analyzer service</name>
  <files>src/services/moduleAnalyzer.ts</files>
  <behavior>
    - Test 1: analyzeOfflineCapability() returns array of ModuleCapability objects
    - Test 2: Each module has offlineCapability enum: 'full' | 'partial' | 'none'
    - Test 3: analyzeNetworkRequirement() returns 'required' | 'optional' | 'none'
    - Test 4: getModuleStatus() reflects current network state
  </behavior>
  <action>
Create `src/services/moduleAnalyzer.ts`:

```typescript
export type OfflineCapability = 'full' | 'partial' | 'none';
export type NetworkRequirement = 'required' | 'optional' | 'none';

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  offlineCapability: OfflineCapability;
  networkRequirement: NetworkRequirement;
  cacheable: boolean;
  syncRequired: boolean;
}

export interface ModuleReport {
  totalModules: number;
  fullyOffline: number;
  partialOffline: number;
  requiresNetwork: number;
  modules: ModuleInfo[];
}
```

**Analyze these app modules:**

1. **Home Dashboard** - `partial` offline, `optional` network
   - Cache: Daily tips, plant of the day
   - Needs network: User-specific progress data

2. **Plant Identification** - `partial` offline, `required` for API
   - Cache: Previous identifications, cached plants
   - Needs network: New identifications via PlantNet

3. **User Profile** - `partial` offline, `optional` network
   - Cache: Display name, avatar, static achievements
   - Needs network: Real-time stats, latest activity

4. **Plant Collection** - `full` offline with local cache
   - Cache: All user's plants from cache
   - Sync: New plants, favorites, updates queued

5. **Journal** - `partial` offline, `optional` network
   - Cache: Recent entries
   - Needs network: Cloud backup

6. **Explore** - `none` offline, `required` network
   - Always needs network: External plant database

**Functions:**
```typescript
export function analyzeOfflineCapability(): ModuleReport
export function getModuleStatus(moduleId: string, isOnline: boolean): 'ready' | 'limited' | 'unavailable'
export function getCacheStatus(moduleId: string): { cached: boolean; age?: number }
```
  </action>
  <verify>
    <automated>npx tsc --noEmit src/services/moduleAnalyzer.ts</automated>
  </verify>
  <done>Module analyzer provides capability report for all app features</done>
</task>

<task type="auto">
  <name>Task 2: Create SyncStatusIndicator component</name>
  <files>src/components/ui/SyncStatusIndicator.tsx</files>
  <action>
Create `src/components/ui/SyncStatusIndicator.tsx`:

```typescript
import { SyncStatus } from '@/src/hooks/useOfflineSync';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  compact?: boolean;  // true = icon only, false = full text
  showModuleStatus?: boolean;
}
```

**Visual design:**
- **Online + Synced:** Green dot + "✓ Synced"
- **Online + Syncing:** Animated spinner + "Syncing..."
- **Online + Pending:** Yellow dot + "{n} pending"
- **Offline:** Gray dot + "Offline"
- **Failed:** Red dot + "Sync failed"

**Compact mode:** Just the colored dot/icon
**Full mode:** Dot + status text + last sync time

**Module capability display (when showModuleStatus=true):**
- Small badges next to each feature showing offline capability
- Or a settings/debug screen showing module status table

**Integration:**
- Accept SyncStatus from useOfflineSync hook
- Auto-update when status changes
- Position: Top-right of screen or in header
  </action>
  <verify>
    <automated>npx tsc --noEmit src/components/ui/SyncStatusIndicator.tsx</automated>
  </verify>
  <done>Sync status indicator displays current sync state with appropriate visual</done>
</task>

<task type="auto">
  <name>Task 3: Integrate sync indicator into app layout</name>
  <files>app/_layout.tsx</files>
  <action>
Update `app/_layout.tsx` to include sync status:

1. Import useOfflineSync hook
2. Wrap content with SyncStatusIndicator
3. Position in header area (safe area aware)

**Layout update:**
```tsx
import { useOfflineSync } from '@/src/hooks/useOfflineSync';
import SyncStatusIndicator from '@/src/components/ui/SyncStatusIndicator';

function RootLayout() {
  const syncStatus = useOfflineSync();
  
  return (
    <>
      <StatusBar ... />
      <View style={styles.header}>
        <SyncStatusIndicator status={syncStatus} compact />
      </View>
      <Stack ... />
    </>
  );
}
```

**Also add offline mode banner:**
- When isOnline=false, show a subtle banner at top
- "You're offline. Changes will sync when connected."
- Banner color: gray background with white text
- Dismissible (user can tap to dismiss)

**Ensure:**
- Indicator doesn't block content
- Works with existing auth flow
- Handles loading state during auth check
  </action>
  <verify>
    <automated>npx tsc --noEmit app/_layout.tsx</automated>
  </verify>
  <done>App layout shows sync status indicator and offline banner</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| App → User display | Sync status and capability shown to user |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-LAB3-09 | I | Module status disclosure | accept | Module status is non-sensitive feature metadata |
| T-LAB3-10 | S | Offline mode bypass | accept | Sync queue ensures data integrity; no security-critical bypass |
</threat_model>

<verification>
1. TypeScript check on all modified files
2. Verify component renders without crashing
3. Confirm offline banner displays when isOnline=false
</verification>

<success_criteria>
1. Sync indicator shows current status visually
2. Offline banner appears when network unavailable
3. Module capability report accessible
4. TypeScript compiles without errors
</success_criteria>

<output>
After completion, create `.planning/phases/02-lab3/02-lab3-03-SUMMARY.md`
</output>