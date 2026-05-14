---
phase: 02-lab3
plan: 04
type: execute
wave: 3
depends_on: [02-lab3-03]
files_modified:
  - app/_layout.tsx
  - src/services/userPlantsService.ts
  - src/services/offlineStorage.ts
autonomous: true
gap_closure: true
requirements:
  - Offline support with local storage
  - Sync queue for pending operations
must_haves:
  truths:
    - "App works without internet (offline modules)"
    - "Data syncs when connection restored"
    - "User sees feedback about sync status"
  artifacts:
    - path: "app/_layout.tsx"
      provides: "setupAutoSync() call and SyncStatusIndicator rendering"
    - path: "src/services/offlineStorage.ts"
      provides: "savePlantLocal() and getLocalPlants() functions"
    - path: "src/services/userPlantsService.ts"
      provides: "Offline-first addUserPlant() with local save + sync queue"
  key_links:
    - from: "app/_layout.tsx"
      to: "syncService.ts"
      via: "setupAutoSync() call on mount"
      pattern: "setupAutoSync\\("
    - from: "app/_layout.tsx"
      to: "SyncStatusIndicator.tsx"
      via: "renders component when user logged in"
      pattern: "SyncStatusIndicator"
    - from: "src/services/userPlantsService.ts"
      to: "offlineStorage.ts"
      via: "savePlantLocal() call"
      pattern: "savePlantLocal"
    - from: "src/services/userPlantsService.ts"
      to: "offlineStorage.ts"
      via: "addToSyncQueue() when offline"
      pattern: "addToSyncQueue"
---

<objective>
Wire offline storage, sync service, and sync status indicator into the app flow to close Phase 2 gaps.

Purpose: The offline storage (offlineStorage.ts) and sync service (syncService.ts) exist but are orphaned — never called from the app. The SyncStatusIndicator component is also never rendered. This plan integrates all three into the app flow.

Output: App can save plants offline, syncs when connection restored, and shows sync status to user.
</objective>

<execution_context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/workflows/execute-plan.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.planning/phases/02-lab3/02-lab3-03-SUMMARY.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.planning/phases/02-lab3/02-lab3-VERIFICATION.md

Key files to modify:
- app/_layout.tsx — needs setupAutoSync() call and SyncStatusIndicator rendering
- src/services/userPlantsService.ts — needs offline-first addUserPlant()
- src/services/offlineStorage.ts — needs plant storage functions added

Existing services available:
- src/services/offlineStorage.ts — has addToSyncQueue(), getSyncQueue(), clearSyncQueueItem()
- src/services/syncService.ts — has queueForSync(), processSyncQueue(), setupAutoSync()
- src/hooks/useNetworkStatus.ts — returns { isConnected }
- src/components/SyncStatusIndicator.tsx — shows online/offline status
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update app/_layout.tsx — setupAutoSync + SyncStatusIndicator</name>
  <files>app/_layout.tsx</files>
  <action>
    Modify app/_layout.tsx to:
    1. Import setupAutoSync from syncService and SyncStatusIndicator from components
    2. Call setupAutoSync() on app mount with the API URL
    3. Render SyncStatusIndicator in the UI (when user is logged in)
    
    Current app/_layout.tsx structure (62 lines):
    - Has useEffect for auth change (lines 18-24)
    - Has useEffect for routing (lines 26-34)
    - Renders Stack with BottomNav and Toast (lines 44-61)
    
    Changes needed:
    ```typescript
    // Add imports
    import { setupAutoSync } from "@/src/services/syncService"
    import { SyncStatusIndicator } from "@/src/components/SyncStatusIndicator"
    
    // Add in the component, after the existing useEffect hooks:
    useEffect(() => {
      if (!user) return
      const unsubscribe = setupAutoSync(process.env.EXPO_PUBLIC_API_URL || 'https://plantasmon.onrender.com')
      return unsubscribe
    }, [user])
    
    // In the return statement, add SyncStatusIndicator before BottomNav:
    {showNav && (
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <SyncStatusIndicator />
      </View>
    )}
    {showNav && <BottomNav />}
    ```
    
    Note: setupAutoSync returns an unsubscribe function for the NetInfo listener.
  </action>
  <verify>
    <automated>grep -l "setupAutoSync\|SyncStatusIndicator" app/_layout.tsx && echo "wired"</automated>
  </verify>
  <done>app/_layout.tsx calls setupAutoSync() on mount and renders SyncStatusIndicator when user is logged in</done>
</task>

<task type="auto">
  <name>Task 2: Add plant storage functions to offlineStorage.ts</name>
  <files>src/services/offlineStorage.ts</files>
  <action>
    Add functions to offlineStorage.ts for storing plants locally (not just sync queue):
    
    ```typescript
    const PLANTS_KEY = '@plantasmon_plants';
    
    // Save plant to local storage
    export async function savePlantLocal(plant: any): Promise<void> {
      try {
        const plantsJson = await AsyncStorage.getItem(PLANTS_KEY);
        const plants = plantsJson ? JSON.parse(plantsJson) : [];
        const existingIndex = plants.findIndex((p: any) => p.id === plant.id);
        if (existingIndex >= 0) {
          plants[existingIndex] = plant;
        } else {
          plants.push(plant);
        }
        await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
      } catch (error) {
        console.error('Error saving plant locally:', error);
      }
    }
    
    // Get all locally stored plants
    export async function getLocalPlants(): Promise<any[]> {
      try {
        const plantsJson = await AsyncStorage.getItem(PLANTS_KEY);
        return plantsJson ? JSON.parse(plantsJson) : [];
      } catch (error) {
        console.error('Error getting local plants:', error);
        return [];
      }
    }
    
    // Check if plant exists locally
    export async function hasLocalPlant(plantId: string): Promise<boolean> {
      const plants = await getLocalPlants();
      return plants.some((p: any) => p.id === plantId);
    }
    ```
    
    These functions allow the app to save plants locally first, then sync to Firebase when online.
  </action>
  <verify>
    <automated>grep -l "savePlantLocal\|getLocalPlants" src/services/offlineStorage.ts && echo "functions added"</automated>
  </verify>
  <done>offlineStorage.ts has savePlantLocal() and getLocalPlants() functions for offline plant storage</done>
</task>

<task type="auto">
  <name>Task 3: Modify addUserPlant() for offline-first approach</name>
  <files>src/services/userPlantsService.ts</files>
  <action>
    Modify addUserPlant() in userPlantsService.ts to:
    1. Save plant data locally first (via offlineStorage.savePlantLocal)
    2. If online, save to Firebase directly (current behavior)
    3. If offline, add to sync queue for later sync
    
    Import needed at top of file:
    ```typescript
    import { savePlantLocal, addToSyncQueue } from "@/src/services/offlineStorage";
    import NetInfo from "@react-native-community/netinfo";
    ```
    
    Modify addUserPlant() function (starts at line 199):
    ```typescript
    export async function addUserPlant(
      input: AddPlantFromIdInput
    ): Promise<void> {
      const {
        plantId,
        imageUri,
        userId = CURRENT_USER_ID,
        commonName,
        scientificName,
        waterSchedule,
        sunlight,
      } = input;
      
      try {
        // Always save plant data locally first
        const plantData = {
          id: plantId,
          imageUri,
          commonName: commonName || scientificName || plantId,
          scientificName: scientificName || commonName || plantId,
          addedAt: new Date().toISOString(),
        };
        await savePlantLocal(plantData);
        
        // Check network status
        const netInfo = await NetInfo.fetch();
        
        if (netInfo.isConnected) {
          // Online: save to Firebase directly
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, { userPlants: [] });
          }
      
          const { userPlants, fieldPath } = await getRawUserPlants(userId);
      
          const alreadyExists = userPlants.some((p: any) => p.id === plantId);
          if (alreadyExists) {
            return;
          }
      
          const normalizedCommonName = commonName?.trim() || scientificName?.trim() || plantId;
          const normalizedScientificName = scientificName?.trim() || normalizedCommonName;
      
          const matchDays = waterSchedule?.match(/\d+/);
          const wateringDays = matchDays ? Number(matchDays[0]) : 7;
      
          const sunlightText = (sunlight || "").toLowerCase();
          const light = sunlightText.includes("shade") || sunlightText.includes("low")
            ? "low"
            : sunlightText.includes("full") ||
              sunlightText.includes("direct") ||
              sunlightText.includes("bright")
            ? "full"
            : "partial";
      
          const plantRef = doc(db, "plants", plantId);
          const plantSnap = await getDoc(plantRef);
          if (!plantSnap.exists()) {
            await setDoc(plantRef, {
              commonName: normalizedCommonName,
              scientificName: normalizedScientificName,
              wateringDays,
              light,
            });
          }
          
          const newPlant = {
            id: plantId,
            image: imageUri,
            firstIdentifiedAt: new Date().toISOString(),
            lastWatered: null,
            favorite: false,
            isCompanion: false,
          };
      
          const updatedPlants = [...userPlants, newPlant];
      
          await updateDoc(userRef, {
            [fieldPath]: updatedPlants,
          });
        } else {
          // Offline: add to sync queue
          await addToSyncQueue(
            "/api/user-plants",
            "POST",
            {
              plantId,
              imageUri,
              userId,
              commonName,
              scientificName,
              waterSchedule,
              sunlight,
            },
            `add_plant_${plantId}`
          );
          console.log('Plant saved locally, will sync when online');
        }
      } catch (error) {
        console.error("Error agregando planta:", error);
        throw error;
      }
    }
    ```
  </action>
  <verify>
    <automated>grep -l "savePlantLocal\|NetInfo.fetch" src/services/userPlantsService.ts && echo "offline-first implemented"</automated>
  </verify>
  <done>addUserPlant() saves locally first, then syncs to Firebase when online (or queues if offline)</done>
</task>

</tasks>

<verification>
- [ ] app/_layout.tsx calls setupAutoSync() and renders SyncStatusIndicator
- [ ] offlineStorage.ts has savePlantLocal() and getLocalPlants() functions
- [ ] userPlantsService.ts addUserPlant() saves locally first, then syncs
- [ ] Turning off internet and adding a plant saves to local storage + sync queue
- [ ] Restoring internet processes sync queue and saves to Firebase
</verification>

<success_criteria>
Gaps 1 and 2 from VERIFICATION.md are closed:
1. Offline storage is wired to app flow (addUserPlant saves locally + queues for sync)
2. Sync service is wired (setupAutoSync called in _layout.tsx, processes queue when online)
3. Sync status indicator is rendered (visible in app when user is logged in)
</success_criteria>

<output>
After completion, create `.planning/phases/02-lab3/02-lab3-04-SUMMARY.md`
</output>
